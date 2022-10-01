// https://brm.io/matter-js/docs/

// https://stackoverflow.com/questions/9692448/how-can-you-find-the-centroid-of-a-concave-irregular-polygon-in-javascript
// https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers

// Setup the app
"use strict";

const BASE_WINDOW_WIDTH = 1920;
const BASE_WINDOW_HEIGHT = 1080;
const BASE_SHAPE_SIZE = 40;
const BASE_SHAPE_VELOCITY = 0.01;
const BASE_SHAPE_VELOCITY_ANGULAR = 0.05;

const WRAPPER = document.getElementById("wrapper");
const SHAPE_SPAWN_RATE = 50;
const SHAPE_MAX_COUNT = 200;
const PEG_THRESHOLD = 0;

const MOUSE_CONSTRAINT_STIFFNESS = 0.1;
const MOUSE_CONSTRAINT_DAMPING = 0;
const HTML_CONSTRAINT_STIFFNESS = 0.025;
const HTML_CONSTRAINT_DAMPING = 0.1;
const HTML_CONSTRAINT_DISTANCE_MODIFIER = 12;

// https://www.temiz.dev/blog/matter-js-collisions-explained
const CATEGORY_GAME = 2;
const CATEGORY_HTML = 4;
const CATEGORY_CONSTRAINT = 8;

let widthRatio, heightRatio;
let shapeSize, shapeVelocity, shapeAngleVelocity;

let gameObjects = [];
let pegObjects = [];
let HTMLMatterObjects = [];
let mouseMatterObject = undefined;

let engine;
let render;
let runner;
let isInitialized = false;

// Ideas for Version 3.1.0
// - make a list in the beginning of all matter-html elements and their background colors
//   - this will not change at all while the page is running, it will be set each time the page is loaded
// - Matter.Query.point() for updating scale and color of matter button objects
//   - this is tricky because i want to follow the same easing equation as used in css, so i need to implement that
//   - when an object is hovered, it is placed in a "fade to color" array, and updated each frame
//     - there will be some global value stored in the master list to track its progress
//     - once it has reached the color, it is removed from the list
//   - when an object is exited, it is placed in a "fade to original" array, and updated each frame
//     - once it has reached its original color, it is removed from the list
//   - the scale will also fade with the color, mimicing the css transition
// - fix peg voids by making them square? basically just like a big border around the object with more space at the top
// - rename variables/functions to be more clear

/************************************************* METHODS *******************************************************/

window.onresize = function(event) { updateGame(); };

window.onmousemove = function(event) { if (isInitialized) { mouseMatterObject.update({ x: event.clientX + window.scrollX, y: event.clientY + window.scrollY }); } };

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
    mouseMatterObject = new MouseMatterObject();

    // Add update functionality for matter
    Matter.Events.on(engine, 'afterUpdate', function(event) {
        // If one of the gravity shapes has reached the bottom of the website, destroy it
        for (let i = gameObjects.length - 1; i >= 0; i--) {
            if (gameObjects[i].position.y > WRAPPER.offsetHeight + shapeSize) {
                Matter.Composite.remove(engine.world, gameObjects[i]);
                gameObjects.splice(i, 1);
            }
        }
    });

    // Create a new shape after a set interval
    setInterval(function() {
        if (document.hasFocus() && gameObjects.length <= SHAPE_MAX_COUNT) {
            createGameObject();
        }
    }, SHAPE_SPAWN_RATE);

    // Create background object
    createHTMLMatterObjects();
    createPegObjects();

    isInitialized = true;
}

function createHTMLMatterObjects() {
    Array.from(document.getElementsByClassName("matter-html")).forEach(element => {
        HTMLMatterObjects.push(new HTMLMatterObject(element));
    });
}

function createConstraint(stiffness, damping, mainBody, otherBody) {
    // Link the constraint object to the object passed into the function
    return Matter.Constraint.create({
        bodyA: mainBody,
        bodyB: otherBody,
        pointA: { x: otherBody.position.x - mainBody.position.x, y: otherBody.position.y - mainBody.position.y },
        stiffness: stiffness,
        damping: damping,
        length: 0,
        render: { visible: false },
        label: 'Constraint'
    });
}

