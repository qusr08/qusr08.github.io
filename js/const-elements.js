export function populateFooter(footerElement) {
    if (footerElement == undefined) return;

    footerElement.innerHTML = `
        <div class="footer-text box-reg matter-rect-html">
            <p>Last updated on: <span id="github-date">XX/XX/XXXX</span></p>
            <!-- <p>Created by Frank Alfano</p> -->
            <p><a href="https://github.com/qusr08/qusr08.github.io">Website Github Repository</a></p>
        </div>
    `;
}

export function populateNavbar(navbarElement) {
    if (navbarElement == undefined) return;
    
    navbarElement.innerHTML = `
        <a class="navbar-title" href="index.html">Frank Alfano</a>
        <div style="flex-grow: 1;"></div>
        <a class="navbar-link" href="https://github.com/qusr08">
            <img src="../media/logos/github-logo.png">
        </a>
        <a class="navbar-link" href="https://www.linkedin.com/in/frankalfanoiii/">
            <img src="../media/logos/linkedin-logo.png">
        </a>
        <a class="navbar-link" href="https://qusr.itch.io/">
            <img src="../media/logos/itchio-logo.png">
        </a>
        <a class="navbar-link" href="https://www.instagram.com/frankalfanoiii/">
            <img src="../media/logos/instagram-logo.png">
        </a>
        <a class="navbar-link" href="mailto:falfanoiii@gmail.com">
            <img src="../media/logos/email-logo.png">
        </a>
    `;
}