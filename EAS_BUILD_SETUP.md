# EAS Build Setup Guide for Solarin UV Tracker

## Prerequisites
1. Node.js 18+ installed
2. NPM or Yarn package manager
3. Expo account (free at https://expo.dev)

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Install EAS CLI Globally
```bash
npm install -g @expo/cli
```

### 3. Login to Expo
```bash
npx expo login
```

### 4. Initialize EAS Project
```bash
npx eas init
```
This will:
- Create a project on Expo's servers
- Update your `app.json` with the project ID

### 5. Configure Credentials

#### For iOS:
```bash
npx eas credentials
```
Select:
- iOS
- Build credentials
- Set up new credentials

#### For Android:
```bash
npx eas credentials
```
Select:
- Android
- Build credentials
- Set up new keystore

### 6. Build Your App

#### Build for iOS (App Store):
```bash
npx eas build --platform ios --profile production
```

#### Build for Android (Play Store):
```bash
npx eas build --platform android --profile production
```

#### Build for Testing:
```bash
# iOS TestFlight
npx eas build --platform ios --profile preview

# Android Internal Testing
npx eas build --platform android --profile preview
```

### 7. Submit to App Stores

#### Submit to iOS App Store:
```bash
npx eas submit --platform ios
```

#### Submit to Google Play Store:
```bash
npx eas submit --platform android
```

## Build Profiles Explained

- **development**: For internal development with development client
- **preview**: For internal testing (TestFlight, Internal Testing)
- **production**: For app store releases

## Important Notes

1. **First Build**: The first build might take 20-30 minutes as it sets up the environment
2. **Subsequent Builds**: Usually take 5-15 minutes
3. **Credits**: Free tier includes limited builds per month. Check pricing at expo.dev
4. **Assets**: Make sure your app icons and splash screens are properly sized
5. **Bundle ID**: The bundle identifier `com.solarin.uvtracker` is already configured

## Troubleshooting

### Common Issues:
1. **Build Fails**: Check the build logs in the Expo dashboard
2. **Credentials Issues**: Re-run `npx eas credentials` to regenerate
3. **Asset Errors**: Ensure all referenced assets exist in the correct paths

### Getting Help:
- Expo Documentation: https://docs.expo.dev/build/introduction/
- Expo Discord: https://chat.expo.dev/
- Stack Overflow: Tag questions with 'expo' and 'eas-build'

## Next Steps After First Build

1. Test your app thoroughly on real devices
2. Set up automatic builds on code changes
3. Configure environment variables for different builds
4. Set up continuous integration/deployment

## Cost Considerations

- **Free Tier**: Limited builds per month
- **Paid Plans**: Unlimited builds, faster build times, priority support
- **Pricing**: Check current pricing at https://expo.dev/pricing

Your app is now ready to be built and published using EAS Build! 🚀 