import { PRESS_RELEASE_STEPS } from './questions';

interface QuestionInfo {
  questionId: string;
  questionText: string;
  stepTitle: string;
  answer: {
    value: string;
    label: string;
  };
}

interface WebhookPayload {
  timestamp: string;
  userInfo: {
    email: string;
    name: string;
    company: string;
    employees: string;
  };
  answers: QuestionInfo[];
  scores: {
    competence: number;
    tools: number;
    structure: number;
    products: number;
    strategy: number;
    overall: number;
  };
  metadata: {
    version: string;
    source: string;
    format: string;
  };
}

export async function sendAnalysisWebhook(
  answers: Record<string, string>,
  userInfo: {
    email: string;
    name: string;
    company: string;
    employees: string;
  },
  scores: {
    competence: number;
    tools: number;
    structure: number;
    products: number;
    strategy: number;
  }
): Promise<void> {
  try {
    // Format the answers with questions from our steps
    const formattedAnswers = Object.entries(answers).map(([id, answer]) => {
      // Find the question and step information
      const step = PRESS_RELEASE_STEPS.find(step => 
        step.questions.some(q => q.id === id)
      );
      const question = step?.questions.find(q => q.id === id);
      
      // Get the label for numeric answers (1-5 scale)
      let label = answer;
      if (question?.options && !isNaN(Number(answer))) {
        const numAnswer = Number(answer);
        if (numAnswer >= 1 && numAnswer <= 5) {
          // Define labels for the 1-5 scale
          const labels = {
            1: "Sehr niedrig/Nicht vorhanden",
            2: "Grundlegendes Verständnis",
            3: "Fortgeschritten",
            4: "Sehr gut",
            5: "Exzellent"
          };
          label = labels[numAnswer as keyof typeof labels] || answer;
        }
      }
      
      const questionInfo: QuestionInfo = {
        questionId: id,
        questionText: question?.text || 'Unknown Question',
        stepTitle: step?.title || 'Unknown Step',
        answer: {
          value: answer,
          label: label
        },
      };
      
      return questionInfo;
    });

    // Calculate overall score
    const overallScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;

    const payload: WebhookPayload = {
      timestamp: new Date().toISOString(),
      userInfo,
      metadata: {
        version: "1.0",
        source: "KI-Reifegrad-Analyse",
        format: "json"
      },
      answers: formattedAnswers,
      scores: {
        ...scores,
        overall: Number(overallScore.toFixed(2))
      }
    };

    console.log('Sending webhook payload with user info:', payload);

    // Send to Make.com webhook
    const response = await fetch('https://hook.eu2.make.com/ncztdvy9lnpjq4riw7ixhjrh87oyukcw', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) { 
      const errorText = await response.text();
      console.error('Webhook failed:', {
        status: response.status,
        statusText: response.statusText,
        response: errorText
      });
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }

    console.log('Webhook sent successfully');
  } catch (error) {
    console.error('Error sending analysis webhook:', error);
    // Don't throw - we don't want to break the analysis flow if the webhook fails
  }
}