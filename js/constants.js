export const BASE_WINDOW_WIDTH = 1920;
export const BASE_WINDOW_HEIGHT = 1080;
export const BASE_SHAPE_SIZE = 50;
export const BASE_SHAPE_VELOCITY = 0.01;
export const BASE_SHAPE_VELOCITY_ANGULAR = 0.05;

export const SHAPE_SPAWN_RATE = 500;
export const SHAPE_MAX_COUNT = 200;
export const PEG_THRESHOLD = 0;

export const MOUSE_CONSTRAINT_STIFFNESS = 0.1;
export const MOUSE_CONSTRAINT_DAMPING = 0;
export const HTML_CONSTRAINT_STIFFNESS = 0.005;
export const HTML_CONSTRAINT_DAMPING = 0.1;
export const HTML_CONSTRAINT_DISTANCE_MODIFIER = 12;

// https://www.temiz.dev/blog/matter-js-collisions-explained
export const CATEGORY_GAME = 2;
export const CATEGORY_HTML = 4;
export const CATEGORY_CONSTRAINT = 8;
export const CATEGORY_PEG = 16;