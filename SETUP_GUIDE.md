# Sol Vita Tracker - Complete Setup Guide

## 🛠️ Prerequisites Installation

### 1. Install Docker Desktop for Windows

1. **Download Docker Desktop**
   - Go to [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
   - Download the installer for Windows

2. **Install Docker Desktop**
   - Run the installer as Administrator
   - Follow the installation wizard
   - Restart your computer when prompted

3. **Verify Installation**
   ```powershell
   docker --version
   docker-compose --version
   ```

4. **Start Docker Desktop**
   - Launch Docker Desktop from Start Menu
   - Wait for Docker to start (whale icon in system tray)

### 2. Install Node.js (if not already installed)

1. **Download Node.js**
   - Go to [Node.js Downloads](https://nodejs.org/)
   - Download LTS version (20.x or later)

2. **Install Node.js**
   - Run the installer
   - Follow the installation wizard

3. **Verify Installation**
   ```powershell
   node --version
   npm --version
   ```

### 3. Install EAS CLI (for App Store deployment)

```powershell
npm install -g @expo/eas-cli
```

## 🚀 Quick Start

### Option 1: Local Development (No Docker)

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Option 2: Docker Development

```powershell
# Start development environment with Docker
npm run docker:dev

# Or manually
docker-compose --profile dev up -d
```

### Option 3: Docker Production

```powershell
# Deploy to production with Docker
npm run docker:prod

# Or manually
docker-compose --profile prod up -d
```

## 📱 App Store Deployment Setup

### 1. Apple Developer Account
- Sign up for [Apple Developer Program](https://developer.apple.com/) ($99/year)
- Access [App Store Connect](https://appstoreconnect.apple.com/)

### 2. Configure EAS Project

```powershell
# Login to Expo
eas login

# Configure EAS project
eas build:configure

# Update eas.json with your project ID
```

### 3. Build for iOS

```powershell
# Build for App Store
npm run eas:build:ios

# Or manually
eas build --platform ios --profile production
```

### 4. Submit to App Store

```powershell
# Submit latest build
npm run eas:submit:ios

# Or manually
eas submit --platform ios --latest
```

## 🔧 Configuration Files

### App Configuration
- **`app.json`**: Expo configuration
- **`capacitor.config.ts`**: Capacitor configuration
- **`eas.json`**: EAS build configuration

### Docker Configuration
- **`Dockerfile`**: Multi-stage build configuration
- **`docker-compose.yml`**: Container orchestration
- **`nginx.conf`**: Web server configuration

## 📋 Pre-App Store Checklist

### Required Assets
- [ ] App icon (1024x1024 PNG)
- [ ] Screenshots for all device sizes:
  - iPhone 6.7" (iPhone 14 Pro Max)
  - iPhone 6.5" (iPhone 11 Pro Max)
  - iPhone 5.5" (iPhone 8 Plus)
  - iPad Pro 12.9" (6th generation)
  - iPad Pro 12.9" (2nd generation)

### App Store Connect Information
- [ ] App name: "Sol Vita Tracker"
- [ ] Subtitle: "Vitamin D & UV Exposure Tracker"
- [ ] Description (see APP_STORE_PUBLISHING_GUIDE.md)
- [ ] Keywords: vitamin d, uv tracker, health, wellness, sunlight
- [ ] Category: Health & Fitness
- [ ] Age Rating: 4+
- [ ] Privacy Policy URL

### Technical Requirements
- [ ] Location permissions configured
- [ ] App tested on real devices
- [ ] Build version incremented
- [ ] No hardcoded secrets
- [ ] Privacy policy implemented

## 🐳 Docker Commands Reference

### Development
```powershell
# Start development
docker-compose --profile dev up -d

# View logs
docker-compose --profile dev logs -f

# Stop development
docker-compose --profile dev down

# Rebuild
docker-compose --profile dev up --build
```

### Production
```powershell
# Start production
docker-compose --profile prod up -d

# View logs
docker-compose --profile prod logs -f

# Stop production
docker-compose --profile prod down

# Rebuild
docker-compose --profile prod up --build
```

### Manual Docker Commands
```powershell
# Build image
docker build -t sol-vita-tracker:latest .

# Run container
docker run -p 80:80 sol-vita-tracker:latest

# View running containers
docker ps

# Stop all containers
docker stop $(docker ps -q)
```

## 🛠️ Troubleshooting

### Docker Issues
```powershell
# Check Docker status
docker info

# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t sol-vita-tracker:latest .
```

### EAS Build Issues
```powershell
# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]

# Clear EAS cache
eas build:clear
```

### Common Windows Issues
1. **Docker not starting**: Enable WSL 2 and virtualization in BIOS
2. **Permission errors**: Run PowerShell as Administrator
3. **Path issues**: Ensure Docker Desktop is in PATH

## 📊 Monitoring & Health Checks

### Health Check Endpoint
- **URL**: `http://localhost/health`
- **Expected Response**: `healthy`

### Logs
```powershell
# View application logs
docker-compose logs -f

# View nginx logs
docker exec -it [container_id] tail -f /var/log/nginx/access.log
```

## 🔒 Security Checklist

### Production Security
- [ ] HTTPS enabled (if using domain)
- [ ] Security headers configured
- [ ] Environment variables secured
- [ ] No sensitive data in logs
- [ ] Regular security updates

### App Store Security
- [ ] Privacy policy implemented
- [ ] Data collection disclosed
- [ ] Permissions justified
- [ ] No hardcoded secrets

## 🎯 Next Steps

1. **Install Docker Desktop** (if not done)
2. **Test local development** with `npm run dev`
3. **Test Docker setup** with `npm run docker:dev`
4. **Configure EAS project** for App Store deployment
5. **Prepare App Store assets** (icons, screenshots, descriptions)
6. **Build and submit** to App Store

## 📞 Support

### Getting Help
1. Check the logs: `docker-compose logs`
2. Verify configuration files
3. Test locally first
4. Check App Store Connect for submission issues

### Useful Resources
- [Docker Desktop Documentation](https://docs.docker.com/desktop/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

---

**Ready to deploy! 🚀** 