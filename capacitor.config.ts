import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.vitad.tracker',
  appName: 'VitaD Tracker',
  webDir: 'dist',
  server: {
    url: 'https://3a7f9c66-4490-49cd-9237-8f0011ff87a8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#F8F8F8'
  },
  plugins: {
    Geolocation: {
      permissions: ["location"]
    },
    Haptics: {
      enable: true
    }
  }
};

export default config;