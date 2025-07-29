import React from 'react';
import { useEffect, useState } from 'react';
import { generateCategoryAnalysis } from '../../lib/gemini';
import { AlertCircle } from 'lucide-react';

interface CategoryAnalysisProps {
  category: string;
  answers: Record<string, string>;
  score: number;
  widgetConfig: { primaryColor: string };
}

export function CategoryAnalysis({ category, answers, score, widgetConfig }: CategoryAnalysisProps) {
  const [analysis, setAnalysis] = useState<{
    summary: string[];
    recommendations: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAnalysis() {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await generateCategoryAnalysis(category, answers, score);
        if (isMounted) {
          setAnalysis(result);
          setError(null);
        }
      } catch (error: any) {
        console.error('Error fetching analysis:', error);
        if (isMounted) {
          setError('Es ist ein Fehler bei der Analyse aufgetreten. Die Analyse wird automatisch erneut versucht...');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchAnalysis();

    return () => {
      isMounted = false;
    };
  }, [category, answers, score]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Current State */}
      <div>
        <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: widgetConfig.primaryColor }}
          ></div>
          Aktuelle Situation
        </h5>
        <ul className="space-y-2">
          {analysis.summary.map((point, index) => (
            <li 
              key={`summary-${index}`} 
              className="text-sm text-gray-600 pl-4 relative"
            >
              <div 
                className="absolute left-0 top-2 w-1 h-1 rounded-full"
                style={{ backgroundColor: `${widgetConfig.primaryColor}80` }}
              ></div>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div>
        <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: widgetConfig.primaryColor }}
          ></div>
          Empfehlungen
        </h5>
        <ul className="space-y-2">
          {analysis.recommendations.map((point, index) => (
            <li 
              key={`rec-${index}`} 
              className="text-sm text-gray-600 pl-4 relative"
            >
              <div 
                className="absolute left-0 top-2 w-1 h-1 rounded-full"
                style={{ backgroundColor: `${widgetConfig.primaryColor}80` }}
              ></div>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}