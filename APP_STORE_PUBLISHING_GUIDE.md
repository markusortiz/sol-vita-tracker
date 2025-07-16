# App Store Publishing Guide for Sol Vita Tracker

## Prerequisites

1. **Apple Developer Account** ($99/year)
2. **Xcode** (latest version)
3. **EAS CLI** installed globally: `npm install -g @expo/eas-cli`
4. **App Store Connect** access

## Step 1: Setup EAS Project

```bash
# Login to Expo
eas login

# Configure EAS project
eas build:configure

# Update eas.json with your project ID
```

## Step 2: Build for iOS

```bash
# Build for iOS App Store
eas build --platform ios --profile production

# Or build locally (requires Xcode)
eas build --platform ios --profile production --local
```

## Step 3: Submit to App Store

```bash
# Submit the build to App Store Connect
eas submit --platform ios --latest
```

## Step 4: App Store Connect Setup

### Required Information:

1. **App Name**: "Sol Vita Tracker"
2. **Subtitle**: "Vitamin D & UV Exposure Tracker"
3. **Description**: 
   ```
   Track your daily Vitamin D intake and UV exposure for optimal health. 
   Get personalized recommendations based on your location and skin type.
   
   Features:
   • Daily UV index tracking
   • Vitamin D intake logging
   • Personalized sun exposure recommendations
   • Health insights and analytics
   • Location-based weather integration
   ```

4. **Keywords**: vitamin d, uv tracker, health, wellness, sunlight, sun exposure
5. **Category**: Health & Fitness
6. **Age Rating**: 4+ (No objectionable content)

### Screenshots Required:
- iPhone 6.7" (iPhone 14 Pro Max)
- iPhone 6.5" (iPhone 11 Pro Max)
- iPhone 5.5" (iPhone 8 Plus)
- iPad Pro 12.9" (6th generation)
- iPad Pro 12.9" (2nd generation)

## Step 5: App Review Process

1. **Submit for Review** in App Store Connect
2. **Wait 24-48 hours** for review
3. **Address any issues** if rejected
4. **Release to App Store** when approved

## Common Issues & Solutions

### Privacy Policy Required
- Create a privacy policy at `https://yourdomain.com/privacy`
- Add to App Store Connect

### Location Permissions
- Ensure location usage description is clear
- Update Info.plist if needed

### App Icon Requirements
- 1024x1024 PNG format
- No transparency
- No rounded corners (Apple adds them)

## Version Management

```bash
# Update version in app.json
# Build new version
eas build --platform ios --profile production

# Submit new version
eas submit --platform ios --latest
```

## Useful Commands

```bash
# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]

# Download build
eas build:download [BUILD_ID]

# Local development
npm run build:ios
npx cap open ios
``` 