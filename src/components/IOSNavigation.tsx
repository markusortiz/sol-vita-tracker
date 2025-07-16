import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Activity, Sun, Settings } from 'lucide-react';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}

const IOSNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      path: '/',
      icon: Home,
      label: 'Início',
      isActive: location.pathname === '/'
    },
    {
      path: '/uv-tracker',
      icon: Sun,
      label: 'UV Tracker',
      isActive: location.pathname === '/uv-tracker'
    },
    {
      path: '/tracker',
      icon: Activity,
      label: 'Manual',
      isActive: location.pathname === '/tracker'
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Config',
      isActive: location.pathname === '/settings'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-yellow-200 z-50 shadow-lg">
      <div className="safe-bottom">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col gap-1 h-auto py-2 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
                  item.isActive
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900 shadow-md'
                    : 'bg-transparent text-yellow-700 hover:bg-yellow-100'
                }`}
              >
                <Icon className={`h-5 w-5 ${item.isActive ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IOSNavigation;