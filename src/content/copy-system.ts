// Enhanced Copy & Content System for Sol-Vita-Tracker
// Transforming technical language into engaging, benefit-focused messaging

export const COPY_SYSTEM = {
  // App-wide messaging strategy
  brand: {
    name: "Solarin",
    tagline: "Sua dose diária de energia e saúde",
    mission: "Transforme 15 minutos de sol em uma vida mais saudável",
    personality: "Amigável, motivacional, educativo, confiável"
  },

  // Enhanced homepage copy
  homepage: {
    hero: {
      headline: "Transforme sua saúde com o poder do sol",
      subheadline: "Descubra quando e como aproveitar a vitamina D natural para ter mais energia, melhor humor e ossos mais fortes.",
      cta_primary: "Começar minha jornada solar",
      cta_secondary: "Modo personalizado"
    },
    
    features: [
      {
        title: "Sol inteligente na palma da sua mão",
        description: "Receba o momento perfeito para aproveitar o sol baseado na sua localização e tipo de pele",
        emotional_benefit: "Nunca mais perca o momento ideal"
      },
      {
        title: "Sua localização, sua dose personalizada",
        description: "Algoritmo inteligente que calcula exatamente quanto sol você precisa hoje",
        emotional_benefit: "Resultados personalizados para você"
      },
      {
        title: "Acompanhamento automático da sua energia",
        description: "Veja sua vitamina D crescer em tempo real e sinta a diferença na sua disposição",
        emotional_benefit: "Energia e bem-estar visíveis"
      },
      {
        title: "Configuração simples e inteligente", 
        description: "Defina seu perfil uma vez e receba recomendações personalizadas todos os dias",
        emotional_benefit: "Simplicidade que funciona"
      }
    ],

    benefits: {
      headline: "Por que milhões já transformaram sua saúde",
      stats: [
        {
          number: "80%",
          description: "das pessoas têm deficiência de vitamina D e nem sabem"
        },
        {
          number: "15min",
          description: "de sol inteligente podem mudar sua energia para sempre"
        },
        {
          number: "365",
          description: "dias de acompanhamento personalizado e motivação diária"
        }
      ]
    },

    cta_final: {
      headline: "Sua nova energia começa hoje",
      description: "Junte-se a milhares de pessoas que já descobriram o segredo de uma vida mais saudável e energizada.",
      button: "Começar agora grátis"
    }
  },

  // UV Tracker page enhanced copy
  uvTracker: {
    header: {
      title: "Sua sessão solar",
      subtitle: "Energia e saúde em tempo real"
    },

    uvIndex: {
      current_label: "Sol disponível agora",
      levels: {
        low: { name: "Sol suave", tip: "Momento ideal para sessões mais longas" },
        moderate: { name: "Sol perfeito", tip: "Condições ideais para vitamina D" },
        high: { name: "Sol forte", tip: "Sessões curtas e eficazes" },
        very_high: { name: "Sol intenso", tip: "Máxima eficiência em poucos minutos" },
        extreme: { name: "Sol poderoso", tip: "Cuidado extra, resultados rápidos" }
      }
    },

    potential: {
      label: "Sua energia solar por minuto",
      subtitle: "Personalizado para seu tipo de pele",
      description: "Baseado no seu perfil único"
    },

    // Simplified skin type language
    skinType: {
      label: "Seu tipo de pele",
      subtitle: "Para recomendações precisas",
      types: {
        1: { name: "Muito clara", desc: "Queima fácil, bronzeia pouco" },
        2: { name: "Clara", desc: "Queima fácil, bronzeia gradualmente" },
        3: { name: "Média", desc: "Queima às vezes, bronzeia bem" },
        4: { name: "Morena", desc: "Queima pouco, bronzeia facilmente" },
        5: { name: "Escura", desc: "Queima raramente, bronzeia muito" },
        6: { name: "Muito escura", desc: "Quase nunca queima, sempre bronzeia" }
      }
    },

    clothing: {
      label: "Quanto do seu corpo está no sol?",
      options: {
        minimal: "Máxima exposição (biquíni/sunga)",
        partial: "Exposição moderada (camiseta)",
        full: "Exposição mínima (manga longa)"
      }
    },

    tracking: {
      start: "Começar sessão solar",
      pause: "Pausar",
      stop: "Finalizar sessão",
      timer_label: "Tempo na sua sessão"
    }
  },

  // Enhanced notifications and toasts
  notifications: {
    session: {
      started: {
        title: "🌞 Sua sessão solar começou!",
        description: "Relaxe e aproveite. Vamos cuidar do tempo para você."
      },
      milestone_5min: {
        title: "⭐ 5 minutos de energia!",
        description: "Ótimo começo! Sua vitamina D já está crescendo."
      },
      milestone_15min: {
        title: "🎯 15 minutos - perfeito!",
        description: "Você está no caminho certo para mais energia e disposição."
      },
      milestone_30min: {
        title: "🏆 30 minutos de sucesso!",
        description: "Incrível! Você fez uma sessão completa e eficaz."
      },
      completed: {
        title: "✨ Sessão finalizada com sucesso!",
        description: "Sua dose diária de energia foi registrada. Parabéns!"
      }
    },

    health: {
      daily_reminder: {
        title: "🌅 Hora do seu sol diário!",
        description: "O momento perfeito chegou. 15 minutos podem transformar seu dia."
      },
      weather_perfect: {
        title: "☀️ Condições perfeitas agora!",
        description: "Sol ideal para vitamina D. Que tal uma sessão rápida?"
      },
      streak_milestone: {
        title: "🔥 Sequência incrível!",
        description: "{{days}} dias consecutivos! Sua energia está crescendo."
      }
    }
  },

  // Settings page improvements
  settings: {
    header: {
      title: "Suas preferências",
      subtitle: "Personalize sua experiência solar"
    },

    sections: {
      profile: {
        title: "Seu perfil solar",
        description: "Configure para recomendações personalizadas"
      },
      notifications: {
        title: "Lembretes inteligentes",
        description: "Nunca perca o momento perfeito"
      },
      health: {
        title: "Integração com saúde",
        description: "Conecte com seus apps de bem-estar"
      },
      data: {
        title: "Seus dados",
        description: "Controle e backup das suas informações"
      }
    },

    actions: {
      sync_health: {
        title: "Conectar com Apple Saúde",
        description: "Compartilhe seus progressos automaticamente"
      },
      export_data: {
        title: "Baixar meus dados",
        description: "Tenha controle total das suas informações"
      },
      clear_data: {
        title: "Limpar tudo",
        description: "Começar do zero (não pode ser desfeito)"
      }
    }
  },

  // Error states and loading
  states: {
    loading: {
      initial: "Preparando seu ambiente solar...",
      location: "Encontrando sua localização...",
      weather: "Verificando condições do sol...",
      sync: "Sincronizando seus dados..."
    },

    errors: {
      location: {
        title: "Precisamos da sua localização",
        description: "Para recomendações precisas, permita acesso à localização",
        action: "Permitir localização"
      },
      network: {
        title: "Sem conexão com a internet",
        description: "Vamos usar dados locais por enquanto",
        action: "Tentar novamente"
      },
      general: {
        title: "Algo deu errado",
        description: "Mas não se preocupe, seus dados estão seguros",
        action: "Tentar novamente"
      }
    },

    empty: {
      no_sessions: {
        title: "Sua jornada solar começa aqui",
        description: "Comece sua primeira sessão e veja a magia acontecer",
        action: "Começar primeira sessão"
      }
    }
  },

  // Educational content
  education: {
    vitaminD: {
      title: "Por que vitamina D é tão importante?",
      benefits: [
        "💪 Ossos mais fortes e resistentes",
        "😊 Humor melhor e menos estresse", 
        "⚡ Mais energia durante o dia",
        "🛡️ Sistema imunológico fortalecido",
        "❤️ Coração mais saudável",
        "🧠 Memória e concentração aprimoradas"
      ]
    },

    safety: {
      title: "Sol com segurança",
      tips: [
        "⏰ Melhores horários: 10h às 14h",
        "🧴 Use protetor nas áreas sensíveis",
        "💧 Mantenha-se hidratado",
        "👀 Proteja os olhos",
        "📏 Comece com sessões curtas",
        "🌡️ Evite horários muito quentes"
      ]
    }
  }
};

