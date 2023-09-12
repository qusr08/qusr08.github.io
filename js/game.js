// https://brm.io/matter-js/docs/
// http://schteppe.github.io/poly-decomp.js/#path=160,150/118,108/78,154/32,48/192,40

// https://stackoverflow.com/questions/9692448/how-can-you-find-the-centroid-of-a-concave-irregular-polygon-in-javascript
// https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
// https://stackoverflow.com/questions/14033281/including-javascript-files-from-github-into-html-pages

// https://github.com/gre/bezier-easing
// https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function

// Setup the app
"use strict";

// https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
const RGBA_2_HEX = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`;

const BASE_WINDOW_WIDTH = 1920;
const BASE_WINDOW_HEIGHT = 1080;
const BASE_SHAPE_SIZE = 40;
const BASE_SHAPE_VELOCITY = 0.01;
const BASE_SHAPE_VELOCITY_ANGULAR = 0.05;

const WRAPPER = document.getElementById("wrapper");
const SHAPE_SPAWN_RATE = 500;
const SHAPE_MAX_COUNT = 200;
const PEG_THRESHOLD = 0;

const MOUSE_CONSTRAINT_STIFFNESS = 0.1;
const MOUSE_CONSTRAINT_DAMPING = 0;
const HTML_CONSTRAINT_STIFFNESS = 0.005;
const HTML_CONSTRAINT_DAMPING = 0.1;
const HTML_CONSTRAINT_DISTANCE_MODIFIER = 12;

// https://www.temiz.dev/blog/matter-js-collisions-explained
const CATEGORY_GAME = 2;
const CATEGORY_HTML = 4;
const CATEGORY_CONSTRAINT = 8;

// http://maschek.hu/imagemap/imgmap/
const LOGO_IMAGE_COORDS = "1468,99,1333,108,1212,131,1096,167,985,215,885,275,813,326,478,0,394,85,719,409,621,523,213,296,152,400,551,630,485,764,33,651,2,766,444,886,425,977,411,1097,409,1220,1089,1217,1128,1287,1186,1346,1259,1387,1338,1406,1429,1406,1430,1204,2519,1219,2520,1098,2520,1015,2501,918,2467,802,2417,684,2348,568,2262,458,2152,349,2011,248,1843,168,1706,128,1593,107".split(',');
const LOGO_IMAGE_WIDTH = 2526;
const LOGO_IMAGE_HEIGHT = 1408;

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

/************************************************* METHODS *******************************************************/

window.onresize = function(event) { updateGame(); };

window.onmousemove = function(event) { if (isInitialized) { mouseMatterObject.update({ x: event.clientX + window.scrollX, y: event.clientY + window.scrollY }); } };

function initializeGame() {
    // Create an engine
    engine = Matter.Engine.create();

    // Create a renderer
    render = Matter.Render.create({
        options: {
            width: WRAPPER.offsetWidth,
            height: WRAPPER.offsetHeight,
            wireframes: false,
            background: getComputedStyle(document.documentElement).getPropertyValue('--background-color'),
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

    updateGameVariables();

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

    window.requestAnimationFrame(updateHTMLMatterObjects);

    isInitialized = true;
}

function updateGame() {
    // Update variables
    updateGameVariables();

    // Resize window and renderer
    render.bounds.max.x = WRAPPER.offsetWidth;
    render.bounds.max.y = WRAPPER.offsetHeight;
    render.options.width = WRAPPER.offsetWidth;
    render.options.height = WRAPPER.offsetHeight;
    render.canvas.width = WRAPPER.offsetWidth;
    render.canvas.height = WRAPPER.offsetHeight;

    if (isInitialized) {
        // Remove all physics game objects
        removeAllGameObjects();

        // Remove all current peg bodies
        removeAllPegObjects();

        // Update html objects
        HTMLMatterObjects.forEach(HTMLMatterObject => { HTMLMatterObject.initialize(); });

        // Recreate peg objects
        createPegObjects();
    }
}

function updateGameVariables() {
    // Update variables
    widthRatio = window.innerWidth / BASE_WINDOW_WIDTH;
    heightRatio = window.innerHeight / BASE_WINDOW_HEIGHT;
    shapeSize = widthRatio * BASE_SHAPE_SIZE;
    shapeVelocity = widthRatio * BASE_SHAPE_VELOCITY;
    shapeAngleVelocity = widthRatio * BASE_SHAPE_VELOCITY_ANGULAR;
}

function createHTMLMatterObjects() {
    Array.from(document.getElementsByClassName("matter-rect-html")).forEach(element => {
        HTMLMatterObjects.push(new HTMLMatterRectObject(element));
    });

    Array.from(document.getElementsByClassName("matter-logo-html")).forEach(element => {
        HTMLMatterObjects.push(new HTMLMatterPolyObject(element, LOGO_IMAGE_COORDS, LOGO_IMAGE_WIDTH, LOGO_IMAGE_HEIGHT));
    });
}

function updateHTMLMatterObjects(timestamp) {
    HTMLMatterObjects.forEach(matterObject => {
        matterObject.update();
    });

    window.requestAnimationFrame(updateHTMLMatterObjects);
}

function createConstraint(stiffness, damping, length, mainBody, otherBody) {
    // Link the constraint object to the object passed into the function
    return Matter.Constraint.create({
        bodyA: mainBody,
        bodyB: otherBody,
        pointA: { x: otherBody.position.x - mainBody.position.x, y: otherBody.position.y - mainBody.position.y },
        stiffness: stiffness,
        damping: damping,
        length: length,
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
        render: { fillStyle: getComputedStyle(document.documentElement).getPropertyValue('--detail-color') },
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

function removeAllGameObjects() {
    gameObjects.forEach(gameObject => { Matter.Composite.remove(engine.world, gameObject); });
    gameObjects = [];
}

function createPegObjects() {
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
                render: { fillStyle: getComputedStyle(document.documentElement).getPropertyValue('--peg-color') },
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

// Abstract class
class HTMLMatterObject {
    constructor(HTMLElement) {
        this.HTMLElement = HTMLElement;
        this.HTMLElementOffsetX = 0;
        this.HTMLElementOffsetY = 0;

        // Calculate dimensions of HTML element
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;

        this.body = undefined;
        this.pegVoid = undefined;
        this.constraintBodies = [undefined, undefined];
        this.constraints = [undefined, undefined];

        this.isInitialized = false;
        // initialize() should be called in all subclasses
    }

    initialize() {
        // Calculate dimensions of HTML element
        this.width = this.HTMLElement.offsetWidth;
        this.height = this.HTMLElement.offsetHeight;
        this.x = this.HTMLElement.offsetLeft + (this.width / 2);
        this.y = this.HTMLElement.offsetTop + (this.height / 2);

        // If the body has been created before, we are going to replace it here with new dimensions
        if (this.body != undefined) {
            Matter.Composite.remove(engine.world, this.body);
        }

        // Create a matter body
        this.body = this.createBody();
        Matter.Composite.add(engine.world, this.body);

        // Calculate the peg void from the body
        // this.pegVoid = [{ x: this.x, y: this.y, w: this.width + (shapeSize * 2), h: (this.height * 1.5) + (shapeSize * 2) }];
        this.pegVoid = { x: this.x, y: this.y, r: (Math.max(this.width, this.height) / 2) + (shapeSize * 2) };

        // Remove old constraints
        this.constraints.forEach(constraint => { if (constraint != undefined) { Matter.Composite.remove(engine.world, constraint); } });
        this.constraintBodies.forEach(constraintBody => { if (constraintBody != undefined) { Matter.Composite.remove(engine.world, constraintBody); } });

        // Create constraints
        this.constraintBodies[0] = createConstraintBody({ x: this.x - (this.width / HTML_CONSTRAINT_DISTANCE_MODIFIER), y: this.y });
        this.constraintBodies[1] = createConstraintBody({ x: this.x + (this.width / HTML_CONSTRAINT_DISTANCE_MODIFIER), y: this.y });
        Matter.Composite.add(engine.world, this.constraintBodies);
        this.constraints[0] = createConstraint(HTML_CONSTRAINT_STIFFNESS, HTML_CONSTRAINT_DAMPING, 0, this.body, this.constraintBodies[0]);
        this.constraints[1] = createConstraint(HTML_CONSTRAINT_STIFFNESS, HTML_CONSTRAINT_DAMPING, 0, this.body, this.constraintBodies[1]);
        Matter.Composite.add(engine.world, this.constraints);

        this.isInitialized = true;
    }

    update() {
        // If the object is not initialized, do not update
        if (!this.isInitialized) {
            return;
        }

        // https://stackoverflow.com/questions/50391891/how-to-apply-sprite-textures-to-matter-js-bodies
        // Update the position of the html element with the position of the matter object
        let translatePosition = this.body.position;
        let translateAngle = this.body.angle * (180 / Math.PI);
        this.HTMLElement.style.transform = "translate(" + (translatePosition.x - this.x + this.HTMLElementOffsetX) + "px, " + (translatePosition.y - this.y + this.HTMLElementOffsetY) + "px) rotate(" + translateAngle + "deg)";
    }

    createBody() {}
}

class HTMLMatterRectObject extends HTMLMatterObject {
    constructor(HTMLElement) {
        super(HTMLElement);

        this.initialize();
    }

    createBody() {
        return Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
            render: { fillStyle: 'transparent' },
            collisionFilter: {
                category: CATEGORY_HTML,
                mask: CATEGORY_GAME | CATEGORY_HTML
            },
            label: 'HTMLMatterRectObject'
        });
    }
}

class HTMLMatterPolyObject extends HTMLMatterObject {
    constructor(HTMLElement, imageCoords, imageWidth, imageHeight) {
        super(HTMLElement);

        this.imageCoords = imageCoords;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;

        this.initialize();
    }

    createBody() {
        // Calculate the vertices of the collision polygon
        let vertices = [];
        let ratio = this.width / this.imageWidth;
        for (let i = 0; i < this.imageCoords.length; i += 2) {
            vertices.push({ x: this.imageCoords[i] * ratio, y: this.imageCoords[i + 1] * ratio });
        }

        this.HTMLElementOffsetX = -115 * ratio;
        this.HTMLElementOffsetY = -31 * ratio;

        // Create the body
        return Matter.Bodies.fromVertices(this.x, this.y, vertices, {
            render: {
                // lineWidth: 1,
                // strokeStyle: '#00FF00',
                fillStyle: 'transparent'
            },
            collisionFilter: {
                category: CATEGORY_HTML,
                mask: CATEGORY_GAME | CATEGORY_HTML
            },
            label: 'HTMLMatterPolyObject'
        });
    }
}

class MouseMatterObject {
    constructor() {
        this.mousePosition = { x: 0, y: 0 };

        // Create the body for the mouse
        this.body = Matter.Bodies.circle(this.mousePosition.x, this.mousePosition.y, 20, {
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
        this.constraint = createConstraint(MOUSE_CONSTRAINT_STIFFNESS, MOUSE_CONSTRAINT_DAMPING, 0, this.body, this.constraintBody);

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

function map(number, inMin, inMax, outMin, outMax) {
    // https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}