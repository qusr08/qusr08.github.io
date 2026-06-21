'use strict';

import PROJECT_DATA from '../json/project-data.json' with { type: 'json' };
import { InteractiveBackground } from "./background/interactive-background.js";
import * as ConstElements from './const-elements.js';
import * as Utils from './utils.js';

let NAVBAR = undefined;
let PROJECT_GRID = undefined;
let WRAPPER = undefined;
let BACKGROUND = undefined;

window.onload = () => {
    PROJECT_GRID = document.querySelector(".proj-grid");
    WRAPPER = document.querySelector("#wrapper");

    // Create all project box elements
    if (PROJECT_GRID != undefined) {
        let reversed = true;
        for (let projectName in PROJECT_DATA) {
            if (PROJECT_DATA[projectName].hidden) continue;
            createProjectBox(projectName, reversed);
            reversed = !reversed;
        }
    }

    NAVBAR = document.querySelector("#navbar");
    ConstElements.populateNavbar(NAVBAR);

    ConstElements.populateFooter(document.querySelector("footer"));
    Utils.updateFromGithub();

    BACKGROUND = new InteractiveBackground(WRAPPER);
    BACKGROUND.initialize();
}

window.onresize = (e) => {
    BACKGROUND.updateResolution();
}

window.onmousemove = (e) => {
    if (BACKGROUND && BACKGROUND.isInitialized) {
        BACKGROUND.mouseMatterObject.update({ x: e.clientX + window.scrollX, y: e.clientY + window.scrollY });
    }
}

window.onscroll = (e) => {
    NAVBAR.classList.toggle("visible", window.scrollY > 0);
}

function createProjectBox(projectName, reversed) {
    let projectNameLowerCase = projectName.toLowerCase();

    // Create project box container element
    let projectBoxContainer = document.createElement("div");
    projectBoxContainer.classList.add("proj-box-container", "matter-rect-html");
    projectBoxContainer.classList.toggle("reversed", reversed);

    // Create project box element
    let projectBox = document.createElement("div");
    projectBox.classList.add("proj-box");

    // Create project thumbnail element
    let projectThumbnail = document.createElement("div");
    projectThumbnail.classList.add("proj-thumbnail");
    projectThumbnail.style.backgroundImage = `url('media/${projectNameLowerCase}/${projectNameLowerCase}-thumbnail.png')`;
    projectBox.appendChild(projectThumbnail);

    // Create project info element
    let projectInfo = document.createElement("div");
    projectInfo.classList.add("proj-info");

    // Create project title element
    let projectTitle = document.createElement("h1");
    projectTitle.classList.add("proj-title");
    projectTitle.innerHTML = projectName;
    projectInfo.appendChild(projectTitle);

    // Create project dates element
    let projectDates = document.createElement("p");
    projectDates.classList.add("proj-dates");
    projectDates.innerHTML = PROJECT_DATA[projectName].dates;
    projectInfo.appendChild(projectDates);

    // Create project description element
    let projectDescription = document.createElement("p");
    projectDescription.classList.add("proj-desc");
    projectDescription.innerHTML = PROJECT_DATA[projectName].desc;
    projectInfo.appendChild(projectDescription);

    // Create project awards element
    if (PROJECT_DATA[projectName].awards != undefined) {
        let projectAwards = document.createElement("div");
        projectAwards.classList.add("proj-awards");
        PROJECT_DATA[projectName].awards.forEach(award => {
            // Create award element
            let projectAward = document.createElement("p");
            projectAward.classList.add("proj-award");
            projectAward.innerHTML = award.event == undefined ? award.award : `${award.award} @ ${award.event}`;
            console.log(award['css-override']);
            if (award['css-override'] != undefined) projectAward.classList.add(award['css-override']);
            projectAwards.appendChild(projectAward);
        });
        projectInfo.appendChild(projectAwards);
    }

    let spacer = document.createElement("div");
    spacer.style.flexGrow = 1;
    projectInfo.appendChild(spacer);

    // Create project tags element
    if (PROJECT_DATA[projectName].tags != undefined) {
        let projectTags = document.createElement("div");
        projectTags.classList.add("proj-tags");
        PROJECT_DATA[projectName].tags.forEach(tag => {
            // Create tag element
            let projectTag = document.createElement("p");
            projectTag.classList.add("proj-tag");
            projectTag.innerHTML = tag;
            projectTags.appendChild(projectTag);
        });
        projectInfo.appendChild(projectTags);
    }

    // Create project links element
    let projectLinks = document.createElement("div");
    projectLinks.classList.add("proj-links");

    // Create the first link to view the project
    let viewLink = document.createElement("a");
    viewLink.classList.add("proj-link");
    viewLink.innerHTML = `<p>View Project</p>`;
    viewLink.href = `project.html?name=${projectName}`;
    viewLink.style.justifyContent = "center";
    projectLinks.appendChild(viewLink);

    if (PROJECT_DATA[projectName].links != undefined) {
        PROJECT_DATA[projectName].links.forEach(link => {
            let linkNameLowerCase = link.name.toLowerCase();

            // Create link element
            let projectLink = document.createElement("a");
            projectLink.classList.add("proj-link");
            projectLink.href = link.url;

            // Create link icon element
            let projectLinkIcon = document.createElement("img");
            projectLinkIcon.src = `media/logos/${link.logo}-logo.png`;
            projectLink.appendChild(projectLinkIcon);

            // Create link name element
            let projectLinkName = document.createElement("p");
            projectLinkName.innerHTML = link.name;
            projectLink.appendChild(projectLinkName);

            // Append the final link element to the links list
            if (link['css-override'] != undefined) projectLink.classList.add(link['css-override']);
            projectLinks.appendChild(projectLink);
        });
    }
    projectInfo.appendChild(projectLinks);

    // Append the project box to the html document
    projectBox.appendChild(projectInfo);
    projectBoxContainer.appendChild(projectBox);
    PROJECT_GRID.appendChild(projectBoxContainer);
}