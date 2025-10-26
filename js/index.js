'use strict';

import PROJECT_DATA from '../json/project-data.json' with { type: 'json' };
import RandomWeightText from './random-weight-text.js';
import MousePushText from './mouse-push-text.js';
import MouseWeightText from './mouse-weight-text.js';
import WobbleEffect from './wobble-effect.js';
import OffsetScrollEffect from './offset-scroll-effect.js';

let wobbleEffects = [];

window.onload = () => {
    // Create all project box elements
    for (let projectName in PROJECT_DATA) {
        if (PROJECT_DATA[projectName].hidden) {
            continue;
        }

        createProjectHTML(projectName);
    }

    document.querySelectorAll(".text-effect").forEach(e => { new RandomWeightText(e); });
    document.querySelectorAll(".wobble-effect").forEach(e => { wobbleEffects.push(new WobbleEffect(e)); });
    document.querySelectorAll(".offset-scroll-effect").forEach(e => { new OffsetScrollEffect(e); });
}

function createProjectHTML(name) {
    // Create project container
    let projectContainer = document.createElement("div");
    projectContainer.classList.add("proj-container");

    // Create project background
    let projectBackground = document.createElement("div");
    projectBackground.classList.add("proj-background", "wobble-effect");
    projectBackground.style.backgroundImage = `url("../png/${name.toLowerCase()}/${name.toLowerCase()}-thumbnail.png")`;
    projectContainer.appendChild(projectBackground);

    let projectTitle = document.createElement("p");
    projectTitle.classList.add("proj-title", "text-effect");
    projectTitle.setAttribute("min-weight", 500);
    projectTitle.innerHTML = name;
    projectContainer.appendChild(projectTitle);

    let projectDates = document.createElement("p");
    projectDates.classList.add("proj-dates");
    projectDates.innerHTML = PROJECT_DATA[name].dates;
    projectContainer.appendChild(projectDates);

    let projectDescription = document.createElement("p");
    projectDescription.classList.add("proj-desc");
    projectDescription.innerHTML = PROJECT_DATA[name].desc;
    projectContainer.appendChild(projectDescription);

    let projectSpacer = document.createElement("div");
    projectSpacer.style.flexGrow = 1;
    projectContainer.appendChild(projectSpacer);

    let projectAwards = document.createElement("div");
    projectAwards.classList.add("proj-awards");
    PROJECT_DATA[name].awards.forEach(award => {
        let projectAward = document.createElement("p");
        projectAward.classList.add("proj-award");
        projectAward.innerHTML = `${award.eventName}<br><span style="color: var(--award-color);">${award.awardList.join("<br>")}</span>`;

        projectAwards.appendChild(projectAward);
    });
    projectContainer.appendChild(projectAwards);

    let projectTags = document.createElement("div");
    projectTags.classList.add("proj-tags");
    PROJECT_DATA[name].tags.forEach(tag => {
        let projectTag = document.createElement("p");
        projectTag.classList.add("proj-tag", "wobble-effect");
        projectTag.innerHTML = `${tag}`;

        projectTags.appendChild(projectTag);
    });
    projectContainer.appendChild(projectTags);

    document.querySelector("div.projects").appendChild(projectContainer);
}