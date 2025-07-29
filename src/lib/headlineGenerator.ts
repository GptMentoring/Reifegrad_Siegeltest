import { generateGeminiResponse } from './gemini';

/**
 * Generates headline variations for a press release
 * @param answers The user's answers to the questionnaire
 * @param count The number of headline variations to generate
 * @returns An array of headline variations
 */
export async function generateHeadlines(
  answers: Record<string, string>,
  count: number = 5
): Promise<string[]> {
  try {
    // Create a structured prompt for the language model
    const prompt = `
# Überschriften für Pressemitteilung generieren

Bitte erstelle ${count} verschiedene, kreative Überschriften für eine Pressemitteilung basierend auf den folgenden Informationen:

## Zielmedium und Relevanz
- Medium: ${answers['1.1'] || 'Nicht angegeben'}
- Event: ${answers['1.2'] || 'Nicht angegeben'}
- Relevanz: ${answers['1.3'] || 'Nicht angegeben'}

## Thema und Event-Details
- Hauptthema: ${answers['2.1'] || 'Nicht angegeben'}
- Expertise/Blickwinkel: ${answers['2.2'] || 'Nicht angegeben'}
- Hypothese/Fokusthema: ${answers['2.3'] || 'Nicht angegeben'}
- Event-Details: ${answers['2.4'] || 'Nicht angegeben'}

## Informationen zur Person
- Name: ${answers['3.1'] || 'Nicht angegeben'}
- Beruf/Hintergrund: ${answers['3.2'] || 'Nicht angegeben'}
- Erfolge/Auszeichnungen: ${answers['3.3'] || 'Nicht angegeben'}

## Anweisungen
1. Erstelle genau ${count} verschiedene, kreative Überschriften für eine Pressemitteilung.
2. Die Überschriften sollten prägnant, aufmerksamkeitsstark und journalistisch sein.
3. Jede Überschrift sollte einen anderen Schwerpunkt oder Stil haben.
4. Formatiere die Ausgabe als nummerierte Liste (1., 2., 3., usw.).
5. Verwende keine Anführungszeichen oder andere Formatierungen.
6. Jede Überschrift sollte maximal 10 Wörter haben.
7. Beziehe den Namen der Person ein, wenn er angegeben wurde.
8. Berücksichtige besonders die Hypothese oder das Fokusthema in den Überschriften.

Bitte generiere jetzt die ${count} Überschriften.
`;

    // Call the Gemini API with the structured prompt
    const response = await generateGeminiResponse(prompt);
    
    // Parse the response to extract the headlines
    // The response should be a numbered list, so we'll split by newlines and process each line
    const lines = response.split('\n').filter(line => line.trim());
    const headlines: string[] = [];
    
    for (const line of lines) {
      // Look for lines that start with a number followed by a period
      const match = line.match(/^\s*\d+\.\s*(.+)$/);
      if (match) {
        headlines.push(match[1].trim());
      }
    }
    
    // If we couldn't parse any headlines, or if we got fewer than requested,
    // generate some fallback headlines
    if (headlines.length < count) {
      const name = answers['3.1'] || 'Experte';
      const event = answers['1.2'] || 'Event';
      
      while (headlines.length < count) {
        headlines.push(`${name} begeistert beim ${event} mit außergewöhnlicher Leistung`);
      }
    }
    
    // Return only the requested number of headlines
    return headlines.slice(0, count);
  } catch (error) {
    console.error('Error generating headlines:', error);
    throw new Error('Fehler bei der Generierung der Überschriften. Bitte versuchen Sie es später erneut.');
  }
}