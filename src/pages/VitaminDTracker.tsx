import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Sun, 
  MapPin, 
  Plus, 
  Calendar, 
  Target, 
  Activity,
  Settings,
  Smartphone,
  Clock
} from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import heroImage from '@/assets/vitamin-d-hero.jpg';

interface VitaminDEntry {
  id: string;
  dose: number;
  time: Date;
  location?: string;
}

interface UserProfile {
  weight: number;
  skinType: 'very-light' | 'light' | 'medium' | 'dark' | 'very-dark';
  clothingCoverage: 'minimal' | 'partial' | 'full';
}

const VitaminDTracker = () => {
  const [dailyEntries, setDailyEntries] = useState<VitaminDEntry[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    weight: 70,
    skinType: 'medium',
    clothingCoverage: 'partial'
  });
  const [currentDose, setCurrentDose] = useState('');
  const [location, setLocation] = useState<string>('');
  const [dailyRecommendation, setDailyRecommendation] = useState(0);
  const { toast } = useToast();

  // Calcular recomendação diária baseada no perfil do usuário
  useEffect(() => {
    const calculateDailyRecommendation = () => {
      let baseRecommendation = userProfile.weight * 10; // 10 IU por kg base
      
      // Ajustar baseado no tipo de pele
      const skinMultiplier = {
        'very-light': 0.8,
        'light': 0.9,
        'medium': 1.0,
        'dark': 1.2,
        'very-dark': 1.5
      };
      
      // Ajustar baseado na cobertura de roupa
      const clothingMultiplier = {
        'minimal': 0.8,
        'partial': 1.0,
        'full': 1.3
      };
      
      baseRecommendation *= skinMultiplier[userProfile.skinType];
      baseRecommendation *= clothingMultiplier[userProfile.clothingCoverage];
      
      setDailyRecommendation(Math.round(baseRecommendation));
    };
    
    calculateDailyRecommendation();
  }, [userProfile]);

  // Obter localização atual
  const getCurrentLocation = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      // Simulação de reverse geocoding (em um app real, usaria uma API)
      setLocation(`${coordinates.coords.latitude.toFixed(2)}, ${coordinates.coords.longitude.toFixed(2)}`);
      
      toast({
        title: "Localização obtida",
        description: "Sua localização foi registrada com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro de localização",
        description: "Não foi possível obter sua localização.",
        variant: "destructive"
      });
    }
  };

  // Adicionar nova entrada de vitamina D
  const addVitaminDEntry = async () => {
    if (!currentDose || isNaN(Number(currentDose))) {
      toast({
        title: "Dose inválida",
        description: "Por favor, insira uma dose válida.",
        variant: "destructive"
      });
      return;
    }

    const newEntry: VitaminDEntry = {
      id: Date.now().toString(),
      dose: Number(currentDose),
      time: new Date(),
      location: location || undefined
    };

    setDailyEntries(prev => [...prev, newEntry]);
    setCurrentDose('');
    
    // Feedback háptico
    await Haptics.impact({ style: ImpactStyle.Light });
    
    toast({
      title: "Vitamina D registrada!",
      description: `${currentDose} IU adicionados ao seu rastreamento diário.`
    });
  };

  // Calcular total diário
  const dailyTotal = dailyEntries.reduce((sum, entry) => sum + entry.dose, 0);
  const progressPercentage = Math.min((dailyTotal / dailyRecommendation) * 100, 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header com imagem hero */}
      <div className="relative h-48 bg-gradient-sunrise overflow-hidden">
        <img 
          src={heroImage} 
          alt="Vitamin D Tracker" 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary-glow/30" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-white mb-1">VitaD Tracker</h1>
          <p className="text-white/90 text-sm">Acompanhe sua vitamina D diariamente</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Card de progresso diário */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sun className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold">Progresso de Hoje</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{dailyTotal}</p>
              <p className="text-sm text-muted-foreground">/ {dailyRecommendation} IU</p>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {progressPercentage >= 100 ? 
              "🎉 Meta diária atingida!" : 
              `Faltam ${dailyRecommendation - dailyTotal} IU para sua meta`
            }
          </p>
        </Card>

        {/* Adicionar nova dose */}
        <Card className="p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Registrar Vitamina D
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="dose">Dose (IU)</Label>
              <Input
                id="dose"
                type="number"
                placeholder="Ex: 1000"
                value={currentDose}
                onChange={(e) => setCurrentDose(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={getCurrentLocation}
                className="flex-1"
              >
                <MapPin className="h-4 w-4 mr-1" />
                {location ? "Localização salva" : "Obter localização"}
              </Button>
            </div>
            
            <Button 
              variant="vitamin" 
              size="lg" 
              onClick={addVitaminDEntry}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Dose
            </Button>
          </div>
        </Card>

        {/* Configurações do perfil */}
        <Card className="p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Perfil & Configurações
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={userProfile.weight}
                onChange={(e) => setUserProfile(prev => ({
                  ...prev,
                  weight: Number(e.target.value)
                }))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Tipo de Pele</Label>
              <Select 
                value={userProfile.skinType} 
                onValueChange={(value: UserProfile['skinType']) => 
                  setUserProfile(prev => ({ ...prev, skinType: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
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
              <Label>Cobertura de Roupa</Label>
              <Select 
                value={userProfile.clothingCoverage} 
                onValueChange={(value: UserProfile['clothingCoverage']) => 
                  setUserProfile(prev => ({ ...prev, clothingCoverage: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Mínima (shorts/regata)</SelectItem>
                  <SelectItem value="partial">Parcial (roupas normais)</SelectItem>
                  <SelectItem value="full">Total (roupas cobrindo corpo)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Histórico de hoje */}
        {dailyEntries.length > 0 && (
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Histórico de Hoje
            </h3>
            
            <div className="space-y-3">
              {dailyEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{entry.dose} IU</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {entry.time.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  {entry.location && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Local registrado
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Card de integração com saúde */}
        <Card className="p-6 shadow-card bg-gradient-health">
          <div className="flex items-center gap-3 mb-3">
            <Smartphone className="h-6 w-6 text-accent-foreground" />
            <h3 className="text-lg font-semibold text-accent-foreground">
              Integração com Saúde
            </h3>
          </div>
          <p className="text-accent-foreground/80 text-sm mb-4">
            Sincronize seus dados com o app de Saúde do seu dispositivo para um acompanhamento completo.
          </p>
          <Button variant="health" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Conectar App de Saúde
          </Button>
        </Card>

        {/* Card informativo */}
        <Card className="p-6 shadow-card border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Dica do Dia</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            A vitamina D é melhor absorvida quando tomada com alimentos que contêm gordura. 
            Considere tomar seus suplementos durante as refeições!
          </p>
        </Card>
      </div>
    </div>
  );
};

export default VitaminDTracker;