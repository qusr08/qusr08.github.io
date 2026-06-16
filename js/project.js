'use strict';

import PROJECT_DATA from '../json/project-data.json' with { type: 'json' };
import { addEffects } from './utils.js';

window.onload = (e) => {
    // Create all project elements
    let projectName = localStorage.getItem("project");
    if (projectName != null) {
        createInfoHTML("DOS");
    }

    addEffects();
}

function createInfoHTML(name) {
    let projectHeader = document.querySelector(".proj-header");
    let projectHeaderTitle = document.querySelector(".proj-header-title");
    let projectInfoList = document.querySelector(".proj-details");
    let projectMediaList = document.querySelector(".proj-media");

    // Set the header images
    projectHeader.style.backgroundImage = `url(./png/${name.toLowerCase()}/${name.toLowerCase()}-title-background.png)`;
    projectHeaderTitle.src = `./png/${name.toLowerCase()}/${name.toLowerCase()}-title-art.png`;

    // Display project info
    // let projectInfo = PROJECT_DATA[name].info || [];
    // projectInfo.forEach(section => {
    //     // Create project section element
    //     let projectSection = document.createElement("div");
    //     projectSection.classList.add("proj-info-section");

    //     // Create title element
    //     let projectSectionTitle = document.createElement("p");
    //     projectSectionTitle.classList.add("proj-info-title", "wobble-effect");
    //     projectSectionTitle.innerHTML = section.title;
    //     projectSection.appendChild(projectSectionTitle);

    //     // Create text elements
    //     section.text.forEach(paragraph => {
    //         let paragraphElement = document.createElement("p");
    //         paragraphElement.classList.add("proj-info-text");
    //         paragraphElement.innerHTML = paragraph;
    //         projectSection.appendChild(paragraphElement);
    //     });

    //     // Append the final section to the details element
    //     projectDetails.appendChild(projectSection);
    // });

    let projectMedia = PROJECT_DATA[name].media || [];
    projectMedia.forEach(media => {
        let newMedia = undefined;
        if (media.video) {
            newMedia = document.createElement("iframe");
            newMedia.allowFullscreen = true;
            newMedia.style.aspectRatio = 1920 / 1080;
            newMedia.src = media.video;
        } else if (media.picture) {
            newMedia = document.createElement("img");
            newMedia.src = media.picture;
        }

        newMedia.classList.add("wobble-effect");
        newMedia.setAttribute("wobble-amount", 2);
        projectMediaList.appendChild(newMedia);
    });
}