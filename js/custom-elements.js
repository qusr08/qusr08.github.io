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
                if (item.indexOf("GMTK Game Jam 2021") != -1) {
                    infoHTML += `<p class="gmtk-2021">${item.trim()}</p>`;
                } else if (item.indexOf("GMTK Game Jam 2022") != -1) {
                    infoHTML += `<p class="gmtk-2022">${item.trim()}</p>`;
                } else if (item.indexOf("Featured") != -1) {
                    infoHTML += `<p class="special">${item.trim()}</p>`;
                } else {
                    infoHTML += `<p>${item.trim()}</p>`;
                }
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
            <p>Last updated on: <strong><span id="github-date">XX/XX/XXXX</span></strong> <em><span id="github-version">Version X.X.X</span></em></p>
            <p><a href="https://github.com/qusr08/qusr08.github.io"><span>Website Github Repository</span></a></p>
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
                <img style="width: 15vw; align-self: center;" src="media/logo-squared.png">
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
        let project = this.getAttribute('project');

        this.innerHTML += `
            <div style="background-image: url('media/${project}/${project}-title-background.png');">
                <img style="max-width: 75vw; max-height: 50vh; width: 100%; height: 100%; object-fit: contain;" src="media/${project}/${project}-title-art.png">
                <h3 class="screen-warning box-em">Hey! This website is best viewed on a wider screen!</h3>
                <a class="box-em button" style="position: absolute; left: var(--spacing); bottom: var(--spacing);" href="index.html#projects">Back To Main Page</a>
            </div>
        `;
    }
});

window.customElements.define('fa-game-credit', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let category = this.getAttribute('category');
        let people = this.getAttribute('people');
        let tools = this.getAttribute('tools');

        let toolsHTML = `<div>`;
        if (tools != undefined) {
            toolsHTML += `<p><em>Using ${tools}</em></p>`;
        }
        toolsHTML += "</div>";

        this.innerHTML = `
            <h2>${category}</h2>
            <p>${people}</p>
            ${toolsHTML}
        `;
    }
});

window.customElements.define('fa-game-music', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let title = this.getAttribute('title');
        let source = this.getAttribute('source');
        let link = this.getAttribute('link');

        let titleHTML = `<h2>${title}</h2>`;
        if (link != undefined) {
            titleHTML = `<h2><a href="${link}"><span>${title}</span></a></h2>`
        }

        this.innerHTML = `
            ${titleHTML}
            <audio controls loop src="${source}" type="audio/wav"></audio>
        `;
    }
});