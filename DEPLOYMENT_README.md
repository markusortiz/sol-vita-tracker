# Sol Vita Tracker - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 20+ (for local development)
- EAS CLI (for App Store deployment)

### Local Development with Docker
```bash
# Start development environment
npm run docker:dev

# Or manually
docker-compose --profile dev up -d
```

### Production Deployment
```bash
# Deploy to production
npm run docker:prod

# Or manually
docker-compose --profile prod up -d
```

## 📱 App Store Deployment

### 1. Setup EAS Project
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

### 2. Build for iOS
```bash
# Build for App Store
npm run eas:build:ios

# Or manually
eas build --platform ios --profile production
```

### 3. Submit to App Store
```bash
# Submit latest build
npm run eas:submit:ios

# Or manually
eas submit --platform ios --latest
```

## 🐳 Docker Commands

### Development
```bash
# Start development environment
docker-compose --profile dev up -d

# View logs
docker-compose --profile dev logs -f

# Stop development
docker-compose --profile dev down

# Rebuild and start
docker-compose --profile dev up --build
```

### Production
```bash
# Start production environment
docker-compose --profile prod up -d

# View logs
docker-compose --profile prod logs -f

# Stop production
docker-compose --profile prod down

# Rebuild and start
docker-compose --profile prod up --build
```

### Manual Docker Commands
```bash
# Build image
docker build -t sol-vita-tracker:latest .

# Run container
docker run -p 80:80 sol-vita-tracker:latest

# View running containers
docker ps

# Stop all containers
docker stop $(docker ps -q)
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file for local development:
```env
NODE_ENV=development
VITE_API_URL=http://localhost:3000
```

### App Configuration
- **App ID**: `com.solarin.uvtracker`
- **App Name**: `Sol Vita Tracker`
- **Version**: `1.0.0`

## 📋 Deployment Checklist

### Before App Store Submission
- [ ] App icon (1024x1024 PNG)
- [ ] Screenshots for all device sizes
- [ ] App description and keywords
- [ ] Privacy policy URL
- [ ] Location permissions configured
- [ ] App tested on real devices
- [ ] Build version incremented

### Before Production Deployment
- [ ] Docker image builds successfully
- [ ] Health check endpoint working
- [ ] Environment variables configured
- [ ] SSL certificate (if using HTTPS)
- [ ] Domain configured (if applicable)
- [ ] Monitoring/logging setup

## 🛠️ Troubleshooting

### Common Issues

#### Docker Issues
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t sol-vita-tracker:latest .
```

#### EAS Build Issues
```bash
# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]

# Clear EAS cache
eas build:clear
```

#### iOS Build Issues
```bash
# Clean iOS build
cd ios/App
xcodebuild clean

# Reset iOS simulator
xcrun simctl erase all
```

## 📊 Monitoring

### Health Check
- **Endpoint**: `http://localhost/health`
- **Expected Response**: `healthy`

### Logs
```bash
# View application logs
docker-compose logs -f

# View nginx logs
docker exec -it [container_id] tail -f /var/log/nginx/access.log
```

## 🔒 Security

### Production Security Checklist
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Environment variables secured
- [ ] No sensitive data in logs
- [ ] Regular security updates

### App Store Security
- [ ] Privacy policy implemented
- [ ] Data collection disclosed
- [ ] Permissions justified
- [ ] No hardcoded secrets

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale production service
docker-compose --profile prod up -d --scale app-prod=3
```

### Load Balancer Configuration
Add a load balancer (nginx, traefik, etc.) in front of multiple containers.

## 🎯 Next Steps

1. **Set up CI/CD pipeline** (GitHub Actions, GitLab CI, etc.)
2. **Configure monitoring** (Sentry, LogRocket, etc.)
3. **Set up analytics** (Google Analytics, Mixpanel, etc.)
4. **Implement A/B testing**
5. **Set up automated testing**

## 📞 Support

For deployment issues:
1. Check the logs: `docker-compose logs`
2. Verify configuration files
3. Test locally first
4. Check App Store Connect for submission issues

---

**Happy Deploying! 🚀** 