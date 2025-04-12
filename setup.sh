#!/bin/bash

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p logs

# Start MongoDB (if not already running)
echo "Checking MongoDB status..."
if ! mongod --version > /dev/null 2>&1; then
    echo "MongoDB is not installed. Please install MongoDB first."
    exit 1
fi

# Start the application
echo "Starting the application..."
echo "1. Start MongoDB service"
echo "2. In a new terminal, run: npm run dev"
echo "3. In another terminal, run: cd frontend && npm start"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000" 