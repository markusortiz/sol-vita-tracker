import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Sun, 
  MapPin, 
  Play,
  Pause,
  Square,
  Cloud,
  Sunrise,
  Sunset
} from 'lucide-react';

interface SessionData {
  isActive: boolean;
  startTime: Date | null;
  duration: number; // em segundos
  totalIU: number;
}

interface WeatherData {
  uvIndex: number;
  maxUVI: number;
  sunrise: string;
  sunset: string;
  clouds: number;
  location: string;
  burnTime: string;
}

interface UVApiResponse {
  ok: boolean;
  latitude: number;
  longitude: number;
  now: {
    time: string;
    uvi: number;
  };
  forecast?: Array<{
    time: string;
    uvi: number;
  }>;
  message?: string;
}

interface UserSettings {
  skinType: 'very-light' | 'light' | 'medium' | 'dark' | 'very-dark';
  clothingCoverage: 'minimal' | 'partial' | 'full';
}

// Enhanced calculation constants
const SKIN_TYPE_MULTIPLIERS = {
  'very-light': 1.0,    // Burns easily, tans minimally
  'light': 1.2,         // Burns easily, tans gradually
  'medium': 1.5,        // Burns moderately, tans gradually
  'dark': 2.0,          // Burns minimally, tans well
  'very-dark': 2.5      // Rarely burns, tans profusely
};

const CLOTHING_COVERAGE_FACTORS = {
  'minimal': 1.0,       // Bikini/swimsuit - maximum exposure
  'partial': 0.6,       // T-shirt and shorts - moderate exposure
  'full': 0.2          // Long sleeves and pants - minimal exposure
};

// Base IU per minute rates at different UV levels
const BASE_IU_RATES = {
  0: 0,    // No UV
  1: 50,   // Very low
  2: 100,  // Low
  3: 150,  // Low-moderate
  4: 200,  // Moderate
  5: 250,  // Moderate-high
  6: 300,  // High
  7: 350,  // High
  8: 400,  // Very high
  9: 450,  // Very high
  10: 500, // Extreme
  11: 550  // Extreme+
};

const DAILY_GOAL_IU = 700; // Daily vitamin D goal

