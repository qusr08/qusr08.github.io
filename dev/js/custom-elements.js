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
            <p>Last updated on: <span id="github-date"><strong>XX/XX/XXXX</strong></span> <em>Version 3.0.0</em></p>
            <a href="https://github.com/qusr08/frankalfano" target="_blank"><p>Website Github Repository</p></a>
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
        let project = this.getAttribute('project');

        this.innerHTML = `
            <div style="background-image: url('media/${project}/${project}-title-background.png');">
                <img style="width: 75vw;" src="media/${project}/${project}-title-art.png">
                <h3 class="screen-warning box-em">Hey! This website is best viewed on a wider screen!</h3>
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

        this.innerHTML = `
            <h2>${title}</h2>
            <audio controls loop src="${source}" type="audio/wav"></audio>
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
    button.innerHTML = `${isFeaturedGallery ? "View Featured Projects" : "View All Projects"}`;

    // Add or remove the featured class from the gallery object so it toggles back and forth each time the button is pressed
    if (isFeaturedGallery) {
        gallery.classList.remove("featured");
    } else {
        gallery.classList.add("featured");
    }
}

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        let repos = JSON.parse(this.responseText);

        repos.forEach((repo) => {
            if (repo.name == "frankalfano") {
                console.log("Found!");
                var lastUpdated = new Date(repo.updated_at);
                var day = lastUpdated.getUTCDate();
                var month = lastUpdated.getUTCMonth();
                var year = lastUpdated.getUTCFullYear();
                document.getElementById('#github-date').innerHTML = `<strong>${month}/${day}/${year}</strong>`;
            }
        });
    }
};
xhttp.open("GET", "https://api.github.com/users/qusr08/repos", true);
xhttp.open("GET", "https://api.github.com/repos/qusr08/frankalfano/commits", true);
xhttp.send();