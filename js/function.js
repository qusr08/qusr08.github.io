function toggleMenu() {
    let gameMenu = document.getElementsByClassName("game-menu")[0];

    let gallerySize = getComputedStyle(document.documentElement).getPropertyValue("--gallery-size");
    let border = getComputedStyle(document.documentElement).getPropertyValue("--border");

    if (gameMenu.style.right == "0px") {
        gameMenu.style.right = `calc(${gallerySize} * -1)`;
        gameMenu.style.borderLeftWidth = "0px";
    } else {
        gameMenu.style.right = "0px";
        gameMenu.style.borderLeftWidth = border;
    }
}