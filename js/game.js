// https://brm.io/matter-js/docs/

// https://stackoverflow.com/questions/9692448/how-can-you-find-the-centroid-of-a-concave-irregular-polygon-in-javascript
// https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers

// Setup the app
"use strict";

const DEG_TO_RAD = (Math.PI / 180);

const REF_WINDOW_WIDTH = 1920;
const REF_WINDOW_HEIGHT = 1080;
const REF_SHP_SIZE = 40;
const REF_SHP_VEL = 0.01;
const REF_SHP_ANG_VEL = 0.05;

const WRAPPER = document.getElementById("wrapper");
const SHP_SPWN_RATE = 500;
const MAX_SHPS = 200;
const PEG_DEN = 0;

const MOUSE_CONST_STIFF = 0.1;
const MOUSE_CONST_DAMP = 0;
const STAT_CONST_STIFF = 0.025;
const STAT_CONST_DAMP = 0.1;

// https://www.temiz.dev/blog/matter-js-collisions-explained
const CAT_GAME = 2;
const CAT_STAT = 4;

let widthRatio, heightRatio;
let shapeSize, shapeVelocity, shapeAngleVelocity;
let mousePosition = { x: 0, y: 0 };

let gameObjects = [];
let HTMLObjects = [];
let pegVoids = [];
let pegObjects = [];
let mouseObject = [];

let engine;
let render;
let runner;

/************************************************* METHODS *******************************************************/

window.onresize = function (event) {
    // Shift all gravity objects
    gameObjects.forEach(element => { Matter.Composite.remove(engine.world, element); });
    gameObjects = [];

    // Update variables to scale with window size
    updateVariables();

    // Resize window and renderer
    render.bounds.max.x = WRAPPER.offsetWidth;
    render.bounds.max.y = WRAPPER.offsetHeight;
    render.options.width = WRAPPER.offsetWidth;
    render.options.height = WRAPPER.offsetHeight;
    render.canvas.width = WRAPPER.offsetWidth;
    render.canvas.height = WRAPPER.offsetHeight;

    // Recreate static objects
    createObjectsFromHTML();
    createPegObjects();
};

window.onmousemove = function (event) {
    mousePosition = { x: event.clientX + window.scrollX, y: event.clientY + window.scrollY };

    // mouseObject[1] is the mouse constraint (not the mouse constraint object)
    // If the constraint has not been set, don't try to change its position
    if (mouseObject[1] == undefined) {
        return;
    }

    Matter.Body.setPosition(mouseObject[1], mousePosition);
};

