import PROJECT_DATA from '../json/project-data.json' with { type: 'json' };
import * as ConstElements from './const-elements.js';
import * as Utils from './utils.js';

let NAVBAR = undefined;
let GAME_INFO = undefined;
let GAME_VISUALS = undefined;
let GAME_LINKS = undefined;
let WRAPPER = undefined;

let PROJECT_NAME = undefined;
let PROJECT_NAME_LOWER = undefined;

window.onload = () => {
    WRAPPER = document.querySelector("#wrapper");

    PROJECT_NAME = Utils.getURLSearchParameter("name");
    PROJECT_NAME_LOWER = PROJECT_NAME.toLowerCase();
    document.title = `Frank Alfano | ${PROJECT_NAME}`;

    NAVBAR = document.querySelector("#navbar");
    ConstElements.populateNavbar(NAVBAR);

    populateGameHeader();

    GAME_LINKS = document.querySelector(".game-links");
    populateGameLinks();

    GAME_INFO = document.querySelector(".game-info");
    populateGameText();
    populateGameAudio();
    populateGameCredits();

    GAME_VISUALS = document.querySelector(".game-visuals");
    populateGameVisuals();

    ConstElements.populateFooter(document.querySelector("footer"));
    Utils.updateFromGithub();
}

window.onscroll = (e) => {
    NAVBAR.classList.toggle("visible", window.scrollY > 0);
}

function populateGameLinks() {
    let projectLinksData = PROJECT_DATA[PROJECT_NAME].links;
    if (projectLinksData == undefined) return;

    projectLinksData.forEach(linkData => {
        let linkNameLowerCase = linkData.name.toLowerCase();

        // Create link element
        let gameLinkElement = document.createElement("a");
        gameLinkElement.classList.add("game-link");
        gameLinkElement.href = linkData.url;

        // Create link icon element
        let gameLinkIconElement = document.createElement("img");
        let iconType = "";
        if (linkNameLowerCase.includes("play")) iconType = "play";
        if (linkNameLowerCase.includes("github")) iconType = "github";
        if (linkNameLowerCase.includes("itch.io")) iconType = "itchio";
        if (linkNameLowerCase.includes("2022")) {
            iconType = "itchio";
            gameLinkElement.classList.add("gmtk-2022");
        }
        gameLinkIconElement.src = `../media/logos/${iconType}-logo.png`;
        gameLinkElement.appendChild(gameLinkIconElement);

        // Create link name element
        let gameLinkNameElement = document.createElement("p");
        gameLinkNameElement.innerHTML = linkData.name;
        gameLinkElement.appendChild(gameLinkNameElement);

        // Append the final link element to the links list
        GAME_LINKS.appendChild(gameLinkElement);
    });
}

function populateGameText() {
    let projectTextData = PROJECT_DATA[PROJECT_NAME].text;
    if (projectTextData == undefined) return;

    projectTextData.forEach(textData => {
        let textSectionElement = createGameSection(textData.title);
        let textSectionListElement = document.createElement("div");
        textSectionListElement.classList.add("section-sublist-vertical");

        textData.content.forEach(paragraphData => {
            let paragraphElement = document.createElement("p");
            paragraphElement.innerText = paragraphData;
            textSectionListElement.appendChild(paragraphElement);
        });

        textSectionElement.appendChild(textSectionListElement);
        GAME_INFO.appendChild(textSectionElement);
    });
}

