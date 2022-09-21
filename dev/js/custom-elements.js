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

window.customElements.define('fa-text-gallery-item', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let name = this.getAttribute('name');
        let dates = this.getAttribute('dates');
        let status = this.getAttribute('status');
        let desc = this.getAttribute('desc');
        let tags = this.getAttribute('tags');

        let tagsHTML = "";
        if (tags != undefined) {
            tags.trim().split(',').forEach(tag => {
                tagsHTML += `<p class="gallery-em">${tag.trim()}</p>`;
            });
        }

        this.innerHTML = `
            <a class="text-gallery-item vert-list">
                <div class="vert-list">
                    <h1 class="gallery-em">${name}</h1>
                    <h2><em>${status}</em></h2>
                    <h3>${dates}</h3>
                    <p>${desc}</p>
                </div>
                <div class="hori-list" style="flex-wrap: wrap;">${tagsHTML}</div>
            </a>
        `;
    }
});

window.customElements.define('fa-footer', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <p>Last updated on: <strong>9/20/2022</strong> <em>Version 3.0.0</em></p>
            <a href="https://github.com/qusr08/frankalfano" target="_blank">Website Github Repository</a>
            <p>Created by Frank Alfano</p>
        `;
    }
});

window.customElements.define('fa-header', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let title = this.getAttribute('title');
        let subtitle = this.getAttribute('subtitle');
        let buttonText = this.getAttribute('buttonText');
        let buttonLink = this.getAttribute('buttonLink');
        let buttonOnClick = this.getAttribute('buttonOnClick');

        let titleHTML = ``;
        if (title != undefined) {
            titleHTML = `<h1 class="box-em matter-html" style="font-size: max(7vw, 3em);">${title}</h1>`;
        }

        let subtitleHTML = ``;
        if (subtitle != undefined) {
            subtitleHTML = `<h2 class="box-em matter-html" style="font-size: max(3vw, 1.5em);"><em>${subtitle}</em></h2>`;
        }

        let buttonHTML = ``;
        if (buttonText != undefined) {
            if (buttonLink != undefined) {
                buttonHTML = `<a class="box-em button matter-html" style="font-size: max(2vw, 1em);" href="${buttonLink}">${buttonText}</a>`;
            } else if (buttonOnClick != undefined) {
                buttonHTML = `<a class="box-em button matter-html" style="font-size: max(2vw, 1em);" onclick="${buttonOnClick}">${buttonText}</a>`;
            }
        }

        this.innerHTML = `
            <div class="vert-list">
                <img style="width: 15vw; align-self: center;" src="media/logo.png">
                <h3 class="screen-warning box-em">Hey! This website is best viewed on a wider screen!</h3>
                ${titleHTML}
                ${subtitleHTML}
                ${buttonHTML}
            </div>
        `;
    }
});

window.customElements.define('fa-game-header', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let titleImage = this.getAttribute('title');
        let backgroundImage = this.getAttribute('background');

        this.innerHTML = `
            <div class="vert-list" style="max-width: 100%; background-image: url('${backgroundImage}');">
                <img src="${titleImage}">
            </div>
        `;
    }
});

function toggleFeaturedGalleryItems(button) {
    let gallery = document.querySelector('.gallery');
    let isFeaturedGallery = gallery.classList.contains('featured');
    let galleryItems = gallery.children;

    for (let i = 0; i < galleryItems.length; i++) {
        // Get the info tags of the gallery item
        let infoAttr = galleryItems[i].getAttribute('info');

        // Make sure to only set the visibility of the non-featured items
        if (infoAttr != undefined && infoAttr.indexOf("Featured") != -1) {
            continue;
        }

        // Set the display of the element
        galleryItems[i].style.display = (isFeaturedGallery ? "unset" : "none");
    }

    // Change the inner text of the toggle button
    button.innerHTML = `${isFeaturedGallery ? "View Featured Projects": "View All Projects"}`;

    // Add or remove the featured class from the gallery object so it toggles back and forth each time the button is pressed
    if (isFeaturedGallery) {
        gallery.classList.remove("featured");
    } else {
        gallery.classList.add("featured");
    }
}