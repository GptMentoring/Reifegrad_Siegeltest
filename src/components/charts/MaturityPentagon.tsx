import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react';

interface MaturityPentagonProps {
  scores: {
    competence: number;
    tools: number;
    structure: number;
    products: number;
    strategy: number;
  };
  widgetConfig: { primaryColor: string };
}

export function MaturityPentagon({ scores, widgetConfig }: MaturityPentagonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { key: 'competence', label: 'Kompetenz aufbauen', shortLabel: 'KO', value: scores.competence },
    { key: 'tools', label: 'Tools einsetzen', shortLabel: 'TO', value: scores.tools },
    { key: 'structure', label: 'Struktur & Steuerung', shortLabel: 'ST', value: scores.structure },
    { key: 'products', label: 'KI-Produkte', shortLabel: 'PR', value: scores.products },
    { key: 'strategy', label: 'Strategie', shortLabel: 'ST', value: scores.strategy }
  ];

  // Calculate points for current state pentagon
  const currentPoints = categories.map((cat, i) => {
    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
    const radius = (cat.value / 5) * 40; // Scale from 0-5 to fit SVG
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Calculate points for ideal state pentagon (all values at 5.0)
  const idealPoints = categories.map((_, i) => {
    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
    const radius = 40; // Maximum radius (represents 5.0)
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <>
      <div 
        className={`cursor-pointer transition-all duration-300 w-full max-h-[70vh] ${
          isExpanded 
            ? "fixed inset-0 z-50 m-4 md:m-12 p-8 flex flex-col items-center justify-center bg-white" 
            : "aspect-square max-w-[400px] mx-auto"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`flex items-center justify-between ${isExpanded ? 'mb-4' : 'hidden'}`}>
          <h3 className="text-xl font-bold">KI-Reifegrad Übersicht</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: widgetConfig.primaryColor }}
              ></div>
              <span className="text-sm">Aktueller Stand</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `${widgetConfig.primaryColor}30` }}
              ></div>
              <span className="text-sm">Optimum (Level 5.0)</span>
            </div>
            <ZoomIn className="w-5 h-5 ml-4 text-gray-400" />
          </div>
        </div>
        
        <div className={`relative w-full aspect-square mx-auto ${isExpanded ? "max-w-3xl" : ""}`}>
          <svg viewBox="-10 -10 120 120" className="w-full h-full">
            {/* Background pentagons */}
            {[1, 2, 3, 4, 5].map((level) => {
              const points = categories.map((_, i) => {
                const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                const radius = (level / 5) * 35; // Reduced radius for more compact display
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ');
              
              return (
                <polygon
                  key={level}
                  points={points}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                />
              );
            })}
            
            {/* Axis lines */}
            {categories.map((_, i) => {
              const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
              const x = 50 + 35 * Math.cos(angle);
              const y = 50 + 35 * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                />
              );
            })}
            
            {/* Ideal state polygon */}
            <polygon
              points={idealPoints}
              fill={widgetConfig.primaryColor}
              fillOpacity="0.1"
              stroke={widgetConfig.primaryColor}
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            
            {/* Current state polygon */}
            <polygon
              points={currentPoints}
              fill={widgetConfig.primaryColor}
              fillOpacity="0.2"
              stroke={widgetConfig.primaryColor}
              strokeWidth="2"
            />
            
            {/* Labels */}
            {categories.map((cat, i) => {
              const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
              const labelDistance = 45; // Reduced distance for more compact display
              const labelX = 50 + labelDistance * Math.cos(angle);
              const labelY = 50 + labelDistance * Math.sin(angle);
              
              const fontSize = isExpanded ? '4px' : '2.5px';
              const scoreFontSize = isExpanded ? '3.5px' : '2px';
              
              return (
                <g key={i}>
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize }}
                    className="font-medium"
                    fill="#374151"
                  >
                    {cat.label}
                  </text>
                  <text
                    x={labelX}
                    y={labelY + (isExpanded ? 6 : 4.5)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: scoreFontSize }}
                    fill="#6B7280"
                  >
                    Level {cat.value.toFixed(1)} / 5.0
                  </text>
                </g>
              );
            })}
            
            {/* Scale numbers */}
            {[1, 2, 3, 4, 5].map((value) => (
              <text
                key={value}
                x="50"
                y={48 - ((value - 1) * 10)}
                textAnchor="middle"
                className="text-[2.5px] fill-gray-400"
              >
                {value.toFixed(1)}
              </text>
            ))}
          </svg>
        </div>

        {/* Legend for non-expanded state */}
        {!isExpanded && (
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: widgetConfig.primaryColor }}
              ></div>
              <span className="text-xs text-gray-600">Aktueller Stand</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: `${widgetConfig.primaryColor}30` }}
              ></div>
              <span className="text-xs text-gray-600">Optimum (Level 5.0)</span>
            </div>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}