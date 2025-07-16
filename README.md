# Sol Vita Tracker 🌞

A modern, intelligent Vitamin D and UV exposure tracking app designed to help you maintain optimal health through smart sun exposure monitoring.

## 🌟 Features

### 📱 **Core Functionality**
- **Real-time UV Index Tracking** - Get current UV levels for your location
- **Vitamin D Production Calculator** - Personalized calculations based on your skin type and clothing
- **Daily Progress Tracking** - Monitor your daily Vitamin D intake goal (700 IU)
- **Location-Based Recommendations** - Get personalized sun exposure advice for your area
- **Smart Time Recommendations** - Find the best times for safe sun exposure

### 🎨 **User Experience**
- **Beautiful iOS-Inspired Design** - Clean, modern interface with smooth animations
- **Dark/Light Mode** - Automatic theme switching based on time of day
- **Responsive Design** - Works perfectly on mobile and desktop
- **Intuitive Navigation** - Easy-to-use interface with clear progress indicators

### 🔧 **Technical Features**
- **Geolocation Integration** - Automatic location detection for accurate UV data
- **Offline Capability** - Core features work without internet connection
- **Cross-Platform** - Built with Capacitor for iOS and Android compatibility
- **Performance Optimized** - Fast loading and smooth interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/markusortiz/sol-vita-tracker.git
   cd sol-vita-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Mobile Development

#### For iOS Testing (requires Mac)
```bash
npm run build:ios
npx cap open ios
```

#### For Android Testing
```bash
npm run build:android
npx cap open android
```

#### Cloud Build (No Mac Required)
Use [Ionic Appflow](https://ionic.io/appflow) to build and deploy to your device:
1. Push code to GitHub
2. Connect repo to Appflow
3. Build iOS/Android app in cloud
4. Install on device via download link

## 🏗️ Project Structure

```
sol-vita-tracker/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   └── ...             # Feature-specific components
│   ├── pages/              # App pages/routes
│   ├── styles/             # CSS and design system
│   └── content/            # Content and copy
├── ios/                    # iOS native code
├── android/                # Android native code
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Mobile**: Capacitor
- **State Management**: React Hooks
- **Icons**: Lucide React
- **Charts**: Recharts

## 📱 Mobile Features

### Location Services
- Automatic GPS detection
- UV index data for your exact location
- Weather integration for accurate recommendations

### Health Integration (Future)
- Apple Health integration planned
- Google Fit integration planned
- Export health data

### Native Features
- Haptic feedback
- Push notifications (planned)
- Background location updates (planned)

## 🎯 How It Works

1. **Location Detection**: App detects your current location
2. **UV Data Fetching**: Retrieves real-time UV index data
3. **Personalization**: Applies your skin type and clothing preferences
4. **Calculation**: Computes optimal sun exposure time
5. **Tracking**: Monitors your daily Vitamin D progress
6. **Recommendations**: Provides personalized advice

## 🚀 Deployment

### Web Deployment
```bash
npm run build
npm run preview
```

### Docker Deployment
```bash
# Development
npm run docker:dev

# Production
npm run docker:prod
```

### App Store Deployment
1. Build for iOS/Android
2. Submit to App Store/Google Play
3. Follow platform-specific guidelines

## 📊 Health Benefits

- **Vitamin D Optimization**: Maintain healthy Vitamin D levels
- **Skin Protection**: Avoid overexposure to harmful UV rays
- **Health Monitoring**: Track your sun exposure patterns
- **Scientific Accuracy**: Based on medical research and UV science

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- UV data provided by weather APIs
- Vitamin D calculations based on scientific research
- Design inspired by modern iOS principles
- Built with love for health and wellness

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/markusortiz/sol-vita-tracker/issues)
- **Documentation**: Check the `/docs` folder
- **Email**: [Your email here]

---

**Made with ❤️ for better health through smart technology**
