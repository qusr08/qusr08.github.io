window.customElements.define('fa-gallery-item', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let name = this.getAttribute('name');
        let dates = this.getAttribute('dates');
        let desc = this.getAttribute('desc');
        let image = this.getAttribute('image');
        let link = this.getAttribute('link');
        let tags = this.getAttribute('tags').trim().split(',');
        let info = this.getAttribute('info');

        let tagsHTML = "";
        tags.forEach(tag => {
            tagsHTML += `<p class="gallery-em">${tag.trim()}</p>`;
        });

        let infoHTML = "";
        if (info != undefined) {
            infoHTML = `<p class="gallery-item-info">${info}</p>`;
        }

        this.style.backgroundImage = `url('${image}')`;

        this.innerHTML = `
            <a class="gallery-item vert-list" style="background-image: url('${image}');" href="${link}">
                <div class="vert-list">
                    <h1 class="gallery-em">${name}</h1>
                    <h3>${dates}</h3>
                    <p>${desc}</p>
                </div>
                <div class="hori-list">${tagsHTML}</div>
                ${infoHTML}
            </a>
        `;
    }
});