// Fog animation frames - drifting effect
// Frame 0: shift left, Frame 1: center, Frame 2: shift right, Frame 3: center

const fogLines = [
  '  = = = = = = = = = = = = = = = = = = = = = =      ',
  '    - - - - - - - - - - - - - - - - - - - -         ',
  '  = = = = = = = = = = = = = = = = = = = = = =      ',
  '    - - - - - - - - - - - - - - - - - - - -         ',
  '  = = = = = = = = = = = = = = = = = = = = = =      ',
  '    - - - - - - - - - - - - - - - - - - - -         ',
  '  = = = = = = = = = = = = = = = = = = = = = =      '
];

const houseLines = [
  '           ( _ _._                                   ',
  "          |_|-'_~_`-._                              ",
  "       .-'-_~_-~_-~-_`-._                           ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

// Frame variations for drifting effect
const frame0 = [
  ' = = = = = = = = = = = = = = = = = = = = = =       ',
  '   - - - - - - - - - - - - - - - - - - - -         ',
  ' = = = = = = = = = = = = = = = = = = = = = =       ',
  '   - - - - - - - - - - - - - = = = = = = = =       ',
  ' = = = = = = = = = = = = = = = = = = = = = =       ',
  '   - - - - - - - - - - - - - - - - - - - -         ',
  ' = = = = = = = = = = = = = = = = = = = = = =       '
];

const frame1 = [
  '  = = = = = = = = = = = = = = = = = = = = = =      ',
  '    - - - - - - - - - - - - - - - - - - - -         ',
  '  = = = = = = = = = = = = = = = = = = = = = =      ',
  '    - - - - - - - - - - - - - - - - - - - -         ',
  '  = = = = = = = = = = = = = = = = = = = = = =      ',
  '    - - - - - - - - - - - - - - - - - - - -         ',
  '  = = = = = = = = = = = = = = = = = = = = = =      '
];

const frame2 = [
  '   = = = = = = = = = = = = = = = = = = = = = =     ',
  '     - - - - - - - - - - - - - - - - - - - -       ',
  '   = = = = = = = = = = = = = = = = = = = = = =     ',
  '     - - - - - - - - - - - - - - = = = = = = =     ',
  '   = = = = = = = = = = = = = = = = = = = = = =     ',
  '     - - - - - - - - - - - - - - - - - - - -       ',
  '   = = = = = = = = = = = = = = = = = = = = = =     '
];

const frame3 = [
  '  = = = = = = = = = = = = = = = = = = = = = =      ',
  '    - - - - - - - - - - - - - - - - - - - -         ',
  '  = = = = = = = = = = = = = = = = = = = = = =      ',
  '    - - - - - - - - - - - - - - - - - - - -         ',
  '  = = = = = = = = = = = = = = = = = = = = = =      ',
  '    - - - - - - - - - - - - - - - - - - - -         ',
  '  = = = = = = = = = = = = = = = = = = = = = =      '
];

const frames = [frame0, frame1, frame2, frame3];

// Build each frame by combining fog + house
const frameArt = frames.map((fogFrame) => [...fogFrame, ...houseLines]);

export default {
  name: 'fog',
  width: 55,
  height: frameArt[0].length,
  defaultColor: 'fog',
  charColors: {
    '=': 'fog',
    '-': 'fog',
    '~': 'fog',
    '(': 'houseWall',
    ')': 'houseWall',
    '[': 'houseWindow',
    ']': 'houseWindow',
    _: 'houseWall',
    '|': 'houseWall',
    '.': 'houseWall',
    "'": 'houseWall'
  },
  // Return all frames for animation
  getFrames() {
    return frameArt;
  },
  // Return single frame for static display
  getArt(frameIndex = 0) {
    return frameArt[frameIndex % frameArt.length];
  },
  frameCount: frameArt.length
};
