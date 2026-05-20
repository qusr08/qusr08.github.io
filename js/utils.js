'use strict';

import RandomWeightText from './effects/random-weight-text.js';
import MousePushText from './effects/mouse-push-text.js';
import MouseWeightText from './effects/mouse-weight-text.js';
import WobbleEffect from './effects/wobble-effect.js';
import OffsetScrollEffect from './effects/offset-scroll-effect.js';

export function addEffects() {
    // document.querySelectorAll(".text-effect").forEach(e => { new RandomWeightText(e); });
    document.querySelectorAll(".wobble-effect").forEach(e => { new WobbleEffect(e); });
    // document.querySelectorAll(".offset-scroll-effect").forEach(e => { new OffsetScrollEffect(e); });
}

// https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
export const map = (number, inMin, inMax, outMin, outMax) => (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

export const randomNumber = (min, max) => Math.random() * (max - min) + min;

// https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
export const rgbaToHex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`;