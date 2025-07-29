import React from 'react';
import { BookOpen, Wrench, Settings, Cpu, Target, BarChart as ChartBar } from 'lucide-react';
import { MaturityPentagon } from './MaturityPentagon';
import { CategoryAnalysis } from './CategoryAnalysis';
import { FocusAreas } from './FocusAreas';

interface AnalysisChartsProps {
  answers: Record<string, string>;
  widgetConfig: { primaryColor: string };
  cachedFocusAreas?: {
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

export function AnalysisCharts({ answers, widgetConfig, cachedFocusAreas }: AnalysisChartsProps) {

  // --- Die Berechnungsfunktionen bleiben unverändert ---
  const calculateMaturityScores = () => {
     // Beinhaltet: category, score, icon, relevantAnswers für jede Kategorie
     // Gekürzt zur Lesbarkeit - Annahme: Funktion ist korrekt
     const scoresData = [
       { category: 'Kompetenz aufbauen', score: calculateCompetenceScore(), icon: <BookOpen className="w-5 h-5" />, relevantAnswers: { /* ... IDs 1.x ... */ } }, // Icon Größe hier angepasst
       { category: 'Tools einsetzen', score: calculateToolsScore(), icon: <Wrench className="w-5 h-5" />, relevantAnswers: { /* ... IDs 2.x ... */ } },
       { category: 'Struktur & Steuerung', score: calculateStructureScore(), icon: <Settings className="w-5 h-5" />, relevantAnswers: { /* ... IDs 3.x ... */ } },
       { category: 'KI-Produkte', score: calculateProductScore(), icon: <Cpu className="w-5 h-5" />, relevantAnswers: { /* ... IDs 4.x ... */ } },
       { category: 'Strategie', score: calculateStrategyScore(), icon: <Target className="w-5 h-5" />, relevantAnswers: { /* ... IDs 5.x ... */ } }
     ];
     // WICHTIG: Stelle sicher, dass die relevantAnswers hier korrekt befüllt werden!
     for (const scoreData of scoresData) {
        const categoryPrefix = scoreData.category.match(/^\d/)?.[0] || ''; // Extract first digit if exists
         if (categoryPrefix) {
             scoreData.relevantAnswers = Object.keys(answers)
                 .filter(key => key.startsWith(categoryPrefix + '.'))
                 .reduce((obj, key) => { obj[key] = answers[key]; return obj; }, {} as Record<string, string>);
         }
     }
     return scoresData;
  };
  const calculateAverageScore = (questionIds: string[]): number => {
     const validScores = questionIds
       .map(id => answers[id])
       .filter(answer => answer && !isNaN(Number(answer)))
       .map(answer => Number(answer));
     if (validScores.length === 0) return 0;
     return Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1));
  };
  const calculateCompetenceScore = (): number => calculateAverageScore(['1.1', '1.2', '1.3', '1.4', '1.5']);
  const calculateToolsScore = (): number => calculateAverageScore(['2.1', '2.2', '2.3', '2.4', '2.5']);
  const calculateStructureScore = (): number => calculateAverageScore(['3.1', '3.2', '3.3', '3.4', '3.5']);
  const calculateProductScore = (): number => calculateAverageScore(['4.1', '4.2', '4.3', '4.4', '4.5']);
  const calculateStrategyScore = (): number => calculateAverageScore(['5.1', '5.2', '5.3', '5.4', '5.5']);

  const maturityScores = calculateMaturityScores();
  const scores = {
    competence: calculateCompetenceScore(),
    tools: calculateToolsScore(),
    structure: calculateStructureScore(),
    products: calculateProductScore(),
    strategy: calculateStrategyScore()
  };
  // --- Ende Berechnungsfunktionen ---


  return (
    // Hauptcontainer: Mobile = flex-col, Desktop = grid mit 2 Spalten
    // Dies ist die Struktur, die die unterschiedliche Reihenfolge ermöglicht
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6">

      {/* 1. Pentagon Chart Wrapper */}
      {/* Mobile: order-1 (erste Position) */}
      {/* Desktop: lg:col-span-1 (erste Spalte, erste Zeile) */}
      <div className="order-1 lg:col-span-1">
        <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
            <ChartBar className="w-4 h-4 sm:w-5 sm:h-5" />
            KI-Reifegrad Pentagon
          </h3>
          <MaturityPentagon
            scores={scores}
            widgetConfig={widgetConfig}
          />
        </div>
      </div>

      {/* 2. Category Analysis Wrapper */}
      {/* Mobile: order-2 (zweite Position) */}
      {/* Desktop: lg:col-span-1 (zweite Spalte), lg:row-span-2 (nimmt beide Zeilen ein) */}
      <div className="order-2 lg:col-span-1 lg:row-span-2">
        <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-gray-100 h-full">
          <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
             <ChartBar className="w-4 h-4 sm:w-5 sm:h-5" />
             KI-Reifegrad nach Kategorien
          </h3>
          <div className="space-y-4">
            {maturityScores.map((score) => (
              <div key={score.category} className="p-2 sm:p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${widgetConfig.primaryColor}20` }}>
                     {/* Verwende React.cloneElement für Icon-Styling */}
                     {React.isValidElement(score.icon) ? React.cloneElement(score.icon, { className: "w-5 h-5" }) : null}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-sm mb-1">{score.category}</h4>
                    <div className="h-1.5 bg-gray-100 rounded-full mb-1">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(score.score / 5) * 100}%`, backgroundColor: widgetConfig.primaryColor }}></div>
                    </div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-500">Level {score.score.toFixed(1)}</span>
                      <span className="font-medium" style={{ color: widgetConfig.primaryColor }}>
                        {score.score <= 2.5 ? 'Basic' : score.score <= 4 ? 'Pro' : 'Expert'}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      {/* Stelle sicher, dass relevantAnswers korrekt übergeben wird */}
                      <CategoryAnalysis
                        category={score.category}
                        // Stelle sicher, dass relevantAnswers alle nötigen Antworten enthält
                        answers={score.relevantAnswers || {}}
                        score={score.score}
                        widgetConfig={widgetConfig}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Focus Areas Wrapper */}
      {/* Mobile: order-3 (dritte Position) */}
      {/* Desktop: lg:col-span-1 (erste Spalte, zweite Zeile) */}
      <div className="order-3 lg:col-span-1">
        <FocusAreas
         answers={answers}
         widgetConfig={widgetConfig}
         scores={scores}
         cachedFocusAreas={cachedFocusAreas}
        />
      </div>

    </div>
  );
}