const UVTracker = () => {
  const [session, setSession] = useState<SessionData>({
    isActive: false,
    startTime: null,
    duration: 0,
    totalIU: 0
  });

  const [weather, setWeather] = useState<WeatherData>({
    uvIndex: 0.0,
    maxUVI: 0.0,
    sunrise: "07:21",
    sunset: "17:46",
    clouds: 0,
    location: "Detectando localização...",
    burnTime: "Calculando..."
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    skinType: 'light',
    clothingCoverage: 'minimal'
  });

  const [dailyTotal, setDailyTotal] = useState(113);
  const [currentPotential, setCurrentPotential] = useState(0);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Time-based background detection
  const [isNightTime, setIsNightTime] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  useEffect(() => {
    const checkTimeOfDay = () => {
      const hour = new Date().getHours();
      // Consider night time from 7 PM to 6 AM
      const isNight = hour >= 19 || hour < 6;
      setIsNightTime(isNight);
    };

    checkTimeOfDay();
    // Update every minute
    const interval = setInterval(checkTimeOfDay, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const { toast } = useToast();

  // Enhanced IU calculation based on UV, skin type, and clothing
  const calculateIUPerMinute = (uvIndex: number, skinType: string, clothingCoverage: string): number => {
    if (uvIndex <= 0) return 0;
    
    // Get base rate for UV level
    const uvLevel = Math.min(Math.floor(uvIndex), 11);
    const baseRate = BASE_IU_RATES[uvLevel] || 0;
    
    // Apply skin type multiplier (darker skin needs more exposure)
    const skinMultiplier = SKIN_TYPE_MULTIPLIERS[skinType as keyof typeof SKIN_TYPE_MULTIPLIERS] || 1.0;
    
    // Apply clothing coverage factor (more clothing = less exposure)
    const clothingFactor = CLOTHING_COVERAGE_FACTORS[clothingCoverage as keyof typeof CLOTHING_COVERAGE_FACTORS] || 1.0;
    
    // Final calculation
    const iuPerMinute = (baseRate * clothingFactor) / skinMultiplier;
    
    return Math.round(iuPerMinute);
  };

  // Update potential whenever UV or settings change
  useEffect(() => {
    const newPotential = calculateIUPerMinute(weather.uvIndex, userSettings.skinType, userSettings.clothingCoverage);
    setCurrentPotential(newPotential);
  }, [weather.uvIndex, userSettings.skinType, userSettings.clothingCoverage]);

  // Timer para sessão ativa
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (session.isActive && session.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - session.startTime!.getTime()) / 1000);
        const iuGain = Math.floor(duration * (currentPotential / 60)); // IU por minuto baseado no potencial
        
        setSession(prev => ({
          ...prev,
          duration,
          totalIU: iuGain
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session.isActive, session.startTime, currentPotential]);

  // Initialize with geolocation and real UV data
  useEffect(() => {
    console.log('🚀 UVTracker iniciado - buscando localização...');
    getCurrentLocation();
  }, []);

  // Fetch UV data when location changes
  useEffect(() => {
    if (location) {
      fetchRealUVData();
      // Update every 10 minutes
      const interval = setInterval(fetchRealUVData, 600000);
      return () => clearInterval(interval);
    }
  }, [location]);

  const startSession = () => {
    setSession({
      isActive: true,
      startTime: new Date(),
      duration: 0,
      totalIU: 0
    });
  };

  const pauseSession = () => {
    setSession(prev => ({
      ...prev,
      isActive: false
    }));
  };

  const stopSession = () => {
    if (session.totalIU > 0) {
      setDailyTotal(prev => prev + session.totalIU);
    }
    
    setSession({
      isActive: false,
      startTime: null,
      duration: 0,
      totalIU: 0
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSkinTypeLabel = (type: string) => {
    const labels = {
      'very-light': 'Muito Clara',
      'light': 'Clara',
      'medium': 'Média',
      'dark': 'Escura',
      'very-dark': 'Muito Escura'
    };
    return labels[type as keyof typeof labels];
  };

  const getClothingLabel = (coverage: string) => {
    const labels = {
      'minimal': 'Mínima (biquíni/sunga)',
      'partial': 'Moderada',
      'full': 'Completa'
    };
    return labels[coverage as keyof typeof labels];
  };

  // Calculate daily progress percentage
  const dailyProgress = Math.min((dailyTotal / DAILY_GOAL_IU) * 100, 100);

  // Real geolocation function
  const getCurrentLocation = () => {
    console.log('📍 Iniciando geolocalização...');
    
    if (!navigator.geolocation) {
      console.error('❌ Geolocalização não suportada');
      setError('Geolocalização não suportada neste dispositivo');
      setLoading(false);
      // Fallback to São Paulo
      setLocation({ lat: -23.5505, lon: -46.6333 });
      setWeather(prev => ({ ...prev, location: 'São Paulo, SP' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('✅ Localização obtida:', { latitude, longitude });
        
        setLocation({ lat: latitude, lon: longitude });
        
        // Get location name
        try {
          const locationName = await reverseGeocode(latitude, longitude);
          setWeather(prev => ({ ...prev, location: locationName }));
        } catch (err) {
          console.error('Erro ao obter nome da localização:', err);
          setWeather(prev => ({ ...prev, location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` }));
        }
        
        setError(null);
        setLoading(false);
      },
      (error) => {
        console.error('❌ Erro na geolocalização:', error.message);
        setError(`Erro de localização: ${error.message}`);
        setLoading(false);
        
        // Fallback to São Paulo
        setLocation({ lat: -23.5505, lon: -46.6333 });
        setWeather(prev => ({ ...prev, location: 'São Paulo, SP (padrão)' }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Reverse geocoding function
  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`
      );
      
      const data = await response.json();
      const city = data.locality || data.city || 'Cidade';
      const state = data.principalSubdivision || '';
      
      return state ? `${city}, ${state}` : city;
    } catch (error) {
      console.error('Erro no reverse geocoding:', error);
      return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    }
  };

  // Real UV data fetching
  const fetchRealUVData = async () => {
    if (!location) {
      console.log('Localização não disponível para buscar UV');
      return;
    }

    console.log('🔍 Buscando dados reais de UV para:', location);
    
    try {
      const response = await fetch(
        `https://currentuvindex.com/api/v1/uvi?latitude=${location.lat}&longitude=${location.lon}`,
        { signal: AbortSignal.timeout(8000) }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: UVApiResponse = await response.json();
      console.log('📊 Dados UV recebidos:', data);

      if (data.ok && data.now) {
        const uvIndex = data.now.uvi;
        
        setWeather(prev => ({
          ...prev,
          uvIndex: uvIndex,
          maxUVI: uvIndex * 1.2, // Estimate max UV for the day
          burnTime: calculateBurnTime(uvIndex)
        }));

        // Calculate potential IU based on real UV
        setCurrentPotential(Math.round(uvIndex * 10));
        
        console.log('✅ UV atualizado:', uvIndex);
        setError(null);
      } else {
        throw new Error(data.message || 'Dados UV inválidos');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar UV:', error);
      
      // Fallback to simulated data based on time
      const hour = new Date().getHours();
      let simulatedUV = 0;
      
      if (hour >= 6 && hour <= 18) {
        const timeFromNoon = Math.abs(hour - 12);
        simulatedUV = Math.max(0, 8 * (1 - Math.pow(timeFromNoon / 6, 2)));
      }
      
      setWeather(prev => ({
        ...prev,
        uvIndex: simulatedUV,
        maxUVI: simulatedUV * 1.2,
        burnTime: calculateBurnTime(simulatedUV)
      }));
      
      setCurrentPotential(Math.round(simulatedUV * 10));
      
      console.log('🎲 Usando UV simulado:', simulatedUV);
      
      if (error instanceof Error && error.message.includes('timeout')) {
        setError('Timeout na API de UV - usando dados simulados');
      } else {
        setError('API de UV indisponível - usando dados simulados');
      }
    }
  };

  // Calculate burn time based on UV index
  const calculateBurnTime = (uv: number): string => {
    if (uv <= 0) return 'Sem risco';
    if (uv <= 2) return '60+ min';
    if (uv <= 5) return '30-60 min';
    if (uv <= 7) return '15-25 min';
    if (uv <= 10) return '10-15 min';
    return '<10 min';
  };

  // Helper to get UV status based on index
  const getUVStatus = (uvIndex: number) => {
    if (uvIndex <= 0) return 'Sem exposição';
    if (uvIndex <= 2) return 'Baixo';
    if (uvIndex <= 5) return 'Moderado';
    if (uvIndex <= 7) return 'Alto';
    if (uvIndex <= 10) return 'Muito alto';
    return 'Extremo';
  };

  // State for manual UV override
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualUV, setManualUV] = useState(0.0);

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
      isNightTime 
        ? 'bg-gray-900' 
        : 'bg-white'
    }`}>
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isNightTime ? (
          /* Night Sky Elements */
          <>
            {/* Subtle night gradient */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full opacity-5 bg-gradient-radial from-yellow-400 to-transparent"></div>
            
            {/* Moon */}
            <div className="absolute top-16 right-12 w-20 h-20 opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <radialGradient id="moonGradient" cx="30%" cy="30%">
                    <stop offset="0%" stopColor="rgb(251, 191, 36)" stopOpacity="1"/>
                    <stop offset="100%" stopColor="rgb(251, 191, 36)" stopOpacity="0.6"/>
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="40" fill="url(#moonGradient)"/>
                {/* Moon craters for realism */}
                <circle cx="42" cy="35" r="4" fill="rgb(251, 191, 36)" opacity="0.3"/>
                <circle cx="58" cy="45" r="2" fill="rgb(251, 191, 36)" opacity="0.3"/>
                <circle cx="48" cy="60" r="3" fill="rgb(251, 191, 36)" opacity="0.3"/>
              </svg>
            </div>

            {/* Twinkling Stars */}
            <div className="absolute top-8 left-8 w-1 h-1 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-24 left-20 w-0.5 h-0.5 bg-yellow-300 rounded-full opacity-40 animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-32 right-32 w-1 h-1 bg-yellow-400 rounded-full opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-20 right-20 w-0.5 h-0.5 bg-yellow-300 rounded-full opacity-50 animate-pulse" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute top-40 left-16 w-0.5 h-0.5 bg-yellow-400 rounded-full opacity-45 animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-12 left-32 w-1 h-1 bg-yellow-300 rounded-full opacity-55 animate-pulse" style={{animationDelay: '2.5s'}}></div>
            <div className="absolute top-36 right-16 w-0.5 h-0.5 bg-yellow-400 rounded-full opacity-65 animate-pulse" style={{animationDelay: '3s'}}></div>
            
            {/* Constellation pattern */}
            <div className="absolute bottom-32 right-12 w-16 h-16 opacity-20">
              <svg viewBox="0 0 60 60" className="w-full h-full">
                <g stroke="rgb(251, 191, 36)" strokeWidth="0.5" fill="none" opacity="0.4">
                  <line x1="10" y1="10" x2="25" y2="20"/>
                  <line x1="25" y1="20" x2="45" y2="15"/>
                  <line x1="25" y1="20" x2="30" y2="40"/>
                </g>
                <circle cx="10" cy="10" r="1" fill="rgb(251, 191, 36)" opacity="0.6"/>
                <circle cx="25" cy="20" r="1" fill="rgb(251, 191, 36)" opacity="0.6"/>
                <circle cx="45" cy="15" r="1" fill="rgb(251, 191, 36)" opacity="0.6"/>
                <circle cx="30" cy="40" r="1" fill="rgb(251, 191, 36)" opacity="0.6"/>
              </svg>
            </div>
          </>
        ) : (
          /* Day Sky Elements */
          <>
            {/* Subtle day gradient */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full opacity-5 bg-gradient-radial from-amber-300 to-transparent"></div>
            
            {/* Animated Sun */}
            <div className="absolute top-20 right-8 w-32 h-32 opacity-10 animate-spin" style={{animationDuration: '20s'}}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <radialGradient id="sunGradient" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="rgb(245, 158, 11)" stopOpacity="1"/>
                    <stop offset="100%" stopColor="rgb(245, 158, 11)" stopOpacity="0.3"/>
                  </radialGradient>
                </defs>
                {/* Sun center */}
                <circle cx="50" cy="50" r="20" fill="url(#sunGradient)"/>
                {/* Sun rays */}
                <g stroke="rgb(245, 158, 11)" strokeWidth="2" strokeLinecap="round" opacity="0.6">
                  <line x1="50" y1="10" x2="50" y2="20"/>
                  <line x1="50" y1="80" x2="50" y2="90"/>
                  <line x1="10" y1="50" x2="20" y2="50"/>
                  <line x1="80" y1="50" x2="90" y2="50"/>
                  <line x1="21.5" y1="21.5" x2="28.5" y2="28.5"/>
                  <line x1="71.5" y1="71.5" x2="78.5" y2="78.5"/>
                  <line x1="21.5" y1="78.5" x2="28.5" y2="71.5"/>
                  <line x1="71.5" y1="28.5" x2="78.5" y2="21.5"/>
                </g>
              </svg>
            </div>

            {/* Floating Clouds */}
            <div className="absolute top-16 left-12 w-20 h-12 opacity-8 animate-pulse" style={{animationDuration: '4s'}}>
              <svg viewBox="0 0 100 60" className="w-full h-full">
                <path d="M20,40 Q10,20 30,20 Q50,10 70,20 Q90,20 80,40 Q90,50 70,50 Q50,60 30,50 Q10,50 20,40" 
                      fill="rgb(156, 163, 175)" opacity="0.3"/>
              </svg>
            </div>
            
            <div className="absolute bottom-24 right-20 w-16 h-10 opacity-6 animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}>
              <svg viewBox="0 0 80 50" className="w-full h-full">
                <path d="M15,35 Q5,15 25,15 Q45,5 65,15 Q75,15 70,35 Q75,45 60,45 Q40,50 20,45 Q5,45 15,35" 
                      fill="rgb(156, 163, 175)" opacity="0.3"/>
              </svg>
            </div>

            {/* Geometric solar pattern */}
            <div className="absolute bottom-20 left-8 w-24 h-24 opacity-4 text-amber-300/10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M0,50 Q50,0 100,50 Q50,100 0,50" fill="currentColor" opacity="0.3"/>
                <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.5"/>
              </svg>
            </div>
          </>
        )}
      </div>

      <div className="relative z-10 max-w-sm mx-auto px-6 py-8">
        
        {/* Header - Sun Day Style with Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Solarin Logo */}
            <div className={`w-6 h-6 ${
              isNightTime ? 'text-yellow-400' : 'text-amber-500'
            }`}>
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <defs>
                  <radialGradient id="logoGradient" cx="50%" cy="30%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="1"/>
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.6"/>
                  </radialGradient>
                </defs>
                {/* Sun center */}
                <circle cx="12" cy="12" r="4" fill="url(#logoGradient)"/>
                {/* Sun rays */}
                <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </g>
              </svg>
            </div>
            
            <h1 className={`text-lg font-medium tracking-wide ${
              isNightTime ? 'text-white' : 'text-gray-900'
            }`}>
              SOLARIN
            </h1>
          </div>
          
          {/* Location */}
          <div className={`text-sm mb-3 ${
            isNightTime ? 'text-gray-400' : 'text-gray-500'
          } flex items-center justify-center gap-1`}>
            <MapPin className="h-3 w-3" />
            <span>{weather.location}</span>
          </div>

          {/* Weather Info - Hero Integration */}
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className={`flex items-center gap-1 ${
              isNightTime ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Cloud className="h-3 w-3" />
              <span>{weather.clouds}%</span>
            </div>
            <div className={`flex items-center gap-1 ${
              isNightTime ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Sunrise className="h-3 w-3" />
              <span>{weather.sunrise}</span>
            </div>
            <div className={`flex items-center gap-1 ${
              isNightTime ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Sunset className="h-3 w-3" />
              <span>{weather.sunset}</span>
            </div>
          </div>
        </div>

        {/* Main UV Display - Hero Number */}
        <div className="text-center mb-12 relative">
          {/* UV Index Container */}
          <div className={`relative p-8 rounded-3xl ${
            isNightTime 
              ? 'bg-gray-800/50 border border-gray-700/50' 
              : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50'
          } shadow-lg backdrop-blur-sm`}>
            {/* Subtle glow effect behind the number */}
            <div className={`absolute inset-0 flex items-center justify-center ${
              isNightTime ? '' : 'opacity-20'
            }`}>
              <div className={`w-48 h-48 rounded-full blur-3xl ${
                isNightTime ? 'bg-yellow-400/5' : 'bg-amber-300/10'
              }`}></div>
            </div>
            
            <div className={`relative text-8xl font-light mb-2 ${
              isNightTime ? 'text-white' : 'text-gray-900'
            }`}>
              {loading ? '—' : (isNightTime ? '0.00' : weather.uvIndex.toFixed(2))}
            </div>
            <div className={`text-sm font-medium tracking-wider mb-1 ${
              isNightTime ? 'text-gray-400' : 'text-gray-500'
            }`}>
              ÍNDICE UV
            </div>
            <div className={`text-sm ${
              isNightTime ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {isNightTime 
                ? 'Modo noturno'
                : getUVStatus(weather.uvIndex)
              }
            </div>
          </div>
        </div>

        {/* Session Data - Clean Layout with Container */}
        <div className={`p-6 rounded-3xl mb-12 ${
          isNightTime 
            ? 'bg-gray-800/30 border border-gray-700/30' 
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50'
        } shadow-lg backdrop-blur-sm`}>
          
          {/* Burn Time */}
          <div className="text-center mb-8">
            <div className={`text-2xl font-light mb-1 ${
              isNightTime ? 'text-white' : 'text-gray-900'
            }`}>
              {isNightTime ? '—' : weather.burnTime}
            </div>
            <div className={`text-xs tracking-wider ${
              isNightTime ? 'text-gray-400' : 'text-gray-500'
            }`}>
              TEMPO EXPOSIÇÃO
            </div>
          </div>

          {/* Session Stats - Horizontal Layout */}
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className={`text-lg font-light ${
                isNightTime ? 'text-white' : 'text-gray-900'
              }`}>
                {isNightTime ? '0.00' : currentPotential.toFixed(2)}
              </div>
              <div className={`text-xs tracking-wider mt-1 ${
                isNightTime ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {isNightTime ? 'IU/MIN (INATIVO)' : 'IU/MIN'}
              </div>
            </div>
            <div>
              <div className={`text-lg font-light ${
                isNightTime ? 'text-white' : 'text-gray-900'
              }`}>
                {session.isActive ? session.totalIU.toFixed(2) : '0.00'}
              </div>
              <div className={`text-xs tracking-wider mt-1 ${
                isNightTime ? 'text-gray-400' : 'text-gray-500'
              }`}>
                SESSÃO
              </div>
            </div>
            <div>
              <div className={`text-lg font-light ${
                isNightTime ? 'text-white' : 'text-gray-900'
              }`}>
                {dailyTotal.toFixed(2)}
              </div>
              <div className={`text-xs tracking-wider mt-1 ${
                isNightTime ? 'text-gray-400' : 'text-gray-500'
              }`}>
                HOJE
              </div>
            </div>
          </div>

          {/* Timer - Only when active */}
          {session.isActive && (
            <div className="text-center mt-6">
              <div className={`text-2xl font-mono font-light ${
                isNightTime ? 'text-white' : 'text-gray-900'
              }`}>
                {formatTime(session.duration)}
              </div>
            </div>
          )}
        </div>

        {/* Daily Goal Progress - Container */}
        <div className={`p-6 rounded-3xl mb-12 ${
          isNightTime 
            ? 'bg-gray-800/30 border border-gray-700/30' 
            : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50'
        } shadow-lg backdrop-blur-sm`}>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* Background circle */}
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={isNightTime ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)'}
                  strokeWidth="4"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={isNightTime ? 'rgb(251, 191, 36)' : 'rgb(245, 158, 11)'}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${dailyProgress * 3.51} 351.86`}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-lg font-light ${
                  isNightTime ? 'text-white' : 'text-gray-900'
                }`}>
                  {dailyTotal.toFixed(2)}
                </div>
                <div className={`text-xs tracking-wider ${
                  isNightTime ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  / {DAILY_GOAL_IU} IU
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <div className={`text-xs tracking-wider ${
              isNightTime ? 'text-gray-400' : 'text-gray-500'
            }`}>
              PROGRESSO DIÁRIO
            </div>
            <div className={`text-sm mt-1 ${
              dailyProgress >= 100 
                ? (isNightTime ? 'text-green-400' : 'text-green-600')
                : (isNightTime ? 'text-white' : 'text-gray-900')
            }`}>
              {dailyProgress.toFixed(1)}% completo
            </div>
          </div>
        </div>

        {/* Main Action Button - Sun Day Style */}
        <div className="mb-12">
          {!session.isActive && session.duration === 0 ? (
            <Button 
              onClick={startSession}
              disabled={loading || isNightTime}
              className={`w-full h-12 rounded-full text-sm font-medium tracking-wide transition-all duration-200 ${
                isNightTime 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' 
                  : 'bg-gray-900 hover:bg-gray-800 text-white shadow-sm'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {isNightTime ? (
                  <Sunrise className="h-4 w-4" />
                ) : loading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span>
                  {isNightTime ? 'Aguardar o nascer do sol' : (loading ? 'Carregando...' : 'Rastrear exposição UV')}
                </span>
              </div>
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={session.isActive ? pauseSession : startSession}
                disabled={isNightTime && !session.isActive}
                className={`h-12 rounded-full text-sm font-medium tracking-wide ${
                  isNightTime 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {session.isActive ? (
                    <Pause className="h-4 w-4" />
                  ) : isNightTime ? (
                    <Sunrise className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span>
                    {session.isActive ? 'Pausar' : (isNightTime ? 'Aguardar' : 'Continuar')}
                  </span>
                </div>
              </Button>
              <Button 
                onClick={stopSession}
                className={`h-12 rounded-full text-sm font-medium tracking-wide ${
                  isNightTime 
                    ? 'bg-red-900/30 hover:bg-red-900/40 text-red-300 border border-red-800/50' 
                    : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Square className="h-4 w-4" />
                  <span>Parar</span>
                </div>
              </Button>
            </div>
          )}
        </div>

        {/* Additional Info - Collapsible */}
        <div className="space-y-4">
          
          {/* Settings */}
          <details className="group">
            <summary className={`cursor-pointer text-sm font-medium tracking-wide list-none flex items-center justify-between ${
              isNightTime ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span>Configurações</span>
              <span className="group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
              <div>
                <div className={`text-xs tracking-wider mb-2 ${
                  isNightTime ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  TIPO DE PELE
                </div>
                <Select 
                  value={userSettings.skinType} 
                  onValueChange={(value: UserSettings['skinType']) => 
                    setUserSettings(prev => ({ ...prev, skinType: value }))
                  }
                >
                  <SelectTrigger className={`h-10 rounded-lg border text-sm ${
                    isNightTime 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full border ${getSkinTypeColor(userSettings.skinType)}`}></div>
                        <span>{getSkinTypeLabel(userSettings.skinType)}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className={`${
                    isNightTime ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                  } shadow-lg max-h-64 overflow-y-auto`}>
                    <SelectItem value="very-light" className={`${isNightTime ? 'text-white hover:bg-gray-700 focus:bg-gray-700' : 'text-gray-900 hover:bg-gray-50 focus:bg-gray-100'} py-3`}>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded-full bg-orange-100 border border-orange-200 mt-0.5 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium">Muito clara</div>
                          <div className={`text-xs ${isNightTime ? 'text-gray-400' : 'text-gray-600'} mt-0.5`}>
                            {getSkinTypeDescription('very-light')}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="light" className={`${isNightTime ? 'text-white hover:bg-gray-700 focus:bg-gray-700' : 'text-gray-900 hover:bg-gray-50 focus:bg-gray-100'} py-3`}>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded-full bg-orange-200 border border-orange-300 mt-0.5 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium">Clara</div>
                          <div className={`text-xs ${isNightTime ? 'text-gray-400' : 'text-gray-600'} mt-0.5`}>
                            {getSkinTypeDescription('light')}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium" className={`${isNightTime ? 'text-white hover:bg-gray-700 focus:bg-gray-700' : 'text-gray-900 hover:bg-gray-50 focus:bg-gray-100'} py-3`}>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded-full bg-amber-400 border border-amber-500 mt-0.5 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium">Média</div>
                          <div className={`text-xs ${isNightTime ? 'text-gray-400' : 'text-gray-600'} mt-0.5`}>
                            {getSkinTypeDescription('medium')}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark" className={`${isNightTime ? 'text-white hover:bg-gray-700 focus:bg-gray-700' : 'text-gray-900 hover:bg-gray-50 focus:bg-gray-100'} py-3`}>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded-full bg-amber-700 border border-amber-800 mt-0.5 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium">Escura</div>
                          <div className={`text-xs ${isNightTime ? 'text-gray-400' : 'text-gray-600'} mt-0.5`}>
                            {getSkinTypeDescription('dark')}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="very-dark" className={`${isNightTime ? 'text-white hover:bg-gray-700 focus:bg-gray-700' : 'text-gray-900 hover:bg-gray-50 focus:bg-gray-100'} py-3`}>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded-full bg-amber-900 border border-amber-950 mt-0.5 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium">Muito escura</div>
                          <div className={`text-xs ${isNightTime ? 'text-gray-400' : 'text-gray-600'} mt-0.5`}>
                            {getSkinTypeDescription('very-dark')}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className={`text-xs tracking-wider mb-2 ${
                  isNightTime ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  ROUPA
                </div>
                <Select 
                  value={userSettings.clothingCoverage} 
                  onValueChange={(value: UserSettings['clothingCoverage']) => 
                    setUserSettings(prev => ({ ...prev, clothingCoverage: value }))
                  }
                >
                  <SelectTrigger className={`h-10 rounded-lg border text-sm ${
                    isNightTime 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}>
                    <SelectValue placeholder={getClothingLabel(userSettings.clothingCoverage)} />
                  </SelectTrigger>
                  <SelectContent className={`${
                    isNightTime ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                  } shadow-lg max-h-64 overflow-y-auto`}>
                    <SelectItem value="minimal" className={`${isNightTime ? 'text-white hover:bg-gray-700 focus:bg-gray-700' : 'text-gray-900 hover:bg-gray-50 focus:bg-gray-100'} py-3`}>
                      <div>
                        <div className="font-medium">Mínima</div>
                        <div className={`text-xs ${isNightTime ? 'text-gray-400' : 'text-gray-600'} mt-0.5`}>
                          {getClothingDescription('minimal')}
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="partial" className={`${isNightTime ? 'text-white hover:bg-gray-700 focus:bg-gray-700' : 'text-gray-900 hover:bg-gray-50 focus:bg-gray-100'} py-3`}>
                      <div>
                        <div className="font-medium">Moderada</div>
                        <div className={`text-xs ${isNightTime ? 'text-gray-400' : 'text-gray-600'} mt-0.5`}>
                          {getClothingDescription('partial')}
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="full" className={`${isNightTime ? 'text-white hover:bg-gray-700 focus:bg-gray-700' : 'text-gray-900 hover:bg-gray-50 focus:bg-gray-100'} py-3`}>
                      <div>
                        <div className="font-medium">Completa</div>
                        <div className={`text-xs ${isNightTime ? 'text-gray-400' : 'text-gray-600'} mt-0.5`}>
                          {getClothingDescription('full')}
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </details>
        </div>

        {/* Error state */}
        {error && (
          <div className={`text-center mt-8 text-sm ${
            isNightTime ? 'text-red-400' : 'text-red-600'
          }`}>
            {error}
          </div>
        )}

      </div>
    </div>
  );
};

// Helper to get UV status based on index
const getUVStatus = (uvIndex: number) => {
  if (uvIndex <= 0) return 'Sem exposição';
  if (uvIndex <= 2) return 'Baixo';
  if (uvIndex <= 5) return 'Moderado';
  if (uvIndex <= 7) return 'Alto';
  if (uvIndex <= 10) return 'Muito alto';
  return 'Extremo';
};

// Helper functions for labels
const getSkinTypeLabel = (skinType: string) => {
  const labels = {
    'very-light': 'Muito clara',
    'light': 'Clara',
    'medium': 'Média',
    'dark': 'Escura',
    'very-dark': 'Muito escura'
  };
  return labels[skinType as keyof typeof labels] || 'Clara';
};

const getSkinTypeDescription = (skinType: string) => {
  const descriptions = {
    'very-light': 'Queima sempre, nunca bronzeia',
    'light': 'Queima facilmente, bronzeia levemente',
    'medium': 'Queima moderadamente, bronzeia gradualmente',
    'dark': 'Raramente queima, bronzeia bem',
    'very-dark': 'Quase nunca queima, pele profundamente pigmentada'
  };
  return descriptions[skinType as keyof typeof descriptions] || '';
};

const getSkinTypeColor = (skinType: string) => {
  const colors = {
    'very-light': 'bg-orange-100 border-orange-200',
    'light': 'bg-orange-200 border-orange-300',
    'medium': 'bg-amber-400 border-amber-500',
    'dark': 'bg-amber-700 border-amber-800',
    'very-dark': 'bg-amber-900 border-amber-950'
  };
  return colors[skinType as keyof typeof colors] || 'bg-orange-200 border-orange-300';
};

const getClothingLabel = (clothing: string) => {
  const labels = {
    'minimal': 'Mínima',
    'partial': 'Moderada',
    'full': 'Completa'
  };
  return labels[clothing as keyof typeof labels] || 'Moderada';
};

const getClothingDescription = (clothing: string) => {
  const descriptions = {
    'minimal': 'Biquíni, sunga, ou sem camisa',
    'partial': 'Camiseta e shorts, regata',
    'full': 'Manga longa, calça comprida'
  };
  return descriptions[clothing as keyof typeof descriptions] || '';
};

export default UVTracker;