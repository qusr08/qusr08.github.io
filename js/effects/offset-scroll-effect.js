export default class OffsetScrollEffect {
    constructor(element) {
        this.element = element;
        this.rect = this.element.getBoundingClientRect();
        
        setInterval(() => { this.update(); }, 1 / 60);
    }

    update() {
        let offset = ((window.scrollY - window.innerHeight) - this.rect.top + this.element.offsetTop) / 5;
        this.element.style.transform = `translateY(${offset}px)`;
    }
}