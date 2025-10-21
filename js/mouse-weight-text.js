export default class MouseWeightText {
    constructor(textElement, minWeight, maxWeight) {
        this.textElement = textElement;
        this.text = textElement.innerHTML.trim();
        this.charSpanElements = [];
        this.rangeSettings = { sqRadius: 500 * 500, min: minWeight, max: maxWeight };
        this.mousePosition = { x: 0, y: 0 };

        this.textElement.innerHTML = "";
        for (let i = 0; i < this.text.length; i++) {
            let spanElement = document.createElement("span");
            spanElement.innerHTML = this.text.at(i);
            this.charSpanElements.push(spanElement);
            this.textElement.appendChild(spanElement);
        }

        document.addEventListener('mousemove', (e) => {
            this.mousePosition = { x: e.clientX, y: e.clientY };
            this.onMouseMove();
        });
        document.addEventListener('scroll', (e) => {
            this.onMouseMove();
        });
    }

    onMouseMove() {
        for (let i = 0; i < this.charSpanElements.length; i++) {
            let spanElement = this.charSpanElements[i];
            let spanRect = spanElement.getBoundingClientRect();

            let distVector = {
                x: this.mousePosition.x - (spanRect.x + (spanRect.width * 0.5)),
                y: this.mousePosition.y - (spanRect.y + (spanRect.height * 0.5))
            };
            let sqMag = (distVector.x * distVector.x) + (distVector.y * distVector.y);

            let areaOfEffect = Math.max(0, this.rangeSettings.sqRadius - sqMag);
            if (areaOfEffect == 0 && spanElement.style.fontWeight == this.rangeSettings.min) {
                continue;
            }

            spanElement.style.minWidth = spanRect.width;
            let fontWeight = scale(areaOfEffect, 0, this.rangeSettings.sqRadius, this.rangeSettings.min, this.rangeSettings.max);
            spanElement.style.fontWeight = Math.round(fontWeight);
        }
    }
}

function scale(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}