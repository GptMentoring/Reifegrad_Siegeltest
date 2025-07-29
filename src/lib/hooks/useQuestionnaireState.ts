import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Step, Question, WidgetConfig } from '../../types';
import { PRESS_RELEASE_STEPS } from '../questions';
import { generatePressRelease } from '../pressReleaseGenerator';

/**
 * Custom hook to manage questionnaire state and logic
 */
export function useQuestionnaireState(
  widgetConfig: WidgetConfig,
  userId: string | null,
  chatThreadId: string | null
) {
  // Navigation state
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionHistory, setQuestionHistory] = useState<{step: number, index: number}[]>([{step: 1, index: 0}]);
  
  // Content state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedVariants, setSelectedVariants] = useState(3);
  const [pressReleaseResult, setPressReleaseResult] = useState<string | null>(null);
  
  // UI state
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatingPressRelease, setGeneratingPressRelease] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize with first step and question
  useEffect(() => {
    // Start with the first step
    const firstStep = PRESS_RELEASE_STEPS[0];
    
    // Log the step start to the database
    logStepStart(firstStep.id);
  }, []);

  /**
   * Logs the start of a step to the database
   */
  const logStepStart = async (stepId: number) => {
    if (!userId || !chatThreadId) return;
    
    try {
      const stepInfo = PRESS_RELEASE_STEPS[stepId - 1];
      const message = `## ${stepInfo.title}\n\n${stepInfo.description}`;
      
      await saveMessage(message, true);
      
      // Also log the first question
      const firstQuestion = stepInfo.questions[0];
      const questionText = formatQuestionText(firstQuestion);
      await saveMessage(questionText, true);
    } catch (error) {
      console.error('Error logging step start:', error);
      setError('Fehler beim Laden des Schritts. Bitte versuchen Sie es erneut.');
    }
  };

  /**
   * Saves a message to the database
   */
  const saveMessage = async (content: string, isBot: boolean) => {
    if (!userId || !chatThreadId) return;

    try {
      await supabase
        .from('chat_messages')
        .insert({
          thread_id: chatThreadId,
          content,
          is_bot: isBot,
          user_id: userId
        });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  /**
   * Formats a question for display
   */
  const formatQuestionText = (question: Question): string => {
    let text = `**${question.text}**\n\n`;
    
    if (question.options) {
      text += question.options.join('\n');
    } else if (question.placeholder) {
      text += `*${question.placeholder}*`;
    }
    
    return text;
  };

  /**
   * Handles a user's answer to a question
   */
  const handleAnswer = async (answer: string) => {
    setError(null);
    
    try {
      // Get the current question
      const currentQuestion = PRESS_RELEASE_STEPS[currentStep - 1].questions[currentQuestionIndex];
      
      // Handle variant selection in step 5
      if (currentQuestion.id === "5.1") {
        if (answer.includes("Eine Variante")) {
          setSelectedVariants(1);
        } else if (answer.includes("Zwei Varianten")) {
          setSelectedVariants(2);
        } else {
          setSelectedVariants(3);
        }
      }
      
      // Save the answer
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: answer
      }));

      // Log the user's answer
      await saveMessage(answer, false);

      // If we're in edit mode, return to summary after saving
      if (editMode) {
        setEditMode(false);
        setShowSummary(true);
        
        await saveMessage("Hier ist die aktualisierte Zusammenfassung Ihrer Antworten.", true);
        return;
      }

      // Move to the next question or step
      if (currentQuestionIndex < PRESS_RELEASE_STEPS[currentStep - 1].questions.length - 1) {
        // Move to the next question in the current step
        const nextIndex = currentQuestionIndex + 1;
        
        // Skip the variant selection question if we're using the VariantSelector component
        if (currentStep === 5 && nextIndex === 0) {
          // Skip to the next question after variant selection
          setCurrentQuestionIndex(nextIndex + 1);
          
          // Add to history
          setQuestionHistory(prev => [...prev, {step: currentStep, index: nextIndex + 1}]);
          
          // Log the next question
          const nextQuestion = PRESS_RELEASE_STEPS[currentStep - 1].questions[nextIndex + 1];
          const questionText = formatQuestionText(nextQuestion);
          await saveMessage(questionText, true);
        } else {
          setCurrentQuestionIndex(nextIndex);
          
          // Add to history
          setQuestionHistory(prev => [...prev, {step: currentStep, index: nextIndex}]);
          
          // Log the next question
          const nextQuestion = PRESS_RELEASE_STEPS[currentStep - 1].questions[nextIndex];
          const questionText = formatQuestionText(nextQuestion);
          await saveMessage(questionText, true);
        }
      } else {
        // Check if this is the last step
        if (currentStep === PRESS_RELEASE_STEPS.length) {
          // This is the last question of the last step
          if (answer.startsWith("a)") || answer.toLowerCase().includes("generieren")) {
            // User wants to generate the press release
            setShowSummary(false);
            setGeneratingPressRelease(true);
            
            await saveMessage("Ich generiere jetzt Ihre Pressemitteilung basierend auf Ihren Antworten. Dies kann einen Moment dauern...", true);
            
            // Generate the press release
            await handlePressReleaseGeneration();
          } else {
            // User wants to review answers
            setShowSummary(true);
            
            await saveMessage("Hier ist eine Zusammenfassung Ihrer Antworten. Sie können jeden Abschnitt bearbeiten, bevor Sie die Pressemitteilung generieren.", true);
          }
        } else {
          // Move to the next step
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);
          setCurrentQuestionIndex(0);
          
          // Add to history
          setQuestionHistory(prev => [...prev, {step: nextStep, index: 0}]);
          
          // Log the next step
          logStepStart(nextStep);
        }
      }
    } catch (error) {
      console.error('Error handling answer:', error);
      setError('Fehler beim Verarbeiten Ihrer Antwort. Bitte versuchen Sie es erneut.');
    }
  };

  /**
   * Generates a press release based on the user's answers
   */
  const handlePressReleaseGeneration = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await generatePressRelease(answers);
      setPressReleaseResult(response);
      await saveMessage(response, true);
    } catch (error) {
      console.error('Error generating press release:', error);
      setError('Fehler bei der Generierung der Pressemitteilung. Bitte versuchen Sie es später erneut.');
      const errorMessage = 'Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Anfrage.';
      await saveMessage(errorMessage, true);
    } finally {
      setIsLoading(false);
      setGeneratingPressRelease(false);
    }
  };

  /**
   * Handles navigation to a specific step
   */
  const handleStepChange = (step: number) => {
    setError(null);
    
    if (editMode) {
      // If we're in edit mode, we want to edit a specific question
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
      // Normal navigation
      setCurrentStep(step);
      setCurrentQuestionIndex(0);
      setShowSummary(false);
    }
    
    // Log the step change
    logStepStart(step);
  };

  /**
   * Handles navigation to the previous question
   */
  const handleGoBack = () => {
    setError(null);
    
    // Remove current question from history
    if (questionHistory.length > 1) {
      const newHistory = [...questionHistory];
      newHistory.pop(); // Remove current question
      const prevQuestion = newHistory[newHistory.length - 1]; // Get previous question
      
      setCurrentStep(prevQuestion.step);
      setCurrentQuestionIndex(prevQuestion.index);
      setQuestionHistory(newHistory);
    }
  };

  /**
   * Handles editing a specific question
   */
  const handleEditQuestion = (stepId: number, questionId: string) => {
    setError(null);
    setEditMode(true);
    setEditingQuestionId(questionId);
    setCurrentStep(stepId);
    
    // Find the index of the question in the step
    const questionIndex = PRESS_RELEASE_STEPS[stepId - 1].questions.findIndex(q => q.id === questionId);
    setCurrentQuestionIndex(questionIndex >= 0 ? questionIndex : 0);
    
    setShowSummary(false);
    
    // Log the edit mode
    const question = PRESS_RELEASE_STEPS[stepId - 1].questions[questionIndex];
    
    if (question) {
      saveMessage(`Sie bearbeiten jetzt Ihre Antwort auf die Frage: "${question.text}"`, true);
    }
  };

  /**
   * Handles changing the number of variants to generate
   */
  const handleVariantChange = (count: number) => {
    setSelectedVariants(count);
    
    // Update the answer for question 5.1
    const variantText = count === 1 
      ? "a) Eine Variante" 
      : count === 2 
        ? "b) Zwei Varianten" 
        : "c) Drei Varianten";
    
    setAnswers(prev => ({
      ...prev,
      "5.1": variantText
    }));
  };

  /**
   * Handles continuing to the next question after variant selection
   */
  const handleContinueAfterVariantSelection = () => {
    // Skip to question 5.2 (index 1)
    setCurrentQuestionIndex(1);
    setQuestionHistory(prev => [...prev, {step: 5, index: 1}]);
  };

  /**
   * Resets the questionnaire to its initial state
   */
  const handleRestart = () => {
    setPressReleaseResult(null);
    setAnswers({});
    setCurrentStep(1);
    setCurrentQuestionIndex(0);
    setShowSummary(false);
    setQuestionHistory([{step: 1, index: 0}]);
    setError(null);
  };

  return {
    // State
    currentStep,
    currentQuestionIndex,
    answers,
    showSummary,
    isLoading,
    selectedVariants,
    pressReleaseResult,
    error,
    questionHistory,
    
    // Actions
    handleAnswer,
    handleStepChange,
    handleGoBack,
    handleEditQuestion,
    handleVariantChange,
    handleContinueAfterVariantSelection,
    handleRestart,
    
    // Computed
    canGoBack: questionHistory.length > 1,
    currentQuestion: PRESS_RELEASE_STEPS[currentStep - 1]?.questions[currentQuestionIndex],
    shouldShowVariantSelector: currentStep === 5,
    shouldHideCurrentQuestion: currentStep === 5 && currentQuestionIndex === 0
  };
}