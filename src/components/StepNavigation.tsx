import React from 'react';
import { ArrowLeft, Activity, BookOpen, Wrench, Settings, Cpu, Target } from 'lucide-react';
import { Step } from '../types';

interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  answers: Record<string, string>;
  widgetConfig: { primaryColor: string };
  onGoBack?: () => void;
  canGoBack?: boolean;
}

export function StepNavigation({ 
  steps, 
  currentStep, 
  onStepChange, 
  answers, 
  widgetConfig,
  onGoBack,
  canGoBack = false
}: StepNavigationProps) {
  // Calculate progress percentage
  const totalQuestions = steps.reduce((acc, step) => acc + step.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

  // Define the 5 pillars with their icons and labels
  const pillars = [
    { icon: BookOpen, label: 'Kompetenz', description: 'Kompetenz aufbauen' },
    { icon: Wrench, label: 'Tools', description: 'Tools gezielt einsetzen' },
    { icon: Settings, label: 'Struktur', description: 'Struktur und Steuerung' },
    { icon: Cpu, label: 'Produkte', description: 'KI-Produkte entwickeln' },
    { icon: Target, label: 'Strategie', description: 'Langfristige Strategien' }
  ];

  return (
    <div className="mb-4 p-2 lg:p-4">
      {/* Overall progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">Gesamtfortschritt</h2>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium">{progressPercentage}% abgeschlossen</span>
          </div>
        </div>
        
        {/* Progress bar with gradient and animation */}
        <div className="w-full h-3 bg-gray-100 rounded-full relative overflow-hidden">
          <div 
            className="h-full transition-all duration-500 ease-out relative rounded-full"
            style={{ 
              width: `${progressPercentage}%`,
              background: `linear-gradient(90deg, ${widgetConfig.primaryColor}80, ${widgetConfig.primaryColor})`
            }}
          >
            {/* Shimmer effect */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                animation: 'shimmer 2s infinite linear'
              }}
            />
          </div>
        </div>
      </div>

      {/* Pillar navigation - Desktop only */}
      <div className="hidden lg:flex relative flex-row justify-between items-center mb-4 gap-2">
        {/* Connecting line background */}
        <div
          className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2"
          style={{ backgroundColor: '#e5e7eb' }}
        />
        
        {/* Progress line */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 transition-all duration-500 ease-out"
          style={{ 
            width: `${((currentStep - 1) / (pillars.length - 1)) * 100}%`,
            backgroundColor: widgetConfig.primaryColor
          }}
        />

        {/* Pillars */}
        {pillars.map((pillar, index) => {
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;
          const stepAnswers = steps[index]?.questions.filter(q => answers[q.id]).length || 0;
          const stepTotal = steps[index]?.questions.length || 0;
          const stepProgress = stepTotal > 0 ? Math.round((stepAnswers / stepTotal) * 100) : 0;
          
          return (
            <div 
              key={index}
              className={`relative flex flex-col items-center gap-1 cursor-pointer p-2
                ${isActive ? 'transform scale-105' : ''}
                transition-all duration-300 ease-out`}
              onClick={() => onStepChange(index + 1)}
            >
              {/* Circular Progress */}
              <div className="relative w-10 h-10">
                {/* Background circle */}
                <svg className="absolute w-full h-full -rotate-90">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  {/* Progress circle */}
                  {stepProgress > 0 && !isCompleted && (
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      fill="none"
                      stroke={widgetConfig.primaryColor}
                      strokeWidth="4"
                      strokeDasharray={`${stepProgress * 1.76} 176`}
                      className="transition-all duration-800 ease-in-out"
                    />
                  )}
                </svg>

                {/* Icon circle */}
                <div 
                  className={`
                    absolute inset-2 rounded-full flex items-center justify-center
                    transition-all duration-300 ease-out
                    ${isActive ? 'shadow-lg' : isCompleted ? 'shadow-md' : 'shadow-sm'}
                    ${isActive ? 'ring-4' : isCompleted ? 'ring-2' : 'ring-1'}
                  `}
                  style={{
                    backgroundColor: isCompleted || isActive ? widgetConfig.primaryColor : 'white',
                    color: isCompleted || isActive ? 'white' : '#9ca3af',
                    ringColor: `${widgetConfig.primaryColor}30`
                  }}
                >
                  <pillar.icon className="w-4 h-4" />
                </div>
              </div>

              {/* Label */}
              <div className="text-center">
                <span className={`
                  text-xs font-medium block
                  transition-all duration-300
                  ${isActive ? 'text-gray-900' : 'text-gray-500'}
                `}>
                  {pillar.label}
                </span>
                <span className={`text-[10px] transition-all duration-300
                  ${isActive ? 'text-gray-600' : 'text-gray-400'}
                `}>
                  {isCompleted && '✓ '}
                  {pillar.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-2 mt-2">
        {canGoBack && onGoBack && (
          <button
            onClick={onGoBack}
            className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 
                     transition-all duration-200 ease-out text-xs flex items-center gap-1
                     hover:shadow-sm active:scale-95 ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </button>
        )}
        
        {currentStep < steps.length && Object.keys(answers).length > 0 && (
          <button
            onClick={() => onStepChange(currentStep + 1)}
            className="px-4 py-2 rounded-lg text-white text-sm
                     transition-all duration-200 ease-out
                     hover:shadow-md active:scale-95"
            style={{ backgroundColor: widgetConfig.primaryColor }}
          >
            Weiter
          </button>
        )}
      </div>
    </div>
  );
}