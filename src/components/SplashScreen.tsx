import { useEffect, useState } from 'react';
import { Sun } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 300); // Aguarda a animação de fade-out
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-200 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center space-y-6 animate-pulse">
        {/* Logo do Sol */}
        <div className="relative">
          <Sun className="h-24 w-24 text-yellow-500 drop-shadow-lg animate-spin-slow" />
          <div className="absolute inset-0 h-24 w-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
        </div>
        
        {/* Nome do App */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-yellow-800 tracking-wide drop-shadow-sm">
            Solarin
          </h1>
          <p className="text-lg text-yellow-700 mt-2 font-medium">
            Sua dose diária de vitamina D
          </p>
        </div>
      </div>
      
      {/* Indicador de loading sutil */}
      <div className="absolute bottom-16 flex space-x-2">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  );
};

export default SplashScreen; 