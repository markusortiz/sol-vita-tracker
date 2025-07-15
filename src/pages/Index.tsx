import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import IOSNavigation from '@/components/IOSNavigation';
import { 
  Sun, 
  Smartphone, 
  MapPin, 
  Target, 
  Activity,
  ArrowRight,
  Shield,
  Clock
} from 'lucide-react';
import heroImage from '@/assets/vitamin-d-hero.jpg';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sun,
      title: "Rastreamento Inteligente",
      description: "Calcule sua necessidade de vitamina D baseado em peso, tipo de pele e exposição solar"
    },
    {
      icon: MapPin,
      title: "Localização GPS",
      description: "Registre onde você tomou suas doses para acompanhar padrões geográficos"
    },
    {
      icon: Activity,
      title: "Integração com Saúde",
      description: "Sincronize com o app de Saúde do seu dispositivo para dados completos"
    },
    {
      icon: Target,
      title: "Metas Personalizadas",
      description: "Defina metas baseadas em suas características pessoais e estilo de vida"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* iOS Status Bar Safe Area */}
      <div className="pt-safe-top">{/* Status bar placeholder */}</div>
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Vitamin D Tracker Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary-glow/30 to-background/90" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Sun className="h-16 w-16 text-primary animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-ios-vitamin bg-clip-text text-transparent">
            VitaD Tracker
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            O app inteligente para rastrear sua vitamina D diária. 
            Calcule, monitore e atinja suas metas de saúde com precisão.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="ios" 
              size="xl"
              onClick={() => navigate('/tracker')}
              className="text-lg px-8"
            >
              Começar Agora
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="xl"
              className="text-lg px-8 border-primary/20 hover:border-primary"
            >
              <Smartphone className="h-5 w-5 mr-2" />
              Ver Recursos
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Recursos Inteligentes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para manter seus níveis de vitamina D sempre equilibrados
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 shadow-ios-medium hover:shadow-ios-large transition-ios hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gradient-ios-vitamin rounded-full mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-ios-health">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 text-accent-foreground">
            Saúde em Números
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-foreground mb-2">80%</div>
              <p className="text-accent-foreground/80">da população tem deficiência de vitamina D</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-foreground mb-2">15min</div>
              <p className="text-accent-foreground/80">de sol por dia podem fazer a diferença</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-foreground mb-2">365</div>
              <p className="text-accent-foreground/80">dias de acompanhamento personalizado</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          
          <h2 className="text-4xl font-bold mb-6 text-foreground">
            Sua Saúde, Nossa Prioridade
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comece hoje mesmo a monitorar sua vitamina D com inteligência e precisão. 
            Seu corpo agradece!
          </p>
          
          <Button 
            variant="ios" 
            size="xl"
            onClick={() => navigate('/tracker')}
            className="text-lg px-12"
          >
            <Clock className="h-5 w-5 mr-2" />
            Iniciar Rastreamento
          </Button>
        </div>
      </div>
      
      <IOSNavigation />
    </div>
  );
};

export default Index;
