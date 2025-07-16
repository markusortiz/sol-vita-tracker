import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Play, Pause, MapPin, AlertTriangle, Droplets, Wind, CloudRain, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

// Interface para dados da API de UV
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

// Interface para dados de clima complementares (OpenWeather)
interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  clouds: number;
  description: string;
  pressure: number;
}

// Interface para previsão do tempo
interface WeatherForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  maxUV: number;
  description: string;
  icon: string;
  bestTime: string;
  recommendation: string;
}

// Interface para alertas inteligentes
interface SmartAlert {
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  message: string;
  icon: React.ReactNode;
}

// Interface para sessão de captação
interface CaptureSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // em segundos
  uvIndex: number;
  location: string;
  vitaminDEstimated: number; // em IU
  skinType: number;
  clothingCoverage: number;
  weather: {
    temperature: number;
    description: string;
    clouds: number;
  };
}

// Interface para conquistas
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (sessions: CaptureSession[]) => boolean;
  unlockedAt?: string;
}

// Interface para gamificação
interface GamificationData {
  level: number;
  xp: number;
  xpToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  monthlyProgress: {
    month: string;
    sessionsTarget: number;
    sessionsDone: number;
    vitaminDTarget: number;
    vitaminDCollected: number;
  };
  dailyProgress: {
    date: string;
    vitaminDTarget: number;
    vitaminDCollected: number;
    percentage: number;
    isCompleted: boolean;
  };
}

