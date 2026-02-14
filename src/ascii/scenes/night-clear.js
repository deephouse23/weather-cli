// Night-clear animation frames - twinkling stars
// 4 frames with star positions shifting (all within width 55)

const nightFrame0 = [
  '    .    +        .    *        .       +            ',
  '         .    _.._      .          +        .        ',
  "   +       .' .-'`    *      .        *             ",
  '    .     /  /    +       .       .        +         ',
  '      *  |  |        .       +         .             ',
  '    .     \\  \\   +      *        .          *      ',
  "       +  '._'-._ .        .    +       .           ",
  '    .      ( _ _._      +         .   *    +         ',
  "     +    |_|-'_~_`-._     .   +      .              ",
  "   .   .-'-_~_-~_-~-_`-._        .          +       ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const nightFrame1 = [
  '    *    .        +    .        *       .            ',
  '         +    _.._      *          .        +        ',
  "   .       .' .-'`    +      *        .             ",
  '    +     /  /    *       +       *        .         ',
  '      .  |  |        *       +         .             ',
  '    +     \\  \\   .      +        *          .      ',
  "       *  '._'-._ +        *    .       +           ",
  '    +      ( _ _._      *         +   .    *         ',
  "     .    |_|-'_~_`-._     +   *      .              ",
  "   +   .-'-_~_-~_-~-_`-._        *          .       ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const nightFrame2 = [
  '    .    +        .    *        .       +            ',
  '         .    _.._      .          +        .        ',
  "   +       .' .-'`    *      .        *             ",
  '    .     /  /    +       .       .        +         ',
  '      *  |  |        .       +         .             ',
  '    .     \\  \\   +      *        .          *      ',
  "       +  '._'-._ .        .    +       .           ",
  '    .      ( _ _._      +         .   *    +         ',
  "     +    |_|-'_~_`-._     .   +      .              ",
  "   .   .-'-_~_-~_-~-_`-._        .          +       ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const nightFrame3 = [
  '    +    .        *    +        .       *            ',
  '         *    _.._      +          .        *        ',
  "   .       .' .-'`    .      +        *             ",
  '    *     /  /    .       +       *        .         ',
  '      +  |  |        +       *         *             ',
  '    .     \\  \\   *      .        +          .      ',
  "       .  '._'-._ .        +    .       .           ",
  '    .      ( _ _._      *         .   +    .         ',
  "     +    |_|-'_~_`-._     .   +      *              ",
  "   .   .-'-_~_-~_-~-_`-._        +          *       ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const frames = [nightFrame0, nightFrame1, nightFrame2, nightFrame3];

export default {
  name: 'night-clear',
  width: 55,
  height: nightFrame0.length,
  defaultColor: 'sky',
  charColors: {
    '.': 'star',
    '+': 'star',
    '*': 'star',
    '(': 'moon',
    ')': 'moon',
    "'": 'moon',
    '/': 'moon',
    '\\': 'moon',
    '|': 'moon',
    '~': 'ground',
    '[': 'houseWindow',
    ']': 'houseWindow',
    _: 'houseWall',
    '-': 'houseWall',
    '=': 'houseDoor'
  },
  // Return all frames for animation
  getFrames() {
    return frames;
  },
  // Return single frame for static display
  // Accepts frameIndex (number) or options object for backwards compatibility
  getArt(frameIndexOrOptions = 0) {
    const frameIndex = typeof frameIndexOrOptions === 'number' ? frameIndexOrOptions : 0;
    return frames[frameIndex % frames.length];
  },
  frameCount: frames.length
};
