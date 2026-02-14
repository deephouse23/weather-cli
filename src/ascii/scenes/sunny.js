// Sunny animation frames - pulsing sun rays
// 4 frames with subtle ray movement (all within width 55)

const sunnyFrame0 = [
  '       \\   |   /                                    ',
  '        .---.                                        ',
  '     --( o o )--                                     ',
  "        `---'            .-~~~-.                     ",
  '       /   |   \\   .- ~ ~-(       )- ~              ',
  '                   /                     \\           ',
  '                          ~                            ',
  '           ( _ _._                                   ',
  "          |_|-'_~_`-._                              ",
  "       .-'-_~_-~_-~-_`-._                           ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const sunnyFrame1 = [
  '        \\  |  /                                     ',
  '         .---.                                      ',
  '      ---( o o )---                                 ',
  "         `---'          .-~~~-.                     ",
  '        /   |   \\ .- ~ ~-(       )- ~              ',
  '                    /                     \\           ',
  '                           ~                          ',
  '            ( _ _._                                  ',
  "           |_|-'_~_`-._                             ",
  "        .-'-_~_-~_-~-_`-._                          ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const sunnyFrame2 = [
  '       \\   |   /                                    ',
  '        .---.                                        ',
  '     --( o o )--                                     ',
  "        `---'            .-~~~-.                     ",
  '       /   |   \\   .- ~ ~-(       )- ~              ',
  '                   /                     \\           ',
  '                          ~                            ',
  '           ( _ _._                                   ',
  "          |_|-'_~_`-._                              ",
  "       .-'-_~_-~_-~-_`-._                           ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const sunnyFrame3 = [
  '        /  |  \\                                     ',
  '         .---.                                      ',
  '      ---( o o )---                                 ',
  "         `---'          .-~~~-.                     ",
  '        /   |   \\ .- ~ ~-(       )- ~              ',
  '                    /                     \\           ',
  '                           ~                          ',
  '            ( _ _._                                  ',
  "           |_|-'_~_`-._                             ",
  "        .-'-_~_-~_-~-_`-._                          ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const frames = [sunnyFrame0, sunnyFrame1, sunnyFrame2, sunnyFrame3];

export default {
  name: 'sunny',
  width: 55,
  height: sunnyFrame0.length,
  defaultColor: 'sky',
  charColors: {
    '\\': 'sunRay',
    '/': 'sunRay',
    '|': 'sunRay',
    '-': 'sun',
    '.': 'sun',
    '(': 'sun',
    ')': 'sun',
    o: 'sun',
    '`': 'sun',
    "'": 'sun',
    '~': 'ground',
    '[': 'houseWindow',
    ']': 'houseWindow',
    _: 'houseWall',
    '^': 'ground',
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
