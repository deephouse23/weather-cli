import sunny from './scenes/sunny.js';
import cloudy from './scenes/cloudy.js';
import rain from './scenes/rain.js';
import snow from './scenes/snow.js';
import thunder from './scenes/thunder.js';
import fog from './scenes/fog.js';
import nightClear from './scenes/night-clear.js';

const SCENE_MAP = {
  // Thunderstorm group (200-232)
  200: thunder,
  201: thunder,
  202: thunder,
  210: thunder,
  211: thunder,
  212: thunder,
  221: thunder,
  230: thunder,
  231: thunder,
  232: thunder,

  // Drizzle group (300-321)
  300: rain,
  301: rain,
  302: rain,
  310: rain,
  311: rain,
  312: rain,
  313: rain,
  314: rain,
  321: rain,

  // Rain group (500-531)
  500: rain,
  501: rain,
  502: rain,
  503: rain,
  504: rain,
  511: snow,
  520: rain,
  521: rain,
  522: rain,
  531: rain,

  // Snow group (600-622)
  600: snow,
  601: snow,
  602: snow,
  611: snow,
  612: snow,
  613: snow,
  615: snow,
  616: snow,
  620: snow,
  621: snow,
  622: snow,

  // Atmosphere group (701-781)
  701: fog,
  711: fog,
  721: fog,
  731: fog,
  741: fog,
  751: fog,
  761: fog,
  762: fog,
  771: fog,
  781: fog,

  // Clear (800)
  800: sunny,

  // Clouds (801-804)
  801: cloudy,
  802: cloudy,
  803: cloudy,
  804: cloudy
};

function isDaytime(data) {
  const now = data.dt;
  const sunrise = data.sys?.sunrise;
  const sunset = data.sys?.sunset;
  if (!sunrise || !sunset) return true;
  return now >= sunrise && now < sunset;
}

function getScene(conditionCode, weatherData) {
  if (conditionCode === 800 && !isDaytime(weatherData)) {
    return nightClear;
  }
  return SCENE_MAP[conditionCode] || cloudy;
}

export { SCENE_MAP, isDaytime, getScene };
