import { HTMLMatterObject, MouseMatterObject, HTMLMatterPolyObject, HTMLMatterRectObject } from "./matter-objects.js";
import { SimplexNoise } from "./simplex-noise.js";
import * as Utils from "../utils.js";
import * as Constants from "./constants.js";

export class InteractiveBackground {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.matterElement = document.createElement("div");
        this.matterElement.style.position = "absolute";
        this.matterElement.style.zIndex = -100;
        document.body.insertBefore(this.matterElement, document.body.firstChild);

        this.lastUpdateTime = 0;
        this.isInitialized = false;

        this.widthRatio = 0;
        this.heightRatio = 0;
        this.shapeSize = 0;
        this.shapeVelocity = 0;
        this.shapeAngleVelocity = 0;

        this.gameObjects = [];
        this.pegObjects = [];
        this.HTMLMatterObjects = [];
        this.mouseMatterObject = undefined;

        this.engine = undefined;
        this.render = undefined;
        this.runner = undefined;
    }

    initialize() {
        let startTime = Date.now();

        // Create an engine
        this.engine = Matter.Engine.create();

        // Create a renderer
        this.render = Matter.Render.create({
            options: {
                width: this.parentElement.offsetWidth,
                height: this.parentElement.offsetHeight,
                wireframes: false,
                background: getComputedStyle(document.documentElement).getPropertyValue('--background-color'),
                hasBounds: true
            },
            element: this.matterElement,
            engine: this.engine
        });
        this.render.canvas.style.imageRendering = 'pixelated';
        Matter.Render.run(this.render);

        // Create a runner
        this.runner = Matter.Runner.create();
        Matter.Runner.run(this.runner, this.engine);

        this.calculateVariables();

        // Create mouse interaction object
        this.mouseMatterObject = new MouseMatterObject(this);

        // Add update functionality for matter
        Matter.Events.on(this.engine, 'afterUpdate', this.removeOutOfBoundsGameObjects.bind(this));

        // Create a new shape after a set interval
        setInterval(this.spawnRandomGameObject.bind(this), Constants.SHAPE_SPAWN_RATE);

        // Create background object
        this.createHTMLMatterObjects();
        this.createPegObjects();

        window.requestAnimationFrame(this.updateHTMLMatterObjects.bind(this));

        this.isInitialized = true;

        console.log(`Initialized in ${Date.now() - startTime}ms`);
    }

    updateResolution() {
        // Update variables
        this.calculateVariables();

        // Resize window and renderer
        this.render.bounds.max.x = this.parentElement.offsetWidth;
        this.render.bounds.max.y = this.parentElement.offsetHeight;
        this.render.options.width = this.parentElement.offsetWidth;
        this.render.options.height = this.parentElement.offsetHeight;
        this.render.canvas.width = this.parentElement.offsetWidth;
        this.render.canvas.height = this.parentElement.offsetHeight;

        if (this.isInitialized) {
            // Remove all physics game objects
            this.removeAllGameObjects();

            // Remove all current peg bodies
            this.removeAllPegObjects();

            // Update html objects
            this.HTMLMatterObjects.forEach(HTMLMatterObject => { HTMLMatterObject.initialize(); });

            // Recreate peg objects
            this.createPegObjects();
        }
    }

    spawnRandomGameObject() {
        if (document.hasFocus() && this.gameObjects.length <= Constants.SHAPE_MAX_COUNT) {
            this.createGameObject();
        }
    }

    removeOutOfBoundsGameObjects() {
        // If one of the gravity shapes has reached the bottom of the website, destroy it
        for (let i = this.gameObjects.length - 1; i >= 0; i--) {
            if (this.gameObjects[i].position.y > this.parentElement.offsetHeight + this.shapeSize) {
                Matter.Composite.remove(this.engine.world, this.gameObjects[i]);
                this.gameObjects.splice(i, 1);
            }
        }
    }

    calculateVariables() {
        // Update variables
        this.widthRatio = window.innerWidth / Constants.BASE_WINDOW_WIDTH;
        this.heightRatio = window.innerHeight / Constants.BASE_WINDOW_HEIGHT;
        this.shapeSize = this.widthRatio * Constants.BASE_SHAPE_SIZE;
        this.shapeVelocity = this.widthRatio * Constants.BASE_SHAPE_VELOCITY;
        this.shapeAngleVelocity = this.widthRatio * Constants.BASE_SHAPE_VELOCITY_ANGULAR;
    }

    createHTMLMatterObjects() {
        Array.from(document.querySelectorAll(".matter-rect-html")).forEach(element => {
            this.HTMLMatterObjects.push(new HTMLMatterRectObject(element, this));
        });

        Array.from(document.querySelectorAll(".matter-logo-html")).forEach(element => {
            this.HTMLMatterObjects.push(new HTMLMatterPolyObject(element, this, Constants.LOGO_IMAGE_COORDS, Constants.LOGO_IMAGE_WIDTH, Constants.LOGO_IMAGE_HEIGHT));
        });
    }

    updateHTMLMatterObjects(timestamp) {
        this.HTMLMatterObjects.forEach(matterObject => matterObject.update());
        window.requestAnimationFrame(this.updateHTMLMatterObjects.bind(this));
    }

    createConstraint(stiffness, damping, length, mainBody, otherBody) {
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

    createConstraintBody(point) {
        // Create the static constraint object
        return Matter.Bodies.circle(point.x, point.y, 1, {
            render: { visible: false },
            collisionFilter: {
                category: Constants.CATEGORY_CONSTRAINT,
                mask: Constants.CATEGORY_CONSTRAINT
            },
            isStatic: true,
            label: 'ConstraintObject'
        });
    }

    createRandomBody(point, size, options) {
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                return Matter.Bodies.circle(point.x, point.y, size / 2, options);
            case 1:
                return Matter.Bodies.rectangle(point.x, point.y, size, size, options);
            case 2:
                return Matter.Bodies.polygon(point.x, point.y, 3, size / 1.5, options);
        }
    }

    createGameObject() {
        // Create variables for the game object
        let x = Math.random() * this.parentElement.offsetWidth;
        let y = -this.shapeSize * 2;
        let options = {
            render: { fillStyle: getComputedStyle(document.documentElement).getPropertyValue('--shape-color') },
            collisionFilter: {
                category: Constants.CATEGORY_GAME,
                mask: Constants.CATEGORY_GAME | Constants.CATEGORY_HTML | Constants.CATEGORY_PEG
            },
            label: 'GameObject'
        };

        // Create the game object
        let o = this.createRandomBody({ x: x, y: y }, this.shapeSize, options);

        // Apply a random force and rotation to the object
        Matter.Body.applyForce(o, o.position, { x: Utils.randomNumber(-this.shapeVelocity, this.shapeVelocity), y: 0 });
        Matter.Body.setAngularVelocity(o, Utils.randomNumber(-this.shapeAngleVelocity, this.shapeAngleVelocity));

        Matter.Composite.add(this.engine.world, o);
        this.gameObjects.push(o);
    }

    removeAllGameObjects() {
        this.gameObjects.forEach(gameObject => { Matter.Composite.remove(this.engine.world, gameObject); });
        this.gameObjects = [];
    }

    createPegObjects() {
        // Create variables for how to start the peg generation
        let perlinNoise = new SimplexNoise();
        let gap = this.shapeSize * 2;
        let size = this.shapeSize * 0.25;
        let row = 0;

        // Pegs are set on a shifted grid
        // Each row of pegs is slightly offset
        for (let y = (gap / 4); y < this.parentElement.offsetHeight; y += gap, row++) {
            for (let x = (gap / 4) + (row % 2 == 0 ? gap / 2 : 0); x < this.parentElement.offsetWidth; x += gap) {
                // If the perlin noise is not above a certain threshold, do not spawn a peg in that position
                // This creates random gaps around the background so it isn't covered with pegs
                // It also gives more room for the shapes to fall and move around
                if (perlinNoise.noise(x, y, 0) <= Constants.PEG_THRESHOLD) {
                    continue;
                }

                // Check to see if the peg point is too close to other matter objects
                let isNearbyMatterObject = false;
                for (let i = 0; i < this.HTMLMatterObjects.length; i++) {
                    if (this.HTMLMatterObjects[i].isPointInside({ x: x, y: y }, this.shapeSize * 2)) {
                        isNearbyMatterObject = true;
                        break;
                    }
                }
                if (isNearbyMatterObject) {
                    continue;
                }

                // Create the peg object
                let pegBody = this.createRandomBody({ x: x, y: y }, size * 2, {
                    render: { fillStyle: getComputedStyle(document.documentElement).getPropertyValue('--peg-color') },
                    collisionFilter: {
                        category: Constants.CATEGORY_PEG,
                        mask: Constants.CATEGORY_GAME
                    },
                    isStatic: true,
                    label: 'PegObject'
                });
                Matter.Body.rotate(pegBody, Math.random() * 360, { x: x, y: y })
                // let pegBody = Matter.Bodies.circle(x, y, size, {
                //     render: { fillStyle: getComputedStyle(document.documentElement).getPropertyValue('--peg-color') },
                //     collisionFilter: {
                //         category: Constants.CATEGORY_PEG,
                //         mask: Constants.CATEGORY_GAME
                //     },
                //     isStatic: true,
                //     label: 'PegObject'
                // });

                Matter.Composite.add(this.engine.world, pegBody);
                this.pegObjects.push(pegBody);
            }
        }
    }

    removeAllPegObjects() {
        this.pegObjects.forEach(pegObject => { Matter.Composite.remove(this.engine.world, pegObject); });
        this.pegObjects = [];
    }
}