#!/bin/bash

echo "🚀 Starting Frontend Development Server..."
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Set environment variables
export NEXT_PUBLIC_API_URL="http://localhost:3001/api"
export NEXTAUTH_URL="http://localhost:3002"
export NEXTAUTH_SECRET="your-secret-key-here"

echo "🌐 Frontend will be available at: http://localhost:3002"
echo "🔗 API Backend should be running at: http://localhost:3001"
echo ""
echo "📋 Test Flow:"
echo "1. Go to http://localhost:3002/login"
echo "2. Click 'Use Test Credentials' button"
echo "3. Click 'Sign In'"
echo "4. You should see the dashboard with real API data"
echo ""
echo "🔧 Available test credentials:"
echo "   Email: testadmin@example.com"
echo "   Password: admin123"
echo ""

# Start the development server
npm run dev
