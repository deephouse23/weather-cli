# Weather CLI v0.0.24 🌤️

![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-0.0.24-orange)
![16bitweather](https://img.shields.io/badge/16bitweather-weather_suite-brightgreen)
![Beta](https://img.shields.io/badge/status-beta-yellow.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)

Part of the 16bitweather suite of weather tools

A beautiful command-line weather application with **horizontal layout**, **responsive design**, and **enhanced features** for any location.

**✨ Now with simplified global installation! Just type `weather "City, State"` from anywhere on your system.**

## 🆕 **What's New in v0.0.24**

### 🎨 **Horizontal Layout**
- **Responsive design** that adapts to your terminal width
- **Beautiful horizontal display** with city/state prominently shown
- **Enhanced visual hierarchy** with emojis and color coding
- **Automatic layout adjustment** for different terminal sizes

### 🏙️ **City, State Requirement**
- **Required format**: `"City, State"` or `"City, Country"`
- **Enhanced location display**: City name in cyan, state/country in yellow
- **Better accuracy**: Reduces location ambiguity
- **Clear error messages**: Helpful guidance when format is incorrect

### 🏗️ **Modular Architecture**
- **Split from 920-line file** into 4 focused modules
- **Better maintainability** and testability
- **Enhanced caching** with 30-minute expiration
- **Security improvements** with updated dependencies

### 🔒 **Security Enhancements**
- **Proper .env management** with gitignore protection
- **API key validation** and secure error handling
- **Updated dependencies** with security fixes
- **Clean documentation** with no exposed secrets

## 🚀 **Quick Start**

### **Installation**
```bash
# Global installation
npm install -g weather-cli

# Or clone and install locally
git clone https://github.com/deephouse23/weather-cli.git
cd weather-cli
npm install
```

### **Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your OpenWeatherMap API key
# Get your free API key at: https://openweathermap.org/api
```

### **Usage**
```bash
# Basic weather lookup (NEW FORMAT REQUIRED)
weather "New York, US"
weather "London, UK"
weather "Tokyo, JP"

# Cache management
weather cache
weather cache --clean

# Help system
weather --help
```

## 🎨 **New Horizontal Layout**

### **Large Terminal Display**
```
╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                                      │
│   ☀️  San Ramon, US                                    🌅 Sunrise: 06:16 AM                                           │
│   clear sky                                           🌇 Sunset: 08:10 PM                                            │
│   🌡️  82°F                                           ⚠️  Air Quality: Good (AQI: 1)                                  │
│   💭 Feels like: 82°F                                 🌡️  Min: 73°F                                                  │
│   💧 Humidity: 44%                                    🌡️  Max: 88°F                                                  │
│   📊 Pressure: 1015 hPa                               🧭 Wind Dir: 247°                                              │
│   💨 Wind: 5.99 mph                                   👁️  Visibility: 10km                                           │
│                                                                                                                      │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

### **Responsive Design**
- **Large terminals** (>120 chars): Full horizontal layout with all details
- **Medium terminals** (80-120 chars): Medium layout with basic sections
- **Small terminals** (<80 chars): Compact layout with combined info

## 📋 **Required Format**

### **✅ Correct Usage**
```bash
weather "San Ramon, US"      # City, Country
weather "New York, US"       # City, Country  
weather "London, UK"         # City, Country
weather "Tokyo, JP"          # City, Country
weather "Paris, FR"          # City, Country
```

### **❌ Invalid Usage**
```bash
weather "San Ramon"          # Missing state/country
weather "New York"           # Missing state/country
weather "London"             # Missing state/country
```

## 🛠️ **Features**

### **🌤️ Weather Information**
- **Current weather** with detailed conditions
- **Temperature** with feels-like and min/max
- **Humidity, pressure, and wind** data
- **Sunrise and sunset** times
- **Air quality** with AQI ratings

### **🎨 Enhanced Display**
- **Horizontal layout** that fits your terminal
- **Responsive design** for any screen size
- **Color-coded information** with emojis
- **Prominent location display** with city/state highlighting

### **📦 Smart Caching**
- **30-minute cache expiration** for fresh data
- **Cache statistics** and cleanup tools
- **Automatic cache management** with expiration
- **Cache hit performance** optimization

### **🔒 Security Features**
- **Environment variable protection** with .gitignore
- **API key validation** and secure error handling
- **Updated dependencies** with security fixes
- **Clean error messages** without exposing secrets

## 🏗️ **Architecture**

### **Modular Structure**
```
src/
├── weather.js      # API calls and weather logic
├── cache.js        # Caching with expiration
├── display.js      # UI formatting and output
└── config.js       # Configuration management
```

### **Performance Improvements**
- **Reduced API calls** with intelligent caching
- **Better error handling** with informative messages
- **Responsive design** that adapts to terminal size
- **Enhanced user experience** with clear requirements

## 📊 **Installation Options**

### **Global Installation (Recommended)**
```bash
npm install -g weather-cli
weather "New York, US"
```

### **Local Development**
```bash
git clone https://github.com/deephouse23/weather-cli.git
cd weather-cli
npm install
cp .env.example .env
# Edit .env with your API key
node index.js "New York, US"
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
# .env file
WEATHER_API_KEY=your_openweathermap_api_key_here
```

### **Cache Management**
```bash
# View cache statistics
weather cache

# Clean expired entries
weather cache --clean

# Clear all cache
weather cache --clear
```

## 🧪 **Testing**

### **Module Tests**
```bash
# Test all modules
node test-modules.js

# Test basic functionality
node test-basic.js

# Test responsive design
node test-responsive.js
```

### **Performance Tests**
```bash
# Run performance benchmarks
node test-performance.js
```

## 📈 **Performance**

### **Before vs After**
- **Modular structure**: Split from 920-line file to 4 focused modules
- **Enhanced caching**: 30-minute expiration with cleanup
- **Security fixes**: Updated vulnerable dependencies
- **Better UX**: Clear requirements and helpful error messages

## 🎯 **Use Cases**

### **Daily Weather Check**
```bash
weather "San Francisco, US"
weather "London, UK"
weather "Tokyo, JP"
```

### **Travel Planning**
```bash
weather "Paris, FR"
weather "Sydney, AU"
weather "Toronto, CA"
```

### **Cache Management**
```bash
weather cache          # Check cache status
weather cache --clean  # Clean expired entries
```

## 🚀 **Development**

### **Prerequisites**
- Node.js (v14 or higher)
- npm
- OpenWeatherMap API key

### **Setup**
```bash
# Clone repository
git clone https://github.com/deephouse23/weather-cli.git
cd weather-cli

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API key

# Test installation
node index.js "New York, US"
```

## 🤝 **Contributing**

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### **Development Setup**
```bash
git clone https://github.com/deephouse23/weather-cli.git
cd weather-cli
npm install
cp .env.example .env
# Add your API key to .env
```

## 📝 **Changelog**

### **v0.0.24** (Latest)
- ✨ **NEW**: Horizontal layout with responsive design
- ✨ **NEW**: City, State format requirement
- ✨ **NEW**: Modular architecture (4 focused modules)
- ✨ **NEW**: Enhanced caching with expiration
- 🔒 **SECURITY**: Updated dependencies and API key protection
- 🎨 **UI**: Enhanced visual hierarchy with emojis
- 📊 **PERFORMANCE**: Reduced API calls and better caching
- 🛠️ **DEVELOPMENT**: Better error handling and validation

### **Previous Versions**
- v0.0.23: Security improvements
- v0.0.22: Initial beta release

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details. Created by 16bitweather.

## 👨‍💻 **Author**

16bitweather

## 🌐 **Links**

- **Homepage**: [16bitweather.co](https://16bitweather.co)
- **Repository**: [GitHub](https://github.com/deephouse23/weather-cli)
- **Issues**: [GitHub Issues](https://github.com/deephouse23/weather-cli/issues)
- **API**: [OpenWeatherMap](https://openweathermap.org/api)

---

**Part of the 16bitweather suite of weather tools** 🌤️