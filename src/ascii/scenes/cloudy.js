const art = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~                            ',
  '     /                     \\      .-~~~-.           ',
  '    |                       |.- ~-(       )- ~       ',
  '     \\                     /                  \\    ',
  '       ~- . _____ . -~      \\                /     ',
  '                               ~- . ___ . -~        ',
  '           ( _ _._                                   ',
  "          |_|-'_~_`-._                              ",
  "       .-'-_~_-~_-~-_`-._                           ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

export default {
  name: 'cloudy',
  width: 55,
  height: art.length,
  defaultColor: 'cloudDark',
  charColors: {
    '-': 'cloud',
    '.': 'cloud',
    '(': 'cloud',
    ')': 'cloud',
    '~': 'ground',
    '/': 'cloud',
    '\\': 'cloud',
    '[': 'houseWindow',
    ']': 'houseWindow',
    _: 'houseWall',
    '=': 'houseDoor',
    '|': 'houseWall'
  },
  getArt() {
    return art;
  }
};
