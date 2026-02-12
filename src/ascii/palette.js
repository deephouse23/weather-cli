const palettes = {
  day: {
    sky: '#87CEEB',
    sun: '#FFD700',
    sunRay: '#FFA500',
    cloud: '#C0C0C0',
    cloudDark: '#808080',
    rain: '#4169E1',
    snow: '#F0F8FF',
    lightning: '#FFFF00',
    fog: '#A9A9A9',
    ground: '#228B22',
    houseRoof: '#8B0000',
    houseWall: '#D2B48C',
    houseWindow: '#00CED1',
    houseDoor: '#8B4513',
    moon: '#F5F5DC',
    star: '#FFFACD'
  },
  night: {
    sky: '#191970',
    sun: '#FFD700',
    sunRay: '#FFA500',
    cloud: '#4A4A4A',
    cloudDark: '#2F2F2F',
    rain: '#4682B4',
    snow: '#B0C4DE',
    lightning: '#FFFFE0',
    fog: '#3A3A3A',
    ground: '#004400',
    houseRoof: '#8B008B',
    houseWall: '#6B4423',
    houseWindow: '#FFD700',
    houseDoor: '#5C3317',
    moon: '#F5F5DC',
    star: '#FFFACD'
  },
  retro: {
    sky: '#5B6EE1',
    sun: '#FBF236',
    sunRay: '#FBF236',
    cloud: '#9BADB7',
    cloudDark: '#6B7B8B',
    rain: '#3F3FBF',
    snow: '#FFFFFF',
    lightning: '#FBFF86',
    fog: '#76767B',
    ground: '#37946E',
    houseRoof: '#AC3232',
    houseWall: '#D9A066',
    houseWindow: '#5FCDE4',
    houseDoor: '#76428A',
    moon: '#CBDBFC',
    star: '#FFFFFF'
  }
};

const PALETTE_KEYS = [
  'sky',
  'sun',
  'sunRay',
  'cloud',
  'cloudDark',
  'rain',
  'snow',
  'lightning',
  'fog',
  'ground',
  'houseRoof',
  'houseWall',
  'houseWindow',
  'houseDoor',
  'moon',
  'star'
];

function getPalette(name) {
  return palettes[name] || palettes.day;
}

export { palettes, PALETTE_KEYS, getPalette };