function populateGameAudio() {
    let projectAudioData = PROJECT_DATA[PROJECT_NAME].audio;
    if (projectAudioData == undefined) return;

    let audioSectionElement = createGameSection("Audio");
    let audioGridElement = document.createElement("div");
    audioGridElement.classList.add("section-subgrid");

    // Create each audio content section
    projectAudioData.forEach(audioData => {
        let audioElement = document.createElement("div");
        audioElement.classList.add("section-subelement");

        // Create the audio title element
        // If a link is specified, have the title also be a link
        let audioTitleElement = document.createElement("h1");
        audioTitleElement.classList.add("section-subelement-title");
        let audioTitle = `${audioData.name} - ${audioData.creator}`;
        if (audioData.link != undefined) {
            audioTitleElement.innerHTML = `<a href="${audioData.link}">${audioTitle}</a>`;
        } else {
            audioTitleElement.innerText = audioTitle;
        }
        audioElement.appendChild(audioTitleElement);

        // Create the audio player element
        let audioPlayerElement = document.createElement("audio");
        audioPlayerElement.setAttribute("controls", "");
        audioPlayerElement.setAttribute("loop", "");
        if (audioData.wav != undefined) {
            audioPlayerElement.type = "audio/wav";
            audioPlayerElement.src = `media/${PROJECT_NAME_LOWER}/audio/${audioData.wav}`;
        }
        audioElement.appendChild(audioPlayerElement);

        audioGridElement.appendChild(audioElement);
    });

    audioSectionElement.appendChild(audioGridElement);
    GAME_INFO.appendChild(audioSectionElement);
}

function populateGameCredits() {
    let projectCreditData = PROJECT_DATA[PROJECT_NAME].credits;
    if (projectCreditData == undefined) return;

    let creditSectionElement = createGameSection("Credits");
    let creditGridElement = document.createElement("div");
    creditGridElement.classList.add("section-subgrid");

    // Create each credit content section
    projectCreditData.forEach(creditData => {
        let creditElement = document.createElement("div");
        creditElement.classList.add("section-subelement");

        // Create the credit title (category) element
        let creditTitleElement = document.createElement("h1");
        creditTitleElement.innerText = creditData.category;
        creditElement.appendChild(creditTitleElement);

        // Create the members of the credit category element
        let creditMembersElement = document.createElement("p");
        creditMembersElement.innerHTML = `<strong>${creditData.members.join(", ")}</strong>`;
        creditElement.appendChild(creditMembersElement);

        // If tools are specified, create a list of used tools element
        if (creditData.tools != undefined) {
            let creditToolsElement = document.createElement("p");
            creditToolsElement.innerHTML = `<em>Using ${creditData.tools.join(", ")}</em>`;
            creditElement.appendChild(creditToolsElement);
        }

        creditGridElement.appendChild(creditElement);
    });

    creditSectionElement.appendChild(creditGridElement);
    GAME_INFO.appendChild(creditSectionElement);
}

function populateGameVisuals() {
    let projectVisualsData = PROJECT_DATA[PROJECT_NAME].visuals;
    if (projectVisualsData == undefined) return;

    projectVisualsData.forEach(visual => {
        let visualElement = undefined;

        // Check to see what type of visual element needs to be created
        if (visual.youtube != undefined) {
            visualElement = document.createElement("iframe");
            visualElement.style.aspectRatio = 1920 / 1080;
            visualElement.src = `${visual.youtube}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0`;
        } else if (visual.png != undefined) {
            visualElement = document.createElement("img");
            visualElement.src = `media/${PROJECT_NAME_LOWER}/screenshots/${visual.png}`;
        }

        GAME_VISUALS.appendChild(visualElement);
    });
}

function createGameSection(sectionTitle = "", isClear = false) {
    // Create a general section element with a title
    // If there is no title specified, then do not add a title
    let sectionElement = document.createElement("section");
    sectionElement.classList.toggle("clear", isClear);
    if (sectionTitle == "") return sectionElement;

    let sectionTitleElement = document.createElement("h1");
    sectionTitleElement.classList.add("section-title");
    sectionTitleElement.innerText = sectionTitle;
    sectionElement.appendChild(sectionTitleElement);

    return sectionElement;
}

function populateGameHeader() {
    // Set the header background image
    let headerElement = document.querySelector("header");
    headerElement.style.backgroundImage = `url('media/${PROJECT_NAME_LOWER}/${PROJECT_NAME_LOWER}-title-background.png')`;

    // Create the header title art
    let headerTitleArtElement = document.createElement("img");
    headerTitleArtElement.classList.add("header-title-art");
    headerTitleArtElement.src = `media/${PROJECT_NAME_LOWER}/${PROJECT_NAME_LOWER}-title-art.png`;
    headerElement.appendChild(headerTitleArtElement);
}