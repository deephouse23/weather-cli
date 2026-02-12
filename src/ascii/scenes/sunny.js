const art = [
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

export default {
  name: 'sunny',
  width: 55,
  height: art.length,
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
  getArt() {
    return art;
  }
};
