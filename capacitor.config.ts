import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3a7f9c66449049cd92378f0011ff87a8',
  appName: 'VitaD Tracker',
  webDir: 'dist',
  server: {
    url: 'https://3a7f9c66-4490-49cd-9237-8f0011ff87a8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Geolocation: {
      permissions: ["location"]
    }
  }
};

export default config;