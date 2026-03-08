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
    // Set the header images
    let projectHeader = document.querySelector(".proj-header");
    projectHeader.style.backgroundImage = `url(./png/${name.toLowerCase()}/${name.toLowerCase()}-title-background.png)`;
    let projectHeaderTitle = document.querySelector(".proj-header-title");
    projectHeaderTitle.src = `./png/${name.toLowerCase()}/${name.toLowerCase()}-title-art.png`;

    let projectDetails = document.querySelector(".proj-details");

    // Display project info
    PROJECT_DATA[name].info.forEach(section => {
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

    let projectImages = document.querySelector(".proj-media");

    // Add project video if it exists
    let projectVideoURL = PROJECT_DATA[name].video;
    if (projectVideoURL != undefined) {
        let projectVideo = document.createElement("iframe");
        projectVideo.allowFullscreen = true;
        projectVideo.style.aspectRatio = 1920 / 1080;
        projectVideo.src = projectVideoURL;
        projectImages.appendChild(projectVideo);
    }

    // Add project screenshots if they exist
    let projectScreenshotCount = PROJECT_DATA[name].screenshotCount;
    if (projectScreenshotCount != undefined) {
        for (let i = 1; i <= projectScreenshotCount; i++) {
            let projectScreenshot = document.createElement("img");
            projectScreenshot.src = `./png/${name.toLowerCase()}/screenshots/${name.toLowerCase()}-screenshot-${i}.png`;
            projectImages.appendChild(projectScreenshot);
        }
    }
}