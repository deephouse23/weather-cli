# Weather CLI v0.3.1 - Better Search

## Release Date: 2025

## What's New in v0.3.1

### 🔍 Enhanced Location Search
- **Smart location parsing**: Now automatically tries multiple search formats when a location isn't found
- **Better error handling**: Provides helpful suggestions when a location can't be found
- **Support for multiple formats**:
  - City names: "San Ramon"
  - City, State: "San Ramon, CA"
  - City, Country: "San Ramon, USA"
  - Zip codes: "94583"
  - UK postcodes: "SW1A 1AA"

### 🎯 Key Improvements

1. **Flexible Search Algorithm**
   - Automatically tries multiple location formats
   - Falls back to different country codes (US, USA)
   - Handles state abbreviations and full state names
   - Shows which search attempts were made

2. **Better Error Messages**
   - Shows all attempted search queries
   - Provides specific suggestions for fixing location format
   - Clear guidance on supported formats

3. **Version Update**
   - Updated version to 0.3.1 in both index.js and package.json
   - Updated beta banner to show correct version

## Examples

### Before (v0.3.0)
```bash
weather "San Ramon, CA"
❌ Location "San Ramon, CA" not found. Please check the spelling.
```

### After (v0.3.1)
```bash
weather "San Ramon, CA"
Trying: San Ramon, CA...
Trying: San Ramon...
Trying: San Ramon, USA...
Found: San Ramon, US
[Weather displays successfully]
```

## Technical Details

### Files Modified
- `index.js`: Added enhanced location parsing and multi-query support
- `package.json`: Updated version to 0.3.1

### New Functions
- `parseLocation()`: Intelligently parses location input into multiple search formats
- `tryMultipleQueries()`: Attempts multiple API calls with different formats until one succeeds

## Testing Commands

Test the improved search with these commands:
```bash
# Should all work now:
weather "San Ramon, CA"
weather "San Ramon"
weather "94583"
weather San Ramon
weather "London, UK"
weather "Tokyo"
```

## Installation

To use the updated version:
```bash
# In the project directory
npm link

# Or install globally from GitHub
npm install -g git+https://github.com/deephouse23/weather-cli.git#v0.3.1
```

## Future Improvements
- Add geocoding API for even better location resolution
- Support for more international postal codes
- Location autocomplete suggestions
