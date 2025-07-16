import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Sun, AlertTriangle, CheckCircle } from 'lucide-react';

interface BestTimeCardProps {
  uvIndex: number | null;
  isCurrentlyGoodTime?: boolean;
}

export default function BestTimeCard({ uvIndex, isCurrentlyGoodTime }: BestTimeCardProps) {
  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours();
  };

  const getBestTimeInfo = () => {
    const currentHour = getCurrentTime();
    const currentUV = uvIndex || 3;

    // Determinar se é um bom momento
    const isGoodTime = currentHour >= 10 && currentHour <= 14 && currentUV >= 3;

    let timeRange = "10:00 - 14:00";
    let statusColor = "text-green-600";
    let statusBg = "bg-green-50";
    let statusIcon = CheckCircle;
    let message = "Horário ideal para captação";
    let recommendation = "Este é o melhor momento para absorver vitamina D!";

    if (currentHour < 8) {
      statusColor = "text-blue-600";
      statusBg = "bg-blue-50";
      statusIcon = Clock;
      message = "Muito cedo";
      recommendation = "Aguarde até às 10:00 para melhor captação.";
    } else if (currentHour >= 8 && currentHour < 10) {
      statusColor = "text-yellow-600";
      statusBg = "bg-yellow-50";
      statusIcon = Clock;
      message = "Quase na hora";
      recommendation = "Em breve será o horário ideal.";
    } else if (currentHour > 14 && currentHour <= 16) {
      statusColor = "text-orange-600";
      statusBg = "bg-orange-50";
      statusIcon = AlertTriangle;
      message = "Horário moderado";
      recommendation = "Ainda é possível captar, mas com menor eficiência.";
    } else if (currentHour > 16) {
      statusColor = "text-gray-600";
      statusBg = "bg-gray-50";
      statusIcon = AlertTriangle;
      message = "Tarde demais";
      recommendation = "Volte amanhã entre 10:00 e 14:00.";
    }

    // Verificar UV baixo
    if (currentUV < 3) {
      statusColor = "text-gray-600";
      statusBg = "bg-gray-50";
      statusIcon = AlertTriangle;
      message = "UV baixo";
      recommendation = "Aguarde UV mais alto para melhor captação.";
    }

    return {
      timeRange,
      statusColor,
      statusBg,
      statusIcon,
      message,
      recommendation,
      isGoodTime
    };
  };

  const timeInfo = getBestTimeInfo();
  const StatusIcon = timeInfo.statusIcon;

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span>Melhor Horário</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Horário ideal */}
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {timeInfo.timeRange}
            </div>
            <div className="text-sm text-gray-600">
              Janela ideal para captação
            </div>
          </div>

          {/* Status atual */}
          <div className={`${timeInfo.statusBg} rounded-lg p-3`}>
            <div className="flex items-center space-x-2 mb-2">
              <StatusIcon className={`w-4 h-4 ${timeInfo.statusColor}`} />
              <span className={`font-medium ${timeInfo.statusColor}`}>
                {timeInfo.message}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {timeInfo.recommendation}
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <Sun className="w-3 h-3 mx-auto mb-1 text-yellow-500" />
              <div className="font-medium">UV Atual</div>
              <div className="text-gray-600">{uvIndex ? uvIndex.toFixed(1) : '3.0'}</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <Clock className="w-3 h-3 mx-auto mb-1 text-blue-500" />
              <div className="font-medium">Agora</div>
              <div className="text-gray-600">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          {/* Dicas baseadas no horário */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            <div className="font-medium mb-1">💡 Dica:</div>
            {timeInfo.isGoodTime ? (
              "Aproveite este momento para uma sessão de 15-30 minutos!"
            ) : (
              "O horário entre 10:00 e 14:00 oferece os melhores níveis de UV para síntese de vitamina D."
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 