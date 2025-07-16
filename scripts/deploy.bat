@echo off
echo 🚀 Starting Sol Vita Tracker deployment...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Build the production image
echo 📦 Building production Docker image...
docker build -t sol-vita-tracker:latest .

REM Stop existing containers
echo 🛑 Stopping existing containers...
docker-compose --profile prod down 2>nul

REM Start production containers
echo ▶️ Starting production containers...
docker-compose --profile prod up -d

REM Wait for container to be ready
echo ⏳ Waiting for container to be ready...
timeout /t 10 /nobreak >nul

REM Check if container is running
docker-compose --profile prod ps | findstr "Up" >nul
if errorlevel 1 (
    echo ❌ Deployment failed. Check logs with: docker-compose --profile prod logs
    exit /b 1
) else (
    echo ✅ Deployment successful!
    echo 🌐 App is running at: http://localhost
    echo 🏥 Health check: http://localhost/health
)

echo 🎉 Sol Vita Tracker is now live! 