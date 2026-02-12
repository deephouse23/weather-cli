const art = [
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

export default {
  name: 'night-clear',
  width: 55,
  height: art.length,
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
  getArt() {
    return art;
  }
};
