export default class MousePushText {
    constructor(textElement) {
        this.textElement = textElement;
        this.text = textElement.innerHTML.trim();
        this.charSpanElements = [];
        this.radius = 500;
        this.maxOffset = 40;

        this.textElement.innerHTML = "";
        for (let i = 0; i < this.text.length; i++) {
            let spanElement = document.createElement("span");
            spanElement.innerHTML = this.text.at(i);
            spanElement.style.display = "inline-block";
            spanElement.style.minWidth = "0.1em";
            this.charSpanElements.push(spanElement);

            this.textElement.appendChild(spanElement);
        }

        document.addEventListener('mousemove', (e) => { this.onMouseMove(e); });
    }

    onMouseMove(e) {
        let mousePosition = { x: e.pageX, y: e.pageY };

        for (let i = 0; i < this.charSpanElements.length; i++) {
            let spanElement = this.charSpanElements[i];

            let distanceVector = {
                x: mousePosition.x - (spanElement.offsetLeft + (spanElement.offsetWidth / 2)),
                y: mousePosition.y - (spanElement.offsetTop + (spanElement.offsetHeight / 2))
            };
            let distanceMagnitude = Math.sqrt((distanceVector.x * distanceVector.x) + (distanceVector.y * distanceVector.y));

            let offsetAmount = -scale(Math.max(0, this.radius - distanceMagnitude), 0, this.radius, 0, this.maxOffset);
            let spanOffset = {
                x: distanceVector.x / distanceMagnitude * offsetAmount,
                y: distanceVector.y / distanceMagnitude * offsetAmount
            };

            this.charSpanElements[i].style.transform = `translate(${spanOffset.x}px, ${spanOffset.y}px)`;
        }
    }
}

function scale(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}