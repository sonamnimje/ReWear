#!/bin/bash

# ReWear Setup Script
# This script helps you set up the ReWear project

echo "🚀 Welcome to ReWear Setup!"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher first."
    echo "Visit: https://python.org/"
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Backend Setup
echo ""
echo "📦 Setting up Backend..."
echo "========================"

cd backend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your configuration"
fi

echo "✅ Backend setup complete!"
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
echo "========================="

cd ../frontend

# Install React dependencies
echo "Installing React dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

# Return to root
cd ..

echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start the Backend:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "2. Start the Frontend (in a new terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Open your browser and go to:"
echo "   http://localhost:3000"
echo ""
echo "📚 For more information, check the README.md file"
echo ""
echo "Happy coding! 🌱" 