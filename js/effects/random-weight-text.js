export default class VariableText {
    constructor(textElement) {
        this.textElement = textElement;
        this.text = textElement.innerHTML.trim();
        this.charSpanElements = [];
        this.charWeights = [];
        this.minWeight = parseInt(textElement.getAttribute('min-weight')) || 100;
        this.maxWeight = parseInt(textElement.getAttribute('max-weight')) || 900;
        this.updateSpeed = parseFloat(textElement.getAttribute("update-speed")) || 1;
        this.lastUpdateTime = 0;

        this.textElement.innerHTML = "";
        for (let i = 0; i < this.text.length; i++) {
            let spanElement = document.createElement("span");
            spanElement.innerHTML = this.text.at(i);
            this.charSpanElements.push(spanElement);

            let spanWeight = randInt(this.minWeight, this.maxWeight);
            spanElement.style.fontWeight = spanWeight;
            this.charWeights.push({ f: spanWeight, t: spanWeight, p: 1, s: randFloat(0.1, 0.3) });

            this.textElement.appendChild(spanElement);
        }

        window.requestAnimationFrame(this.update.bind(this));
    }

    update(currentTime) {
        // Calculate delta time for smooth animation
        if (this.lastUpdateTime === 0) this.lastUpdateTime = currentTime;
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = currentTime;

        // Loop through all span elements
        for (let i = 0; i < this.charSpanElements.length; i++) {
            let charWeight = this.charWeights[i];

            // Update the font weight
            charWeight.p += deltaTime * this.updateSpeed * charWeight.s;
            this.charSpanElements[i].style.fontWeight = Math.round(scale(easeInOut(charWeight.p), 0, 1, charWeight.f, charWeight.t));

            // Get a new random weight if the current span element has reached it
            if (charWeight.p >= 1) {
                charWeight.f = charWeight.t;
                charWeight.t = randInt(this.minWeight, this.maxWeight);
                charWeight.p = 0;
                charWeight.s = randFloat(0.1, 0.3);
            }

            this.charWeights[i] = charWeight;
        }

        window.requestAnimationFrame(this.update.bind(this));
    }
}

function scale(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function easeInOut(t) {
    return t > 0.5 ? 4 * Math.pow((t - 1), 3) + 1 : 4 * Math.pow(t, 3);
}

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max) {
    return (Math.random() * (max - min)) + min;
}