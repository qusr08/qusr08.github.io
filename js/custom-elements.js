const PROJECT_ROOT = "/frankalfano";

window.customElements.define('custom-menu', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div>
                <div id="info">
                    <a href="${PROJECT_ROOT}/media/Resume.pdf">Resume</a>
                    <a href="">About</a>
                    <a href="${PROJECT_ROOT}/index.html"><img src="${PROJECT_ROOT}/media/logo.png"></a>
                    <a href="mailto:falfanoiii@gmail.com">Email</a>
                    <a href="https://discordapp.com/users/368904010322673665/">Discord</a>
                </div>
                <div class="socials">
                    <a class="social" href="https://www.instagram.com/frankalfanoiii/"><img src="${PROJECT_ROOT}/media/logos/instagram-logo.png"></a>
                    <a class="social" href="https://discordapp.com/users/368904010322673665/"><img src="${PROJECT_ROOT}/media/logos/discord-logo.png"></a>
                    <a class="social" href="https://steamcommunity.com/id/qusr/"><img src="${PROJECT_ROOT}/media/logos/steam-logo.png"></a>
                    <a class="social" href="https://twitter.com/__qusr"><img src="${PROJECT_ROOT}/media/logos/twitter-logo.png"></a>
                    <a class="social" href="https://qusr.itch.io/"><img src="${PROJECT_ROOT}/media/logos/itchio-logo.png"></a>
                    <a class="social" href="https://fontstruct.com/fontstructors/1616822/quasar-1"><img src="${PROJECT_ROOT}/media/logos/fontstruct-logo.png"></a>
                    <a class="social" href="https://github.com/qusr08"><img src="${PROJECT_ROOT}/media/logos/github-logo.png"></a>
                    <a class="social" href="https://www.linkedin.com/in/frankalfanoiii/"><img src="${PROJECT_ROOT}/media/logos/linkedin-logo.png"></a>
                </div>
            </div>
        `;
    }
});

window.customElements.define('custom-gallery', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <a class="gallery-item" href="${PROJECT_ROOT}/projects/gcmdesigns.html" style="background-image: url('${PROJECT_ROOT}/projects/gcmdesigns/gcmdesigns-thumbnail.png');">
                <h1>gcmdesigns</h1>
                <h4>Mar 2022 - Present</h4>
                <div class="gallery-item-banner">
                    <p><strong>New Addition!</strong></p>
                </div>
            </a>
            <a class="gallery-item" href="${PROJECT_ROOT}/projects/prichi.html" style="background-image: url('${PROJECT_ROOT}/projects/prichi/prichi-thumbnail.png');">
                <h1>Prichi</h1>
                <h4>Oct 2021 - Dec 2021</h4>
            </a>
            <a class="gallery-item" href="${PROJECT_ROOT}/projects/into-orbit.html" style="background-image: url('${PROJECT_ROOT}/projects/into-orbit/into-orbit-thumbnail.png');">
                <h1>Into Orbit</h1>
                <h4>Aug 2021 - Oct 2021</h4>
            </a>
            <a class="gallery-item" href="${PROJECT_ROOT}/projects/blockchain.html" style="background-image: url('${PROJECT_ROOT}/projects/blockchain/blockchain-thumbnail.png');">
                <h1>Blockchain</h1>
                <h4>Jun 2021 - Jul 2021</h4>
                <div class="gallery-item-banner">
                    <p><strong>Top 10%</strong> GMTK Game Jam 2021</p>
                </div>
            </a>
            <a class="gallery-item" href="${PROJECT_ROOT}/projects/monozombie.html" style="background-image: url('${PROJECT_ROOT}/projects/monozombie/monozombie-thumbnail.png');">
                <h1>Monozombie</h1>
                <h4>Feb 2021 - May 2021</h4>
            </a>
            <a class="gallery-item" href="${PROJECT_ROOT}/projects/collab.html" style="background-image: url('${PROJECT_ROOT}/projects/collab/collab-thumbnail.png');">
                <h1>Collab</h1>
                <h4>Oct 2019 - Dec 2019</h4>
            </a>
            <a class="gallery-item" href="${PROJECT_ROOT}/projects/wumpus.html" style="background-image: url('${PROJECT_ROOT}/projects/wumpus/wumpus-thumbnail.png');">
                <h1>Wumpus</h1>
                <h4>Apr 2019 - Jun 2019</h4>
            </a>
        `;
    }
});

window.customElements.define('custom-footer', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <footer>
                <custom-menu></custom-menu>
                <p>Last updated on May 15th, 2022</p>
                <a href="https://github.com/qusr08${PROJECT_ROOT}">Website Github Repository</a>
            </footer>
        `;
    }
});

window.customElements.define('mobile-warning', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <p>
                <strong>Hey!</strong> This website is best viewed on a device with a larger screen :)
            </p>
        `;
    }
});

window.customElements.define('game-menu', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="game-menu">
                <button onClick="toggleMenu()">≡</button>
                <a href="${PROJECT_ROOT}/index.html"><img src="${PROJECT_ROOT}/media/logo.png"></a>
                <custom-gallery></custom-gallery>
            </div>
        `;
    }
});

window.customElements.define('game-credit', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = "";

        if (this.getAttribute("category")) {
            this.innerHTML += `<h3>${this.getAttribute("category")}</h3>`;
        }
        if (this.getAttribute("people")) {
            this.innerHTML += `<p>${this.getAttribute("people")}</p>`;
        }
        if (this.getAttribute("tools")) {
            this.innerHTML += `<p><em>Using ${this.getAttribute("tools")}</em></p>`;
        }
    }
});

window.customElements.define('game-music', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <h3>${this.getAttribute("name")}</h3>
            <audio controls loop src="${this.getAttribute("src")}"></audio>
        `;
    }
});