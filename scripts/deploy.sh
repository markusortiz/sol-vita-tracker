#!/bin/bash

# Sol Vita Tracker Deployment Script
set -e

echo "🚀 Starting Sol Vita Tracker deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the production image
echo "📦 Building production Docker image..."
docker build -t sol-vita-tracker:latest .

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose --profile prod down || true

# Start production containers
echo "▶️ Starting production containers..."
docker-compose --profile prod up -d

# Wait for container to be ready
echo "⏳ Waiting for container to be ready..."
sleep 10

# Check if container is running
if docker-compose --profile prod ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo "🌐 App is running at: http://localhost"
    echo "🏥 Health check: http://localhost/health"
else
    echo "❌ Deployment failed. Check logs with: docker-compose --profile prod logs"
    exit 1
fi

echo "🎉 Sol Vita Tracker is now live!" 