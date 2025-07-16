import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Play, Pause, MapPin, Settings, ChevronDown, ChevronUp, Activity, Zap } from 'lucide-react';
import ProgressCircle from '@/components/ui/progress-circle';
import { useToast } from '@/hooks/use-toast';
import { COPY_SYSTEM, getContextualTip, getMotivationalQuote } from '@/content/copy-system';

// Simplified interfaces for redesigned component
interface RedesignedUVTrackerProps {
  uvIndex: number | null;
  location: { lat: number; lon: number } | null;
  locationName: string;
  skinType: number;
  clothingCoverage: number;
  onSkinTypeChange: (type: number) => void;
  onClothingChange: (coverage: number) => void;
}

const UVTrackerRedesigned: React.FC<RedesignedUVTrackerProps> = ({
  uvIndex,
  location,
  locationName,
  skinType,
  clothingCoverage,
  onSkinTypeChange,
  onClothingChange
}) => {
  const { toast } = useToast();
  
  // Core tracking states
  const [isTracking, setIsTracking] = useState(false);
  const [trackingTime, setTrackingTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  // Timer for active sessions
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setTrackingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  // Helper functions
  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Sol suave', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (uv <= 5) return { level: 'Sol perfeito', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (uv <= 7) return { level: 'Sol forte', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    if (uv <= 10) return { level: 'Sol intenso', color: 'text-red-600', bgColor: 'bg-red-100' };
    return { level: 'Sol poderoso', color: 'text-purple-600', bgColor: 'bg-purple-100' };
  };

  const calculateIUPerMinute = (): number => {
    if (!uvIndex) return 0;
    const baseIU = uvIndex * 100;
    const skinFactor = [0.1, 0.3, 0.5, 0.7, 0.9, 1.0][skinType - 1];
    const exposureFactor = 1 - clothingCoverage;
    return Math.round((baseIU * skinFactor * exposureFactor) / 60);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTracking = () => {
    setIsTracking(true);
    toast({
      title: COPY_SYSTEM.notifications.session.started.title,
      description: COPY_SYSTEM.notifications.session.started.description,
    });
  };

  const stopTracking = () => {
    setIsTracking(false);
    setTrackingTime(0);
    toast({
      title: COPY_SYSTEM.notifications.session.completed.title,
      description: COPY_SYSTEM.notifications.session.completed.description,
    });
  };

  const uvLevel = uvIndex ? getUVLevel(uvIndex) : { level: 'Carregando...', color: 'text-gray-500', bgColor: 'bg-gray-100' };

  return (
    <div className="space-y-6">
      {/* 🎯 PRIMARY: UV Status Card - Always Visible */}
      <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-xl">
        <CardContent className="p-6">
          {/* UV Index - Hero Display */}
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 font-medium mb-2">
              {COPY_SYSTEM.uvTracker.uvIndex.current_label}
            </div>
            <div className="text-7xl font-light text-yellow-600 mb-3 tracking-tight">
              {uvIndex !== null ? uvIndex.toFixed(1) : '0.0'}
            </div>
            <div className={`inline-flex px-6 py-3 rounded-full text-base font-medium shadow-sm ${uvLevel.bgColor} ${uvLevel.color}`}>
              {uvLevel.level}
            </div>
          </div>

          {/* Quick Context Info */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-4 mb-6">
            <div className="text-center">
              <div className="text-sm text-gray-700 font-medium mb-1">
                Sua energia solar agora
              </div>
              <div className="text-3xl font-bold text-yellow-700 mb-1">
                {calculateIUPerMinute()} <span className="text-lg font-normal text-gray-600">energia/min</span>
              </div>
              <div className="flex items-center justify-center text-xs text-gray-600 mt-2">
                <MapPin className="w-3 h-3 mr-1" />
                {locationName}
              </div>
            </div>
          </div>

          {/* Smart Tip */}
          {uvIndex !== null && (
            <div className="text-sm text-gray-600 bg-blue-50 rounded-lg px-4 py-3 border border-blue-200">
              💡 {getContextualTip(uvIndex, new Date().getHours())}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🎯 SECONDARY: Tracking Session Card */}
      <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-lg">
        <CardContent className="p-6">
          {!isTracking ? (
            /* Not Tracking State - Simple Start */
            <div className="text-center space-y-6">
              <div>
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  Pronto para sua sessão solar?
                </div>
                <div className="text-sm text-gray-600">
                  ✨ {getMotivationalQuote()}
                </div>
              </div>
              
              <Button
                onClick={startTracking}
                className="w-full h-16 text-xl font-semibold rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 hover:scale-[1.02] text-white transition-all duration-300 shadow-lg"
              >
                <Play className="w-6 h-6 mr-3" />
                {COPY_SYSTEM.uvTracker.tracking.start}
              </Button>
            </div>
          ) : (
            /* Active Tracking State */
            <div className="space-y-6">
              {/* Session Status */}
              <div className="text-center">
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300 mb-4 inline-block">
                  SESSÃO ATIVA
                </div>
              </div>

              {/* Timer Circle */}
              <div className="flex items-center justify-center">
                <ProgressCircle
                  progress={(trackingTime % 1800) / 1800 * 100}
                  size={120}
                  strokeWidth={8}
                  className="text-yellow-500"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {formatTime(trackingTime)}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      ATIVO
                    </div>
                  </div>
                </ProgressCircle>
              </div>

              {/* Energy Collected */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-sm text-gray-700 font-medium mb-1">
                    Energia coletada
                  </div>
                  <div className="text-2xl font-bold text-yellow-700">
                    {Math.round(calculateIUPerMinute() * (trackingTime / 60))} energia
                  </div>
                </div>
              </div>

              {/* Stop Button */}
              <Button
                onClick={stopTracking}
                className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 hover:scale-[1.02] text-white transition-all duration-300 shadow-lg"
              >
                <Pause className="w-5 h-5 mr-3" />
                {COPY_SYSTEM.uvTracker.tracking.stop}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🎯 TERTIARY: Settings Card - Collapsible */}
      <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-sm">
        <CardContent className="p-0">
          {/* Settings Header - Always Visible */}
          <Button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full p-4 justify-between bg-transparent hover:bg-gray-50 text-gray-700 rounded-none"
          >
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-3" />
              <span className="font-medium">Personalizar cálculos</span>
            </div>
            {showSettings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>

          {/* Settings Content - Collapsible */}
          {showSettings && (
            <div className="p-4 border-t border-gray-100 space-y-6">
              {/* Skin Type */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {COPY_SYSTEM.uvTracker.skinType.label}
                    </div>
                    <div className="text-xs text-gray-600">
                      Para cálculos precisos
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-700">
                      {COPY_SYSTEM.uvTracker.skinType.types[skinType as keyof typeof COPY_SYSTEM.uvTracker.skinType.types].name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {COPY_SYSTEM.uvTracker.skinType.types[skinType as keyof typeof COPY_SYSTEM.uvTracker.skinType.types].desc}
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={skinType}
                  onChange={(e) => onSkinTypeChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Muito clara</span>
                  <span>Muito escura</span>
                </div>
              </div>

              {/* Clothing Coverage */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {COPY_SYSTEM.uvTracker.clothing.label}
                    </div>
                    <div className="text-xs text-gray-600">
                      Área exposta ao sol
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-700">
                      {Math.round((1 - clothingCoverage) * 100)}%
                    </div>
                    <div className="text-xs text-gray-600">
                      do corpo
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.1"
                  value={clothingCoverage}
                  onChange={(e) => onClothingChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Máxima</span>
                  <span>Mínima</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UVTrackerRedesigned; 