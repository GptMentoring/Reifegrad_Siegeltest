import { generateGeminiResponse } from './gemini';

/**
 * Generates an AI analysis based on the questionnaire answers
 * @param answers The user's answers to the questionnaire
 * @returns The generated analysis
 * @throws Error if the generation fails
 */
export async function generateAIAnalysis(answers: Record<string, string>): Promise<string> {
  // Create a structured prompt for the language model
  const prompt = `
# KI-Reifegradanalyse und Handlungsempfehlungen

Bitte erstelle eine detaillierte Analyse basierend auf den folgenden Informationen:

## Unternehmensprofil und Kontext
- Branche: ${answers['1.1'] || 'Nicht angegeben'}
- Unternehmensgröße: ${answers['1.2'] || 'Nicht angegeben'}
- Regionale Präsenz: ${answers['1.3'] || 'Nicht angegeben'}
- Bisherige Digitalisierung: ${answers['1.4'] || 'Nicht angegeben'}

## Aktueller KI-Status
- KI-Nutzung: ${answers['2.1'] || 'Nicht angegeben'}
- Team-Expertise: ${answers['2.2'] || 'Nicht angegeben'}
- IT-Systeme: ${answers['2.3'] || 'Nicht angegeben'}

## Ziele und Visionen
- Quick Wins: ${answers['3.1'] || 'Nicht angegeben'}
- Langfristige Strategie: ${answers['3.2'] || 'Nicht angegeben'}
- Erwartete Mehrwerte: ${answers['3.3'] || 'Nicht angegeben'}

## Herausforderungen
- Aktuelle Hürden: ${answers['4.1'] || 'Nicht angegeben'}
- Ressourcenverfügbarkeit: ${answers['4.2'] || 'Nicht angegeben'}
- Organisatorische Hindernisse: ${answers['4.3'] || 'Nicht angegeben'}

## Prioritäten
- Fokusbereiche: ${answers['5.1'] || 'Nicht angegeben'}
- Technologie-Interessen: ${answers['5.2'] || 'Nicht angegeben'}
- Beratungsbedarfe: ${answers['5.3'] || 'Nicht angegeben'}

## Anweisungen für die Analyse

1. **Aktueller Status**  
   - Fasse die wichtigsten Punkte aus den Fragebogen-Antworten zusammen
   - Zeige auf, welche Aspekte besonders dringlich sind und wo die größten Potenziale liegen

2. **Empfohlene Maßnahmen**  
   - Ordne die individuellen Ziele und Herausforderungen in die vorhandenen Funnel ein
   - Gib konkrete Handlungsschritte für das KI-Mentoring an

3. **Zeitplanung & Priorisierung**  
   - Erkläre die optimale Aufteilung der 4-8 Stunden pro Woche:
     - 2-3 Stunden für Mentoring-Sessions
     - 1 Stunde für Tools und Community
     - 1-2 Stunden für Implementierung
   - Berücksichtige flexible Anpassungen bei weniger Kapazität

4. **Vorgehensweise im KI-Mentoring**  
   - Leite konkrete nächste Schritte ab
   - Betone die Bedeutung von Konsistenz

5. **Umsetzung & Tools**  
   - Empfehle passende Tools und Ressourcen
   - Gib Datenschutz-Hinweise für die Integration

Formatiere die Analyse mit Markdown für bessere Lesbarkeit und strukturiere sie klar in die genannten Abschnitte.

Beginne direkt mit der Analyse, ohne einleitende Erklärungen.`;

  try {
    // Call the Gemini API with the structured prompt
    const response = await generateGeminiResponse(prompt);
    return response;
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    throw new Error('Es gab einen Fehler bei der Generierung der Analyse. Bitte versuchen Sie es später erneut.');
  }
}