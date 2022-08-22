// https://brm.io/matter-js/docs/

// Setup the app
"use strict";

const DEG_TO_RAD = (Math.PI / 180);

const REF_WINDOW_WIDTH = 1920;
const REF_WINDOW_HEIGHT = 1080;
const REF_SHP_SIZE = 40;
const REF_SHP_VEL = 0.01;
const REF_SHP_ANG_VEL = 0.05;

const WRAPPER = document.getElementById("wrapper");
const SHP_SPWN_RATE = 100;//1500;
const S_SHP_ROT_SPD = 0.1;
const MAX_SHPS = 50;

let wrapperWidth, wrapperHeight;
let widthRatio, heightRatio, ratio;
let shapeSize, shapeVelocity, shapeAngleVelocity;
let mousePosition = { x: 0, y: 0 };

let gameObjects = [];
let staticObjects = [];
let HTMLObjects = [];
let mouseObject;
let mouseInteractObject;

let engine;
let render;
let runner;

/************************************************* METHODS *******************************************************/

window.onresize = function (event) {
    // Shift all gravity objects
    updateGameObjects();

    // Update variables to scale with window size
    updateVariables();

    // Resize window and renderer
    render.bounds.max.x = wrapperWidth;
    render.bounds.max.y = wrapperHeight;
    render.options.width = wrapperWidth;
    render.options.height = wrapperHeight;
    render.canvas.width = wrapperWidth;
    render.canvas.height = wrapperHeight;

    // Recreate static objects from HTML elements
    createObjectsFromHTML();
};

window.onmousemove = function (event) {
    mousePosition = { x: event.clientX + window.scrollX, y: event.clientY + window.scrollY };

    Matter.Body.setPosition(mouseObject, mousePosition);
};

window.onload = function (event) {
    updateVariables();

    // Create an engine
    engine = Matter.Engine.create();

    // Create a renderer
    render = Matter.Render.create({
        options: {
            width: wrapperWidth,
            height: wrapperHeight,
            wireframes: false,
            background: getComputedStyle(document.documentElement).getPropertyValue('--color1'),
            hasBounds: true
        },
        element: document.getElementById("matter"),
        engine: engine
    });
    Matter.Render.run(render);

    // Create a runner
    runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    mouseObject = Matter.Bodies.circle(mousePosition.x, mousePosition.y, 1, {
        render: { visible: false },
        collisionFilter: {
            'group': -1,
            'category': 2,
            'mask': 0,
        },
        isStatic: true
    });
    mouseInteractObject = Matter.Bodies.circle(mousePosition.x, mousePosition.y, 15, {
        render: { visible: false },
        isStatic: false
    });
    Matter.Composite.add(engine.world, [mouseObject, mouseInteractObject, Matter.Constraint.create({
        bodyA: mouseObject,
        bodyB: mouseInteractObject,
        stiffness: 0.1,
        length: 0,
        render: { visible: false }
    })]);

    Matter.Events.on(engine, 'afterUpdate', function (event) {
        // If one of the gravity shapes has reached the bottom of the website, destroy it
        for (let i = gameObjects.length - 1; i >= 0; i--) {
            if (gameObjects[i].position.y > wrapperHeight + shapeSize) {
                Matter.Composite.remove(engine.world, gameObjects[i]);
                gameObjects.splice(i, 1);
            }
        }
    });

    // Create a new shape after a set interval
    setInterval(function () {
        if (document.hasFocus() && gameObjects.length <= MAX_SHPS) {
            createGameObject();
        }
    }, SHP_SPWN_RATE);

    createObjectsFromHTML();
};

function updateGameObjects() {
    let newWidthRatio = window.innerWidth / REF_WINDOW_WIDTH;

    gameObjects.forEach(element => {
        // Convert the previous dimensions of the coordinates to the new dimensions
        let refX = map(element.position.x, 0, wrapperWidth, 0, WRAPPER.offsetWidth);
        let refY = map(element.position.y, 0, wrapperHeight, 0, WRAPPER.offsetHeight);
        let refScale = 1 + newWidthRatio - widthRatio;

        Matter.Body.setPosition(element, { x: refX, y: refY });
        Matter.Body.scale(element, refScale, refScale);
    });
}