function createConstraintBody(point) {
    // Create the static constraint object
    return Matter.Bodies.circle(point.x, point.y, 1, {
        render: { visible: false },
        collisionFilter: {
            category: CATEGORY_CONSTRAINT,
            mask: CATEGORY_CONSTRAINT
        },
        isStatic: true,
        label: 'ConstraintObject'
    });
}

function createRandomBody(point, size, options) {
    switch (Math.floor(Math.random() * 3)) {
        case 0:
            return Matter.Bodies.circle(point.x, point.y, size / 2, options);
        case 1:
            return Matter.Bodies.rectangle(point.x, point.y, size, size, options);
        case 2:
            return Matter.Bodies.polygon(point.x, point.y, 3, size / 1.5, options);
    }
}

function createGameObject() {
    // Create variables for the game object
    let x = Math.random() * WRAPPER.offsetWidth;
    let y = -shapeSize * 2;
    let options = {
        render: { fillStyle: getComputedStyle(document.documentElement).getPropertyValue('--color3') },
        collisionFilter: {
            category: CATEGORY_GAME,
            mask: CATEGORY_GAME | CATEGORY_HTML
        },
        label: 'GameObject'
    };

    // Create the game object
    let o = createRandomBody({ x: x, y: y }, shapeSize, options);

    // Apply a random force and rotation to the object
    Matter.Body.applyForce(o, o.position, { x: getRandomNumber(-shapeVelocity, shapeVelocity), y: 0 });
    Matter.Body.setAngularVelocity(o, getRandomNumber(-shapeAngleVelocity, shapeAngleVelocity));

    Matter.Composite.add(engine.world, o);
    gameObjects.push(o);
}

function createPegObjects() {
    // Remove all current peg bodies
    removeAllPegObjects();

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
            if (perlinNoise.noise(x, y, 0) <= PEG_THRESHOLD) {
                continue;
            }

            // If the peg is trying to spawn in a position too close to an html element, do not let it spawn
            if (isPegInVoid({ x: x, y: y })) {
                continue;
            }

            // Create the peg object
            let pegBody = Matter.Bodies.circle(x, y, size, {
                render: { fillStyle: getComputedStyle(document.documentElement).getPropertyValue('--color5') },
                collisionFilter: {
                    category: CATEGORY_HTML,
                    mask: CATEGORY_GAME
                },
                isStatic: true,
                label: 'PegObject'
            });

            Matter.Composite.add(engine.world, pegBody);
            pegObjects.push(pegBody);
        }
    }
}

function removeAllGameObjects() {
    gameObjects.forEach(gameObject => { Matter.Composite.remove(engine.world, gameObject); });
    gameObjects = [];
}

function removeAllPegObjects() {
    pegObjects.forEach(pegObject => { Matter.Composite.remove(engine.world, pegObject); });
    pegObjects = [];
}

