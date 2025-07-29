import React, { useState, useEffect } from 'react';
import { QuestionDisplay } from '../components/QuestionDisplay';
import { StepNavigation } from '../components/StepNavigation';
import { AnswerSummary } from '../components/AnswerSummary';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { AnalysisResult } from '../components/AnalysisResult';
import { ErrorMessage } from '../components/ErrorMessage';
import { PRESS_RELEASE_STEPS } from '../lib/questions';
import { sendAnalysisWebhook } from '../lib/webhook';
import { useQuestionnaireState } from '../hooks/useQuestionnaireState';
import { WidgetConfig } from '../types';

interface QuestionnaireContainerProps {
  widgetConfig: WidgetConfig;
}

export function QuestionnaireContainer({ 
  widgetConfig
}: QuestionnaireContainerProps) {
  const [userInfo, setUserInfo] = useState<{
    email: string;
    name: string;
    company: string;
    employees: string;
  }>({
    email: '',
    name: '',
    company: '',
    employees: ''
  });
  const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);
  const [isDemo, setIsDemo] = useState<boolean>(false);

  const {
    currentStep,
    currentQuestionIndex,
    answers,
    showSummary,
    isLoading,
    isGenerating,
    analysisResult,
    error,
    editMode,
    cachedAnalysis,
    handleAnswer,
    handleStepChange,
    handleGoBack,
    handleEditQuestion,
    handleRestart,
    handleReturnToAnswers,
    handleReturnToSummary,
    canGoBack,
    currentQuestion,
    setUserEmail,
    updateUserInfo,
  } = useQuestionnaireState(widgetConfig);

  const handleStartQuestionnaire = (demo: boolean, userInfo?: { email: string; name: string; company: string; employees: string }) => {
    setShowWelcomeScreen(false);
    setIsDemo(demo);
    if (userInfo) {
      // Update the userInfo state directly in this component
      setUserInfo(userInfo);
      updateUserInfo(userInfo);
      setUserEmail(userInfo.email);
    }
    
    // If it's a demo, trigger the analysis generation immediately
    if (demo) {
      handleAnswer("a) Ja, Analyse generieren");
    }
  };

  // Calculate current step progress
  const currentStepQuestions = PRESS_RELEASE_STEPS[currentStep - 1]?.questions.length || 0;
  const currentStepAnswered = PRESS_RELEASE_STEPS[currentStep - 1]?.questions.filter(q => 
    answers[q.id]
  ).length || 0;
  const stepProgress = Math.round((currentStepAnswered / currentStepQuestions) * 100);

  // If we have an analysis result, show it
  if (analysisResult) {
    return (
      <AnalysisResult 
        onRestart={handleRestart}
        onEditAnswers={handleReturnToAnswers}
        widgetConfig={widgetConfig}
        answers={answers}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        {showWelcomeScreen ? (
          <WelcomeScreen 
            onStart={handleStartQuestionnaire}
            widgetConfig={widgetConfig}
          />
        ) : (
          <>
            {/* Error message */}
            {error && <ErrorMessage message={error} />}
            
            {/* Current step and question */}
            {!showSummary && (
              <>
                <StepNavigation 
                  steps={PRESS_RELEASE_STEPS}
                  currentStep={currentStep}
                  onStepChange={handleStepChange}
                  answers={answers}
                  widgetConfig={widgetConfig}
                  onGoBack={handleGoBack}
                  canGoBack={canGoBack}
                />
                
                {currentQuestion && (
                  <QuestionDisplay
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    isLoading={isLoading}
                    widgetConfig={widgetConfig}
                    answers={answers}
                    currentStep={currentStep}
                    totalSteps={PRESS_RELEASE_STEPS.length}
                    progress={stepProgress}
                    stepTitle={PRESS_RELEASE_STEPS[currentStep - 1].title}
                    stepDescription={PRESS_RELEASE_STEPS[currentStep - 1].description}
                    canGoBack={canGoBack}
                    onBack={handleGoBack}
                  />
                )}
              </>
            )}

            {/* Summary view */}
            {showSummary && (
              <div className="p-6">
                <AnswerSummary
                  steps={PRESS_RELEASE_STEPS}
                  answers={answers}
                  onEdit={handleEditQuestion}
                  widgetConfig={widgetConfig}
                />
                
                <button
                  onClick={() => handleAnswer("a) Ja, Analyse generieren")}
                  className="w-full p-2 rounded-lg text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: widgetConfig.primaryColor }}
                  disabled={isLoading}
                  aria-label="Analyse generieren"
                >
                  Analyse generieren
                </button>
              </div>
            )}
            
            {editMode && (
              <div className="p-4">
                <button
                  onClick={() => handleAnswer("b) Nein, Angaben verändern")}
                  className="w-full p-2 rounded-lg text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: widgetConfig.primaryColor }}
                  disabled={isLoading}
                  aria-label="Angaben verändern"
                >
                  Angaben verändern
                </button>
              </div>
            )}

            {/* Loading state */}
            {isGenerating && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="bg-white p-6 lg:p-8 rounded-xl shadow-xl flex flex-col items-center gap-4 mx-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4" 
                       style={{ borderColor: widgetConfig.primaryColor }}></div>
                  <p className="text-lg font-medium">Generiere Analyse...</p>
                  <p className="text-sm text-gray-600">Dies kann einen Moment dauern</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}