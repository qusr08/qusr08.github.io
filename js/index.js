'use strict';

import PROJECT_DATA from '../json/project-data.json' with { type: 'json' };
import { addEffects } from './base.js';
import { InteractiveBackground } from './background/interactive-background.js';

window.onload = (e) => {
    // Create all project box elements
    for (let projectName in PROJECT_DATA) {
        if (PROJECT_DATA[projectName].hidden) {
            continue;
        }

        createProjectHTML(projectName);
    }

    addEffects();

    let background = new InteractiveBackground(document.querySelector("div.projects"));
    background.initialize();
}

function createProjectHTML(name) {
    // Create project container
    let projectContainer = document.createElement("div");
    projectContainer.onclick = (e) => {
        localStorage.setItem("project", name);
        window.location.href = "project.html";
    }
    projectContainer.classList.add("proj-container");

    // Create project background
    let projectBackground = document.createElement("div");
    projectBackground.classList.add("proj-background", "wobble-effect");
    projectBackground.style.backgroundImage = `url("../png/${name.toLowerCase()}/${name.toLowerCase()}-thumbnail.png")`;
    projectContainer.appendChild(projectBackground);

    // Create project title
    let projectTitle = document.createElement("p");
    projectTitle.classList.add("proj-title", "text-effect");
    projectTitle.setAttribute("min-weight", 600);
    projectTitle.innerHTML = name;
    projectContainer.appendChild(projectTitle);

    // Create project date
    let projectDates = document.createElement("p");
    projectDates.classList.add("proj-dates");
    projectDates.innerHTML = PROJECT_DATA[name].dates;
    projectContainer.appendChild(projectDates);

    // Create project description
    let projectDescription = document.createElement("p");
    projectDescription.classList.add("proj-desc");
    projectDescription.innerHTML = PROJECT_DATA[name].desc;
    projectContainer.appendChild(projectDescription);

    // Create a spacer so the rest of the elements are at the bottom of the project container
    let projectSpacer = document.createElement("div");
    projectSpacer.style.flexGrow = 1;
    projectContainer.appendChild(projectSpacer);

    // Create all awards for the project
    let projectAwards = document.createElement("div");
    projectAwards.classList.add("proj-awards");
    PROJECT_DATA[name].awards.forEach(award => {
        let projectAward = document.createElement("p");
        projectAward.classList.add("proj-award");
        projectAward.innerHTML = `${award.eventName}<br><span style="color: var(--award-color);">${award.awardList.join("<br>")}</span>`;

        projectAwards.appendChild(projectAward);
    });
    projectContainer.appendChild(projectAwards);

    // Create all tags for the project
    let projectTags = document.createElement("div");
    projectTags.classList.add("proj-tags");
    PROJECT_DATA[name].tags.forEach(tag => {
        let projectTag = document.createElement("p");
        projectTag.classList.add("proj-tag", "wobble-effect");
        projectTag.innerHTML = `${tag}`;

        projectTags.appendChild(projectTag);
    });
    projectContainer.appendChild(projectTags);

    // Append the final project element to the website
    document.querySelector("div.projects").appendChild(projectContainer);
}