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
  Square
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

interface UserSettings {
  skinType: 'very-light' | 'light' | 'medium' | 'dark' | 'very-dark';
  clothingCoverage: 'minimal' | 'partial' | 'full';
}

const VitaminDTracker = () => {
  const [session, setSession] = useState<SessionData>({
    isActive: false,
    startTime: null,
    duration: 0,
    totalIU: 0
  });

  const [weather, setWeather] = useState<WeatherData>({
    uvIndex: 0.7,
    maxUVI: 4.4,
    sunrise: "07:21",
    sunset: "17:46",
    clouds: 0,
    location: "São Paulo",
    burnTime: "9h 33m"
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    skinType: 'light',
    clothingCoverage: 'minimal'
  });

  const [dailyTotal, setDailyTotal] = useState(113);
  const [currentPotential, setCurrentPotential] = useState(42);

  const { toast } = useToast();

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

  // Simular dados de UV em tempo real
  useEffect(() => {
    const updateWeatherData = () => {
      // Simular variação no UV Index baseado no horário
      const hour = new Date().getHours();
      let uvIndex = 0;
      
      if (hour >= 6 && hour <= 18) {
        // Curva parabólica do UV durante o dia
        const timeFromNoon = Math.abs(hour - 12);
        uvIndex = Math.max(0, 4.4 * (1 - Math.pow(timeFromNoon / 6, 2)));
      }
      
      setWeather(prev => ({
        ...prev,
        uvIndex: Math.round(uvIndex * 10) / 10
      }));

      // Atualizar potencial baseado no UV atual
      setCurrentPotential(Math.round(uvIndex * 10));
    };

    updateWeatherData();
    const interval = setInterval(updateWeatherData, 30000); // Atualizar a cada 30s
    
    return () => clearInterval(interval);
  }, []);

  const startSession = () => {
    setSession({
      isActive: true,
      startTime: new Date(),
      duration: 0,
      totalIU: 0
    });
    
    toast({
      title: "Sessão iniciada",
      description: "Comece a aproveitar o sol com segurança!"
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
      
      toast({
        title: "Sessão finalizada",
        description: `Você ganhou ${session.totalIU} IU de vitamina D!`
      });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-white text-4xl font-bold tracking-wider">
            SOLARIN
          </h1>
        </div>

        {/* Card Principal - UV Index */}
        <Card className="bg-blue-500/30 backdrop-blur-sm border-blue-300/20 text-white">
          <div className="p-6 text-center">
            <div className="text-sm font-medium text-blue-100 mb-2 tracking-wide">
              ÍNDICE UV
            </div>
            
            <div className="text-7xl font-bold mb-6">
              {weather.uvIndex.toFixed(1)}
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-center mb-4">
              <div>
                <div className="text-xs text-blue-100 mb-1">QUEIMA</div>
                <div className="font-semibold text-sm">{weather.burnTime}</div>
              </div>
              <div>
                <div className="text-xs text-blue-100 mb-1">MÁXIMO</div>
                <div className="font-semibold text-sm">{weather.maxUVI}</div>
              </div>
              <div>
                <div className="text-xs text-blue-100 mb-1">NASCER</div>
                <div className="font-semibold text-sm">{weather.sunrise}</div>
              </div>
              <div>
                <div className="text-xs text-blue-100 mb-1">PÔR</div>
                <div className="font-semibold text-sm">{weather.sunset}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-blue-100">
              <Sun className="h-4 w-4" />
              <span>{weather.clouds}% nuvens</span>
              <MapPin className="h-4 w-4 ml-2" />
              <span>{weather.location}</span>
            </div>
          </div>
        </Card>

        {/* Card Sessão */}
        <Card className="bg-blue-500/30 backdrop-blur-sm border-blue-300/20 text-white">
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div>
                <div className="text-xs text-blue-100 mb-1">POTENCIAL</div>
                <div className="text-2xl font-bold">{currentPotential}</div>
                <div className="text-xs text-blue-100">IU/min</div>
              </div>
              <div>
                <div className="text-xs text-blue-100 mb-1">SESSÃO</div>
                <div className="text-2xl font-bold">
                  {session.isActive ? `${session.totalIU.toFixed(2)} IU` : '0.00 IU'}
                </div>
                <div className="text-xs text-blue-100">
                  {session.isActive ? formatTime(session.duration) : 'Parado'}
                </div>
              </div>
              <div>
                <div className="text-xs text-blue-100 mb-1">HOJE</div>
                <div className="text-2xl font-bold">{dailyTotal}</div>
                <div className="text-xs text-blue-100">IU total</div>
              </div>
            </div>
            
            {/* Botão Begin/Pause/Stop */}
            {!session.isActive && session.duration === 0 ? (
              <Button 
                onClick={startSession}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 h-14 text-lg font-semibold rounded-xl"
              >
                <Sun className="h-5 w-5 mr-2" />
                Começar
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button 
                  onClick={session.isActive ? pauseSession : startSession}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30 h-14 text-lg font-semibold rounded-xl"
                >
                  {session.isActive ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Continuar
                    </>
                  )}
                </Button>
                <Button 
                  onClick={stopSession}
                  className="flex-1 bg-red-500/30 hover:bg-red-500/40 text-white border-red-300/30 h-14 text-lg font-semibold rounded-xl"
                >
                  <Square className="h-5 w-5 mr-2" />
                  Parar
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Card Configurações */}
        <Card className="bg-blue-500/30 backdrop-blur-sm border-blue-300/20 text-white">
          <div className="p-6">
            <div className="text-sm font-medium text-blue-100 mb-4 text-center tracking-wide">
              CONFIGURAÇÕES
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-blue-100 mb-2">Tipo de Pele</div>
                <Select 
                  value={userSettings.skinType} 
                  onValueChange={(value: UserSettings['skinType']) => 
                    setUserSettings(prev => ({ ...prev, skinType: value }))
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={getSkinTypeLabel(userSettings.skinType)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-light">Muito Clara</SelectItem>
                    <SelectItem value="light">Clara</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="dark">Escura</SelectItem>
                    <SelectItem value="very-dark">Muito Escura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="text-sm text-blue-100 mb-2">Roupa</div>
                <Select 
                  value={userSettings.clothingCoverage} 
                  onValueChange={(value: UserSettings['clothingCoverage']) => 
                    setUserSettings(prev => ({ ...prev, clothingCoverage: value }))
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={getClothingLabel(userSettings.clothingCoverage)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Mínima (biquíni/sunga)</SelectItem>
                    <SelectItem value="partial">Moderada</SelectItem>
                    <SelectItem value="full">Completa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default VitaminDTracker;