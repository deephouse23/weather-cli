import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG_FILE = join(__dirname, '..', '.weather-config.json');

// Load saved configuration
async function loadConfig() {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Save configuration
async function saveConfig(config) {
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// Get default location
async function getDefaultLocation() {
  const config = await loadConfig();
  return config.defaultLocation || null;
}

// Get default units
async function getDefaultUnits() {
  const config = await loadConfig();
  return config.defaultUnits || 'auto';
}

// Check if beta banner should be shown
async function shouldShowBetaBanner() {
  const config = await loadConfig();
  return config.showBetaBanner === true;
}

// Toggle beta banner setting
async function setShowBetaBanner(show) {
  const config = await loadConfig();
  config.showBetaBanner = show;
  await saveConfig(config);
}

// Set default location
async function setDefaultLocation(location) {
  const config = await loadConfig();
  config.defaultLocation = location;
  await saveConfig(config);
}

// Set default units
async function setDefaultUnits(units) {
  const config = await loadConfig();
  config.defaultUnits = units;
  await saveConfig(config);
}

// Process temperature options from command line
function processTemperatureOptions(options) {
  if (options.celsius) return 'celsius';
  if (options.fahrenheit) return 'fahrenheit';
  if (options.units && options.units !== 'auto') {
    return options.units === 'metric' ? 'celsius' : 'fahrenheit';
  }
  return null; // Use auto-detection
}

export {
  loadConfig,
  saveConfig,
  getDefaultLocation,
  getDefaultUnits,
  setDefaultLocation,
  setDefaultUnits,
  processTemperatureOptions,
  shouldShowBetaBanner,
  setShowBetaBanner
};
