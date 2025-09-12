export default class VariableText {
    constructor(textElement) {
        this.textElement = textElement;
        this.text = textElement.innerHTML.trim();
        this.charSpanElements = [];
        this.charWeights = [];

        this.textElement.innerHTML = "";
        for (let i = 0; i < this.text.length; i++) {
            let spanElement = document.createElement("span");
            spanElement.innerHTML = this.text.at(i);
            this.charSpanElements.push(spanElement);

            let spanWeight = randInt(100, 900);
            spanElement.style.fontWeight = spanWeight;
            this.charWeights.push({ f: spanWeight, t: spanWeight, p: 1 });

            this.textElement.appendChild(spanElement);
        }

        setInterval(() => { this.update(); }, 1 / 60);
    }

    update() {
        // Loop through all span elements
        for (let i = 0; i < this.charSpanElements.length; i++) {
            let charWeight = this.charWeights[i];

            // Update the font weight
            charWeight.p += (1 / 60) * 0.2;
            this.charSpanElements[i].style.fontWeight = Math.round(scale(easeInOut(charWeight.p), 0, 1, charWeight.f, charWeight.t));

            // Get a new random weight if the current span element has reached it
            if (charWeight.p >= 1) {
                charWeight.f = charWeight.t;
                charWeight.t = randInt(100, 900);
                charWeight.p = 0;
            }

            this.charWeights[i] = charWeight;
        }
    }
}

function scale(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function easeInOut(t){
  return t > 0.5 ? 4*Math.pow((t-1),3)+1 : 4*Math.pow(t,3);
}

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}