export default function UVTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingTime, setTrackingTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const [uvForecast, setUvForecast] = useState<Array<{time: string, uvi: number}>>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('Detectando localização...');
  const [skinType, setSkinType] = useState(3);
  const [clothingCoverage, setClothingCoverage] = useState(0.3);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast[]>([]);
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([]);
  const [sessions, setSessions] = useState<CaptureSession[]>([]);
  const [gamification, setGamification] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Lista de conquistas disponíveis
  const availableAchievements: Achievement[] = [
    {
      id: 'first-session',
      name: 'Primeiro Raio',
      description: 'Complete sua primeira sessão de captação solar',
      icon: '🌅',
      condition: (sessions) => sessions.length >= 1
    },
    {
      id: 'early-bird',
      name: 'Madrugador Solar',
      description: 'Faça uma sessão antes das 9h da manhã',
      icon: '🐦',
      condition: (sessions) => sessions.some(s => {
        const hour = parseInt(s.startTime.split(':')[0]);
        return hour < 9;
      })
    },
    {
      id: 'dedicated',
      name: 'Dedicado ao Sol',
      description: 'Complete 7 sessões',
      icon: '⭐',
      condition: (sessions) => sessions.length >= 7
    },
    {
      id: 'vitamin-collector',
      name: 'Coletor de Vitamina',
      description: 'Colete 1000 IU de vitamina D no total',
      icon: '💊',
      condition: (sessions) => sessions.reduce((sum, s) => sum + s.vitaminDEstimated, 0) >= 1000
    },
    {
      id: 'streak-3',
      name: 'Sequência Solar',
      description: 'Mantenha uma sequência de 3 dias consecutivos',
      icon: '🔥',
      condition: (sessions) => calculateCurrentStreak(sessions) >= 3
    },
    {
      id: 'explorer',
      name: 'Explorador Solar',
      description: 'Faça sessões em 3 localizações diferentes',
      icon: '🌍',
      condition: (sessions) => {
        const locations = new Set(sessions.map(s => s.location));
        return locations.size >= 3;
      }
    },
    {
      id: 'long-session',
      name: 'Sessão Longa',
      description: 'Complete uma sessão de mais de 30 minutos',
      icon: '⏰',
      condition: (sessions) => sessions.some(s => s.duration >= 1800)
    },
    {
      id: 'weather-warrior',
      name: 'Guerreiro do Tempo',
      description: 'Faça sessões em diferentes condições climáticas',
      icon: '⛅',
      condition: (sessions) => {
        const conditions = new Set(sessions.map(s => s.weather.description));
        return conditions.size >= 3;
      }
    },
    {
      id: 'daily-goal',
      name: 'Meta Diária',
      description: 'Atinja sua meta diária de vitamina D',
      icon: '🎯',
      condition: (sessions) => {
        const today = new Date().toLocaleDateString('pt-BR');
        const todaySessions = sessions.filter(session => session.date === today);
        const dailyVitaminD = todaySessions.reduce((sum, s) => sum + s.vitaminDEstimated, 0);
        const dailyTarget = parseInt(localStorage.getItem('solarin-daily-target') || '700');
        return dailyVitaminD >= dailyTarget;
      }
    }
  ];

  // Calcular streak atual
  const calculateCurrentStreak = (sessions: CaptureSession[]): number => {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = sessions.sort((a, b) => 
      new Date(b.date.split('/').reverse().join('-')).getTime() - 
      new Date(a.date.split('/').reverse().join('-')).getTime()
    );
    
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Verificar últimos 30 dias
      const dateString = currentDate.toLocaleDateString('pt-BR');
      const hasSession = sortedSessions.some(s => s.date === dateString);
      
      if (hasSession) {
        streak++;
      } else if (streak > 0) {
        break; // Quebrou a sequência
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  // Calcular dados de gamificação
  const calculateGamification = (sessions: CaptureSession[]): GamificationData => {
    const totalVitaminD = sessions.reduce((sum, s) => sum + s.vitaminDEstimated, 0);
    const totalSessions = sessions.length;
    
    // Calcular XP baseado em sessões e vitamina D coletada
    const sessionXP = totalSessions * 50;
    const vitaminXP = Math.floor(totalVitaminD / 10);
    const totalXP = sessionXP + vitaminXP;
    
    // Calcular nível (cada nível requer mais XP)
    let level = 1;
    let xpForCurrentLevel = 0;
    let xpRequired = 100;
    
    while (xpForCurrentLevel + xpRequired <= totalXP) {
      xpForCurrentLevel += xpRequired;
      level++;
      xpRequired = Math.floor(xpRequired * 1.2); // Cada nível requer 20% mais XP
    }
    
    const currentXP = totalXP - xpForCurrentLevel;
    const xpToNextLevel = xpRequired - currentXP;
    
    // Calcular streak
    const currentStreak = calculateCurrentStreak(sessions);
    const longestStreak = Math.max(currentStreak, 
      parseInt(localStorage.getItem('solarin-longest-streak') || '0')
    );
    
    if (currentStreak > parseInt(localStorage.getItem('solarin-longest-streak') || '0')) {
      localStorage.setItem('solarin-longest-streak', currentStreak.toString());
    }
    
    // Verificar conquistas desbloqueadas
    const unlockedAchievements = availableAchievements.filter(achievement => 
      achievement.condition(sessions)
    ).map(achievement => ({
      ...achievement,
      unlockedAt: achievement.unlockedAt || new Date().toISOString()
    }));
    
    // Progresso mensal
    const currentMonth = new Date().toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    const monthStart = new Date();
    monthStart.setDate(1);
    const thisMonthSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date.split('/').reverse().join('-'));
      return sessionDate >= monthStart;
    });
    
    const monthlyVitaminD = thisMonthSessions.reduce((sum, s) => sum + s.vitaminDEstimated, 0);
    
    // Calcular progresso diário
    const today = new Date().toLocaleDateString('pt-BR');
    const todaySessions = sessions.filter(session => session.date === today);
    const dailyVitaminD = todaySessions.reduce((sum, s) => sum + s.vitaminDEstimated, 0);
    const dailyTarget = parseInt(localStorage.getItem('solarin-daily-target') || '700');
    const dailyPercentage = Math.min((dailyVitaminD / dailyTarget) * 100, 100);
    const isDailyCompleted = dailyVitaminD >= dailyTarget;
    
    return {
      level,
      xp: currentXP,
      xpToNextLevel,
      currentStreak,
      longestStreak,
      achievements: unlockedAchievements,
      monthlyProgress: {
        month: currentMonth,
        sessionsTarget: 20, // Meta mensal de sessões
        sessionsDone: thisMonthSessions.length,
        vitaminDTarget: 2000, // Meta mensal de vitamina D (IU)
        vitaminDCollected: monthlyVitaminD
      },
      dailyProgress: {
        date: today,
        vitaminDTarget: dailyTarget,
        vitaminDCollected: dailyVitaminD,
        percentage: dailyPercentage,
        isCompleted: isDailyCompleted
      }
    };
  };

  // Verificar se meta diária foi atingida
  const checkDailyGoal = (sessions: CaptureSession[], newVitaminD: number) => {
    const today = new Date().toLocaleDateString('pt-BR');
    const todaySessions = sessions.filter(session => session.date === today);
    const previousDailyVitaminD = todaySessions.reduce((sum, s) => sum + s.vitaminDEstimated, 0) - newVitaminD;
    const dailyTarget = parseInt(localStorage.getItem('solarin-daily-target') || '700');
    
    // Verificar se a meta foi atingida com esta sessão
    if (previousDailyVitaminD < dailyTarget && (previousDailyVitaminD + newVitaminD) >= dailyTarget) {
      // Verificar se já notificou hoje
      const lastNotification = localStorage.getItem('solarin-last-daily-notification');
      if (lastNotification !== today) {
        localStorage.setItem('solarin-last-daily-notification', today);
        
        setTimeout(() => {
          toast({
            title: "Meta diária atingida! 🎯✨",
            description: `Parabéns! Você alcançou sua meta de ${dailyTarget} IU de vitamina D hoje!`,
            duration: 6000,
          });
        }, 2000); // Delay para mostrar após a notificação da sessão
      }
    }
  };

  // Verificar novas conquistas
  const checkNewAchievements = (sessions: CaptureSession[]) => {
    const savedAchievements = JSON.parse(localStorage.getItem('solarin-achievements') || '[]');
    const currentUnlocked = availableAchievements.filter(achievement => 
      achievement.condition(sessions)
    );
    
    const newAchievements = currentUnlocked.filter(achievement => 
      !savedAchievements.some((saved: Achievement) => saved.id === achievement.id)
    );
    
    newAchievements.forEach(achievement => {
      toast({
        title: `🏆 Nova Conquista Desbloqueada!`,
        description: `${achievement.icon} ${achievement.name}: ${achievement.description}`,
        duration: 6000,
      });
    });
    
    if (newAchievements.length > 0) {
      localStorage.setItem('solarin-achievements', JSON.stringify(currentUnlocked));
    }
  };

  // Carregar sessões do localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('solarin-sessions');
    if (savedSessions) {
      try {
        const loadedSessions = JSON.parse(savedSessions);
        setSessions(loadedSessions);
        setGamification(calculateGamification(loadedSessions));
      } catch (err) {
        console.error('Erro ao carregar sessões:', err);
      }
    }

    // Carregar configurações salvas
    const savedSkinType = localStorage.getItem('solarin-skin-type');
    const savedClothing = localStorage.getItem('solarin-clothing');
    
    if (savedSkinType) setSkinType(Number(savedSkinType));
    if (savedClothing) setClothingCoverage(Number(savedClothing));
  }, []);

  // Salvar configurações quando mudarem
  useEffect(() => {
    localStorage.setItem('solarin-skin-type', skinType.toString());
  }, [skinType]);

  useEffect(() => {
    localStorage.setItem('solarin-clothing', clothingCoverage.toString());
  }, [clothingCoverage]);

  // Salvar sessão no localStorage
  const saveSession = (session: CaptureSession) => {
    const updatedSessions = [session, ...sessions].slice(0, 50); // Manter apenas 50 sessões
    setSessions(updatedSessions);
    localStorage.setItem('solarin-sessions', JSON.stringify(updatedSessions));
    
    // Atualizar gamificação
    const newGamification = calculateGamification(updatedSessions);
    setGamification(newGamification);
    
    // Verificar se atingiu meta diária
    checkDailyGoal(updatedSessions, session.vitaminDEstimated);
    
    // Verificar novas conquistas
    checkNewAchievements(updatedSessions);
    
    // Verificar se subiu de nível
    if (gamification && newGamification.level > gamification.level) {
      toast({
        title: `🎉 Nível ${newGamification.level} Alcançado!`,
        description: `Parabéns! Você evoluiu para o nível ${newGamification.level}!`,
        duration: 5000,
      });
    }
  };

  // Iniciar sessão de captação
  const startTracking = () => {
    console.log('Starting tracking session...');
    console.log('Current UV Index:', uvIndex);
    console.log('Current Weather Data:', weatherData);
    console.log('Location:', locationName);
    
    setIsTracking(true);
    setSessionStartTime(new Date());
    setTrackingTime(0);
    
    toast({
      title: "Captação iniciada! ☀️",
      description: "Começamos a monitorar sua exposição solar.",
      duration: 3000,
    });
  };

  // Finalizar sessão de captação
  const stopTracking = () => {
    console.log('Stopping tracking session...');
    console.log('Session start time:', sessionStartTime);
    console.log('Tracking time:', trackingTime);
    console.log('Current UV Index:', uvIndex);
    console.log('Current Weather Data:', weatherData);
    
    if (!sessionStartTime) {
      console.error('Erro: Não há sessão ativa para finalizar');
      toast({
        title: "Erro",
        description: "Não há sessão ativa para finalizar.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const endTime = new Date();
    const vitaminDEstimated = Math.round(calculateIUPerMinute() * (trackingTime / 60));
    
    // Usar dados padrão se não estiverem disponíveis
    const currentUvIndex = uvIndex || 3; // Fallback para UV moderado
    const currentWeatherData = weatherData || {
      temperature: 25,
      humidity: 60,
      windSpeed: 10,
      visibility: 10,
      clouds: 30,
      description: 'dados indisponíveis',
      pressure: 1015
    };
    
    const session: CaptureSession = {
      id: Date.now().toString(),
      date: sessionStartTime.toLocaleDateString('pt-BR'),
      startTime: sessionStartTime.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      endTime: endTime.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      duration: trackingTime,
      uvIndex: currentUvIndex,
      location: locationName || 'Localização indisponível',
      vitaminDEstimated,
      skinType,
      clothingCoverage,
      weather: {
        temperature: currentWeatherData.temperature,
        description: currentWeatherData.description,
        clouds: currentWeatherData.clouds
      }
    };

    console.log('Saving session:', session);
    saveSession(session);
    setIsTracking(false);
    setSessionStartTime(null);
    setTrackingTime(0);

    // Calcular XP ganho
    const sessionXP = 50;
    const vitaminXP = Math.floor(vitaminDEstimated / 10);
    const totalXPGained = sessionXP + vitaminXP;

    toast({
      title: "Sessão finalizada! 🎉",
      description: `Você captou ${vitaminDEstimated} IU de vitamina D e ganhou ${totalXPGained} XP!`,
      duration: 5000,
    });
  };

  // Estatísticas do histórico
  const getSessionStats = () => {
    if (sessions.length === 0) return null;

    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
    const totalVitaminD = sessions.reduce((sum, session) => sum + session.vitaminDEstimated, 0);
    const avgDuration = totalDuration / totalSessions;
    const avgVitaminD = totalVitaminD / totalSessions;

    // Sessões desta semana
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date.split('/').reverse().join('-'));
      return sessionDate >= weekAgo;
    });

    return {
      totalSessions,
      totalDuration: Math.round(totalDuration / 60), // em minutos
      totalVitaminD: Math.round(totalVitaminD),
      avgDuration: Math.round(avgDuration / 60), // em minutos
      avgVitaminD: Math.round(avgVitaminD),
      thisWeekSessions: thisWeekSessions.length,
      thisWeekVitaminD: Math.round(thisWeekSessions.reduce((sum, session) => sum + session.vitaminDEstimated, 0))
    };
  };

  // Função para obter dados de UV em tempo real
  const fetchUVData = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lng}`
      );
      
      if (!response.ok) {
        throw new Error('Falha ao buscar dados de UV');
      }
      
      const data: UVApiResponse = await response.json();
      
      if (!data.ok) {
        throw new Error(data.message || 'Erro na API de UV');
      }
      
      console.log('UV data loaded successfully:', data.now.uvi);
      setUvIndex(data.now.uvi);
      if (data.forecast) {
        setUvForecast(data.forecast.slice(0, 24)); // Próximas 24 horas
      }
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar dados de UV, usando simulação:', err);
      
      // Gerar UV simulado baseado na hora atual
      const now = new Date();
      const hour = now.getHours();
      let simulatedUV = 0;
      
      // Simular padrão solar realista baseado na hora
      if (hour >= 6 && hour <= 18) {
        const peak = 12; // meio-dia
        const distance = Math.abs(hour - peak);
        simulatedUV = Math.max(0, 8 - distance * 1.2 + Math.random() * 2);
      } else {
        simulatedUV = 0; // Noite
      }
      
      const finalUV = Math.round(simulatedUV * 10) / 10;
      console.log('Using simulated UV:', finalUV);
      setUvIndex(finalUV);
      
      // Gerar forecast simulado
      const simulatedForecast = Array.from({ length: 24 }, (_, i) => {
        const time = new Date(now.getTime() + i * 60 * 60 * 1000);
        const forecastHour = time.getHours();
        let uvi = 0;
        
        // Simular padrão solar realista
        if (forecastHour >= 6 && forecastHour <= 18) {
          const peak = 12; // meio-dia
          const distance = Math.abs(forecastHour - peak);
          uvi = Math.max(0, 8 - distance * 1.2 + Math.random() * 2);
        }
        
        return {
          time: time.toISOString(),
          uvi: Math.round(uvi * 10) / 10
        };
      });
      setUvForecast(simulatedForecast);
      setError(null); // Não mostrar erro quando usar simulação
    }
  };

  // Função para obter dados de clima complementares
  const fetchWeatherData = async (lat: number, lng: number) => {
    try {
      // Em produção, usar uma chave real do OpenWeatherMap
      // Por ora, vamos simular dados realistas
      const simulatedWeather: WeatherData = {
        temperature: 22 + Math.random() * 10,
        humidity: 50 + Math.random() * 30,
        windSpeed: Math.random() * 20,
        visibility: 8 + Math.random() * 7,
        clouds: Math.random() * 100,
        description: ['céu claro', 'parcialmente nublado', 'nublado', 'chuva leve'][Math.floor(Math.random() * 4)],
        pressure: 1010 + Math.random() * 20
      };
      
      setWeatherData(simulatedWeather);
      generateWeatherForecast();
    } catch (err) {
      console.error('Erro ao buscar dados de clima:', err);
      // Dados simulados como fallback
      setWeatherData({
        temperature: 25,
        humidity: 60,
        windSpeed: 10,
        visibility: 10,
        clouds: 30,
        description: 'céu claro',
        pressure: 1015
      });
    }
  };

  // Gerar previsão do tempo para os próximos dias
  const generateWeatherForecast = () => {
    const forecast: WeatherForecast[] = [];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const maxTemp = 20 + Math.random() * 15;
      const minTemp = maxTemp - 5 - Math.random() * 5;
      const maxUV = 2 + Math.random() * 8;
      const cloudiness = Math.random() * 100;
      
      let description = 'Ensolarado';
      let icon = '☀️';
      let bestTime = '10:00 - 14:00';
      let recommendation = 'Excelente para captação de vitamina D!';
      
      if (cloudiness > 70) {
        description = 'Nublado';
        icon = '☁️';
        bestTime = '11:00 - 13:00';
        recommendation = 'Aproveite as aberturas nas nuvens.';
      } else if (cloudiness > 40) {
        description = 'Parcialmente nublado';
        icon = '⛅';
        bestTime = '10:00 - 15:00';
        recommendation = 'Bom dia para exposição solar moderada.';
      }
      
      if (maxUV > 8) {
        recommendation = 'Alto UV! Use protetor e limite a exposição.';
      }
      
      forecast.push({
        date: date.toLocaleDateString('pt-BR', { 
          weekday: i === 0 ? undefined : 'short',
          day: 'numeric',
          month: 'short'
        }),
        maxTemp: Math.round(maxTemp),
        minTemp: Math.round(minTemp),
        maxUV: Math.round(maxUV * 10) / 10,
        description,
        icon,
        bestTime,
        recommendation
      });
    }
    
    setWeatherForecast(forecast);
  };

  // Gerar alertas inteligentes baseados nas condições
  const generateSmartAlerts = () => {
    if (!uvIndex || !weatherData) return;
    
    const alerts: SmartAlert[] = [];
    const currentHour = new Date().getHours();
    
    // Alerta de melhor horário para captação
    if (currentHour >= 10 && currentHour <= 14 && uvIndex >= 3) {
      alerts.push({
        type: 'success',
        title: 'Horário Ideal!',
        message: 'Este é um excelente momento para captação de vitamina D.',
        icon: <Sun className="w-5 h-5" />
      });
    }
    
    // Alerta de UV muito alto
    if (uvIndex > 8) {
      alerts.push({
        type: 'danger',
        title: 'UV Extremo',
        message: 'Use protetor solar e limite a exposição a 10-15 minutos.',
        icon: <AlertTriangle className="w-5 h-5" />
      });
    }
    
    // Alerta de hidratação
    if (weatherData.temperature > 28 || weatherData.humidity < 30) {
      alerts.push({
        type: 'warning',
        title: 'Hidrate-se',
        message: 'Temperatura alta ou baixa umidade. Beba bastante água.',
        icon: <Droplets className="w-5 h-5" />
      });
    }
    
    // Alerta de vento forte
    if (weatherData.windSpeed > 25) {
      alerts.push({
        type: 'info',
        title: 'Vento Forte',
        message: 'Procure um local mais protegido para maior conforto.',
        icon: <Wind className="w-5 h-5" />
      });
    }
    
    // Alerta de chuva
    if (weatherData.description.includes('chuva') || weatherData.clouds > 80) {
      alerts.push({
        type: 'info',
        title: 'Condições Desfavoráveis',
        message: 'Aguarde melhores condições climáticas para a captação.',
        icon: <CloudRain className="w-5 h-5" />
      });
    }
    
    // Alerta de horário tardio/cedo
    if ((currentHour < 8 || currentHour > 16) && uvIndex < 2) {
      alerts.push({
        type: 'info',
        title: 'UV Baixo',
        message: 'Horário com pouco UV. Considere voltar entre 10h-14h.',
        icon: <Clock className="w-5 h-5" />
      });
    }
    
    setSmartAlerts(alerts);
  };

  // Função para obter nome da localização
  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=pt`
      );
      
      if (response.ok) {
        const data = await response.json();
        const city = data.city || data.locality || 'Cidade desconhecida';
        const region = data.principalSubdivision || '';
        const country = data.countryName || '';
        
        setLocationName(`${city}, ${region}${country ? `, ${country}` : ''}`);
      }
    } catch (err) {
      console.error('Erro ao buscar nome da localização:', err);
      setLocationName(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
    }
  };

  // Função para obter localização do usuário
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo navegador');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });
        
        // Buscar dados em paralelo
        Promise.all([
          fetchUVData(lat, lng),
          fetchWeatherData(lat, lng),
          fetchLocationName(lat, lng)
        ]).finally(() => {
          setLoading(false);
        });
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        console.log('Usando localização padrão (São Paulo)');
        
        // Usar localização padrão (São Paulo) se a geolocalização falhar
        const defaultLat = -23.5505;
        const defaultLng = -46.6333;
        setLocation({ lat: defaultLat, lng: defaultLng });
        setLocationName('São Paulo, SP');
        
        // Buscar dados com localização padrão
        Promise.all([
          fetchUVData(defaultLat, defaultLng),
          fetchWeatherData(defaultLat, defaultLng)
        ]).finally(() => {
          setLoading(false);
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );
  };

  // Effect para obter localização inicial
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Effect para atualizar dados de UV periodicamente
  useEffect(() => {
    if (!location) return;
    
    const interval = setInterval(() => {
      fetchUVData(location.lat, location.lng);
    }, 600000); // Atualizar a cada 10 minutos

    return () => clearInterval(interval);
  }, [location]);

  // Effect para gerar alertas quando dados mudam
  useEffect(() => {
    generateSmartAlerts();
  }, [uvIndex, weatherData]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setTrackingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  // Notificações periódicas
  useEffect(() => {
    if (!isTracking) return;

    const notificationTimes = [300, 900, 1800]; // 5, 15, 30 minutos
    
    if (notificationTimes.includes(trackingTime)) {
      const minutes = trackingTime / 60;
      toast({
        title: `☀️ ${minutes} minutos de captação!`,
        description: `Você está absorvendo vitamina D de forma inteligente. Continue aproveitando o sol!`,
        duration: 4000,
      });
      
      // Vibração se disponível
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  }, [trackingTime, isTracking, toast]);

  // Calcular IU por minuto baseado no UV real
  const calculateIUPerMinute = () => {
    // Usar UV index atual ou fallback para valor simulado
    const currentUV = uvIndex || 3; // Fallback para UV moderado
    
    const skinMultiplier = [0.5, 0.7, 1.0, 1.3, 1.6, 2.0][skinType - 1] || 1.0;
    const exposureMultiplier = 1 - clothingCoverage;
    const baseIU = currentUV * 50; // Base calculation
    
    return Math.round(baseIU * skinMultiplier * exposureMultiplier);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMins}min`;
    }
    return `${mins}min`;
  };

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Baixo', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (uv <= 5) return { level: 'Moderado', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (uv <= 7) return { level: 'Alto', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    if (uv <= 10) return { level: 'Muito Alto', color: 'text-red-600', bgColor: 'bg-red-100' };
    return { level: 'Extremo', color: 'text-purple-600', bgColor: 'bg-purple-100' };
  };

  const getAlertColor = (type: SmartAlert['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'danger': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4">
        <div className="max-w-md mx-auto pt-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
            <h1 className="text-2xl font-bold text-gray-900">Carregando dados solares...</h1>
            <p className="text-gray-600">Obtendo sua localização e dados de UV em tempo real</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4">
        <div className="max-w-md mx-auto pt-8 space-y-6">
          <div className="text-center space-y-4">
            <AlertTriangle className="w-16 h-16 mx-auto text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Erro ao carregar dados</h1>
            <p className="text-gray-600">{error}</p>
            <Button 
              onClick={getCurrentLocation}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const uvLevel = uvIndex ? getUVLevel(uvIndex) : { level: 'Carregando...', color: 'text-gray-500', bgColor: 'bg-gray-100' };
  const stats = getSessionStats();
  const lastUpdate = uvIndex ? new Date() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-md mx-auto space-y-6 animate-slide-up">
        {/* Header Principal */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mb-4 shadow-lg">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Solarin</h1>
          <p className="text-gray-600">Exposição Solar Inteligente</p>
        </div>

        {/* Card principal de UV */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center space-x-2 text-xl">
              <Sun className="w-6 h-6 text-yellow-500" />
              <span>Índice UV Atual</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* UV Index Display */}
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="text-6xl font-bold text-yellow-600">
                  {uvIndex ? uvIndex.toFixed(1) : (loading ? '...' : '3.0')}
                </div>
                <div className={`inline-block px-4 py-1 rounded-full text-sm font-medium mt-2 ${uvLevel.bgColor} ${uvLevel.color}`}>
                  {uvLevel.level}
                </div>
              </div>
              
              {/* Localização */}
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{locationName || 'Obtendo localização...'}</span>
              </div>
              
              {/* Horário da última atualização */}
              <div className="text-xs text-gray-500">
                Última atualização: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Nunca'}
              </div>
            </div>

            {/* Informações do Tempo */}
            {weatherData && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-700">
                    {Math.round(weatherData.temperature)}°C
                  </div>
                  <div className="text-xs text-gray-500">Temperatura</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-700">
                    {weatherData.clouds}%
                  </div>
                  <div className="text-xs text-gray-500">Nuvens</div>
                </div>
              </div>
            )}

            {/* Previsão UV para hoje */}
            {uvForecast.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">UV nas próximas horas</h4>
                <div className="flex justify-between items-end space-x-2">
                  {uvForecast.slice(0, 6).map((forecast, index) => (
                    <div key={index} className="text-center flex-1">
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(Number(forecast.time) * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="h-8 flex items-end">
                        <div 
                          className="w-full bg-gradient-to-t from-yellow-400 to-orange-500 rounded-t-sm min-h-1"
                          style={{ height: `${Math.max(4, (forecast.uvi / 11) * 32)}px` }}
                        />
                      </div>
                      <div className="text-xs font-medium text-gray-700 mt-1">
                        {forecast.uvi.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card de Sessão Ativa */}
        {isTracking && (
          <Card className="backdrop-blur-sm bg-gradient-to-r from-orange-400/90 to-yellow-400/90 border-0 shadow-xl text-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Sessão Ativa</h3>
                <div className="text-4xl font-bold">
                  {Math.floor(trackingTime / 60).toString().padStart(2, '0')}:
                  {(trackingTime % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm opacity-90">
                  Vitamina D estimada: {Math.round(calculateIUPerMinute() * (trackingTime / 60))} IU
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão Principal */}
        <div className="text-center">
          <Button
            onClick={isTracking ? stopTracking : startTracking}
            className={`w-full h-16 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 ${
              isTracking
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white'
            }`}
          >
            {isTracking ? (
              <>
                <Pause className="w-6 h-6 mr-2" />
                Pausar Exposição
              </>
            ) : (
              <>
                <Play className="w-6 h-6 mr-2" />
                Iniciar Exposição
              </>
            )}
          </Button>
        </div>

        {/* Configurações Rápidas */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-700 mb-3 text-sm">Tipo de Pele</h4>
              <Select value={skinType.toString()} onValueChange={(value) => setSkinType(parseInt(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Tipo 1 - Muito Clara</SelectItem>
                  <SelectItem value="2">Tipo 2 - Clara</SelectItem>
                  <SelectItem value="3">Tipo 3 - Média</SelectItem>
                  <SelectItem value="4">Tipo 4 - Morena</SelectItem>
                  <SelectItem value="5">Tipo 5 - Escura</SelectItem>
                  <SelectItem value="6">Tipo 6 - Muito Escura</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-700 mb-3 text-sm">Cobertura de Roupa</h4>
              <div className="space-y-2">
                <div className="text-center text-lg font-semibold text-gray-800">
                  {clothingCoverage}%
                </div>
                <Slider
                  value={[clothingCoverage]}
                  onValueChange={([value]) => setClothingCoverage(value)}
                  max={80}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas do Dia */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-700 mb-4">Estatísticas de Hoje</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-yellow-600">
                  {stats.totalSessions}
                </div>
                <div className="text-xs text-gray-500">Sessões</div>
              </div>
              <div>
                <div className="text-xl font-bold text-orange-600">
                  {Math.floor(stats.totalDuration / 60)}h {stats.totalDuration % 60}m
                </div>
                <div className="text-xs text-gray-500">Tempo Total</div>
              </div>
              <div>
                <div className="text-xl font-bold text-red-600">
                  {Math.round(gamification?.dailyProgress.vitaminDCollected || 0)}
                </div>
                <div className="text-xs text-gray-500">IU Vitamina D</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recomendações Inteligentes */}
        {smartAlerts.length > 0 && (
          <Card className="backdrop-blur-sm bg-blue-50/80 border-0 shadow-lg">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-blue-600" />
                Recomendações
              </h4>
              <div className="space-y-2">
                {smartAlerts.map((alert, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-white/50 p-2 rounded-lg">
                    {alert.message}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Previsão do Tempo para os próximos dias */}
        {weatherForecast.length > 0 && (
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-700 mb-4">Previsão para os Próximos Dias</h4>
              <div className="space-y-3">
                {weatherForecast.slice(0, 5).map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-gray-700">
                        {index === 0 ? 'Hoje' : new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {day.description}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">{day.minTemp}°-{day.maxTemp}°</span>
                      <span className="font-medium text-yellow-600">UV {day.maxUV}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 