import React, { useEffect, useState } from 'react';
import { Lightbulb, Rocket, Settings, ArrowRight, Clock } from 'lucide-react';
import { generateFocusAreas } from '../../lib/gemini';

interface FocusArea {
  title: string;
  description: string;
  timeline: string;
  baseAnswer?: string;
}

interface FocusAreasProps {
  answers: Record<string, string>;
  widgetConfig: { primaryColor: string };
  cachedFocusAreas?: {
    quickWins: FocusArea[];
    strategicFocus: FocusArea[];
  };
  scores: {
    competence: number;
    tools: number;
    structure: number;
    products: number;
    strategy: number;
  };
}

export function FocusAreas({ answers, widgetConfig, scores, cachedFocusAreas }: FocusAreasProps) {
  const [focusAreas, setFocusAreas] = useState<{
    quickWins: FocusArea[];
    strategicFocus: FocusArea[];
  } | null>(cachedFocusAreas || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFocusAreas() {
      if (cachedFocusAreas) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Format answers for better context
        const formattedAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
          // Remove option prefixes like "a)", "b)", etc.
          const cleanValue = value.replace(/^[a-z]\)\s*/i, '');
          return { ...acc, [key]: cleanValue };
        }, {});
        
        const result = await generateFocusAreas(formattedAnswers, scores);
        setFocusAreas(result);
      } catch (error) {
        console.error('Error fetching focus areas:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFocusAreas();
  }, [answers, scores]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Lightbulb className="w-6 h-6" style={{ color: widgetConfig.primaryColor }} />
          Ihre Prioritäten für die nächsten Schritte
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-t-xl mb-4"></div>
              <div className="space-y-4 p-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!focusAreas) return null;

  const areas = {
    quickWins: {
      title: 'Quick Wins',
      period: '4 Wochen',
      icon: Rocket,
      items: focusAreas.quickWins
    },
    strategicFocus: {
      title: 'Strategischer Fokus',
      period: '6 Monate',
      icon: Settings,
      items: focusAreas.strategicFocus
    }
  };

  return (
    <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Lightbulb className="w-6 h-6" style={{ color: widgetConfig.primaryColor }} />
        Ihre Prioritäten für die nächsten Schritte
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
        {Object.entries(areas).map(([key, area]) => (
          <div 
            key={key}
            className="rounded-xl border transition-all duration-800 overflow-hidden hover:shadow-lg"
            style={{ borderColor: `${widgetConfig.primaryColor}30` }}
          >
            {/* Header */}
            <div 
              className="p-2 sm:p-4 flex items-center gap-2 sm:gap-3"
              style={{ backgroundColor: `${widgetConfig.primaryColor}10` }}
            >
              <div 
                className="p-1.5 sm:p-2 rounded-lg"
                style={{ backgroundColor: `${widgetConfig.primaryColor}20` }}
              >
                <area.icon 
                  className="w-5 h-5"
                  style={{ color: widgetConfig.primaryColor }}
                />
              </div>
              <div>
                <h4 className="font-semibold">{area.title}</h4>
                <p className="text-sm text-gray-600">Für die nächsten {area.period}</p>
              </div>
            </div>

            {/* Items */}
            <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
              {area.items.map((item, index) => (
                <div 
                  key={index}
                  className="rounded-lg p-2 sm:p-4 transition-all duration-800 hover:scale-[1.02]"
                  style={{ backgroundColor: `${widgetConfig.primaryColor}05` }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ backgroundColor: `${widgetConfig.primaryColor}20` }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">{item.title}</h5>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      {item.baseAnswer && (
                        <p className="text-xs text-gray-500 mb-2">
                          Basierend auf Ihrer Antwort: "{item.baseAnswer}"
                        </p>
                      )}
                      <div 
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${widgetConfig.primaryColor}15`,
                          color: widgetConfig.primaryColor
                        }}
                      >
                        <Clock className="w-3 h-3" />
                        {item.timeline}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}