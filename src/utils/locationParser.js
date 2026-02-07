export const STATE_MAPPINGS = {
  // US States
  AL: 'Alabama, US',
  AK: 'Alaska, US',
  AZ: 'Arizona, US',
  AR: 'Arkansas, US',
  CA: 'California, US',
  CO: 'Colorado, US',
  CT: 'Connecticut, US',
  DE: 'Delaware, US',
  FL: 'Florida, US',
  GA: 'Georgia, US',
  HI: 'Hawaii, US',
  ID: 'Idaho, US',
  IL: 'Illinois, US',
  IN: 'Indiana, US',
  IA: 'Iowa, US',
  KS: 'Kansas, US',
  KY: 'Kentucky, US',
  LA: 'Louisiana, US',
  ME: 'Maine, US',
  MD: 'Maryland, US',
  MA: 'Massachusetts, US',
  MI: 'Michigan, US',
  MN: 'Minnesota, US',
  MS: 'Mississippi, US',
  MO: 'Missouri, US',
  MT: 'Montana, US',
  NE: 'Nebraska, US',
  NV: 'Nevada, US',
  NH: 'New Hampshire, US',
  NJ: 'New Jersey, US',
  NM: 'New Mexico, US',
  NY: 'New York, US',
  NC: 'North Carolina, US',
  ND: 'North Dakota, US',
  OH: 'Ohio, US',
  OK: 'Oklahoma, US',
  OR: 'Oregon, US',
  PA: 'Pennsylvania, US',
  RI: 'Rhode Island, US',
  SC: 'South Carolina, US',
  SD: 'South Dakota, US',
  TN: 'Tennessee, US',
  TX: 'Texas, US',
  UT: 'Utah, US',
  VT: 'Vermont, US',
  VA: 'Virginia, US',
  WA: 'Washington, US',
  WV: 'West Virginia, US',
  WI: 'Wisconsin, US',
  WY: 'Wyoming, US',
  DC: 'Washington DC, US',

  // Canadian Provinces
  ON: 'Ontario, CA',
  QC: 'Quebec, CA',
  BC: 'British Columbia, CA',
  AB: 'Alberta, CA',
  MB: 'Manitoba, CA',
  SK: 'Saskatchewan, CA',
  NS: 'Nova Scotia, CA',
  NB: 'New Brunswick, CA',
  NL: 'Newfoundland, CA',
  PE: 'Prince Edward Island, CA',
  NT: 'Northwest Territories, CA',
  YT: 'Yukon, CA',
  NU: 'Nunavut, CA',

  // Country Codes
  USA: 'United States',
  UK: 'United Kingdom',
  UAE: 'United Arab Emirates',
  JP: 'Japan',
  FR: 'France',
  DE: 'Germany',
  AU: 'Australia',
  NZ: 'New Zealand',
  IT: 'Italy',
  ES: 'Spain',
  MX: 'Mexico',
  BR: 'Brazil',
  IN: 'India',
  CN: 'China'
};

export const MAJOR_CITIES = {
  // US Cities
  'san francisco': 'San Francisco, CA, US',
  'los angeles': 'Los Angeles, CA, US',
  'san diego': 'San Diego, CA, US',
  'san jose': 'San Jose, CA, US',
  'san ramon': 'San Ramon, CA, US',
  'new york': 'New York, NY, US',
  chicago: 'Chicago, IL, US',
  houston: 'Houston, TX, US',
  phoenix: 'Phoenix, AZ, US',
  philadelphia: 'Philadelphia, PA, US',
  'san antonio': 'San Antonio, TX, US',
  dallas: 'Dallas, TX, US',
  austin: 'Austin, TX, US',
  seattle: 'Seattle, WA, US',
  boston: 'Boston, MA, US',
  miami: 'Miami, FL, US',

  // International Cities
  london: 'London, UK',
  paris: 'Paris, FR',
  tokyo: 'Tokyo, JP',
  sydney: 'Sydney, AU',
  toronto: 'Toronto, CA',
  vancouver: 'Vancouver, CA',
  berlin: 'Berlin, DE',
  madrid: 'Madrid, ES',
  rome: 'Rome, IT',
  amsterdam: 'Amsterdam, NL',
  dubai: 'Dubai, AE',
  singapore: 'Singapore, SG',
  'hong kong': 'Hong Kong, HK',
  mumbai: 'Mumbai, IN',
  beijing: 'Beijing, CN',
  shanghai: 'Shanghai, CN'
};

export function parseLocation(args) {
  if (!args || args.length === 0) return null;

  // Join all arguments, filtering out options
  const locationArgs = args.filter(
    (arg) =>
      !arg.startsWith('-') && !['metric', 'imperial', 'celsius', 'fahrenheit', 'auto'].includes(arg)
  );

  if (locationArgs.length === 0) return null;

  let location = locationArgs.join(' ').trim();

  // Check for state/country mapping (single argument like "CA")
  const upperLocation = location.toUpperCase();
  if (STATE_MAPPINGS[upperLocation]) {
    return STATE_MAPPINGS[upperLocation];
  }

  // Check for known city
  const lowerLocation = location.toLowerCase();
  if (MAJOR_CITIES[lowerLocation]) {
    return MAJOR_CITIES[lowerLocation];
  }

  // Intelligent parsing for "City State" format
  const parts = location.split(/\s+/);
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1].toUpperCase();

    // Check if last part is a state/country code
    if (STATE_MAPPINGS[lastPart]) {
      const cityParts = parts.slice(0, -1).join(' ');
      const mappedValue = STATE_MAPPINGS[lastPart];
      const countryCode = mappedValue.includes(', ') ? mappedValue.split(', ').pop() : 'US';
      return `${cityParts}, ${lastPart}, ${countryCode}`;
    }

    // Check if it's a 2-3 letter code (likely state/country)
    if (lastPart.length <= 3 && /^[A-Z]+$/.test(lastPart)) {
      const cityParts = parts.slice(0, -1).join(' ');
      return `${cityParts}, ${lastPart}`;
    }
  }

  // Handle formats with existing commas
  if (location.includes(',')) {
    // Clean up spacing around commas
    location = location.replace(/\s*,\s*/g, ', ');
  }

  return location;
}
