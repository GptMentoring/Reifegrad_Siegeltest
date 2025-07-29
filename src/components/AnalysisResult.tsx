import React, { useState, useEffect } from 'react';
import { Brain, BarChart as ChartBar } from 'lucide-react';
import { AnalysisCharts } from './charts/AnalysisCharts';
import { ConsultationCTA } from './ConsultationCTA';

interface CachedAnalysis {
  focusAreas: {
    quickWins: Array<{
      title: string;
      description: string;
      timeline: string;
      baseAnswer?: string;
    }>;
    strategicFocus: Array<{
      title: string;
      description: string;
      timeline: string;
      baseAnswer?: string;
    }>;
  };
}

interface AnalysisResultProps {
  onRestart: () => void;
  onEditAnswers: () => void;
  widgetConfig: { primaryColor: string };
  answers: Record<string, string>;
}

export function AnalysisResult({ onRestart, onEditAnswers, widgetConfig, answers }: AnalysisResultProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [cachedAnalysis, setCachedAnalysis] = useState<CachedAnalysis | null>(null);
  const [progress, setProgress] = useState(0);

  // Helper function to calculate average scores
  const calculateAverageScore = (questionIds: string[]): number => {
    const validScores = questionIds
      .map(id => answers[id])
      .filter(answer => answer && !isNaN(Number(answer)))
      .map(answer => Number(answer));

    if (validScores.length === 0) return 0;
    return Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1));
  };

  // Calculate level from scores
  const calculateLevelFromScores = (scores: number[]): { score: number; label: string } => {
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const roundedScore = Number(averageScore.toFixed(1));

    let levelLabel = 'Einsteiger';
    if (roundedScore >= 1.5 && roundedScore < 2.5) {
      levelLabel = 'Fortgeschritten';
    } else if (roundedScore >= 2.5 && roundedScore < 3.5) {
      levelLabel = 'Kompetent';
    } else if (roundedScore >= 3.5 && roundedScore < 4.5) {
      levelLabel = 'Experte';
    } else if (roundedScore >= 4.5) {
      levelLabel = 'Vorreiter';
    }

    return { score: roundedScore, label: levelLabel };
  };

  // Calculate scores for each category
  const calculateScores = () => {
    return {
      competence: calculateAverageScore(['1.1', '1.2', '1.3', '1.4', '1.5']),
      tools: calculateAverageScore(['2.1', '2.2', '2.3', '2.4', '2.5']),
      structure: calculateAverageScore(['3.1', '3.2', '3.3', '3.4', '3.5']),
      products: calculateAverageScore(['4.1', '4.2', '4.3', '4.4', '4.5']),
      strategy: calculateAverageScore(['5.1', '5.2', '5.3', '5.4', '5.5'])
    };
  };

  // Find strongest and weakest areas
  const findStrengthsAndWeaknesses = () => {
    const areas = [
      { name: 'Kompetenz', score: calculateAverageScore(['1.1', '1.2', '1.3', '1.4', '1.5']) },
      { name: 'Tools', score: calculateAverageScore(['2.1', '2.2', '2.3', '2.4', '2.5']) },
      { name: 'Struktur', score: calculateAverageScore(['3.1', '3.2', '3.3', '3.4', '3.5']) },
      { name: 'Produkte', score: calculateAverageScore(['4.1', '4.2', '4.3', '4.4', '4.5']) },
      { name: 'Strategie', score: calculateAverageScore(['5.1', '5.2', '5.3', '5.4', '5.5']) }
    ];

    const sorted = [...areas].sort((a, b) => b.score - a.score);
    return {
      strongest: sorted[0],
      weakest: sorted[sorted.length - 1]
    };
  };

  // Calculate overall maturity level
  const calculateOverallLevel = (): { score: number; label: string } => {
    const scores = [
      calculateAverageScore(['1.1', '1.2', '1.3', '1.4', '1.5']), // Kompetenz
      calculateAverageScore(['2.1', '2.2', '2.3', '2.4', '2.5']), // Tools
      calculateAverageScore(['3.1', '3.2', '3.3', '3.4', '3.5']), // Struktur
      calculateAverageScore(['4.1', '4.2', '4.3', '4.4', '4.5']), // Produkte
      calculateAverageScore(['5.1', '5.2', '5.3', '5.4', '5.5'])  // Strategie
    ];
    
    return calculateLevelFromScores(scores);
  };

  const overallLevel = calculateOverallLevel();
  const { strongest, weakest } = findStrengthsAndWeaknesses();
  const scores = calculateScores();

  const getWelcomeContent = () => {
    if (overallLevel.score > 3.5) {
      return {
        title: "Herzlichen Glückwunsch! Sie haben sich als „KI-Pionier" qualifiziert!",
        description: "Innerhalb von 5 Werktagen melden wir uns mit dem Resultat unserer internen Prüfung bei Ihnen und informieren Sie, ob Ihr Unternehmen als KI-Pionier ausgezeichnet wird. In der Zwischenzeit, zeigt unsere kostenfreie Analyse Ihnen, wo Sie bereits stark sind und wo noch Entwicklungspotenzial besteht"
      };
    } else {
      return {
        title: "Willkommen zu Ihrer KI-Reifegrad Analyse",
        description: "Diese Analyse bietet Ihnen eine detaillierte Momentaufnahme Ihres aktuellen KI-Reifegrads. Sie zeigt auf, wo Sie bereits stark sind und wo noch Entwicklungspotenzial                            besteht."
      };
    }
  };
  
  const welcomeContent = getWelcomeContent();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4">
        <div ref={contentRef}>

          {/* Welcome and Management Summary */}
          <div className="mb-8">
            <div 
              className="rounded-xl p-6 mb-6"
              style={{ backgroundColor: `${widgetConfig.primaryColor}10` }}
            >
              {/* Header with Logo */}
              {/* Header with Logo in white container */}
              <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm mb-4 border border-gray-100">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
                  <img 
                    src="/2ba logo.png" 
                    alt="2bAHEAD" 
                    className="h-10 sm:h-12 w-auto flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-2">
                      <Brain className="w-6 h-6" style={{ color: widgetConfig.primaryColor }} />
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: widgetConfig.primaryColor }}>
                        Herzlichen Glückwunsch! Sie haben sich als „KI-Pionier“ qualifiziert!
                      </h1>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                     Innerhalb von 5 Werktagen melden wir uns mit dem Resultat unserer internen Prüfung bei Ihnen und informieren Sie, 
                     ob Ihr Unternehmen als KI-Pionier ausgezeichnet wird.
                     <br /> In der Zwischenzeit, zeigt unsere kostenfreie Analyse Ihnen, 
                     wo Sie bereits stark sind und wo noch Entwicklungspotenzial besteht
                    </p>
                  </div>
                </div>
              </div>
              

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-medium mb-1">Gesamtbewertung</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold" style={{ color: widgetConfig.primaryColor }}>
                      {overallLevel.score.toFixed(1)}
                    </span>
                    <span className="text-gray-600">/ 5.0</span>
                  </div>
                  <p className="text-sm text-gray-600">Level: {overallLevel.label}</p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-medium mb-1">Stärkster Bereich</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold" style={{ color: widgetConfig.primaryColor }}>
                      {strongest.score.toFixed(1)}
                    </span>
                    <span className="text-gray-600">/ 5.0</span>
                  </div>
                  <p className="text-sm text-gray-600">{strongest.name}</p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-medium mb-1">Größtes Potenzial</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold" style={{ color: widgetConfig.primaryColor }}>
                      {weakest.score.toFixed(1)}
                    </span>
                    <span className="text-gray-600">/ 5.0</span>
                  </div>
                  <p className="text-sm text-gray-600">{weakest.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Analysis */}
        <AnalysisCharts 
          answers={answers}
          widgetConfig={widgetConfig}
          cachedFocusAreas={cachedAnalysis}
        />
        
        {/* Consultation CTA Banner */}
        <ConsultationCTA widgetConfig={widgetConfig} />
      </div>
    </div>
  );
}