import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Activity, ArrowLeft } from 'lucide-react';

const IOSNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-50">
      <div className="safe-bottom">
        <div className="flex items-center justify-around px-4 py-2">
          {location.pathname === '/tracker' ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate('/')}
              className="flex flex-col gap-1 h-auto py-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-xs">Voltar</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate('/')}
              className="flex flex-col gap-1 h-auto py-2"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Início</span>
            </Button>
          )}
          
          <Button
            variant={location.pathname === '/tracker' ? "ios-secondary" : "ghost"}
            size="icon-sm"
            onClick={() => navigate('/tracker')}
            className="flex flex-col gap-1 h-auto py-2"
          >
            <Activity className="h-5 w-5" />
            <span className="text-xs">Tracker</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IOSNavigation;