function createObjectsFromHTML() {
    HTMLObjects.forEach(element => { Matter.Composite.remove(engine.world, element); });
    HTMLObjects = [];

    Array.from(document.getElementsByClassName("matter-html")).forEach(element => {
        let width = element.offsetWidth;
        let height = element.offsetHeight;
        let x = element.offsetLeft + (width / 2);
        let y = element.offsetTop + (height / 2);

        // Rectangle vertices
        let vertices = [{ x: -(width / 2), y: -(height / 2) }, { x: (width / 2), y: -(height / 2) }, { x: (width / 2), y: (height / 2) }, { x: -(width / 2), y: (height / 2) }];

        // Check for alterations in the vertices from html
        if (element.hasAttribute("matter-slant")) {
            let mInfo = element.getAttribute("matter-slant").trim().split(/\s+/);

            // check 0: 0, 3, 6, etc.
            for (let i = 0; i < mInfo.length; i++) {
                
            }

            if (mInfo[1] == "x") {
                let xChange = 0;

                if (mInfo[2].includes("deg")) {
                    xChange = height * Math.tan(parseInt(mInfo[2]) * DEG_TO_RAD);
                } else {
                    xChange = parseInt(mInfo[2]);
                }

                vertices[parseInt(mInfo[0])].x += xChange;
            } else if (mInfo[1] == "y") {
                let yChange = 0;

                if (mInfo[2].includes("deg")) {
                    yChange = width * Math.tan(parseInt(mInfo[2]) * DEG_TO_RAD);
                } else {
                    yChange = parseInt(mInfo[2]);
                }

                vertices[parseInt(mInfo[0])].y -= yChange;
            }
        }

        if (element.hasAttribute("matter-static")) {
            let mInfo = element.getAttribute("matter-static").trim().split(/\s+/);
        }

        // Get the center of the new vertices so the center of the object can be offset
        let offsetPosition = getVerticesCenter(vertices);

        // Create a static object
        let o = Matter.Bodies.fromVertices(x + offsetPosition.x, y + offsetPosition.y, vertices, {
            render: { fillStyle: getComputedStyle(element).backgroundColor },
            isStatic: true
        });

        Matter.Composite.add(engine.world, o);
        HTMLObjects.push(o);
    });
}

function createRandomBody(x, y, size, options) {
    switch (Math.floor(Math.random() * 3)) {
        case 0:
            return Matter.Bodies.circle(x, y, size / 2, options);
        case 1:
            return Matter.Bodies.rectangle(x, y, size, size, options);
        case 2:
            return Matter.Bodies.polygon(x, y, 3, size / 1.5, options);
    }
}

function createStaticObjectsFromHTML(x, y, size) {
    staticObjects.forEach(element => { Matter.Composite.remove(engine.world, element); });
    staticObjects = [];

    // Array.from(document.querySelectorAll('[attrname="matter-static"]')).forEach(element => {
    // let options = {
    //     isStatic: true,
    //     render: { fillStyle: getComputedStyle(document.documentElement).getPropertyValue('--color2') }
    // };
    // let o = createRandomBody(x, y, size, options);

    // Matter.Composite.add(engine.world, o);
    // staticObjects.push(o);
}

function createGameObject() {
    let x = Math.random() * wrapperWidth;
    let y = -shapeSize * 2;
    let options = { render: { fillStyle: getComputedStyle(document.documentElement).getPropertyValue('--color3') } };

    let o = createRandomBody(x, y, shapeSize, options)
    Matter.Body.applyForce(o, o.position, { x: getRandomNumber(-shapeVelocity, shapeVelocity), y: 0 });
    Matter.Body.setAngularVelocity(o, getRandomNumber(-shapeAngleVelocity, shapeAngleVelocity));

    Matter.Composite.add(engine.world, o);
    gameObjects.push(o);
}

function updateVariables() {
    wrapperWidth = WRAPPER.offsetWidth;
    wrapperHeight = WRAPPER.offsetHeight;

    widthRatio = window.innerWidth / REF_WINDOW_WIDTH;
    heightRatio = window.innerHeight / REF_WINDOW_HEIGHT;

    shapeSize = widthRatio * REF_SHP_SIZE;
    shapeVelocity = widthRatio * REF_SHP_VEL;
    shapeAngleVelocity = widthRatio * REF_SHP_ANG_VEL;
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomArrayValue(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function map(number, inMin, inMax, outMin, outMax) {
    // https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers

    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function getVerticesCenter(vertices) {
    // https://stackoverflow.com/questions/9692448/how-can-you-find-the-centroid-of-a-concave-irregular-polygon-in-javascript

    let first = vertices[0], last = vertices[vertices.length - 1];
    let addedValue = false;
    let twicearea = 0,
        x = 0, y = 0,
        nPts = vertices.length,
        p1, p2, f;

    if (first.x != last.x || first.y != last.y) {
        vertices.push(first);
        addedValue = true;
    }

    for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
        p1 = vertices[i]; p2 = vertices[j];
        f = p1.x * p2.y - p2.x * p1.y;
        twicearea += f;
        x += (p1.x + p2.x) * f;
        y += (p1.y + p2.y) * f;
    }

    f = twicearea * 3;

    if (addedValue) {
        vertices.pop();
    }

    return { x: x / f, y: y / f };
}