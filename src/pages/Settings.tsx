import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  User, 
  Heart, 
  Shield, 
  Download, 
  Upload,
  FileText,
  Share,
  Smartphone,
  Database,
  Trash2,
  RefreshCw,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { COPY_SYSTEM } from '@/content/copy-system';

interface CaptureSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  uvIndex: number;
  location: string;
  vitaminDEstimated: number;
  skinType: number;
  clothingCoverage: number;
  weather: {
    temperature: number;
    description: string;
    clouds: number;
  };
}

export default function Settings() {
  const [sessions, setSessions] = useState<CaptureSession[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [healthKitEnabled, setHealthKitEnabled] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [dailyTarget, setDailyTarget] = useState(700);
  const { toast } = useToast();

  // Carregar configurações e sessões
  useEffect(() => {
    // Carregar sessões
    const savedSessions = localStorage.getItem('solarin-sessions');
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (err) {
        console.error('Erro ao carregar sessões:', err);
      }
    }

    // Carregar configurações
    const savedDarkMode = localStorage.getItem('solarin-dark-mode');
    const savedNotifications = localStorage.getItem('solarin-notifications');
    const savedHealthKit = localStorage.getItem('solarin-healthkit');
    const savedDataSharing = localStorage.getItem('solarin-data-sharing');
    const savedAutoBackup = localStorage.getItem('solarin-auto-backup');
    const savedDailyTarget = localStorage.getItem('solarin-daily-target');

    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedHealthKit) setHealthKitEnabled(JSON.parse(savedHealthKit));
    if (savedDataSharing) setDataSharing(JSON.parse(savedDataSharing));
    if (savedAutoBackup) setAutoBackup(JSON.parse(savedAutoBackup));
    if (savedDailyTarget) setDailyTarget(Number(savedDailyTarget));
  }, []);

  // Salvar configurações
  const saveSettings = () => {
    localStorage.setItem('solarin-dark-mode', JSON.stringify(darkMode));
    localStorage.setItem('solarin-notifications', JSON.stringify(notifications));
    localStorage.setItem('solarin-healthkit', JSON.stringify(healthKitEnabled));
    localStorage.setItem('solarin-data-sharing', JSON.stringify(dataSharing));
    localStorage.setItem('solarin-auto-backup', JSON.stringify(autoBackup));
    localStorage.setItem('solarin-daily-target', dailyTarget.toString());
  };

  useEffect(() => {
    saveSettings();
  }, [darkMode, notifications, healthKitEnabled, dataSharing, autoBackup, dailyTarget]);

  // Exportar dados para CSV
  const exportToCSV = () => {
    if (sessions.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Você ainda não possui sessões de captação.",
        variant: "destructive"
      });
      return;
    }

    const headers = [
      'Data',
      'Hora Início',
      'Hora Fim',
      'Duração (min)',
      'Índice UV',
      'Localização',
      'Vitamina D (IU)',
      'Tipo de Pele',
      'Cobertura Roupa (%)',
      'Temperatura (°C)',
      'Condição Climática',
      'Nuvens (%)'
    ];

    const csvData = sessions.map(session => [
      session.date,
      session.startTime,
      session.endTime,
      Math.round(session.duration / 60),
      session.uvIndex.toFixed(1),
      session.location,
      session.vitaminDEstimated,
      session.skinType,
      Math.round((1 - session.clothingCoverage) * 100),
      Math.round(session.weather.temperature),
      session.weather.description,
      Math.round(session.weather.clouds)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `solarin-dados-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Dados exportados com sucesso! 📊",
      description: "Arquivo CSV baixado com suas sessões de captação solar.",
      duration: 4000,
    });
  };

  // Exportar dados para JSON
  const exportToJSON = () => {
    if (sessions.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Você ainda não possui sessões de captação.",
        variant: "destructive"
      });
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      app: 'Solarin',
      version: '1.0.0',
      totalSessions: sessions.length,
      totalVitaminD: sessions.reduce((sum, s) => sum + s.vitaminDEstimated, 0),
      sessions: sessions,
      settings: {
        skinType: localStorage.getItem('solarin-skin-type'),
        clothingCoverage: localStorage.getItem('solarin-clothing'),
        notifications,
        darkMode,
        healthKitEnabled,
        dataSharing,
        autoBackup
      }
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `solarin-backup-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Backup criado com sucesso! 💾",
      description: "Arquivo JSON baixado com backup completo dos seus dados.",
      duration: 4000,
    });
  };

  // Simular sincronização com HealthKit
  const syncWithHealthKit = async () => {
    toast({
      title: "Sincronizando com HealthKit... 🔄",
      description: "Enviando dados de vitamina D para o app Saúde.",
      duration: 3000,
    });

    // Simular delay de API
    setTimeout(() => {
      const totalVitaminD = sessions.reduce((sum, s) => sum + s.vitaminDEstimated, 0);
      
      toast({
        title: "Sincronização concluída! ✅",
        description: `${sessions.length} sessões e ${Math.round(totalVitaminD)} IU de vitamina D enviados para o HealthKit.`,
        duration: 5000,
      });
    }, 3000);
  };

  // Limpar todos os dados
  const clearAllData = () => {
    if (confirm('Tem certeza que deseja excluir todos os seus dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('solarin-sessions');
      localStorage.removeItem('solarin-achievements');
      localStorage.removeItem('solarin-longest-streak');
      localStorage.removeItem('solarin-skin-type');
      localStorage.removeItem('solarin-clothing');
      localStorage.removeItem('solarin-daily-target');
      localStorage.removeItem('solarin-last-daily-notification');
      
      setSessions([]);
      
      toast({
        title: "Dados removidos",
        description: "Todos os seus dados foram excluídos permanentemente.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  // Importar dados
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.sessions && Array.isArray(data.sessions)) {
          const mergedSessions = [...sessions, ...data.sessions];
          // Remover duplicatas baseado no ID
          const uniqueSessions = mergedSessions.filter((session, index, self) =>
            index === self.findIndex(s => s.id === session.id)
          );
          
          setSessions(uniqueSessions);
          localStorage.setItem('solarin-sessions', JSON.stringify(uniqueSessions));
          
          toast({
            title: "Dados importados com sucesso! 📥",
            description: `${data.sessions.length} sessões foram importadas.`,
            duration: 4000,
          });
        } else {
          throw new Error('Formato de arquivo inválido');
        }
      } catch (err) {
        toast({
          title: "Erro na importação",
          description: "Não foi possível importar o arquivo. Verifique se o formato está correto.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const getDataSummary = () => {
    const totalSessions = sessions.length;
    const totalVitaminD = sessions.reduce((sum, s) => sum + s.vitaminDEstimated, 0);
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
    const dataSize = JSON.stringify(sessions).length;

    return {
      totalSessions,
      totalVitaminD: Math.round(totalVitaminD),
      totalDuration: Math.round(totalDuration / 60),
      dataSize: Math.round(dataSize / 1024)
    };
  };

  const dataSummary = getDataSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-md mx-auto space-y-6 animate-slide-up">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <SettingsIcon className="w-6 h-6 text-yellow-600" />
            <h1 className="text-2xl font-bold text-gray-900">{COPY_SYSTEM.settings.header.title}</h1>
          </div>
          <p className="text-gray-600">{COPY_SYSTEM.settings.header.subtitle}</p>
        </div>

        {/* Resumo dos Dados */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-500" />
              <span>Resumo dos Dados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-600">{dataSummary.totalSessions}</div>
                <div className="text-sm text-gray-600">Sessões</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">{dataSummary.totalVitaminD}</div>
                <div className="text-sm text-gray-600">IU Vitamina D</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{dataSummary.totalDuration}</div>
                <div className="text-sm text-gray-600">Minutos Total</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{dataSummary.dataSize}</div>
                <div className="text-sm text-gray-600">KB de Dados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saúde & Bem-estar */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Saúde & Bem-estar</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Integração HealthKit</div>
                <div className="text-sm text-gray-500">Sincronizar com app Saúde do iOS</div>
              </div>
              <Switch
                checked={healthKitEnabled}
                onCheckedChange={setHealthKitEnabled}
              />
            </div>
            
            {healthKitEnabled && (
              <div className="space-y-3 pt-3 border-t">
                <Button
                  onClick={syncWithHealthKit}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  disabled={sessions.length === 0}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Sincronizar com HealthKit
                </Button>
                <div className="text-xs text-gray-500 text-center">
                  Última sincronização: {healthKitEnabled ? 'Nunca' : 'Desabilitado'}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Notificações</div>
                <div className="text-sm text-gray-500">Alertas e lembretes de captação</div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dados & Privacidade */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span>Dados & Privacidade</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Backup Automático</div>
                <div className="text-sm text-gray-500">Fazer backup dos dados localmente</div>
              </div>
              <Switch
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Compartilhamento de Dados</div>
                <div className="text-sm text-gray-500">Ajudar a melhorar o app (anônimo)</div>
              </div>
              <Switch
                checked={dataSharing}
                onCheckedChange={setDataSharing}
              />
            </div>

            <div className="pt-3 border-t space-y-3">
              <div className="text-sm font-medium text-gray-700">Exportar Dados</div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  size="sm"
                  disabled={sessions.length === 0}
                  className="flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>CSV</span>
                </Button>
                
                <Button
                  onClick={exportToJSON}
                  variant="outline"
                  size="sm"
                  disabled={sessions.length === 0}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>JSON</span>
                </Button>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Importar Dados</div>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Selecionar Arquivo JSON</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Meta */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span>Metas Pessoais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-medium mb-2">Meta Diária de Vitamina D</div>
              <div className="text-sm text-gray-500 mb-3">
                Defina sua meta diária de captação em IU (Unidades Internacionais). 
                A recomendação padrão é 700 IU por dia.
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="50"
                    value={dailyTarget}
                    onChange={(e) => setDailyTarget(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="bg-blue-50 px-3 py-1 rounded-lg min-w-[80px] text-center">
                    <span className="text-lg font-bold text-blue-600">{dailyTarget}</span>
                    <span className="text-sm text-gray-600"> IU</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setDailyTarget(400)}
                    className={`p-2 rounded text-center transition-colors ${
                      dailyTarget === 400 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Baixa<br />400 IU
                  </button>
                  <button
                    onClick={() => setDailyTarget(700)}
                    className={`p-2 rounded text-center transition-colors ${
                      dailyTarget === 700 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Recomendada<br />700 IU
                  </button>
                  <button
                    onClick={() => setDailyTarget(1000)}
                    className={`p-2 rounded text-center transition-colors ${
                      dailyTarget === 1000 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Alta<br />1000 IU
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geral */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-500" />
              <span>Geral</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Modo Escuro</div>
                <div className="text-sm text-gray-500">Interface com cores escuras</div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            <div className="pt-3 border-t">
              <div className="text-sm text-gray-600 mb-3">
                Versão do app: 1.0.0<br />
                Última atualização: Janeiro 2025
              </div>
              
              <Button
                onClick={clearAllData}
                variant="destructive"
                size="sm"
                className="w-full flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpar Todos os Dados</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Privacidade */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-sm font-medium text-gray-700">🔒 Seus dados são privados</div>
              <div className="text-xs text-gray-500">
                Todas as informações são armazenadas localmente no seu dispositivo. 
                Nenhum dado pessoal é enviado para servidores externos sem sua permissão explícita.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 