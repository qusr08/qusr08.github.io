export default class MouseWeightText {
    constructor(textElement) {
        this.textElement = textElement;
        this.text = textElement.innerHTML.trim();
        this.charSpanElements = [];
        this.rangeSettings = { sqRadius: 500 * 500, min: 100, max: 900 };

        this.textElement.innerHTML = "";
        for (let i = 0; i < this.text.length; i++) {
            let spanElement = document.createElement("span");
            spanElement.innerHTML = this.text.at(i);
            this.charSpanElements.push(spanElement);
            this.textElement.appendChild(spanElement);
        }

        document.addEventListener('mousemove', (e) => { this.onMouseMove(e); });
    }

    onMouseMove(e) {
        let mousePosition = { x: e.pageX, y: e.pageY };

        for (let i = 0; i < this.charSpanElements.length; i++) {
            let spanElement = this.charSpanElements[i];

            let distVector = {
                x: mousePosition.x - (spanElement.offsetLeft + (spanElement.offsetWidth / 2)),
                y: mousePosition.y - (spanElement.offsetTop + (spanElement.offsetHeight / 2))
            };
            let sqMag = (distVector.x * distVector.x) + (distVector.y * distVector.y);

            let areaOfEffect = Math.max(0, this.rangeSettings.sqRadius - sqMag);
            if (areaOfEffect == 0 && spanElement.style.fontWeight == this.rangeSettings.min) {
                continue;
            }

            let fontWeight = scale(areaOfEffect, 0, this.rangeSettings.sqRadius, this.rangeSettings.min, this.rangeSettings.max);
            spanElement.style.fontWeight = fontWeight;
        }
    }
}

function scale(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}