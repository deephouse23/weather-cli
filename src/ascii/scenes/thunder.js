const art = [
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

export default {
  name: 'thunder',
  width: 55,
  height: art.length,
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
  getArt() {
    return art;
  }
};
