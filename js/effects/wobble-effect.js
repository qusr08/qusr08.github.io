export default class MorphSquareElement {
    constructor(element) {
        this.element = element;
        this.wobbleAmount = parseFloat(element.getAttribute("wobble-amount")) || 5;
        this.minWobbleSpeed = parseFloat(element.getAttribute("min-wobble-speed")) || 0.1;
        this.maxWobbleSpeed = parseFloat(element.getAttribute("max-wobble-speed")) || 0.2;
        this.onlyVertical = (element.getAttribute("only-vertical") || "false") == "true";
        this.onlyHorizontal = (element.getAttribute("only-horizontal") || "false") == "true";

        this.bounds = [
            { minX: 0, minY: 0, maxX: this.wobbleAmount, maxY: this.wobbleAmount }, // Top Left
            { minX: 100 - this.wobbleAmount, minY: 0, maxX: 100, maxY: this.wobbleAmount }, // Top Right
            { minX: 100 - this.wobbleAmount, minY: 100 - this.wobbleAmount, maxX: 100, maxY: 100 }, // Bottom Right
            { minX: 0, minY: 100 - this.wobbleAmount, maxX: this.wobbleAmount, maxY: 100 } // Bottom Left
        ];
        this.offsets = [
            { fromX: 0, fromY: 0, atX: 0, atY: 0, toX: 0, toY: 0, t: 0, spd: 0 },
            { fromX: 100, fromY: 0, atX: 100, atY: 0, toX: 100, toY: 0, t: 0, spd: 0 },
            { fromX: 100, fromY: 100, atX: 100, atY: 100, toX: 100, toY: 100, t: 0, spd: 0 },
            { fromX: 0, fromY: 100, atX: 0, atY: 100, toX: 0, toY: 100, t: 0, spd: 0 }
        ];

        this.setRandomOffset(0, true);
        this.setRandomOffset(1, true);
        this.setRandomOffset(2, true);
        this.setRandomOffset(3, true);

        setInterval(() => { this.update(); }, 1 / 60);
    }

    update() {
        for (let i = 0; i < this.offsets.length; i++) {
            let offset = this.offsets[i];
            if (offset.t >= 1) {
                this.setRandomOffset(i);
            }

            offset.atX = smoothLerp(offset.fromX, offset.toX, offset.t);
            offset.atY = smoothLerp(offset.fromY, offset.toY, offset.t);
            offset.t += (1 / 60) * offset.spd;

            this.offsets[i] = offset;
        }

        this.setElementClipPath();
    }

    setRandomOffset(i, setFrom = false) {
        let offset = this.offsets[i];
        let bound = this.bounds[i];

        if (!this.onlyVertical) {
            offset.fromX = setFrom ? randFloat(bound.minX, bound.maxX) : offset.toX;
            offset.atX = offset.fromX;
            offset.toX = randFloat(bound.minX, bound.maxX);
        }

        if (!this.onlyHorizontal) {
            offset.fromY = setFrom ? randFloat(bound.minY, bound.maxY) : offset.toY;
            offset.atY = offset.fromY;
            offset.toY = randFloat(bound.minY, bound.maxY);
        }

        offset.t = 0;
        offset.spd = randFloat(this.minWobbleSpeed, this.maxWobbleSpeed);

        this.offsets[i] = offset;
    }

    setElementClipPath() {
        this.element.style.clipPath = `polygon(${this.offsets[0].atX}% ${this.offsets[0].atY}%, ${this.offsets[1].atX}% ${this.offsets[1].atY}%, ${this.offsets[2].atX}% ${this.offsets[2].atY}%, ${this.offsets[3].atX}% ${this.offsets[3].atY}%)`;
    }
}

function randFloat(min, max) {
    return (Math.random() * (max - min)) + min;
}

function smoothLerp(start, end, t) {
    let angle = lerp(-Math.PI / 2, Math.PI / 2, t);
    let smooth = Math.sin(angle) / 2 + 0.5;
    return lerp(start, end, smooth);
}

function lerp(start, end, t) {
    return start + (end - start) * t
}