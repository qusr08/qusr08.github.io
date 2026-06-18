// https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
export const map = (number, inMin, inMax, outMin, outMax) => (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

export const randomNumber = (min, max) => Math.random() * (max - min) + min;

// https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
export const rgbaToHex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`;

// https://stackoverflow.com/questions/56279807/is-it-possible-to-automatically-have-the-last-updated-date-on-my-website-changed
export function updateFromGithub() {
    let xhttpDate = new XMLHttpRequest();
    // let xhttpVersion = new XMLHttpRequest();

    xhttpDate.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let repos = JSON.parse(this.responseText);

            repos.forEach((repo) => {
                if (repo.name == "qusr08.github.io") {
                    let lastUpdated = new Date(repo.updated_at);
                    let day = lastUpdated.getUTCDate();
                    let month = lastUpdated.getUTCMonth();
                    let year = lastUpdated.getUTCFullYear();

                    document.querySelector("#github-date").innerHTML = `${month + 1}/${day}/${year}`;

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

export const getURLSearchParameter = (parameterName) => new URLSearchParams(window.location.search).get(parameterName);