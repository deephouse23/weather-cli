// Rain animation frames - falling rain drops
// 4 frames with subtle rain position shifts (all within width 55)

const rainFrame0 = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~       .-~~~-.             ',
  '     /                     \\.- ~-(       )- ~      ',
  '    |   , | , |  , | ,   |                  \\   ',
  '     \\   , |  ,|    / \\                /   ',
  '       ~- . _____ . -~       ~- . ___ . -~         ',
  '      |  ,  |  , | , |  , |  ,  |  ,  |          ',
  '    |  ,  |  ,(  _ _._  |  ,  |  ,  |           ',
  "      ,  |  , |_|-'_~_`-._  ,  |  ,  |             ",
  "    |  ,  |.-'-_~_-~_-~-_`-._  |  ,  |  ,         ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const rainFrame1 = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~       .-~~~-.             ',
  '     /                     \\.- ~-(       )- ~      ',
  '    |                       |   , | , |  , \\   ',
  '     \\    , | , |  ,   / \\                /   ',
  '       ~- . _____ . -~       ~- . ___ . -~         ',
  '      ,  |  , |  , | , |  , |  ,  |  ,  |         ',
  '    |  ,  |  ,(  _ _._  |  ,  |  ,  |           ',
  "      ,  |  , |_|-'_~_`-._  ,  |  ,  |             ",
  "    |  ,  |.-'-_~_-~_-~-_`-._  |  ,  |  ,         ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const rainFrame2 = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~       .-~~~-.             ',
  '     /                     \\.- ~-(       )- ~      ',
  '    |                       |                  \\   ',
  '     \\ , | , |  , | ,   / \\                /   ',
  '       ~- . _____ . -~       ~- . ___ . -~         ',
  '      ,  |  ,  |  , | , |  , |  ,  |  ,  |         ',
  '    |  ,  |  ,(  _ _._  |  ,  |  ,  |           ',
  "      ,  |  , |_|-'_~_`-._  ,  |  ,  |             ",
  "    |  ,  |.-'-_~_-~_-~-_`-._  |  ,  |  ,         ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const rainFrame3 = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~       .-~~~-.             ',
  '     /                     \\.- ~-(       )- ~      ',
  '    |   , | , |  , | ,    |  |                  \\   ',
  '     \\    ,  |  ,|    / \\                /   ',
  '       ~- . _____ . -~       ~- . ___ . -~         ',
  '      ,  |  ,  |  ,  | , |  , |  ,  |  ,         ',
  '    |  ,  |  ,(  _ _._  |  ,  |  ,  |  ,           ',
  "      ,  |  , |_|-'_~_`-._  ,  |  ,  |  ,             ",
  "    |  ,  |.-'-_~_-~_-~-_`-._  |  ,  |  ,         ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const frames = [rainFrame0, rainFrame1, rainFrame2, rainFrame3];

export default {
  name: 'rain',
  width: 55,
  height: rainFrame0.length,
  defaultColor: 'cloudDark',
  charColors: {
    '|': 'rain',
    ',': 'rain',
    '-': 'cloudDark',
    '.': 'cloudDark',
    '(': 'cloudDark',
    ')': 'cloudDark',
    '/': 'cloudDark',
    '\\': 'cloudDark',
    '~': 'rain',
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
