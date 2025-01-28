'use strict';

window.onload = () => {
    let projTags = document.querySelectorAll(".proj-tag");
    projTags.forEach(tag => {
        if (tag.innerHTML.toLowerCase().includes("2022")) {
            tag.classList.add("gmtk-2022");
        }
    });
}