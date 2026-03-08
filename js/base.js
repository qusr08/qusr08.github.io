'use strict';

import RandomWeightText from './effects/random-weight-text.js';
import MousePushText from './effects/mouse-push-text.js';
import MouseWeightText from './effects/mouse-weight-text.js';
import WobbleEffect from './effects/wobble-effect.js';
import OffsetScrollEffect from './effects/offset-scroll-effect.js';

export function addEffects() {
    document.querySelectorAll(".text-effect").forEach(e => { new RandomWeightText(e); });
    document.querySelectorAll(".wobble-effect").forEach(e => { new WobbleEffect(e); });
    document.querySelectorAll(".offset-scroll-effect").forEach(e => { new OffsetScrollEffect(e); });
}