import * as Constants from "../constants.js";

// Abstract class
export class HTMLMatterObject {
    constructor(HTMLElement, simulation) {
        this.HTMLElement = HTMLElement;
        this.simulation = simulation;
        this.HTMLElementOffsetX = 0;
        this.HTMLElementOffsetY = 0;

        // Calculate dimensions of HTML element
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;

        this.body = undefined;
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
            Matter.Composite.remove(this.simulation.engine.world, this.body);
        }

        // Create a matter body
        this.body = this.createBody();
        Matter.Composite.add(this.simulation.engine.world, this.body);

        // Remove old constraints
        this.constraints.forEach(constraint => { if (constraint != undefined) { Matter.Composite.remove(this.simulation.engine.world, constraint); } });
        this.constraintBodies.forEach(constraintBody => { if (constraintBody != undefined) { Matter.Composite.remove(this.simulation.engine.world, constraintBody); } });

        // Create constraints
        this.constraintBodies[0] = this.simulation.createConstraintBody({ x: this.x - (this.width / Constants.HTML_CONSTRAINT_DISTANCE_MODIFIER), y: this.y });
        this.constraintBodies[1] = this.simulation.createConstraintBody({ x: this.x + (this.width / Constants.HTML_CONSTRAINT_DISTANCE_MODIFIER), y: this.y });
        Matter.Composite.add(this.simulation.engine.world, this.constraintBodies);
        this.constraints[0] = this.simulation.createConstraint(Constants.HTML_CONSTRAINT_STIFFNESS, Constants.HTML_CONSTRAINT_DAMPING, 0, this.body, this.constraintBodies[0]);
        this.constraints[1] = this.simulation.createConstraint(Constants.HTML_CONSTRAINT_STIFFNESS, Constants.HTML_CONSTRAINT_DAMPING, 0, this.body, this.constraintBodies[1]);
        Matter.Composite.add(this.simulation.engine.world, this.constraints);

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

    isPointInside(point, borderThickness = 0) {
        let inX = point.x >= this.x - (this.width / 2) - borderThickness && point.x <= this.x + (this.width / 2) + borderThickness;
        let inY = point.y >= this.y - (this.height / 2) - borderThickness && point.y <= this.y + (this.height / 2) + borderThickness;
        return (inX && inY);
    }

    createBody() {}
}

export class HTMLMatterRectObject extends HTMLMatterObject {
    constructor(HTMLElement, simulation) {
        super(HTMLElement, simulation);

        this.initialize();
    }

    createBody() {
        return Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
            render: { fillStyle: 'transparent' },
            collisionFilter: {
                category: Constants.CATEGORY_HTML,
                mask: Constants.CATEGORY_GAME | Constants.CATEGORY_HTML & Constants.CATEGORY_PEG
            },
            label: 'HTMLMatterRectObject'
        });
    }
}

export class HTMLMatterPolyObject extends HTMLMatterObject {
    constructor(HTMLElement, simulation, imageCoords, imageWidth, imageHeight) {
        super(HTMLElement, simulation);

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
                category: Constants.CATEGORY_HTML,
                mask: Constants.CATEGORY_GAME | Constants.CATEGORY_HTML & Constants.CATEGORY_PEG
            },
            label: 'HTMLMatterPolyObject'
        });
    }
}

export class MouseMatterObject {
    constructor(simulation) {
        this.simulation = simulation;
        this.mousePosition = { x: 0, y: 0 };

        // Create the body for the mouse
        this.body = Matter.Bodies.circle(this.mousePosition.x, this.mousePosition.y, 20, {
            render: { visible: false },
            collisionFilter: {
                category: Constants.CATEGORY_GAME,
                mask: Constants.CATEGORY_GAME
            },
            isStatic: false,
            label: 'MouseMatterObject'
        });

        // Create the constraint to connect the body to the mouse position
        this.constraintBody = this.simulation.createConstraintBody(this.mousePosition);
        this.constraint = this.simulation.createConstraint(Constants.MOUSE_CONSTRAINT_STIFFNESS, Constants.MOUSE_CONSTRAINT_DAMPING, 0, this.body, this.constraintBody);

        // Add the body and constraints to the world
        Matter.Composite.add(this.simulation.engine.world, [this.body, this.constraintBody, this.constraint]);
    }

    update(mousePosition) {
        this.mousePosition = mousePosition;

        // Set the position of the mouse constraint object
        // The mouse body will follow it around because the two bodies are joined together
        Matter.Body.setPosition(this.constraintBody, this.mousePosition);
    }
}