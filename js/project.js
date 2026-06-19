import PROJECT_DATA from '../json/project-data.json' with { type: 'json' };
import * as ConstElements from './const-elements.js';
import * as Utils from './utils.js';

let NAVBAR = undefined;
let GAME_INFO = undefined;
let GAME_VISUALS = undefined;
let WRAPPER = undefined;

let PROJECT_NAME = undefined;
let PROJECT_NAME_LOWER = undefined;

window.onload = () => {
    WRAPPER = document.querySelector("#wrapper");

    PROJECT_NAME = Utils.getURLSearchParameter("name");
    PROJECT_NAME_LOWER = PROJECT_NAME.toLowerCase();

    NAVBAR = document.querySelector("#navbar");
    ConstElements.populateNavbar(NAVBAR);

    populateGameHeader();

    GAME_INFO = document.querySelector(".game-info");
    populateGameText();
    populateGameAudio();
    populateGameCredits();

    GAME_VISUALS = document.querySelector(".game-visuals");
    populateGameVisuals();

    document.title = `Frank Alfano | ${PROJECT_NAME}`;

    ConstElements.populateFooter(document.querySelector("footer"));
    Utils.updateFromGithub();
}

window.onscroll = (e) => {
    NAVBAR.classList.toggle("visible", window.scrollY > 0);
}

function populateGameText() {
    let projectTextData = PROJECT_DATA[PROJECT_NAME].text;

    if (PROJECT_DATA[PROJECT_NAME].text != undefined) {
        PROJECT_DATA[PROJECT_NAME].text.forEach(textContent => {
            let textSectionElement = createGameSection(textContent.title);
            let textSectionListElement = document.createElement("div");
            textSectionListElement.classList.add("section-sublist");

            textContent.content.forEach(paragraph => {
                let paragraphElement = document.createElement("p");
                paragraphElement.innerText = paragraph;
                textSectionListElement.appendChild(paragraphElement);
            });

            textSectionElement.appendChild(textSectionListElement);
            GAME_INFO.appendChild(textSectionElement);
        });
    }


}

function populateGameAudio() {
    if (PROJECT_DATA[PROJECT_NAME].audio != undefined) {
        let audioSectionElement = createGameSection("Audio");
        let audioGridElement = document.createElement("div");
        audioGridElement.classList.add("section-subgrid");

        // Create each audio content section
        PROJECT_DATA[PROJECT_NAME].audio.forEach(audio => {
            let audioElement = document.createElement("div");
            audioElement.classList.add("section-subelement");

            let audioTitleElement = document.createElement("h1");
            audioTitleElement.classList.add("section-subelement-title");
            let audioTitle = `${audio.name} - ${audio.creator}`;
            if (audio.link != undefined) {
                audioTitleElement.innerHTML = `<a href="${audio.link}">${audioTitle}</a>`;
            } else {
                audioTitleElement.innerText = audioTitle;
            }
            audioElement.appendChild(audioTitleElement);

            let audioPlayerElement = document.createElement("audio");
            audioPlayerElement.setAttribute("controls", "");
            audioPlayerElement.setAttribute("loop", "");
            if (audio.wav != undefined) {
                audioPlayerElement.type = "audio/wav";
                audioPlayerElement.src = `media/${PROJECT_NAME_LOWER}/audio/${audio.wav}`;
            }
            audioElement.appendChild(audioPlayerElement);

            audioGridElement.appendChild(audioElement);
        });

        audioSectionElement.appendChild(audioGridElement);
        GAME_INFO.appendChild(audioSectionElement);
    }
}

function populateGameCredits() {
    if (PROJECT_DATA[PROJECT_NAME].credits != undefined) {
        let creditSectionElement = createGameSection("Credits");
        let creditGridElement = document.createElement("div");
        creditGridElement.classList.add("section-subgrid");

        // Create each credit content section
        PROJECT_DATA[PROJECT_NAME].credits.forEach(credit => {
            let creditElement = document.createElement("div");
            creditElement.classList.add("section-subelement");

            let creditTitleElement = document.createElement("h1");
            creditTitleElement.innerText = credit.category;
            creditElement.appendChild(creditTitleElement);

            let creditMembersElement = document.createElement("p");
            creditMembersElement.innerHTML = `<strong>${credit.members.join(", ")}</strong>`;
            creditElement.appendChild(creditMembersElement);

            if (credit.tools != undefined) {
                let creditToolsElement = document.createElement("p");
                creditToolsElement.innerHTML = `<em>Using ${credit.tools.join(", ")}</em>`;
                creditElement.appendChild(creditToolsElement);
            }

            creditGridElement.appendChild(creditElement);
        });

        creditSectionElement.appendChild(creditGridElement);
        GAME_INFO.appendChild(creditSectionElement);
    }
}

function populateGameVisuals() {
    if (PROJECT_DATA[PROJECT_NAME].visuals != undefined) {
        PROJECT_DATA[PROJECT_NAME].visuals.forEach(visual => {
            let visualElement = undefined;

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
}

function createGameSection(sectionTitle) {
    let sectionElement = document.createElement("section");
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