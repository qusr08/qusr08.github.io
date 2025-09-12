export default class MousePushText {
    constructor(textElement) {
        this.textElement = textElement;
        this.text = textElement.innerHTML.trim();
        this.charSpanElements = [];
        this.radius = 500;
        this.maxOffset = 50;

        this.textElement.innerHTML = "";
        for (let i = 0; i < this.text.length; i++) {
            let spanElement = document.createElement("span");
            spanElement.innerHTML = this.text.at(i);
            spanElement.style.display = "inline-block";
            this.charSpanElements.push(spanElement);

            this.textElement.appendChild(spanElement);
        }

        document.addEventListener('mousemove', (e) => { this.onMouseMove(e); });
    }

    onMouseMove(e) {
        let mousePosition = { x: e.clientX, y: e.clientY };

        for (let i = 0; i < this.charSpanElements.length; i++) {
            let spanElement = this.charSpanElements[i];
            let vector = { x: mousePosition.x - (spanElement.offsetLeft + (spanElement.offsetWidth / 2)), y: mousePosition.y - (spanElement.offsetTop + (spanElement.offsetHeight / 2)) };
            let vectorMagnitude = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
            let vectorDirection = { x: vector.x / vectorMagnitude, y: vector.y / vectorMagnitude };
            let charOffsetMagnitude = -scale(Math.max(0, this.radius - vectorMagnitude), 0, this.radius, 0, this.maxOffset);

            this.charSpanElements[i].style.transform = `translate(${vectorDirection.x * charOffsetMagnitude}px, ${vectorDirection.y * charOffsetMagnitude}px)`;
        }
    }
}

function scale(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}