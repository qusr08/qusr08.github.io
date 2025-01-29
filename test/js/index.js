'use strict';

import PROJECT_DATA from '../json/project-data.json' with { type: 'json' };

window.onload = () => {
    // Create all project box elements
    let isProjectReversed = false;
    for (let project in PROJECT_DATA) {
        createProjectBox(project, isProjectReversed);
        isProjectReversed = !isProjectReversed;
    }
}

function createProjectBox(projectName, isReversed) {
    let projectNameLowerCase = projectName.toLowerCase();

    // Create project box container element
    let projectBoxContainer = document.createElement("div");
    projectBoxContainer.classList.add("proj-box-container");
    if (isReversed) projectBoxContainer.classList.add("reversed");

    // Create project box element
    let projectBox = document.createElement("a");
    projectBox.href = `html/${projectNameLowerCase}.html`;
    projectBox.classList.add("proj-box");

    // Create project thumbnail element
    let projectThumbnail = document.createElement("div");
    projectThumbnail.classList.add("proj-thumbnail");
    projectThumbnail.style.backgroundImage = `url('png/${projectNameLowerCase}-thumbnail.png')`;
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

    // Create project tags element
    let projectTags = document.createElement("div");
    projectTags.classList.add("proj-tags");
    PROJECT_DATA[projectName].tags.forEach(tag => {
        // Create tag element
        let projectTag = document.createElement("p");
        projectTag.classList.add("proj-tag");
        if (tag.includes("2022")) projectTag.classList.add("gmtk-2022");
        projectTag.innerHTML = tag;
        projectTags.appendChild(projectTag);
    });
    projectInfo.appendChild(projectTags);

    // Create project links element
    let projectLinks = document.createElement("div");
    projectLinks.classList.add("proj-links");
    PROJECT_DATA[projectName].links.forEach(link => {
        let linkNameLowerCase = link.name.toLowerCase();

        // Create link element
        let projectLink = document.createElement("a");
        projectLink.classList.add("proj-link");
        projectLink.href = link.url;

        // Create link icon element
        let projectLinkIcon = document.createElement("img");
        let iconType = "";
        if (linkNameLowerCase.includes("play")) iconType = "play";
        if (linkNameLowerCase.includes("github")) iconType = "github";
        if (linkNameLowerCase.includes("itch.io")) iconType = "itchio";
        if (linkNameLowerCase.includes("2022")) {
            iconType = "itchio";
            projectLink.classList.add("gmtk-2022");
        }
        projectLinkIcon.src = `png/logos/${iconType}-logo.png`;
        projectLink.appendChild(projectLinkIcon);

        // Create link name element
        let projectLinkName = document.createElement("p");
        projectLinkName.innerHTML = link.name;
        projectLink.appendChild(projectLinkName);

        // Append the final link element to the links list
        projectLinks.appendChild(projectLink);
    });
    projectInfo.appendChild(projectLinks);

    // Append the project box to the html document
    projectBox.appendChild(projectInfo);
    projectBoxContainer.appendChild(projectBox);
    document.body.appendChild(projectBoxContainer);
}