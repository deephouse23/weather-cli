import { describe, it, expect } from 'vitest';
import { SCENE_MAP, isDaytime, getScene } from '../../../src/ascii/index.js';
import sunny from '../../../src/ascii/scenes/sunny.js';
import cloudy from '../../../src/ascii/scenes/cloudy.js';
import rain from '../../../src/ascii/scenes/rain.js';
import snow from '../../../src/ascii/scenes/snow.js';
import thunder from '../../../src/ascii/scenes/thunder.js';
import fog from '../../../src/ascii/scenes/fog.js';
import nightClear from '../../../src/ascii/scenes/night-clear.js';

const daytimeData = {
  dt: 1700000000,
  sys: { sunrise: 1699990000, sunset: 1700030000 }
};

const nighttimeData = {
  dt: 1700040000,
  sys: { sunrise: 1699990000, sunset: 1700030000 }
};

const noSunData = {
  dt: 1700000000,
  sys: {}
};

describe('SCENE_MAP', () => {
  it('maps thunderstorm codes (200-232) to thunder', () => {
    const codes = [200, 201, 202, 210, 211, 212, 221, 230, 231, 232];
    for (const code of codes) {
      expect(SCENE_MAP[code], `code ${code}`).toBe(thunder);
    }
  });

  it('maps drizzle codes (300-321) to rain', () => {
    const codes = [300, 301, 302, 310, 311, 312, 313, 314, 321];
    for (const code of codes) {
      expect(SCENE_MAP[code], `code ${code}`).toBe(rain);
    }
  });

  it('maps rain codes (500-531) to rain', () => {
    const codes = [500, 501, 502, 503, 504, 520, 521, 522, 531];
    for (const code of codes) {
      expect(SCENE_MAP[code], `code ${code}`).toBe(rain);
    }
  });

  it('maps freezing rain (511) to snow', () => {
    expect(SCENE_MAP[511]).toBe(snow);
  });

  it('maps snow codes (600-622) to snow', () => {
    const codes = [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622];
    for (const code of codes) {
      expect(SCENE_MAP[code], `code ${code}`).toBe(snow);
    }
  });

  it('maps atmosphere codes (701-781) to fog', () => {
    const codes = [701, 711, 721, 731, 741, 751, 761, 762, 771, 781];
    for (const code of codes) {
      expect(SCENE_MAP[code], `code ${code}`).toBe(fog);
    }
  });

  it('maps clear (800) to sunny', () => {
    expect(SCENE_MAP[800]).toBe(sunny);
  });

  it('maps cloud codes (801-804) to cloudy', () => {
    const codes = [801, 802, 803, 804];
    for (const code of codes) {
      expect(SCENE_MAP[code], `code ${code}`).toBe(cloudy);
    }
  });
});

describe('isDaytime', () => {
  it('returns true when dt is between sunrise and sunset', () => {
    expect(isDaytime(daytimeData)).toBe(true);
  });

  it('returns false when dt is after sunset', () => {
    expect(isDaytime(nighttimeData)).toBe(false);
  });

  it('returns false when dt is before sunrise', () => {
    const beforeSunrise = { dt: 1699980000, sys: { sunrise: 1699990000, sunset: 1700030000 } };
    expect(isDaytime(beforeSunrise)).toBe(false);
  });

  it('returns true when sunrise/sunset data is missing', () => {
    expect(isDaytime(noSunData)).toBe(true);
  });

  it('returns true when sys is missing', () => {
    expect(isDaytime({ dt: 1700000000 })).toBe(true);
  });
});

describe('getScene', () => {
  it('returns sunny for code 800 during daytime', () => {
    expect(getScene(800, daytimeData)).toBe(sunny);
  });

  it('returns night-clear for code 800 at night', () => {
    expect(getScene(800, nighttimeData)).toBe(nightClear);
  });

  it('returns sunny for code 800 when no sunrise/sunset data', () => {
    expect(getScene(800, noSunData)).toBe(sunny);
  });

  it('returns thunder for thunderstorm codes regardless of time', () => {
    expect(getScene(200, nighttimeData)).toBe(thunder);
    expect(getScene(200, daytimeData)).toBe(thunder);
  });

  it('returns rain for rain codes', () => {
    expect(getScene(500, daytimeData)).toBe(rain);
  });

  it('returns snow for snow codes', () => {
    expect(getScene(601, daytimeData)).toBe(snow);
  });

  it('returns fog for atmosphere codes', () => {
    expect(getScene(741, daytimeData)).toBe(fog);
  });

  it('returns cloudy for cloud codes', () => {
    expect(getScene(803, daytimeData)).toBe(cloudy);
  });

  it('falls back to cloudy for unknown codes', () => {
    expect(getScene(999, daytimeData)).toBe(cloudy);
    expect(getScene(0, daytimeData)).toBe(cloudy);
  });
});
