import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CACHE_FILE = join(__dirname, '..', '.weather-cache.json');
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

// Load cache from file
async function loadCache() {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Save cache to file
async function saveCache(cache) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// Get cached weather data if not expired
async function getCachedWeather(location, units) {
  const cache = await loadCache();
  const key = `${location}-${units}`;
  const cached = cache[key];
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_EXPIRY) {
    return cached.data;
  }
  
  return null;
}

// Set cached weather data
async function setCachedWeather(location, units, data) {
  const cache = await loadCache();
  const key = `${location}-${units}`;
  cache[key] = {
    data,
    timestamp: Date.now()
  };
  await saveCache(cache);
}

// Clean expired cache entries
async function cleanExpiredCache() {
  const cache = await loadCache();
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, value] of Object.entries(cache)) {
    if ((now - value.timestamp) >= CACHE_EXPIRY) {
      delete cache[key];
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    await saveCache(cache);
    console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
  }
  
  return cleaned;
}

// Get cache statistics
async function getCacheStats() {
  const cache = await loadCache();
  const now = Date.now();
  let total = 0;
  let expired = 0;
  let valid = 0;
  
  for (const [key, value] of Object.entries(cache)) {
    total++;
    if ((now - value.timestamp) >= CACHE_EXPIRY) {
      expired++;
    } else {
      valid++;
    }
  }
  
  return { total, expired, valid };
}

// Clear all cache
async function clearCache() {
  await fs.writeFile(CACHE_FILE, '{}');
}

export {
  loadCache,
  saveCache,
  getCachedWeather,
  setCachedWeather,
  cleanExpiredCache,
  getCacheStats,
  clearCache
};
