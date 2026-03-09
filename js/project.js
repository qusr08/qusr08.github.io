'use strict';

import PROJECT_DATA from '../json/project-data.json' with { type: 'json' };
import { addEffects } from './base.js';

window.onload = (e) => {
    // Create all project elements
    let projectName = localStorage.getItem("project");
    if (projectName != null) {
        createInfoHTML(projectName);
    }

    addEffects();
}

function createInfoHTML(name) {
    let projectHeader = document.querySelector(".proj-header");
    let projectHeaderTitle = document.querySelector(".proj-header-title");
    let projectDetails = document.querySelector(".proj-details");
    let projectImages = document.querySelector(".proj-media");

    // Set the header images
    projectHeader.style.backgroundImage = `url(./png/${name.toLowerCase()}/${name.toLowerCase()}-title-background.png)`;
    projectHeaderTitle.src = `./png/${name.toLowerCase()}/${name.toLowerCase()}-title-art.png`;

    // Display project info
    let projectInfo = PROJECT_DATA[name].info || [];
    projectInfo.forEach(section => {
        // Create project section element
        let projectSection = document.createElement("div");
        projectSection.classList.add("proj-info-section");

        // Create title element
        let projectSectionTitle = document.createElement("p");
        projectSectionTitle.classList.add("proj-info-title", "wobble-effect");
        projectSectionTitle.innerHTML = section.title;
        projectSection.appendChild(projectSectionTitle);

        // Create text elements
        section.text.forEach(paragraph => {
            let paragraphElement = document.createElement("p");
            paragraphElement.classList.add("proj-info-text");
            paragraphElement.innerHTML = paragraph;
            projectSection.appendChild(paragraphElement);
        });

        // Append the final section to the details element
        projectDetails.appendChild(projectSection);
    });

    let projectMedia = PROJECT_DATA[name].media || [];
    projectMedia.forEach(media => {
        if (media.video) {
            let projectVideo = document.createElement("iframe");
            projectVideo.allowFullscreen = true;
            projectVideo.style.aspectRatio = 1920 / 1080;
            projectVideo.src = media.video;
            projectImages.appendChild(projectVideo);
        } else if (media.picture) {
            let projectScreenshot = document.createElement("img");
            projectScreenshot.src = media.picture;
            projectImages.appendChild(projectScreenshot);
        }
    });
}