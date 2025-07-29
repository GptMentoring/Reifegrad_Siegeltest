import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';

interface VariantSelectorProps {
  selectedVariants: number;
  onVariantChange: (count: number) => void;
  widgetConfig: { primaryColor: string };
  onContinue?: () => void;
}

export function VariantSelector({ 
  selectedVariants, 
  onVariantChange, 
  widgetConfig,
  onContinue 
}: VariantSelectorProps) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Anzahl der Varianten</h3>
      <p className="text-sm text-gray-600 mb-3">
        Wählen Sie, wie viele verschiedene Versionen der Pressemitteilung generiert werden sollen.
      </p>
      
      <div className="space-y-2 mb-4">
        {[1, 2, 3].map((count) => (
          <button
            key={count}
            onClick={() => onVariantChange(count)}
            className={`block w-full text-left p-3 border-2 rounded-lg transition-colors ${
              selectedVariants === count 
                ? 'bg-opacity-10' 
                : 'bg-white hover:bg-gray-50'
            }`}
            style={{ 
              borderColor: selectedVariants === count 
                ? widgetConfig.primaryColor 
                : 'transparent',
              backgroundColor: selectedVariants === count 
                ? `${widgetConfig.primaryColor}10` 
                : undefined
            }}
          >
            <div className="flex items-center">
              <div 
                className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  selectedVariants === count ? 'border-0' : 'border-gray-400'
                }`}
                style={{ 
                  backgroundColor: selectedVariants === count 
                    ? widgetConfig.primaryColor 
                    : 'white' 
                }}
              >
                {selectedVariants === count && (
                  <span className="text-white text-xs">✓</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="font-medium">{count} {count === 1 ? 'Variante' : 'Varianten'}</span>
                  <p className="text-sm text-gray-600">
                    {count === 1 
                      ? 'Eine fokussierte Version der Pressemitteilung.' 
                      : count === 2 
                        ? 'Zwei unterschiedliche Ansätze für Ihre Pressemitteilung.' 
                        : 'Drei verschiedene Versionen mit unterschiedlichen Schwerpunkten.'}
                  </p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <button
        onClick={onContinue}
        className="w-full py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2"
        style={{ backgroundColor: widgetConfig.primaryColor }}
      >
        Weiter
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}