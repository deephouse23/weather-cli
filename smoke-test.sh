#!/bin/bash
# smoke-test.sh

echo "🧪 Weather CLI v0.3.0 Smoke Test"
echo "================================"

# Test validators
echo -e "\n✅ Running validator tests..."
node test-validators.js

# Test error handling
echo -e "\n❌ Testing error handling..."
echo "Testing invalid location format..."
node index.js "InvalidLocation" 2>&1 | grep -q "Invalid location format" && echo "✅ Location validation working"

echo "Testing invalid coordinates..."
node index.js coords "invalid,coords" 2>&1 | grep -q "must be numbers" && echo "✅ Coordinate validation working"

# Test auth commands (will fail without API key, but shouldn't crash)
echo -e "\n🔑 Testing auth commands..."
node index.js auth test 2>&1 | grep -q "Invalid API key" && echo "✅ Auth test command working"

# Test help
echo -e "\n📖 Testing help..."
node index.js --help | grep -q "weather" && echo "✅ Help command working"

# Test version
echo -e "\n📦 Testing version..."
node index.js --version | grep -q "0.3.0" && echo "✅ Version command working"

echo -e "\n🎉 Smoke test complete!"
echo "Note: To fully test weather functionality, run 'weather auth set' with a valid API key"