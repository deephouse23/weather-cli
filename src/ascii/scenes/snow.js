const art = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~       .-~~~-.             ',
  '     /                     \\.- ~-(       )- ~      ',
  '    |                       |                  \\   ',
  '     \\                     / \\                /   ',
  '       ~- . _____ . -~       ~- . ___ . -~         ',
  '     *    .   *    .   *   .    *    .   *          ',
  '       .    *   .( _ _._   .    *  .    .           ',
  "     *   .   * |_|-'_~_`-._   *    .  *            ",
  "       .   * .-'-_~_-~_-~-_`-._  .    *   .       ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

export default {
  name: 'snow',
  width: 55,
  height: art.length,
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
  getArt() {
    return art;
  }
};
