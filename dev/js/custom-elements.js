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
        let tags = this.getAttribute('tags');
        let info = this.getAttribute('info');

        let tagsHTML = "";
        if (tags != undefined) {
            tags.trim().split(',').forEach(tag => {
                tagsHTML += `<p class="gallery-em">${tag.trim()}</p>`;
            });
        }

        let infoHTML = "";
        if (info != undefined) {
            infoHTML += `<div class="gallery-item-info">`;
            info.trim().split(',').forEach(item => {
                infoHTML += `<p>${item.trim()}</p>`;
            });
            infoHTML += `</div>`;
        }

        this.style.backgroundImage = `url('${image}')`;
        this.style.display = (infoHTML.indexOf("Featured") != -1 ? "unset" : "none");

        this.innerHTML = `
            <a class="gallery-item vert-list" style="background-image: url('${image}');" href="${link}">
                <div class="vert-list">
                    <h1 class="gallery-em">${name}</h1>
                    <h3>${dates}</h3>
                    <p>${desc}</p>
                </div>
                <div class="hori-list" style="flex-wrap: wrap;">${tagsHTML}</div>
                ${infoHTML}
            </a>
        `;
    }
});

function toggleFeaturedGalleryItems() {
    let galleryItems = document.getElementById('gallery').children;

    for (let i = 0; i < galleryItems.length; i++) {
        let infoAttr = galleryItems[i].getAttribute('info');

        if (infoAttr != undefined && infoAttr.indexOf("Featured") != -1) {
            continue;
        }

        let display = galleryItems[i].style.display;
        galleryItems[i].style.display = (display == "unset" ? "none" : "unset");
    }
}