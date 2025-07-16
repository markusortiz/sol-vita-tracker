import React from 'react';
import { Sun, Play, Zap, Star, Trophy } from 'lucide-react';

const DesignShowcase: React.FC = () => {
  return (
    <div className="container-enhanced space-y-enhanced p-6 bg-gradient-to-br from-amber-50 to-yellow-100 min-h-screen">
      
      {/* Enhanced Typography Showcase */}
      <div className="card-enhanced stagger-1">
        <div className="p-6">
          <h2 className="text-enhanced-heading text-2xl mb-4">Enhanced Typography</h2>
          <div className="space-y-4">
            <div className="text-enhanced-heading text-lg">Primary Heading Text</div>
            <div className="text-enhanced-body">Enhanced body text with perfect readability</div>
            <div className="text-enhanced-accent text-xl">Gradient accent text that stands out</div>
          </div>
        </div>
      </div>

      {/* Enhanced Buttons Showcase */}
      <div className="card-enhanced stagger-2">
        <div className="p-6">
          <h2 className="text-enhanced-heading text-2xl mb-4">Enhanced Buttons</h2>
          <div className="space-y-4">
            <button className="btn-primary-enhanced hover-lift scale-on-tap focus-enhanced">
              <Play className="w-5 h-5 mr-2" />
              Primary Button with Ripple
            </button>
            <button className="btn-secondary-enhanced hover-lift scale-on-tap focus-enhanced">
              <Star className="w-5 h-5 mr-2" />
              Secondary Glassmorphism Button
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced UV Display Showcase */}
      <div className="card-enhanced stagger-3">
        <div className="p-6 text-center">
          <h2 className="text-enhanced-heading text-2xl mb-6">Enhanced UV Display</h2>
          <div className="uv-display-enhanced mb-4">8.5</div>
          <div className="status-badge-enhanced status-active">
            Sol Perfeito
          </div>
        </div>
      </div>

      {/* Enhanced Cards & Glass Effects */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-enhanced stagger-4 hover-lift">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Sun className="w-6 h-6 text-yellow-500 mr-3" />
              <h3 className="text-enhanced-heading">Enhanced Card</h3>
            </div>
            <p className="text-enhanced-body">Card with improved shadows, borders, and hover effects.</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl stagger-5 hover-lift">
          <div className="flex items-center mb-4">
            <Zap className="w-6 h-6 text-yellow-500 mr-3" />
            <h3 className="text-enhanced-heading">Glass Card</h3>
          </div>
          <p className="text-enhanced-body">Glassmorphism effect with backdrop blur and transparency.</p>
        </div>
      </div>

      {/* Enhanced Animations Showcase */}
      <div className="card-enhanced stagger-6">
        <div className="p-6">
          <h2 className="text-enhanced-heading text-2xl mb-4">Enhanced Animations</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl text-center animate-fade-in-scale">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-enhanced-body text-sm">Fade In Scale</div>
            </div>
            <div className="glass-card p-4 rounded-xl text-center animate-counter-up">
              <div className="text-2xl font-bold text-enhanced-accent mb-1">2,847</div>
              <div className="text-enhanced-body text-xs">Counter Animation</div>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="text-enhanced-body text-sm">Pulse Glow</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Spacing & Layout */}
      <div className="section-enhanced">
        <div className="card-enhanced">
          <div className="p-6">
            <h2 className="text-enhanced-heading text-2xl spacing-enhanced-md">Enhanced Layout System</h2>
            <div className="space-y-enhanced">
              <div className="spacing-enhanced-sm">
                <div className="text-enhanced-body">Perfect spacing between elements</div>
              </div>
              <div className="spacing-enhanced-md">
                <div className="text-enhanced-body">Consistent visual rhythm</div>
              </div>
              <div className="spacing-enhanced-lg">
                <div className="text-enhanced-body">Harmonious proportions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DesignShowcase; 