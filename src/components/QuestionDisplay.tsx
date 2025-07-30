import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types'; // Stelle sicher, dass der Pfad zu 'types' korrekt ist
import { Lightbulb, ArrowLeft, Activity, BookOpen, Wrench, Settings, Cpu, Target } from 'lucide-react';
import { RatingScale } from './RatingScale';
import { questionTips } from './questionTips'; // <-- NEUER IMPORT

interface QuestionDisplayProps {
  question: Question;
  onAnswer: (answer: string) => void;
  onBack?: () => void;
  isLoading: boolean;
  widgetConfig: { primaryColor: string };
  currentStep?: number;
  totalSteps?: number;
  canGoBack?: boolean;
  progress?: number;
  stepTitle?: string;
  stepDescription?: string;
}

export function QuestionDisplay({
  question,
  onAnswer,
  onBack,
  isLoading,
  widgetConfig,
  currentStep = 1,
  totalSteps = 5,
  canGoBack = false,
  progress = 0,
  stepTitle = "",
  stepDescription = ""
}: QuestionDisplayProps) {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>(() => {
    // Initialize with current value if it exists
    if (question.options?.includes(selectedValue)) {
      return [selectedValue];
    }
    return [];
  });
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [clickedOption, setClickedOption] = useState<string | null>(null);
  const [animateOption, setAnimateOption] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Define the 5 pillars with their icons and labels
  const pillars = [
    { icon: BookOpen, label: 'Kompetenz', description: 'Kompetenz aufbauen' },
    { icon: Wrench, label: 'Tools', description: 'Tools gezielt einsetzen' },
    { icon: Settings, label: 'Struktur', description: 'Struktur und Steuerung' },
    { icon: Cpu, label: 'Produkte', description: 'KI-Produkte entwickeln' },
    { icon: Target, label: 'Strategie', description: 'Langfristige Strategien' }
  ];

  // Get current pillar
  const currentPillar = pillars[currentStep - 1];

  // Reset states when question changes
  useEffect(() => {
    setSelectedValue('');
    setSelectedValues([]);
    setSelectedOptions([]);
    setTextInput('');
    setClickedOption(null);
    setAnimateOption(null);
    setShowDescription(false);
  }, [question.id]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [textInput]);

  // Format question text with bold title and line break
  const formatQuestionText = (text: string) => {
    const parts = text.split(':');
    if (parts.length > 1) {
      return (
        <>
          <strong>{parts[0]}:</strong>
          <br />
          {parts.slice(1).join(':')}
        </>
      );
    }
    return text;
  };

  // Handle multiple choice selection with feedback
  const handleOptionSelect = (option: string) => {
    setClickedOption(option);
    setAnimateOption(option);
    
    setTimeout(() => {
      setClickedOption(null);
      setAnimateOption(null);
    }, 300);
    
    if (question.multiSelect) {
      const newSelection = selectedOptions.includes(option)
        ? selectedOptions.filter(o => o !== option)
        : [...selectedOptions, option];
      setSelectedOptions(newSelection);
    } else {
      setSelectedOptions([option]);
      onAnswer(option); // Submit answer immediately for single-select
    }
  };

  // Handle text input submission
  const handleTextSubmit = () => {
    if (textInput.trim() || question.optional) {
      onAnswer(textInput || "");
      if (textareaRef.current) {
        textareaRef.current.classList.add('scale-[0.98]');
        setTimeout(() => {
          textareaRef.current?.classList.remove('scale-[0.98]');
        }, 200);
      }
    }
  };

  // Determine question type
  const getQuestionType = () => {
    if (question.options) {
      // Check if the first option looks like a rating scale value
      if (["1", "2", "3", "4", "5"].includes(question.options[0])) return 'scale';
      return 'choice';
    }
    if (question.isMultiline !== undefined || question.placeholder !== undefined) {
       return 'text';
    }
    // Default assumption if no options or text properties are defined (adjust if needed)
    return 'unknown';
  };

  // Render different input types based on question type
  const renderQuestionInput = () => {
    const type = getQuestionType();

    switch (type) {
      case 'scale':
        return (
          <RatingScale
            key={question.id} // Add key to force re-render on question change
            multiSelect={question.multiSelect}
            question={question}
            value={selectedValue}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
            onChange={(value) => {
              if (!question.multiSelect) {
                setSelectedValue(value);
                onAnswer(value);
              } else {
                // For multi-select, we'll handle submission via the button
                const values = value.split(',').filter(Boolean);
                setSelectedValues(values);
              }
            }}
            disabled={isLoading}
            widgetConfig={widgetConfig}
          >
            {question.multiSelect && selectedValues.length > 0 && (
              <button
                onClick={() => onAnswer(selectedValues.join(','))}
                className="w-full mt-4 p-4 rounded-xl text-white font-medium 
                         transition-all transform hover:shadow-lg hover:scale-[1.01] 
                         active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ backgroundColor: widgetConfig.primaryColor }}
                disabled={isLoading}
              >
                <Activity className="w-4 h-4" />
                {selectedValues.length} Antwort{selectedValues.length !== 1 ? 'en' : ''} senden
              </button>
            )}
          </RatingScale>
        );

      case 'choice':
        return (
          <div className="space-y-3">
            {question.options!.map((option) => {
              const isSelected = selectedOptions.includes(option);
              const isAnimating = animateOption === option;

              return (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all duration-800 ease-in-out
                    transform hover:shadow-lg hover:scale-[1.01]
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${clickedOption === option ? 'scale-[0.98]' : 'scale-100'}
                    ${isAnimating ? 'animate-pulse' : ''}
                    ${isSelected ? 'bg-opacity-10' : 'bg-white hover:bg-gray-50'}
                  `}
                  style={{
                    borderColor: isSelected ? widgetConfig.primaryColor : '#e5e7eb',
                    backgroundColor: isSelected ? `${widgetConfig.primaryColor}1A` : undefined // Use 1A for ~10% opacity hex
                  }}
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                        w-6 h-6 ${question.multiSelect ? 'rounded-md' : 'rounded-full'}
                        flex items-center justify-center flex-shrink-0
                        transition-all duration-800 ease-in-out
                        border-2
                        ${isSelected ? 'scale-110' : 'scale-100'}
                      `}
                      style={{
                        borderColor: isSelected ? widgetConfig.primaryColor : '#d1d5db',
                        backgroundColor: isSelected ? widgetConfig.primaryColor : 'transparent'
                      }}
                    >
                      {isSelected && (
                        <div className={`w-2 h-2 ${question.multiSelect ? 'bg-white rounded-sm' : 'bg-white rounded-full'}`} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{option.replace(/^[a-z]\)\s*/, '')}</div>
                      {isSelected && (
                        <div
                          className="text-sm mt-1 transition-all duration-800"
                          style={{ color: widgetConfig.primaryColor }}
                        >
                          Ausgewählt
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Optional submit button for multi-select */}
            {question.multiSelect && (
              <button
                onClick={() => onAnswer(selectedOptions.join('\n'))}
                className="w-full mt-4 p-4 rounded-xl text-white font-medium
                           transition-all transform hover:shadow-lg hover:scale-[1.01]
                           active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ backgroundColor: widgetConfig.primaryColor }}
                disabled={isLoading || selectedOptions.length === 0}
              >
                <Activity className="w-4 h-4" />
                {selectedOptions.length > 0 
                  ? `${selectedOptions.length} Antwort${selectedOptions.length !== 1 ? 'en' : ''} senden`
                  : 'Bitte wählen Sie mindestens eine Option'}
              </button>
            )}
          </div>
        );

      case 'text':
        return (
          <div>
            {question.isMultiline ? (
              <textarea
                ref={textareaRef}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onBlur={handleTextSubmit} // Submit on blur
                className="w-full p-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 min-h-[120px] resize-none transition-all duration-800 ease-in-out hover:shadow-lg"
                style={{
                  // Use a slightly darker shade for filled state if needed
                  backgroundColor: textInput ? '#f8f8f8' : 'white',
                  borderColor: textInput ? widgetConfig.primaryColor : '#e5e7eb',
                  ringColor: widgetConfig.primaryColor // Ensure focus ring matches primary color
                }}
                disabled={isLoading}
                rows={4}
              />
            ) : (
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={question.placeholder || "Ihre Antwort..."}
                className="w-full p-4 rounded-xl border-2 focus:outline-none
                           focus:ring-2 focus:ring-opacity-50
                           transition-all duration-300 ease-in-out hover:shadow-lg"
                style={{
                   backgroundColor: textInput ? '#f8f8f8' : 'white',
                  borderColor: textInput ? widgetConfig.primaryColor : '#e5e7eb',
                  ringColor: widgetConfig.primaryColor
                }}
                disabled={isLoading}
              />
            )}

            {textInput.trim() || question.optional && (
              <button
                onClick={handleTextSubmit}
                className="w-full mt-4 p-4 rounded-xl text-white font-medium
                           transition-all transform hover:shadow-lg hover:scale-[1.01]
                           active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ backgroundColor: widgetConfig.primaryColor }}
                disabled={isLoading}
              >
                <Activity className="w-4 h-4" />
                Antwort senden
              </button>
            )}
            {(textInput.trim() || question.optional) && (
              <button
                onClick={handleTextSubmit}
                className="w-full mt-4 p-4 rounded-xl text-white font-medium
                           transition-all transform hover:shadow-lg hover:scale-[1.01]
                           active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ backgroundColor: widgetConfig.primaryColor }}
                disabled={isLoading}
              >
                <Activity className="w-4 h-4" />
                Antwort senden
              </button>
            )}
          </div>
        );

       default:
         return <div>Fragetyp nicht unterstützt.</div>;
    }
  };

  // Get the tip for the current question, or a default message
  const currentTip = questionTips[question.id] || "Hier steht bald ein spezifischer Tipp für diese Frage.";

  return (
    <div className="max-w-4xl mx-auto p-2 lg:p-3">
      {/* Header */}
      <div className="mb-3">
        {/* Header with Logo in white container - Desktop only */}
        <div className="hidden lg:block bg-white rounded-lg p-2 sm:p-3 shadow-sm mb-3 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <img 
                src="/2ba logo.png" 
                alt="2bAHEAD" 
                className="h-6 sm:h-8 w-auto"
              />
              <div className="text-sm sm:text-base font-bold" style={{ color: widgetConfig.primaryColor }}>
                KI-Reifegrad Analyse
              </div>
            </div>
            <div
              className="text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap"
              style={{
                backgroundColor: `${widgetConfig.primaryColor}20`,
                color: widgetConfig.primaryColor
              }}
            >
              {Math.round(progress || 0)}% abgeschlossen
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-0 justify-between mb-3">
          <div className="flex items-center gap-3">
            {canGoBack && onBack && (
              <button
                onClick={onBack}
                className="p-1 hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Zurück"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            {/* Mobile: Show current pillar icon and label */}
            <div className="lg:hidden flex items-center gap-2">
              {currentPillar && (
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${widgetConfig.primaryColor}20` }}
                >
                  <currentPillar.icon 
                    className="w-4 h-4"
                    style={{ color: widgetConfig.primaryColor }}
                  />
                </div>
              )}
              <div>
                <h1 className="text-sm font-bold">
                  Schritt {currentStep} von {totalSteps}
                  {currentPillar && (
                    <>
                      <span className="mx-2 text-gray-300">|</span>
                      {currentPillar.label}
                    </>
                  )}
                </h1>
              </div>
              <div
                className="text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-auto"
                style={{
                  backgroundColor: `${widgetConfig.primaryColor}20`,
                  color: widgetConfig.primaryColor
                }}
              >
                {Math.round(progress || 0)}%
              </div>
            </div>
            
            {/* Desktop: Original layout */}
            <h1 className="hidden lg:block text-sm lg:text-base font-bold">
              Schritt {currentStep} von {totalSteps}
              <span className="mx-2 text-gray-300">|</span>
              {stepTitle}
            </h1>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 ease-out relative"
            style={{
              width: `${progress || 0}%`,
              backgroundColor: widgetConfig.primaryColor
            }}
          >
            {/* Optional: Shimmer effect */}
            {/* <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                animation: 'shimmer 2s infinite linear'
              }}
            /> */}
          </div>
        </div>

        {/* Description with toggle button - Mobile */}
        <div className="lg:hidden mt-2">
          {stepDescription && (
            <div>
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-xs px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                <Lightbulb className="w-3 h-3" />
                {showDescription ? 'Informationen ausblenden' : 'Informationen anzeigen'}
              </button>
              {showDescription && (
                <p className="mt-2 text-xs text-gray-600 p-2 bg-gray-50 rounded-md">
                  {stepDescription}
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Description - Desktop */}
        <div className="hidden lg:block">
          {stepDescription && (
            <p className="mt-2 text-xs text-gray-600">
              {stepDescription}
            </p>
          )}
        </div>
      </div>

      {/* Question Area */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-3">
          {formatQuestionText(question.text)}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            {renderQuestionInput()}
          </div>

          {/* --- Tip box --- */}
          <div
            className="rounded-lg p-3 transition-all duration-300 ease-in-out hover:shadow-lg sticky top-2"
            style={{ backgroundColor: `${widgetConfig.primaryColor}1A` }} // ~10% opacity hex
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${widgetConfig.primaryColor}33` }} // ~20% opacity hex
              >
                <Lightbulb
                  className="w-4 h-4"
                  style={{ color: widgetConfig.primaryColor }}
                />
              </div>
              <h3 className="text-sm font-semibold">Tipp</h3>
            </div>
            {/* Dynamically display the tip */}
            <p className="text-gray-600 text-xs">
              {currentTip}
            </p>
          </div>
          {/* --- End Tip box --- */}

        </div>
      </div>

      {/* Optional: Define shimmer animation globally if used */}
      {/* <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style> */}
    </div>
  );
}