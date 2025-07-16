@echo off
echo 🔧 Starting Sol Vita Tracker development environment...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Stop existing containers
echo 🛑 Stopping existing containers...
docker-compose --profile dev down 2>nul

REM Start development containers
echo ▶️ Starting development containers...
docker-compose --profile dev up -d

REM Wait for container to be ready
echo ⏳ Waiting for development server to be ready...
timeout /t 15 /nobreak >nul

REM Check if container is running
docker-compose --profile dev ps | findstr "Up" >nul
if errorlevel 1 (
    echo ❌ Development environment failed to start. Check logs with: docker-compose --profile dev logs
    exit /b 1
) else (
    echo ✅ Development environment ready!
    echo 🌐 App is running at: http://localhost:3000
    echo 📝 Hot reload is enabled
    echo.
    echo 📋 Useful commands:
    echo   View logs: docker-compose --profile dev logs -f
    echo   Stop dev: docker-compose --profile dev down
    echo   Rebuild: docker-compose --profile dev up --build
)

echo 🎉 Happy coding! 