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
        let labels = this.getAttribute('labels');

        let tagsHTML = "";
        if (tags != undefined) {
            tags.trim().split(',').forEach(tag => {
                tagsHTML += `<p class="gallery-box">${tag.trim()}</p>`;
            });
        }

        let labelsHTML = "";
        if (labels != undefined) {
            labelsHTML += `<div class="gallery-item-labels">`;
            labels.trim().split(',').forEach(item => {
                if (item.indexOf("GMTK Game Jam 2021") != -1) {
                    labelsHTML += `<p class="gmtk-2021">${item.trim()}</p>`;
                } else if (item.indexOf("GMTK Game Jam 2022") != -1) {
                    labelsHTML += `<p class="gmtk-2022">${item.trim()}</p>`;
                } else if (item.indexOf("Featured") != -1) {
                    labelsHTML += `<p class="special">${item.trim()}</p>`;
                } else {
                    labelsHTML += `<p>${item.trim()}</p>`;
                }
            });
            labelsHTML += `</div>`;
        }

        this.style.display = (labelsHTML.indexOf("Featured") != -1 ? "unset" : "none");

        this.innerHTML = `
            <a class="gallery-item v-list" style="background-image: url('${image}');" href="${link}">
                <div class="v-list">
                    <h1 class="gallery-box">${name}</h1>
                    <h3>${dates}</h3>
                    <p>${desc}</p>
                </div>
                <div class="h-list gallery-item-tags" style="flex-wrap: wrap;">${tagsHTML}</div>
                ${labelsHTML}
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
            <p><a href="https://github.com/qusr08/qusr08.github.io"><span>Website Github Repository</span></a></p>
            <img style="filter: invert(1); width: max(10vw, 200px);" src="../media/signature.png">
            <p>Created by Frank Alfano</p>
            <p>Last updated on: <strong><span id="github-date">XX/XX/XXXX</span></strong></p>
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
            titleHTML = `<h1 class="box-em matter-rect-html" style="font-size: max(7vw, 2.5em);">${title}</h1>`;
        }

        let subtitleHTML = ``;
        if (subtitle != undefined) {
            subtitleHTML = `<h2 class="box-em matter-rect-html" style="font-size: max(3vw, 1.5em);"><em>${subtitle}</em></h2>`;
        }

        let buttonHTML = ``;
        if (buttonText != undefined) {
            if (buttonLink != undefined) {
                buttonHTML = `<a class="box-em button matter-rect-html" style="font-size: max(2vw, 1em);" href="${buttonLink}">${buttonText}</a>`;
            } else if (buttonOnClick != undefined) {
                buttonHTML = `<a class="box-em button matter-rect-html" style="font-size: max(2vw, 1em);" onclick="${buttonOnClick}">${buttonText}</a>`;
            }
        }

        this.innerHTML = `
            <h3 class="screen-warning box-em">Hey! This website is best viewed on a wider screen!</h3>
            <div>
                <div class="v-list">
                    ${titleHTML}
                    ${subtitleHTML}
                    ${buttonHTML}
                </div>
                <img class="matter-logo-html" style="width: 30vw;" src="media/logo-squared.png">
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