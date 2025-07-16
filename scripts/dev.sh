#!/bin/bash

# Sol Vita Tracker Development Script
set -e

echo "🔧 Starting Sol Vita Tracker development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose --profile dev down || true

# Start development containers
echo "▶️ Starting development containers..."
docker-compose --profile dev up -d

# Wait for container to be ready
echo "⏳ Waiting for development server to be ready..."
sleep 15

# Check if container is running
if docker-compose --profile dev ps | grep -q "Up"; then
    echo "✅ Development environment ready!"
    echo "🌐 App is running at: http://localhost:3000"
    echo "📝 Hot reload is enabled"
    echo ""
    echo "📋 Useful commands:"
    echo "  View logs: docker-compose --profile dev logs -f"
    echo "  Stop dev: docker-compose --profile dev down"
    echo "  Rebuild: docker-compose --profile dev up --build"
else
    echo "❌ Development environment failed to start. Check logs with: docker-compose --profile dev logs"
    exit 1
fi

echo "🎉 Happy coding!" 