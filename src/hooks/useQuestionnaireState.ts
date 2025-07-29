import { useState, useEffect, useCallback } from 'react';
import { Step, Question, WidgetConfig } from '../types';
import { PRESS_RELEASE_STEPS } from '../lib/questions';
import { generateAIAnalysis } from '../lib/aiAnalysisGenerator';
import { generateFocusAreas } from '../lib/gemini';
import { sendAnalysisWebhook } from '../lib/webhook';

export function useQuestionnaireState(widgetConfig: WidgetConfig) {
  // Core state
  const [userEmail, setUserEmail] = useState<string>('');
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
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const savedDemoAnswers = localStorage.getItem('demoAnswers');
    return {};
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cachedAnalysis, setCachedAnalysis] = useState<{
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
  } | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  
  // Load demo data if available
  useEffect(() => {
    const savedDemoAnswers = localStorage.getItem('demoAnswers');
    if (savedDemoAnswers) {
      try {
        const demoData = JSON.parse(savedDemoAnswers);
        setAnswers(demoData);
        setShowSummary(true);
        localStorage.removeItem('demoAnswers');
      } catch (error) {
        console.error('Error loading demo data:', error);
      }
    }
  }, []);

  // Navigation state
  const [questionHistory, setQuestionHistory] = useState<{step: number, index: number}[]>([
    { step: 1, index: 0 }
  ]);
  
  // Get current question safely
  const getCurrentQuestion = useCallback(() => {
    const step = PRESS_RELEASE_STEPS[currentStep - 1];
    if (!step) return null;
    return step.questions[currentQuestionIndex] || null;
  }, [currentStep, currentQuestionIndex]);

  // Calculate average score for a set of questions
  const calculateAverageScore = useCallback((questionIds: string[]): number => {
    const validAnswers = questionIds
      .map(id => answers[id])
      .filter(answer => answer && !isNaN(Number(answer)))
      .map(answer => Number(answer));

    if (validAnswers.length === 0) return 0;

    return Number((validAnswers.reduce((a, b) => a + b, 0) / validAnswers.length).toFixed(1));
  }, [answers]);

  // Save answer and handle navigation
  const saveAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  // Generate analysis
  const generateAnalysisContent = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Calculate scores for focus areas
      const scores = {
        competence: calculateAverageScore(['1.1', '1.2', '1.3', '1.4', '1.5']),
        tools: calculateAverageScore(['2.1', '2.2', '2.3', '2.4', '2.5']),
        structure: calculateAverageScore(['3.1', '3.2', '3.3', '3.4', '3.5']),
        products: calculateAverageScore(['4.1', '4.2', '4.3', '4.4', '4.5']),
        strategy: calculateAverageScore(['5.1', '5.2', '5.3', '5.4', '5.5'])
      };
      
      // Format answers for focus areas
      const formattedAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
        const cleanValue = value.replace(/^[a-z]\)\s*/i, '');
        return { ...acc, [key]: cleanValue };
      }, {});
      
      // Generate focus areas
      const focusAreas = await generateFocusAreas(formattedAnswers, scores);
      
      // Cache the analysis
      setCachedAnalysis({ focusAreas });
      
      const result = await generateAIAnalysis(answers);
      setAnalysisResult(result);
      
      // Send webhook with email and scores
      await sendAnalysisWebhook(answers, userInfo, scores);
      
      setShowSummary(false);
    } catch (error) {
      console.error('Error generating analysis:', error);
      setError('Fehler bei der Generierung der Analyse. Bitte versuchen Sie es später erneut.');
      setShowSummary(true);
    } finally {
      setIsGenerating(false);
    }
  }, [answers, calculateAverageScore, setCachedAnalysis]);

  // Handle answer submission
  const handleAnswer = useCallback(async (answer: string) => {
    if (isLoading) return;
    
    // Handle final step actions
    if (answer === "a) Ja, Analyse generieren") {
      await generateAnalysisContent();
      return;
    } else if (answer === "b) Nein, Angaben verändern") {
      setShowSummary(true);
      return;
    }
    
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;
    
    // Save the answer
    saveAnswer(currentQuestion.id, answer);
    
    // Handle edit mode
    if (editMode) {
      setShowSummary(true);
      setEditMode(false);
      setEditingQuestionId(null);
      
      return;
    }
    
    // Handle normal navigation
    const currentStepData = PRESS_RELEASE_STEPS[currentStep - 1];
    if (!currentStepData) {
      setError('Ungültiger Schritt');
      return;
    }
    
    const isLastQuestionInStep = currentQuestionIndex === currentStepData.questions.length - 1;
    
    if (!isLastQuestionInStep) {
      // Move to next question
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setQuestionHistory(prev => [...prev, { step: currentStep, index: nextIndex }]);
    } else {
      // Handle last step
      if (currentStep >= PRESS_RELEASE_STEPS.length) {
        setShowSummary(true);
      } else {
        // Move to next step
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setCurrentQuestionIndex(0);
        setQuestionHistory(prev => [...prev, { step: nextStep, index: 0 }]);
      }
    }
  }, [
    currentStep,
    currentQuestionIndex,
    editMode,
    isLoading,
    getCurrentQuestion,
    saveAnswer,
    generateAnalysisContent
  ]);

  // Handle step navigation
  const handleStepChange = useCallback((step: number) => {
    if (editMode) {
      const stepQuestions = PRESS_RELEASE_STEPS[step - 1].questions;
      const questionToEdit = editingQuestionId 
        ? stepQuestions.find(q => q.id === editingQuestionId)
        : stepQuestions[0];
      
      setCurrentStep(step);
      setCurrentQuestionIndex(questionToEdit 
        ? stepQuestions.indexOf(questionToEdit)
        : 0);
      setShowSummary(false);
    } else {
      setCurrentStep(step);
      setCurrentQuestionIndex(0);
      setShowSummary(false);
    }
  }, [editMode, editingQuestionId]);

  // Handle going back
  const handleGoBack = useCallback(() => {
    if (questionHistory.length > 1) {
      const newHistory = [...questionHistory];
      newHistory.pop();
      const prevQuestion = newHistory[newHistory.length - 1];
      
      setCurrentStep(prevQuestion.step);
      setCurrentQuestionIndex(prevQuestion.index);
      setQuestionHistory(newHistory);
    }
  }, [questionHistory]);

  // Handle editing a specific question
  const handleEditQuestion = useCallback((stepId: number, questionId: string) => {
    setEditMode(true);
    setEditingQuestionId(questionId);
    
    const stepQuestions = PRESS_RELEASE_STEPS[stepId - 1].questions;
    const questionIndex = stepQuestions.findIndex(q => q.id === questionId);
    
    setCurrentStep(stepId);
    setCurrentQuestionIndex(questionIndex >= 0 ? questionIndex : 0);
    setShowSummary(false);
  }, []);

  // Handle variant change
  const handleVariantChange = useCallback((count: number) => {
    saveAnswer("5.1", count === 1 
      ? "a) Eine Variante"
      : count === 2 
        ? "b) Zwei Varianten"
        : "c) Drei Varianten"
    );
  }, [saveAnswer]);

  // Handle continuing after variant selection
  const handleContinueAfterVariantSelection = useCallback(() => {
    setCurrentQuestionIndex(1);
    setQuestionHistory(prev => [...prev, { step: 5, index: 1 }]);
  }, []);

  // Reset everything
  const handleRestart = useCallback(() => {
    setAnswers({});
    localStorage.removeItem('demoAnswers');
    setCurrentStep(1);
    setCurrentQuestionIndex(0);
    setAnalysisResult(null);
    setShowSummary(false);
    setQuestionHistory([{ step: 1, index: 0 }]);
    setError(null);
    setEditMode(false);
    setEditingQuestionId(null);
  }, []);

  // Return to answers
  const handleReturnToAnswers = useCallback(() => {
    setAnalysisResult(null);
    setShowSummary(true);
    setEditMode(false);
    setEditingQuestionId(null);
  }, []);

  // Handle return to summary
  const handleReturnToSummary = useCallback(() => {
    setShowSummary(true);
    setEditMode(false);
  }, []);

  return {
    // State
    currentStep,
    currentQuestionIndex,
    answers,
    showSummary,
    isLoading,
    isGenerating,
    analysisResult,
    error,
    questionHistory,
    editMode,
    cachedAnalysis,
    
    // Actions
    handleAnswer,
    handleStepChange,
    handleGoBack,
    handleEditQuestion,
    handleRestart,
    handleReturnToAnswers,
    handleReturnToSummary,
    
    // Computed
    canGoBack: questionHistory.length > 1,
    currentQuestion: getCurrentQuestion(),
    setUserEmail,
    updateUserInfo: setUserInfo,
  };
}