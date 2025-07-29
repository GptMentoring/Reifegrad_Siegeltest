import React from 'react';
import { Brain, Star, AlertTriangle, ArrowUpRight, Target } from 'lucide-react';
import { AnalysisResult } from '../../types';

interface AnalysisResultCardProps {
  analysis: AnalysisResult;
  isLoading?: boolean;
  widgetConfig: { primaryColor: string };
}

export function AnalysisResultCard({ analysis, isLoading, widgetConfig }: AnalysisResultCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Brain className="w-8 h-8" style={{ color: widgetConfig.primaryColor }} />
        KI-Reifegrad Analyse & Empfehlungen
      </h3>

      {Object.values(analysis).every(arr => arr.length === 0) ? (
        <div className="text-center text-gray-500 py-4">
          Analyse wird geladen... Bitte haben Sie einen Moment Geduld.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section
            title="Ihre Stärken"
            items={analysis.strengths}
            icon={<Star className="w-5 h-5 text-yellow-500" />}
            widgetConfig={widgetConfig}
          />
          
          <Section
            title="Potenzielle Herausforderungen"
            items={analysis.challenges}
            icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
            widgetConfig={widgetConfig}
          />
          
          <Section
            title="Entwicklungsempfehlungen"
            items={analysis.recommendations}
            icon={<ArrowUpRight className="w-5 h-5 text-blue-500" />}
            widgetConfig={widgetConfig}
          />
          
          <Section
            title="Entwicklungspotenziale"
            items={analysis.developmentAreas}
            icon={<Target className="w-5 h-5 text-green-500" />}
            widgetConfig={widgetConfig}
          />
        </div>
      )}
    </div>
  );
}

interface SectionProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  widgetConfig: { primaryColor: string };
}

function Section({ title, items, icon, widgetConfig }: SectionProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold flex items-center gap-2">
        {icon}
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2 text-gray-700">
            <span style={{ color: widgetConfig.primaryColor }} className="font-bold min-w-[12px]">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}