// Helper functions for dynamic content
export const getPersonalizedMessage = (userName?: string, timeOfDay: 'morning' | 'afternoon' | 'evening' = 'morning') => {
  const greetings = {
    morning: [`Bom dia${userName ? `, ${userName}` : ''}!`, "Que tal começar o dia com energia solar?"],
    afternoon: [`Boa tarde${userName ? `, ${userName}` : ''}!`, "Hora perfeita para uma dose de vitamina D"],
    evening: [`Boa noite${userName ? `, ${userName}` : ''}!`, "Veja como foi seu progresso solar hoje"]
  };
  
  return greetings[timeOfDay];
};

export const getMotivationalQuote = () => {
  const quotes = [
    "Cada raio de sol é uma oportunidade de energia renovada.",
    "15 minutos de sol hoje = mais disposição amanhã.",
    "Sua saúde agradece cada sessão solar que você faz.",
    "O sol é gratuito, mas os benefícios são inestimáveis.",
    "Pequenos momentos ao sol, grandes transformações na vida."
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const getContextualTip = (uvIndex: number, timeOfDay: number) => {
  if (uvIndex === 0) {
    return "🌙 Período noturno - hora de descansar e se preparar para o sol de amanhã!";
  }
  
  if (uvIndex <= 2) {
    return "🌅 Sol suave - momento ideal para sessões mais longas e relaxantes.";
  }
  
  if (uvIndex <= 5 && timeOfDay >= 10 && timeOfDay <= 14) {
    return "⭐ Condições perfeitas! Este é o momento ideal para sua dose diária.";
  }
  
  if (uvIndex > 7) {
    return "🔥 Sol intenso - sessões curtas de 10-15 minutos são mais eficazes.";
  }
  
  return "☀️ Bom momento para aproveitar o sol com consciência e cuidado.";
}; 