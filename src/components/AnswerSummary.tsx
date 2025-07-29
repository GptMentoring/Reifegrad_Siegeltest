import React from 'react';
import { Step } from '../types';

interface AnswerSummaryProps {
  steps: Step[];
  answers: Record<string, string>;
  onEdit: (stepId: number, questionId: string) => void;
  widgetConfig: { primaryColor: string };
}

export function AnswerSummary({ steps, answers, onEdit, widgetConfig }: AnswerSummaryProps) {
  // Check if we have any answers to display
  const hasAnswers = Object.keys(answers).length > 0;

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-4">Zusammenfassung Ihrer Antworten</h2>
      
      {!hasAnswers && (
        <p className="text-gray-600 italic">Keine Antworten vorhanden. Bitte beantworten Sie die Fragen.</p>
      )}
      
      {steps.map((step) => {
        // Check if this step has any answered questions
        const stepAnswers = step.questions.filter(q => answers[q.id]);
        if (stepAnswers.length === 0) return null;
        
        return (
          <div key={step.id} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <button
                onClick={() => onEdit(step.id, step.questions[0].id)}
                className="text-sm px-2 py-1 rounded transition-colors"
                style={{ color: widgetConfig.primaryColor }}
                aria-label={`Schritt ${step.id} bearbeiten`}
              >
                Bearbeiten
              </button>
            </div>
            
            <div className="space-y-2 pl-4 border-l-2" style={{ borderColor: widgetConfig.primaryColor + '40' }}>
              {step.questions.map((question) => {
                const answer = answers[question.id];
                if (!answer) return null;

                // Handle multi-select answers
                const formattedAnswer = question.multiSelect 
                  ? answer.split('\n').map(a => a.trim()).join(', ')
                  : answer;
                
                return (
                  <div key={question.id} className="mb-2">
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-600">{question.text}</p>
                      <button
                        onClick={() => onEdit(step.id, question.id)}
                        className="text-xs px-2 py-0.5 rounded text-gray-500 hover:text-gray-700"
                        aria-label={`Antwort auf "${question.text}" ändern`}
                      >
                        Ändern
                      </button>
                    </div>
                    <p className="font-medium">{formattedAnswer}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {hasAnswers && (
        <p className="text-sm text-gray-600 mt-4">
          Überprüfen Sie Ihre Antworten und klicken Sie auf "Bearbeiten", um Änderungen vorzunehmen.
          Wenn Sie mit allen Antworten zufrieden sind, können Sie die Analyse generieren lassen.
        </p>
      )}
    </div>
  );
}