// Snow animation frames - falling snowflakes
// 4 frames with subtle snow position shifts (all within width 55)

const snowFrame0 = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~       .-~~~-.             ',
  '     /                     \\.- ~-(       )- ~      ',
  '    |   * . * . * .   |                  \\   ',
  '     \\   . * . * .  / \\                /   ',
  '       ~- . _____ . -~       ~- . ___ . -~         ',
  '     *    .   *    .   *   .    *    .   *          ',
  '       .    *   .( _ _._   .    *  .    .           ',
  "     *   .   * |_|-'_~_`-._   *    .  *            ",
  "       .   * .-'-_~_-~_-~-_`-._  .    *   .       ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const snowFrame1 = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~       .-~~~-.             ',
  '     /                     \\.- ~-(       )- ~      ',
  '    |                       |   * . * . * \\   ',
  '     \\    * . * .   / \\                /   ',
  '       ~- . _____ . -~       ~- . ___ . -~         ',
  '       .    *   .   *   .    *   .    *             ',
  '     *   .    *( _ _._   .    *  .    *           ',
  "       .   * |_|-'_~_`-._   *    .  *            ",
  "     *   .-'-_~_-~_-~-_`-._  .    *   .       ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const snowFrame2 = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~       .-~~~-.             ',
  '     /                     \\.- ~-(       )- ~      ',
  '    |   * . * . * .   |                  \\   ',
  '     \\   . * . * .  / \\                /   ',
  '       ~- . _____ . -~       ~- . ___ . -~         ',
  '     *    .   *    .   *   .    *    .   *          ',
  '       .    *   .( _ _._   .    *  .    .           ',
  "     *   .   * |_|-'_~_`-._   *    .  *            ",
  "       .   * .-'-_~_-~_-~-_`-._  .    *   .       ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const snowFrame3 = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~       .-~~~-.             ',
  '     /                     \\.- ~-(       )- ~      ',
  '    |                       |   * . * . * \\   ',
  '     \\    * . * .   / \\                /   ',
  '       ~- . _____ . -~       ~- . ___ . -~         ',
  '       .    *   .   *   .    *   .    *             ',
  '     *   .    *( _ _._   .    *  .    *           ',
  "       .   * |_|-'_~_`-._   *    .  *            ",
  "     *   .-'-_~_-~_-~-_`-._  .    *   .       ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

const frames = [snowFrame0, snowFrame1, snowFrame2, snowFrame3];

export default {
  name: 'snow',
  width: 55,
  height: snowFrame0.length,
  defaultColor: 'cloud',
  charColors: {
    '*': 'snow',
    '.': 'snow',
    '-': 'cloud',
    '(': 'cloud',
    ')': 'cloud',
    '/': 'cloud',
    '\\': 'cloud',
    '~': 'snow',
    '[': 'houseWindow',
    ']': 'houseWindow',
    _: 'houseWall',
    '=': 'houseDoor',
    '|': 'houseWall',
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
