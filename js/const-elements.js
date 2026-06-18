export function populateFooter(footerElement) {
    footerElement.innerHTML = `
        <div class="footer-text box-reg matter-rect-html">
            <p>Last updated on: <span id="github-date">XX/XX/XXXX</span></p>
            <!-- <p>Created by Frank Alfano</p> -->
            <p><a href="https://github.com/qusr08/qusr08.github.io">Website Github Repository</a></p>
        </div>
    `;
}

export function populateNavbar(navbarElement) {
    navbarElement.innerHTML = `
        <p>Frank Alfano</p>
        <div style="flex-grow: 1;"></div>
        <a class="navbar-link" href="https://www.linkedin.com/in/frankalfanoiii/">
            <img src="../media/logos/linkedin-logo.png">
        </a>
    `;
}