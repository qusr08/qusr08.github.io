'use strict';

import PROJECT_DATA from '../json/project-data.json' with { type: 'json' };
import { InteractiveBackground } from "./background/interactive-background.js";

let PROJECT_GRID = undefined;
let BACKGROUND = undefined;

window.onload = () => {
    PROJECT_GRID = document.querySelector(".proj-grid");

    // Create all project box elements
    let isProjectReversed = true;
    for (let project in PROJECT_DATA) {
        createProjectBox(project, isProjectReversed);
        isProjectReversed = !isProjectReversed;
    }

    BACKGROUND = new InteractiveBackground(document.querySelector(".wrapper"));
    BACKGROUND.initialize();
    
    updateFromGithub();
}

window.onresize = (e) => {
    BACKGROUND.updateResolution();
}

window.onmousemove = (e) => {
    if (BACKGROUND && BACKGROUND.isInitialized) {
        BACKGROUND.mouseMatterObject.update({ x: e.clientX + window.scrollX, y: e.clientY + window.scrollY });
    }
}

function createProjectBox(projectName, isReversed) {
    let projectNameLowerCase = projectName.toLowerCase();

    // Create project box container element
    let projectBoxContainer = document.createElement("div");
    projectBoxContainer.classList.add("proj-box-container", "matter-rect-html");
    if (isReversed) projectBoxContainer.classList.add("reversed");

    // Create project box element
    let projectBox = document.createElement("a");
    projectBox.href = `html/${projectNameLowerCase}.html`;
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
        projectLinkIcon.src = `media/logos/${iconType}-logo.png`;
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
    PROJECT_GRID.appendChild(projectBoxContainer);
}

// https://stackoverflow.com/questions/56279807/is-it-possible-to-automatically-have-the-last-updated-date-on-my-website-changed
function updateFromGithub() {
    let xhttpDate = new XMLHttpRequest();
    // let xhttpVersion = new XMLHttpRequest();

    xhttpDate.onreadystatechange = function() {
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

    // xhttpVersion.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         let commit = JSON.parse(this.responseText)[0];
    //         document.getElementById('github-version').innerHTML = `<a href="${commit.html_url}"><span>${commit.commit.message.split("\n\n")[0]}</span></a>`;
    //     }
    // };

    xhttpDate.open("GET", "https://api.github.com/users/qusr08/repos", true);
    // xhttpVersion.open("GET", "https://api.github.com/repos/qusr08/qusr08.github.io/commits", true);

    xhttpDate.send();
    // xhttpVersion.send();
}