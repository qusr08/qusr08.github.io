"use strict";

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

// https://stackoverflow.com/questions/56279807/is-it-possible-to-automatically-have-the-last-updated-date-on-my-website-changed
function updateFromGithub() {
    let xhttpDate = new XMLHttpRequest();
    let xhttpVersion = new XMLHttpRequest();

    xhttpDate.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let repos = JSON.parse(this.responseText);

            repos.forEach((repo) => {
                if (repo.name == "qusr08.github.io") {
                    let lastUpdated = new Date(repo.updated_at);
                    let day = lastUpdated.getUTCDate();
                    let month = lastUpdated.getUTCMonth();
                    let year = lastUpdated.getUTCFullYear();

                    document.getElementById('github-date').innerHTML = `${month + 1}/${day}/${year}`;

                    return;
                }
            });
        }
    };

    xhttpVersion.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let commit = JSON.parse(this.responseText)[0];
            document.getElementById('github-version').innerHTML = `<a href="${commit.html_url}">${commit.commit.message}</a>`;
        }
    };

    xhttpDate.open("GET", "https://api.github.com/users/qusr08/repos", true);
    xhttpVersion.open("GET", "https://api.github.com/repos/qusr08/qusr08.github.io/commits", true);

    xhttpDate.send();
    xhttpVersion.send();
}

window.onload = function (event) {
    updateFromGithub();

    // The game won't always be loaded for each webpage
    try {
        initializeGame();
    } catch (err) {}
};