'use strict';

import PROJECT_DATA from '../json/project-data.json' with { type: 'json' };
import RandomWeightText from './random-weight-text.js';
import MousePushText from './mouse-push-text.js';
import MouseWeightText from './mouse-weight-text.js';

window.onload = () => {
    // Create all project box elements
    let isProjectReversed = false;
    for (let projectName in PROJECT_DATA) {
        if (PROJECT_DATA[projectName].hidden) {
            continue;
        }

        createProjectBox(projectName, isProjectReversed);
        isProjectReversed = !isProjectReversed;
    }

    // let textEffect = new RandomWeightText(document.querySelector(".text-effect"));
    // let textEffect = new MousePushText(document.querySelector(".text-effect"));
    let textEffect = new MouseWeightText(document.querySelector(".text-effect"));
}

function createProjectBox(projectName, isReversed) {
    // Create project box container element
    let projectContainer = document.createElement("div");
    projectContainer.classList.add("proj-container");
    if (isReversed) projectContainer.classList.add("reversed");

    // Create project button element
    let projectButton = document.createElement("div");
    projectButton.classList.add("proj-button");
    projectContainer.appendChild(projectButton);

    // Create project info element
    let projectInfo = document.createElement("div");
    projectInfo.classList.add("proj-info");

    // Create project title element
    let projectTitle = document.createElement("h1");
    projectTitle.classList.add("proj-title");
    projectTitle.innerHTML = projectName;
    projectInfo.appendChild(projectTitle);

    // Create project description element
    let projectDescription = document.createElement("p");
    projectDescription.classList.add("proj-desc");
    projectDescription.innerHTML = PROJECT_DATA[projectName].desc;
    projectInfo.appendChild(projectDescription);

    // Create project awards element
    let projectAwards = document.createElement("div");
    projectAwards.classList.add("proj-tags");
    PROJECT_DATA[projectName].awards.forEach(award => {
        // Create tag element
        let projectAward = document.createElement("p");
        projectAward.classList.add("proj-award");
        if (award.includes("GMTK Game Jam 2022")) projectAward.classList.add("gmtk-2022");
        if (award.includes("GMTK Game Jam 2021")) projectAward.classList.add("gmtk-2021");
        if (award.includes("RIT EDGE")) projectAward.classList.add("rit-edge");
        projectAward.innerHTML = award;
        projectAwards.appendChild(projectAward);
    });
    projectInfo.appendChild(projectAwards);

    // Create project tags element
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

    // Append the project box to the html document
    projectContainer.appendChild(projectInfo);
    document.querySelector("div.projects").appendChild(projectContainer);
}