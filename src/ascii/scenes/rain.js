const art = [
  '            .-~~~-.                                  ',
  '      .- ~ ~-(       )- ~       .-~~~-.             ',
  '     /                     \\.- ~-(       )- ~      ',
  '    |                       |                  \\   ',
  '     \\                     / \\                /   ',
  '       ~- . _____ . -~       ~- . ___ . -~         ',
  '      ,  |  ,  |  ,  |  , |  ,  |  ,  |  ,         ',
  '    |  ,  |  ,(  _ _._  |  ,  |  ,  |  ,           ',
  "      ,  |  , |_|-'_~_`-._  ,  |  ,  |             ",
  "    |  ,  |.-'-_~_-~_-~-_`-._  |  ,  |  ,         ",
  '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                     ',
  '   | []  []   ___   []  [] |_._._._._.               ',
  '   |_________|___|__________|=|=|=|=|=|              '
];

export default {
  name: 'rain',
  width: 55,
  height: art.length,
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
  getArt() {
    return art;
  }
};
