import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyA3vtrr32ipOR987Js7BSRK6LGpuE9lqLs';
const MODEL = 'gemini-2.0-flash';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

const genAI = new GoogleGenerativeAI(API_KEY);

interface CategoryAnalysis {
  summary: string[];
  recommendations: string[];
}

interface FocusArea {
  title: string;
  description: string;
  baseAnswer: string;
  timeline: string;
}

interface FocusAreas {
  quickWins: FocusArea[];
  strategicFocus: FocusArea[];
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries === 0 || !error?.message?.includes('503')) {
      throw error;
    }

    await sleep(delay);
    return retryWithExponentialBackoff(operation, retries - 1, delay * 2);
  }
}

export async function generateGeminiResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const operation = () => model.generateContent(prompt);
    const result = await retryWithExponentialBackoff(operation);
    return result.response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

export async function generateCategoryAnalysis(
  category: string,
  answers: Record<string, string>,
  score: number
): Promise<CategoryAnalysis> {
  const model = genAI.getGenerativeModel({ model: MODEL });

  // Helper function to format answers for better readability
  const formatAnswerValue = (value: string): string => {
    // Remove option prefixes like "a)", "b)", etc.
    return value.replace(/^[a-z]\)\s*/i, '');
  };

  // Helper function to get a descriptive label for numeric scores
  const getScoreLabel = (score: number): string => {
    if (score <= 2) return 'grundlegendes';
    if (score <= 3) return 'fortgeschrittenes';
    if (score <= 4) return 'sehr gutes';
    return 'exzellentes';
  };

  const prompt = `
Analysiere den folgenden Bereich der KI-Reife: "${category}"

Quantitative Bewertung: ${score}/5.0 (${getScoreLabel(score)} Niveau)

Die Antworten zeigen:
${Object.entries(answers)
  .map(([_, value]) => `- ${formatAnswerValue(value)}`)
  .join('\n')}

Bitte erstelle:
1. 2-3 prägnante Beobachtungen zum aktuellen Stand, die direkt auf den Antworten basieren
2. 2-3 konkrete, umsetzbare Handlungsempfehlungen zur Verbesserung

Liefere NUR ein JSON-Objekt mit zwei Arrays:
{
  "summary": ["Beobachtung 1", "Beobachtung 2", ...],
  "recommendations": ["Empfehlung 1", "Empfehlung 2", ...]
}

Wichtige Hinweise:
- Beziehe dich DIREKT auf die konkreten Antworten, nicht auf abstrakte Konzepte
- Verwende die tatsächlichen Formulierungen aus den Antworten
- Vermeide Referenzen auf Fragenummern oder technische IDs
- Halte jeden Punkt prägnant (max. 100 Zeichen)
- Formuliere alles auf Deutsch
`;

  try {
    const operation = async () => {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Extract JSON from potential markdown formatting
      let jsonText = text;
      
      // Remove any markdown code block markers
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Remove any leading/trailing whitespace
      jsonText = jsonText.trim();
      
      return jsonText;
    };

    const jsonText = await retryWithExponentialBackoff(operation);
    
    try {
      const analysis = JSON.parse(jsonText);
      
      return {
        summary: analysis.summary || [],
        recommendations: analysis.recommendations || []
      };
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.error('Raw response:', jsonText);
      throw new Error('Fehler bei der Analyse-Generierung');
    }
  } catch (error) {
    console.error('Error generating category analysis:', error);
    throw error;
  }
}

export async function generateFocusAreas(
  answers: Record<string, string>,
  scores: {
    competence: number;
    tools: number;
    structure: number;
    products: number;
    strategy: number;
  }
): Promise<FocusAreas> {
  const model = genAI.getGenerativeModel({ model: MODEL });

  const prompt = `
Analysiere die folgenden KI-Reifegradwerte und Antworten, um konkrete Handlungsempfehlungen zu generieren:

Reifegradwerte (0-5):
- Kompetenz: ${scores.competence}
- Tools: ${scores.tools}
- Struktur: ${scores.structure}
- Produkte: ${scores.products}
- Strategie: ${scores.strategy}

Antworten des Nutzers:
${Object.entries(answers)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}

Generiere zwei Arten von Empfehlungen:

1. Quick Wins (Umsetzung in 1-4 Wochen)
2. Strategische Initiativen (Umsetzung in 2-6 Monaten)

Liefere NUR ein JSON-Objekt mit folgendem Format:
{
  "quickWins": [
    {
      "title": "Kurzer, prägnanter Titel",
      "description": "Konkrete Beschreibung der Maßnahme",
      "baseAnswer": "Ursprüngliche Antwort des Nutzers",
      "timeline": "2-3 Wochen"
    }
  ],
  "strategicFocus": [
    {
      "title": "Kurzer, prägnanter Titel",
      "description": "Konkrete Beschreibung der Initiative",
      "baseAnswer": "Ursprüngliche Antwort des Nutzers",
      "timeline": "3-4 Monate"
    }
  ]
}

Wichtige Hinweise:
- Generiere je 3 Empfehlungen pro Kategorie
- Beziehe dich auf konkrete Antworten und Scores
- Priorisiere Bereiche mit niedrigen Scores
- Verwende realistische Zeitrahmen
- Formuliere alles auf Deutsch
- Empfehlungen müssen konkret und umsetzbar sein
- Stelle sicher, dass die Antwort ein valides JSON-Objekt ist
`;

  try {
    const operation = async () => {
      const result = await model.generateContent(prompt);
      const response = result.response;
      let text = response.text();
      
      // Remove any markdown formatting
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      text = text.trim();
      
      // Find the start and end of the JSON object
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}') + 1;
      
      if (startIndex === -1 || endIndex === 0) {
        throw new Error('No valid JSON object found in response');
      }
      
      return text.slice(startIndex, endIndex);
    };

    const jsonText = await retryWithExponentialBackoff(operation);
    
    try {
      const analysis = JSON.parse(jsonText);
      
      return {
        quickWins: Array.isArray(analysis.quickWins) ? analysis.quickWins : [],
        strategicFocus: Array.isArray(analysis.strategicFocus) ? analysis.strategicFocus : []
      };
    } catch (parseError) {
      console.error('Error parsing focus areas JSON:', parseError);
      console.error('Attempted to parse:', jsonText);
      throw new Error('Fehler bei der Analyse-Generierung');
    }
  } catch (error) {
    console.error('Error generating focus areas:', error);
    throw error;
  }
}