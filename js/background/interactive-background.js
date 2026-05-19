import { HTMLMatterObject, MouseMatterObject, HTMLMatterPolyObject, HTMLMatterRectObject } from "./matter-objects.js";
import * as Constants from "./constants.js";

export class InteractiveBackground {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.matterElement = document.createElement("div");
        document.body.appendChild(this.matterElement);
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
        mouseMatterObject = new MouseMatterObject();

        // Add update functionality for matter
        Matter.Events.on(this.engine, 'afterUpdate', function (event) {
            // If one of the gravity shapes has reached the bottom of the website, destroy it
            for (let i = this.gameObjects.length - 1; i >= 0; i--) {
                if (this.gameObjects[i].position.y > this.parentElement.offsetHeight + this.shapeSize) {
                    Matter.Composite.remove(this.engine.world, this.gameObjects[i]);
                    this.gameObjects.splice(i, 1);
                }
            }
        });

        // Create a new shape after a set interval
        setInterval(function () {
            if (document.hasFocus() && this.gameObjects.length <= Constants.SHAPE_MAX_COUNT) {
                createGameObject();
            }
        }, SHAPE_SPAWN_RATE);

        // Create background object
        createHTMLMatterObjects();
        createPegObjects();

        window.requestAnimationFrame(updateHTMLMatterObjects);

        this.isInitialized = true;
    }

    calculateVariables() {
        // Update variables
        this.widthRatio = window.innerWidth / Constants.BASE_WINDOW_WIDTH;
        this.heightRatio = window.innerHeight / Constants.BASE_WINDOW_HEIGHT;
        this.shapeSize = this.widthRatio * Constants.BASE_SHAPE_SIZE;
        this.shapeVelocity = this.widthRatio * Constants.BASE_SHAPE_VELOCITY;
        this.shapeAngleVelocity = this.widthRatio * Constants.BASE_SHAPE_VELOCITY_ANGULAR;
    }
}