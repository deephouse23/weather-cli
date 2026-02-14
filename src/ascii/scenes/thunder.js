// Thunder animation frames - lightning flashes
// 4 frames: alternating lightning intensity (all within width 55)

const thunderFrame0 = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~       .-~~~-.             ',
  '     /            /\\      \\.- ~-(       )- ~      ',
  '    |             \\ \\      |                  \\  ',
  '     \\            / /     / \\                /    ',
  '       ~- . _____/ /. -~    ~- . ___ . -~          ',
  '      ,  |  , / /  |  , |  ,  |  ,  |  ,           ',
  '    |  ,  |  *  ,(  _ _._  |  ,  |  ,  |           ',
  "      ,  |  ,  |_|-'_~_`-._  ,  |  ,  |           ",
  "    |  ,  |.-'-_~_-~_-~-_`-._  |  ,  |  ,         ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const thunderFrame1 = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~       .-~~~-.             ',
  '     /            /\\      \\.- ~-(       )- ~      ',
  '    |           ** \\ \\      |                  \\  ',
  '     \\          *  / /     / \\                /    ',
  '       ~- . *_***__/ /. -~    ~- . ___ . -~          ',
  '      ,  |  , / /*  |  , |  ,  |  ,  |  ,           ',
  '    |  ,  |  ** ,(  _ _._  |  ,  |  ,  |           ',
  "      ,  |  ,  |_|-'_~_`-._  ,  |  ,  |           ",
  "    |  ,  |.-'-_~_-~_-~-_`-._  |  ,  |  ,         ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const thunderFrame2 = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~       .-~~~-.             ',
  '     /            /\\      \\.- ~-(       )- ~      ',
  '    |             \\ \\      |                  \\  ',
  '     \\            / /     / \\                /    ',
  '       ~- . _____/ /. -~    ~- . ___ . -~          ',
  '      ,  |  , / /  |  , |  ,  |  ,  |  ,           ',
  '    |  ,  |  *  ,(  _ _._  |  ,  |  ,  |           ',
  "      ,  |  ,  |_|-'_~_`-._  ,  |  ,  |           ",
  "    |  ,  |.-'-_~_-~_-~-_`-._  |  ,  |  ,         ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const thunderFrame3 = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~       .-~~~-.             ',
  '     /            /\\      \\.- ~-(       )- ~      ',
  '    |           ** \\ \\      |                  \\  ',
  '     \\          *  / /     / \\                /    ',
  '       ~- . *_***__/ /. -~    ~- . ___ . -~          ',
  '      ,  |  , / /*  |  , |  ,  |  ,  |  ,           ',
  '    |  ,  |  ** ,(  _ _._  |  ,  |  ,  |           ',
  "      ,  |  ,  |_|-'_~_`-._  ,  |  ,  |           ",
  "    |  ,  |.-'-_~_-~_-~-_`-._  |  ,  |  ,         ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const frames = [thunderFrame0, thunderFrame1, thunderFrame2, thunderFrame3];

export default {
  name: 'thunder',
  width: 55,
  height: thunderFrame0.length,
  defaultColor: 'cloudDark',
  charColors: {
    '/': 'lightning',
    '\\': 'lightning',
    '*': 'lightning',
    '|': 'rain',
    ',': 'rain',
    '-': 'cloudDark',
    '.': 'cloudDark',
    '(': 'cloudDark',
    ')': 'cloudDark',
    '~': 'ground',
    '[': 'houseWindow',
    ']': 'houseWindow',
    _: 'houseWall',
    '=': 'houseDoor',
    "'": 'houseWall'
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
