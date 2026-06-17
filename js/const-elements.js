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
                <a class="box-em button" style="position: absolute; left: var(--variable-padding); bottom: var(--variable-padding);" href="index.html#projects">Back To Main Page</a>
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

export function createFooter(footerElement) {
    footerElement.innerHTML = `
        <div class="footer-text box-reg matter-rect-html">
            <p>Last updated on: <strong><span id="github-date">XX/XX/XXXX</span></strong></p>
            <p>Created by Frank Alfano</p>
            <p><a href="https://github.com/qusr08/qusr08.github.io">Website Github Repository</a></p>
        </div>
    `;
}