function initializeGame() {
    updateVariables();

    // Create an engine
    engine = Matter.Engine.create();

    // Create a renderer
    render = Matter.Render.create({
        options: {
            width: WRAPPER.offsetWidth,
            height: WRAPPER.offsetHeight,
            wireframes: false,
            background: getComputedStyle(document.documentElement).getPropertyValue('--color1'),
            hasBounds: true
        },
        element: document.getElementById("matter"),
        engine: engine
    });
    render.canvas.style.imageRendering = 'pixelated';
    Matter.Render.run(render);

    // Create a runner
    runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Create mouse interaction object
    mouseObject[0] = Matter.Bodies.circle(mousePosition.x, mousePosition.y, 25, {
        render: { visible: false },
        collisionFilter: {
            category: CAT_GAME,
            mask: CAT_GAME
        },
        isStatic: false
    });
    Matter.Composite.add(engine.world, mouseObject[0]);
    mouseObject[1] = createConstraints([mousePosition], MOUSE_CONST_STIFF, MOUSE_CONST_DAMP, mouseObject[0]);

    // Add update functionality for matter
    Matter.Events.on(engine, 'afterUpdate', function (event) {
        // If one of the gravity shapes has reached the bottom of the website, destroy it
        for (let i = gameObjects.length - 1; i >= 0; i--) {
            if (gameObjects[i].position.y > WRAPPER.offsetHeight + shapeSize) {
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

    // Create background object
    createObjectsFromHTML();
    createPegObjects();
}

function createObjectsFromHTML() {
    HTMLObjects.forEach(element => { Matter.Composite.remove(engine.world, element); });
    HTMLObjects = [];
    pegVoids = [];

    Array.from(document.getElementsByClassName("matter-html")).forEach(element => {
        // Calculate dimensions of HTML element
        let width = element.offsetWidth;
        let height = element.offsetHeight;
        let x = element.offsetLeft + (width / 2);
        let y = element.offsetTop + (height / 2);

        // Create a static object
        let o = Matter.Bodies.rectangle(x, y, width, height, {
            render: { fillStyle: getComputedStyle(element).backgroundColor },
            collisionFilter: {
                category: CAT_STAT,
                mask: CAT_GAME | CAT_STAT
            },
            isStatic: true
        });

        // Add the object to the world
        Matter.Composite.add(engine.world, o);
        HTMLObjects.push(o);
        pegVoids.push([{ x: x, y: y }, (Math.max(width, height) / 2) + (shapeSize * 2)]);
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

function createPegObjects() {
    // Clear current peg objects
    pegObjects.forEach(element => { Matter.Composite.remove(engine.world, element); });
    pegObjects = [];

    // Create variables for how to start the peg generation
    let perlinNoise = new SimplexNoise();
    let gap = shapeSize * 2.5;
    let size = shapeSize / 4;
    let row = 0;

    // Pegs are set on a shifted grid
    // Each row of pegs is slightly offset
    for (let y = (gap / 4); y < WRAPPER.offsetHeight; y += gap, row++) {
        for (let x = (gap / 4) + (row % 2 == 0 ? gap / 2 : 0); x < WRAPPER.offsetWidth; x += gap) {
            // If the perlin noise is not above a certain threshold, do not spawn a peg in that position
            // This creates random gaps around the background so it isn't covered with pegs
            // It also gives more room for the shapes to fall and move around
            if (perlinNoise.noise(x, y, 0) <= PEG_DEN) {
                continue;
            }

            // If the peg is trying to spawn in a position too close to an html element, do not let it spawn
            if (IsPegPositionInVoid(x, y)) {
                continue;
            }

            // Create the peg object
            let o = Matter.Bodies.circle(x, y, size, {
                render: { fillStyle: getComputedStyle(document.documentElement).getPropertyValue('--color5') },
                collisionFilter: {
                    category: CAT_STAT,
                    mask: CAT_GAME
                },
                isStatic: true
            });

            Matter.Composite.add(engine.world, o);
            pegObjects.push(o);
        }
    }
}

function IsPegPositionInVoid(x, y) {
    let isInVoid = false;

    // Check to see if the peg is in range of an html element
    pegVoids.forEach(element => {
        if (Math.hypot(x - element[0].x, y - element[0].y) <= element[1]) {
            isInVoid = true;
        }
    });

    return isInVoid;
}

function createConstraints(points, stiffness, damping, object) {
    let constraintObject = undefined;

    // Create an object for each point to bind the object to
    points.forEach(point => {
        // Create the static constraint object
        constraintObject = Matter.Bodies.circle(point.x, point.y, 1, {
            render: { visible: false },
            collisionFilter: {
                category: 8,
                mask: 8
            },
            isStatic: true
        });

        // Link the constraint object to the object passed into the function
        let constraint = Matter.Constraint.create({
            bodyA: constraintObject,
            bodyB: object,
            pointB: { x: point.x - object.position.x, y: point.y - object.position.y },
            stiffness: stiffness,
            damping: damping,
            length: 0,
            render: { visible: false }
        });

        // Add both objects to the world
        Matter.Composite.add(engine.world, [constraintObject, constraint]);
    });

    // Return the last created constraint object (basically only used for the mouse)
    return constraintObject;
}

function createGameObject() {
    // Create variables for the game object
    let x = Math.random() * WRAPPER.offsetWidth;
    let y = -shapeSize * 2;
    let options = {
        render: { fillStyle: getComputedStyle(document.documentElement).getPropertyValue('--color3') },
        collisionFilter: {
            category: CAT_GAME,
            mask: CAT_GAME | CAT_STAT
        }
    };

    // Create the game object
    let o = createRandomBody(x, y, shapeSize, options);
    // Apply a random force and rotation to the object
    Matter.Body.applyForce(o, o.position, { x: getRandomNumber(-shapeVelocity, shapeVelocity), y: 0 });
    Matter.Body.setAngularVelocity(o, getRandomNumber(-shapeAngleVelocity, shapeAngleVelocity));

    Matter.Composite.add(engine.world, o);
    gameObjects.push(o);
}

function updateVariables() {
    widthRatio = window.innerWidth / REF_WINDOW_WIDTH;
    heightRatio = window.innerHeight / REF_WINDOW_HEIGHT;

    shapeSize = widthRatio * REF_SHP_SIZE;
    shapeVelocity = widthRatio * REF_SHP_VEL;
    shapeAngleVelocity = widthRatio * REF_SHP_ANG_VEL;
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