function isPegInVoid(point) {
    let isVoid = false;

    // Check to see if the peg is in range of an html element
    HTMLMatterObjects.forEach(HTMLMatterObject => {
        if (Math.hypot(point.x - HTMLMatterObject.pegVoid.x, point.y - HTMLMatterObject.pegVoid.y) <= HTMLMatterObject.pegVoid.r) {
            isVoid = true;
        }
    });

    return isVoid;
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function updateVariables() {
    // Update variables
    widthRatio = window.innerWidth / BASE_WINDOW_WIDTH;
    heightRatio = window.innerHeight / BASE_WINDOW_HEIGHT;
    shapeSize = widthRatio * BASE_SHAPE_SIZE;
    shapeVelocity = widthRatio * BASE_SHAPE_VELOCITY;
    shapeAngleVelocity = widthRatio * BASE_SHAPE_VELOCITY_ANGULAR;
}

function updateGame() {
    // Update variables
    updateVariables();

    // Resize window and renderer
    render.bounds.max.x = WRAPPER.offsetWidth;
    render.bounds.max.y = WRAPPER.offsetHeight;
    render.options.width = WRAPPER.offsetWidth;
    render.options.height = WRAPPER.offsetHeight;
    render.canvas.width = WRAPPER.offsetWidth;
    render.canvas.height = WRAPPER.offsetHeight;

    if (isInitialized) {
        // Remove all current game objects
        removeAllGameObjects();

        // Update html objects
        HTMLMatterObjects.forEach(HTMLMatterObject => { HTMLMatterObject.update(); });

        // Recreate peg objects
        createPegObjects();
    }
}

class HTMLMatterObject {
    constructor(HTMLElement) {
        this.HTMLElement = HTMLElement;

        this.body = undefined;
        this.pegVoid = undefined;
        this.constraintBodies = [undefined, undefined];
        this.constraints = [undefined, undefined];

        this.update();
    }

    update() {
        // Calculate dimensions of HTML element
        let width = this.HTMLElement.offsetWidth;
        let height = this.HTMLElement.offsetHeight;
        let x = this.HTMLElement.offsetLeft + (width / 2);
        let y = this.HTMLElement.offsetTop + (height / 2);

        // If the body has been created before, we are going to replace it here with new dimensions
        if (this.body != undefined) {
            Matter.Composite.remove(engine.world, this.body);
        }

        // Create a matter body
        this.body = Matter.Bodies.rectangle(x, y, width, height, {
            render: { fillStyle: getComputedStyle(this.HTMLElement).backgroundColor },
            collisionFilter: {
                category: CATEGORY_HTML,
                mask: CATEGORY_GAME | CATEGORY_HTML
            },
            label: 'HTMLMatterObject'
        });

        this.HTMLElement.style.backgroundColor = 'transparent';

        // Add the body to the world
        Matter.Composite.add(engine.world, this.body);

        // Calculate the peg void from the body
        // this.pegVoid = [{ x: x, y: y, w: width + (shapeSize * 2), h: (height * 1.5) + (shapeSize * 2) }];
        this.pegVoid = { x: x, y: y, r: (Math.max(width, height) / 2) + (shapeSize * 2) };

        // Remove old constraints
        this.constraints.forEach(constraint => { if (constraint != undefined) { Matter.Composite.remove(engine.world, constraint); } });
        this.constraintBodies.forEach(constraintBody => { if (constraintBody != undefined) { Matter.Composite.remove(engine.world, constraintBody); } });

        // Remake constraints
        this.constraintBodies[0] = createConstraintBody({ x: x - (width / HTML_CONSTRAINT_DISTANCE_MODIFIER), y: y });
        this.constraintBodies[1] = createConstraintBody({ x: x + (width / HTML_CONSTRAINT_DISTANCE_MODIFIER), y: y });
        Matter.Composite.add(engine.world, this.constraintBodies);
        this.constraints[0] = createConstraint(HTML_CONSTRAINT_STIFFNESS, HTML_CONSTRAINT_DAMPING, this.body, this.constraintBodies[0]);
        this.constraints[1] = createConstraint(HTML_CONSTRAINT_STIFFNESS, HTML_CONSTRAINT_DAMPING, this.body, this.constraintBodies[1]);
        Matter.Composite.add(engine.world, this.constraints);
    }
}

class MouseMatterObject {
    constructor() {
        this.mousePosition = { x: 0, y: 0 };

        // Create the body for the mouse
        this.body = Matter.Bodies.circle(this.mousePosition.x, this.mousePosition.y, 25, {
            render: { visible: false },
            collisionFilter: {
                category: CATEGORY_GAME,
                mask: CATEGORY_GAME
            },
            isStatic: false,
            label: 'MouseMatterObject'
        });

        // Create the constraint to connect the body to the mouse position
        this.constraintBody = createConstraintBody(this.mousePosition);
        this.constraint = createConstraint(MOUSE_CONSTRAINT_STIFFNESS, MOUSE_CONSTRAINT_DAMPING, this.body, this.constraintBody);

        // Add the body and constraints to the world
        Matter.Composite.add(engine.world, [this.body, this.constraintBody, this.constraint]);
    }

    update(mousePosition) {
        this.mousePosition = mousePosition;

        // Set the position of the mouse constraint object
        // The mouse body will follow it around because the two bodies are joined together
        Matter.Body.setPosition(this.constraintBody, this.mousePosition);
    }
}