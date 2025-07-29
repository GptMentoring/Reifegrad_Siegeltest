import React from 'react';
import { Question } from '../types'; // Stelle sicher, dass der Pfad korrekt ist

interface RatingScaleProps {
  value: string; // Für Single-Select
  selectedValues: string[]; // Für Multi-Select
  setSelectedValues: (values: string[]) => void; // Für Multi-Select Update
  onChange: (value: string) => void; // Übergibt einzelnen Wert oder kommagetrennte Liste
  disabled?: boolean;
  widgetConfig: { primaryColor: string };
  question?: Question; // Frage-Objekt für Kontext (Labels etc.)
  multiSelect?: boolean; // Flag für Multi-Select-Verhalten
  children?: React.ReactNode; // Für zusätzlichen Inhalt (z.B. Weiter-Button)
}

export function RatingScale({
  value,
  selectedValues,
  setSelectedValues,
  onChange,
  disabled,
  widgetConfig,
  question,
  multiSelect = false, // Standardmäßig kein Multi-Select
  children
}: RatingScaleProps) {

  // Get custom labels based on question ID
  const getLevels = () => {
    // Fallback, falls keine Frage übergeben wird
    const defaultLevels = [
      { value: '1', label: 'Sehr niedrig', description: 'Kaum vorhanden', shade: '#FFEAEA' },
      { value: '2', label: 'Niedrig', description: 'Grundlegend vorhanden', shade: '#FFD5D5' },
      { value: '3', label: 'Mittel', description: 'Teilweise etabliert', shade: '#FFC0C0' },
      { value: '4', label: 'Hoch', description: 'Gut etabliert', shade: '#FFABAB' },
      { value: '5', label: 'Sehr hoch', description: 'Vollständig etabliert', shade: '#FF9696' }
    ];

    if (!question) {
      return defaultLevels;
    }

    const questionId = question.id;

    // Custom labels for specific questions
    const customLabels: { [key: string]: { value: string; label: string; description: string; shade: string }[] } = {
      // Step 1: Kompetenz aufbauen
      '1.1': [ // Grundverständnis & Potenzialerkennung
        { value: '1', label: 'Kein Verständnis', description: 'Keine Kenntnisse über KI oder deren Potenzial.', shade: '#FFEAEA' },
        { value: '2', label: 'Grundlegendes Verständnis', description: 'Basiswissen über KI vorhanden, Potenzial wird ansatzweise erkannt.', shade: '#FFD5D5' },
        { value: '3', label: 'Gutes Verständnis', description: 'Funktionsweise wird verstanden, konkrete Einsatzmöglichkeiten werden gesehen.', shade: '#FFC0C0' },
        { value: '4', label: 'Fortgeschrittenes Verständnis', description: 'Tiefes Verständnis für Einsatzmöglichkeiten zur Effizienzsteigerung.', shade: '#FFABAB' },
        { value: '5', label: 'Experten-Level', description: 'Strategisches Verständnis und Fähigkeit zur Potenzialerkennung im gesamten Unternehmen.', shade: '#FF9696' }
      ],
      '1.2': [ // Bedarfsanalyse
        { value: '1', label: 'Gar nicht', description: 'Keine Analyse des KI-Kompetenzbedarfs durchgeführt.', shade: '#FFEAEA' },
        { value: '2', label: 'Intuitiv/Vereinzelt', description: 'Bedarf wird eher gefühlt als systematisch erfasst.', shade: '#FFD5D5' },
        { value: '3', label: 'Teilweise systematisch', description: 'Erste Analysen für einzelne Bereiche/Rollen erfolgt.', shade: '#FFC0C0' },
        { value: '4', label: 'Weitgehend systematisch', description: 'Bedarf für viele Rollen analysiert und grob dokumentiert.', shade: '#FFABAB' },
        { value: '5', label: 'Vollständig systematisch', description: 'Detaillierte, dokumentierte Bedarfsanalyse für alle relevanten Rollen/Aufgaben.', shade: '#FF9696' }
      ],
      '1.3': [ // Kontinuierliche Weiterbildung
        { value: '1', label: 'Nicht etabliert', description: 'Kein strukturierter Prozess für KI-Weiterbildung vorhanden.', shade: '#FFEAEA' },
        { value: '2', label: 'Unstrukturiert/Reaktiv', description: 'Lernen erfolgt zufällig oder bei akutem Bedarf.', shade: '#FFD5D5' },
        { value: '3', label: 'Teilweise strukturiert', description: 'Einzelne Angebote, aber kein durchgängiger Prozess.', shade: '#FFC0C0' },
        { value: '4', label: 'Gut strukturiert', description: 'Regelmäßige Angebote und ein Weiterbildungsplan existieren.', shade: '#FFABAB' },
        { value: '5', label: 'Vollständig integriert/Proaktiv', description: 'Systematischer, strategischer Prozess, der die Entwicklung vorwegnimmt.', shade: '#FF9696' }
      ],
      '1.4': [ // Praktische Anwendung
        { value: '1', label: 'Sehr gering', description: 'Kaum oder keine Fähigkeit, KI-Tools effektiv zu nutzen.', shade: '#FFEAEA' },
        { value: '2', label: 'Gering', description: 'Erste Versuche, aber unsicher oder ineffektiv.', shade: '#FFD5D5' },
        { value: '3', label: 'Mittel', description: 'KI-Tools können für einfache, klar definierte Aufgaben genutzt werden.', shade: '#FFC0C0' },
        { value: '4', label: 'Hoch', description: 'KI-Tools werden gezielt und effektiv für diverse Arbeitsaufgaben genutzt.', shade: '#FFABAB' },
        { value: '5', label: 'Sehr hoch', description: 'KI-Tools werden meisterhaft und innovativ zur Optimierung der Arbeit eingesetzt.', shade: '#FF9696' }
      ],
      '1.5': [ // Interner Wissensaustausch
        { value: '1', label: 'Nicht etabliert', description: 'Kein Austausch von KI-Wissen findet statt.', shade: '#FFEAEA' },
        { value: '2', label: 'Informell/Sporadisch', description: 'Zufälliger Austausch zwischen einzelnen Personen.', shade: '#FFD5D5' },
        { value: '3', label: 'Teilweise etabliert', description: 'Erste Foren/Treffen existieren, aber wenig genutzt oder ineffektiv.', shade: '#FFC0C0' },
        { value: '4', label: 'Gut etabliert', description: 'Regelmäßige, genutzte Kanäle für den Austausch vorhanden.', shade: '#FFABAB' },
        { value: '5', label: 'Sehr effektiv/Kulturell verankert', description: 'Wissensaustausch ist selbstverständlich und fördert aktiv die Kompetenz.', shade: '#FF9696' }
      ],

      // Step 2: Tools gezielt einsetzen
      '2.1': [ // Prozessidentifikation & -analyse
        { value: '1', label: 'Gar nicht', description: 'Keine systematische Identifikation/Analyse von Prozessen auf KI-Potenzial.', shade: '#FFEAEA' },
        { value: '2', label: 'Ad-hoc/Unsystematisch', description: 'Analyse erfolgt zufällig oder bei akuten Problemen.', shade: '#FFD5D5' },
        { value: '3', label: 'Gelegentlich systematisch', description: 'Einzelne Prozesse werden bei Bedarf auf KI-Potenzial analysiert.', shade: '#FFC0C0' },
        { value: '4', label: 'Regelmäßig systematisch', description: 'Ein strukturierter Prozess zur Identifikation und Analyse existiert.', shade: '#FFABAB' },
        { value: '5', label: 'Kontinuierlich & Proaktiv', description: 'Prozessanalyse auf KI-Potenzial ist fester Bestandteil der Optimierungsroutine.', shade: '#FF9696' }
      ],
      '2.2': [ // Bedarfsorientierte Tool-Auswahl
        { value: '1', label: 'Gar nicht/Zufällig', description: 'Auswahl basiert auf Hype, Empfehlungen oder persönlichen Vorlieben.', shade: '#FFEAEA' },
        { value: '2', label: 'Geringfügig bedarfsorientiert', description: 'Anforderungen werden vage oder nur am Rande berücksichtigt.', shade: '#FFD5D5' },
        { value: '3', label: 'Teilweise bedarfsorientiert', description: 'Ergebnisse der Prozessanalyse fließen manchmal in die Auswahl ein.', shade: '#FFC0C0' },
        { value: '4', label: 'Weitgehend bedarfsorientiert', description: 'Auswahl basiert klar auf definierten Anforderungen und Analyseergebnissen.', shade: '#FFABAB' },
        { value: '5', label: 'Ausschließlich bedarfsorientiert', description: 'Strikte Ausrichtung der Tool-Auswahl an klar definierten Anforderungen.', shade: '#FF9696' }
      ],
      '2.3': [ // Strukturierte Evaluierung & Testung
        { value: '1', label: 'Nicht vorhanden/Unstrukturiert', description: 'Tools werden ohne Test eingeführt oder Tests sind chaotisch.', shade: '#FFEAEA' },
        { value: '2', label: 'Einfache Tests', description: 'Kurzes, unsystematisches Ausprobieren durch Einzelne.', shade: '#FFD5D5' },
        { value: '3', label: 'Teilweise strukturiert', description: 'Definierte Testphasen oder Kriterien für manche Tools.', shade: '#FFC0C0' },
        { value: '4', label: 'Gut strukturiert', description: 'Klarer Prozess mit definierten Kriterien und Testgruppen.', shade: '#FFABAB' },
        { value: '5', label: 'Sehr strukturiert & Umfassend', description: 'Systematischer, kriterienbasierter Evaluations- & Testprozess ist Standard.', shade: '#FF9696' }
      ],
      '2.4': [ // Integration in Arbeitsabläufe
        { value: '1', label: 'Gar nicht integriert', description: 'KI-Tools sind Insellösungen ohne Anbindung.', shade: '#FFEAEA' },
        { value: '2', label: 'Schwach integriert', description: 'Minimale technische Anbindung, keine Anpassung der Abläufe.', shade: '#FFD5D5' },
        { value: '3', label: 'Teilweise integriert', description: 'Einige Schnittstellen vorhanden, Abläufe teilweise angepasst.', shade: '#FFC0C0' },
        { value: '4', label: 'Gut integriert', description: 'Tools technisch gut eingebunden, Arbeitsabläufe angepasst.', shade: '#FFABAB' },
        { value: '5', label: 'Nahtlos integriert', description: 'Volle technische Integration und optimierte, angepasste Arbeitsabläufe.', shade: '#FF9696' }
      ],
      '2.5': [ // Performance-Messung & Optimierung
        { value: '1', label: 'Gar nicht', description: 'Nutzen und Performance werden nicht gemessen oder optimiert.', shade: '#FFEAEA' },
        { value: '2', label: 'Sporadisch/Subjektiv', description: 'Gelegentliche, oft bauchgefühlbasierte Bewertung.', shade: '#FFD5D5' },
        { value: '3', label: 'Regelmäßig, aber einfach', description: 'Grundlegende Metriken werden erfasst, selten Optimierungen.', shade: '#FFC0C0' },
        { value: '4', label: 'Systematisch', description: 'Definierte KPIs werden gemessen, darauf basierend erfolgen Optimierungen.', shade: '#FFABAB' },
        { value: '5', label: 'Kontinuierlich & Datengetrieben', description: 'Ständige Messung, Analyse und darauf basierende Prozess-/Tooloptimierung.', shade: '#FF9696' }
      ],

      // Step 3: Struktur und Steuerung etablieren
      '3.1': [ // Verantwortlichkeiten & Rollen
        { value: '1', label: 'Unklar/Nicht definiert', description: 'Niemand weiß genau, wer für KI zuständig ist.', shade: '#FFEAEA' },
        { value: '2', label: 'Teilweise definiert', description: 'Einige Rollen sind bekannt, aber nicht umfassend oder klar abgegrenzt.', shade: '#FFD5D5' },
        { value: '3', label: 'Größtenteils definiert', description: 'Hauptverantwortlichkeiten sind festgelegt, aber Details fehlen.', shade: '#FFC0C0' },
        { value: '4', label: 'Klar definiert', description: 'Rollen und Verantwortlichkeiten sind klar beschrieben.', shade: '#FFABAB' },
        { value: '5', label: 'Klar definiert & Kommuniziert', description: 'Rollen sind definiert, allen bekannt und werden gelebt.', shade: '#FF9696' }
      ],
      '3.2': [ // Zieldefinition & Messbarkeit
        { value: '1', label: 'Keine Ziele', description: 'Keine spezifischen, messbaren Ziele für KI-Initiativen definiert.', shade: '#FFEAEA' },
        { value: '2', label: 'Vage Ziele', description: 'Ziele sind unklar oder nicht messbar (z.B. "KI nutzen").', shade: '#FFD5D5' },
        { value: '3', label: 'Teilweise messbare Ziele', description: 'Einige Ziele sind definiert, aber nicht immer messbar oder nachverfolgbar.', shade: '#FFC0C0' },
        { value: '4', label: 'Messbare Ziele definiert', description: 'Spezifische, messbare Ziele sind definiert und werden teilweise verfolgt.', shade: '#FFABAB' },
        { value: '5', label: 'SMART-Ziele definiert & kommuniziert', description: 'Klare, messbare, erreichbare, relevante, terminierte Ziele sind etabliert und bekannt.', shade: '#FF9696' }
      ],
      '3.3': [ // Management Commitment
        { value: '1', label: 'Nicht vorhanden', description: 'Kein Interesse oder sogar Ablehnung durch die Führungsebene.', shade: '#FFEAEA' },
        { value: '2', label: 'Passiv/Wenig sichtbar', description: 'KI wird toleriert, aber nicht aktiv gefördert.', shade: '#FFD5D5' },
        { value: '3', label: 'Vorhanden', description: 'Grundsätzliche Unterstützung durch die Führung wird signalisiert.', shade: '#FFC0C0' },
        { value: '4', label: 'Aktiv', description: 'Führung fördert KI aktiv und stellt Ressourcen bereit.', shade: '#FFABAB' },
        { value: '5', label: 'Stark & Treibend', description: 'Führung ist sichtbarer Treiber und fordert KI-Integration strategisch ein.', shade: '#FF9696' }
      ],
      '3.4': [ // Reporting & Controlling
        { value: '1', label: 'Nicht etabliert', description: 'Kein regelmäßiges Reporting oder Controlling von KI-Projekten.', shade: '#FFEAEA' },
        { value: '2', label: 'Sporadisch/Informell', description: 'Gelegentliche, unstrukturierte Updates zum Status.', shade: '#FFD5D5' },
        { value: '3', label: 'Regelmäßig, aber einfach', description: 'Einfaches Reporting über Aktivitäten, kaum Fokus auf Zielerreichung.', shade: '#FFC0C0' },
        { value: '4', label: 'Etabliert', description: 'Regelmäßiges Reporting über Fortschritt und Zielerreichung.', shade: '#FFABAB' },
        { value: '5', label: 'Integriert & Adaptiv', description: 'Systematisches Controlling mit Steuerung und Anpassung von Maßnahmen.', shade: '#FF9696' }
      ],
      '3.5': [ // Ressourcenallokation
        { value: '1', label: 'Unsystematisch/Mangelhaft', description: 'Ressourcen (Zeit, Budget, Personal) werden kaum bereitgestellt.', shade: '#FFEAEA' },
        { value: '2', label: 'Ad-hoc/Reaktiv', description: 'Ressourcen werden bei Bedarf bereitgestellt, oft zu spät oder zu wenig.', shade: '#FFD5D5' },
        { value: '3', label: 'Teilweise geplant', description: 'Einige Ressourcen werden eingeplant, aber nicht immer ausreichend.', shade: '#FFC0C0' },
        { value: '4', label: 'Systematisch geplant', description: 'Ressourcenbedarf wird ermittelt und weitgehend bereitgestellt.', shade: '#FFABAB' },
        { value: '5', label: 'Strategisch & Adäquat', description: 'Ressourcen werden systematisch geplant und ausreichend zur Verfügung gestellt.', shade: '#FF9696' }
      ],

      // Step 4: Eigene KI-Produkte entwickeln
      '4.1': [ // Datenpotenzial-Bewertung
        { value: '1', label: 'Gar nicht bewertet', description: 'Das Potenzial eigener Daten für KI wurde nicht betrachtet.', shade: '#FFEAEA' },
        { value: '2', label: 'Oberflächlich betrachtet', description: 'Erste vage Ideen zum Datenpotenzial, keine Analyse.', shade: '#FFD5D5' },
        { value: '3', label: 'Teilweise bewertet', description: 'Potenzial für einzelne Datensätze/Anwendungen geprüft.', shade: '#FFC0C0' },
        { value: '4', label: 'Systematisch bewertet', description: 'Umfassende Bewertung des Datenpotenzials durchgeführt.', shade: '#FFABAB' },
        { value: '5', label: 'Strategisch bewertet & dokumentiert', description: 'Detaillierte Analyse des Potenzials und strategische Einordnung.', shade: '#FF9696' }
      ],
      '4.2': [ // Datenqualität & -zugänglichkeit
        { value: '1', label: 'Sehr schlecht', description: 'Daten chaotisch, unvollständig, für KI unzugänglich.', shade: '#FFEAEA' },
        { value: '2', label: 'Schlecht', description: 'Datenqualität niedrig, Struktur mangelhaft, Zugriff schwierig.', shade: '#FFD5D5' },
        { value: '3', label: 'Mittelmäßig', description: 'Daten teilweise strukturiert, Qualität variabel, Zugriff möglich.', shade: '#FFC0C0' },
        { value: '4', label: 'Gut', description: 'Daten weitgehend strukturiert, gute Qualität, gut zugänglich.', shade: '#FFABAB' },
        { value: '5', label: 'Sehr gut', description: 'Hohe Datenqualität, gut strukturiert, einfach zugänglich für KI.', shade: '#FF9696' }
      ],
      '4.3': [ // Use-Case-Definition
        { value: '1', label: 'Keine/Sehr vage Ideen', description: 'Keine konkreten Anwendungsfälle für eigene KI definiert.', shade: '#FFEAEA' },
        { value: '2', label: 'Erste Ideen', description: 'Grobe Vorstellungen von möglichen eigenen KI-Anwendungen.', shade: '#FFD5D5' },
        { value: '3', label: 'Konkrete Ideen', description: 'Einzelne Anwendungsfälle sind umrissen und werden diskutiert.', shade: '#FFC0C0' },
        { value: '4', label: 'Gut definierte Use Cases', description: 'Anwendungsfälle sind klar beschrieben und auf Machbarkeit/Nutzen bewertet.', shade: '#FFABAB' },
        { value: '5', label: 'Detaillierte & Validierte Use Cases', description: 'Spezifische, detaillierte und (vor-)validierte Anwendungsfälle liegen vor.', shade: '#FF9696' }
      ],
      '4.4': [ // Entwicklungskompetenz
        { value: '1', label: 'Unbekannt/Nicht vorhanden', description: 'Keine Einschätzung möglich oder Kompetenz fehlt nachweislich.', shade: '#FFEAEA' },
        { value: '2', label: 'Schwer einschätzbar/Vermutlich nicht vorhanden', description: 'Kompetenzbedarf unklar, wahrscheinlich extern nötig.', shade: '#FFD5D5' },
        { value: '3', label: 'Einschätzbar/Teilweise vorhanden', description: 'Kompetenzbedarf bekannt, teilweise intern/extern verfügbar.', shade: '#FFC0C0' },
        { value: '4', label: 'Gut einschätzbar/Verfügbar', description: 'Kompetenz realistisch einschätzbar & kann beschafft/genutzt werden.', shade: '#FFABAB' },
        { value: '5', label: 'Realistisch eingeschätzt/Leicht verfügbar', description: 'Kompetenz klar bewertet & intern/extern leicht zugänglich.', shade: '#FF9696' }
      ],
      '4.5': [ // Strategische Priorität
        { value: '1', label: 'Keine Priorität', description: 'Entwicklung eigener KI-Lösungen wird nicht verfolgt.', shade: '#FFEAEA' },
        { value: '2', label: 'Niedrige Priorität', description: 'Thema wird diskutiert, aber ohne konkrete Pläne oder Ressourcen.', shade: '#FFD5D5' },
        { value: '3', label: 'Mittlere Priorität', description: 'Ist ein Thema, erste Überlegungen, aber nachrangig.', shade: '#FFC0C0' },
        { value: '4', label: 'Hohe Priorität', description: 'Gehört zu den wichtigen strategischen Zielen, erste Projekte.', shade: '#FFABAB' },
        { value: '5', label: 'Top-Priorität', description: 'Zentrales Element der Unternehmensstrategie mit dedizierten Ressourcen.', shade: '#FF9696' }
      ],

      // Step 5: Langfristige Strategien sicherstellen
      '5.1': [ // Trend & Technologie-Monitoring
        { value: '1', label: 'Gar nicht/Reaktiv', description: 'Keine Beobachtung oder nur Reaktion auf große Hypes.', shade: '#FFEAEA' },
        { value: '2', label: 'Unsystematisch', description: 'Gelegentliche, zufällige Beobachtung von KI-News ohne Struktur.', shade: '#FFD5D5' },
        { value: '3', label: 'Teilweise systematisch', description: 'Bestimmte Quellen werden regelmäßig geprüft, wenig Bewertung.', shade: '#FFC0C0' },
        { value: '4', label: 'Systematisch', description: 'Etablierter Prozess zur Beobachtung und Bewertung relevanter Trends/Tools.', shade: '#FFABAB' },
        { value: '5', label: 'Proaktiv & Integriert', description: 'Kontinuierliches Monitoring mit direkter Einspeisung in die Strategieentwicklung.', shade: '#FF9696' }
      ],
      '5.2': [ // Strategische Anpassungsfähigkeit
        { value: '1', label: 'Starr/Keine Strategie', description: 'Keine KI-Strategie vorhanden oder diese ist nicht flexibel.', shade: '#FFEAEA' },
        { value: '2', label: 'Gering flexibel', description: 'Strategie wird selten oder nur schwer an neue Entwicklungen angepasst.', shade: '#FFD5D5' },
        { value: '3', label: 'Mäßig flexibel', description: 'Anpassungen sind möglich, aber langsam oder aufwändig.', shade: '#FFC0C0' },
        { value: '4', label: 'Flexibel', description: 'Strategie erlaubt und plant regelmäßige Anpassungen an neue Gegebenheiten.', shade: '#FFABAB' },
        { value: '5', label: 'Sehr agil/Adaptiv', description: 'Strategie ist auf kontinuierliche Überprüfung und Anpassung ausgelegt.', shade: '#FF9696' }
      ],
      '5.3': [ // Kontinuierliche Optimierung
        { value: '1', label: 'Nicht etabliert', description: 'Keine regelmäßige Überprüfung oder Optimierung bestehender KI-Anwendungen.', shade: '#FFEAEA' },
        { value: '2', label: 'Sporadisch', description: 'Gelegentliche Überprüfung bei akuten Problemen oder Bedarf.', shade: '#FFD5D5' },
        { value: '3', label: 'Regelmäßig', description: 'Periodische Reviews der KI-Anwendungen finden statt.', shade: '#FFC0C0' },
        { value: '4', label: 'Systematisch', description: 'Etablierter Prozess zur Überprüfung und Optimierung mit definierten Zyklen.', shade: '#FFABAB' },
        { value: '5', label: 'Kontinuierlich & Datengetrieben', description: 'Ständige Überwachung und proaktive Optimierung basierend auf Nutzungsdaten/Feedback.', shade: '#FF9696' }
      ],
      '5.4': [ // Externes Netzwerk & Lernen
        { value: '1', label: 'Gar nicht', description: 'Kein Austausch oder Lernen von externen Quellen/Netzwerken.', shade: '#FFEAEA' },
        { value: '2', label: 'Passiv/Gelegentlich', description: 'Zufälliger Konsum externer Informationen (z.B. Newsartikel).', shade: '#FFD5D5' },
        { value: '3', label: 'Gezielt für spezifische Fragen', description: 'Aktive Suche nach externem Wissen bei konkretem Bedarf.', shade: '#FFC0C0' },
        { value: '4', label: 'Aktiv', description: 'Regelmäßige Nutzung externer Quellen (Konferenzen, Netzwerke, Experten).', shade: '#FFABAB' },
        { value: '5', label: 'Sehr aktiv & Systematisch', description: 'Strategische Nutzung & Aufbau externer Netzwerke zum Lernen & zur Inspiration.', shade: '#FF9696' }
      ],
      '5.5': [ // Zukunftsorientierung
        { value: '1', label: 'Gar nicht', description: 'Keine Auseinandersetzung mit zukünftigen KI-Entwicklungen.', shade: '#FFEAEA' },
        { value: '2', label: 'Oberflächlich', description: 'Zukünftige Themen (z.B. Agenten) werden erwähnt, aber nicht analysiert.', shade: '#FFD5D5' },
        { value: '3', label: 'Diskutiert', description: 'Potenzielle Auswirkungen werden diskutiert, aber ohne konkrete Maßnahmen.', shade: '#FFC0C0' },
        { value: '4', label: 'Analysiert', description: 'Systematische Bewertung zukünftiger Trends und deren potenzieller Auswirkungen.', shade: '#FFABAB' },
        // *** KORREKTUR HIER ***
        { value: '5', label: 'Strategisch integriert', description: 'Zukünftige Entwicklungen werden proaktiv bewertet und in die Langfriststrategie integriert.', shade: '#FF9696' }
      ],
      // *** ÜBERFLÜSSIGE KLAMMERN ENTFERNT ***
    };

    // Return custom labels if found for the questionId, otherwise return default levels
    return customLabels[questionId] || defaultLevels;
  };

  const levels = getLevels();

  // Aktuell ausgewählten Wert ermitteln (abhängig von multiSelect)
  const currentSelection = multiSelect ? selectedValues : [value];

  const handleSelect = (levelValue: string) => {
    if (disabled) return;

    if (multiSelect) {
      const newValues = selectedValues.includes(levelValue)
        ? selectedValues.filter(v => v !== levelValue) // Remove if already selected
        : [...selectedValues, levelValue]; // Add if not selected
      setSelectedValues(newValues); // Update local state for multi-select
      onChange(newValues.join(',')); // Notify parent with comma-separated string
    } else {
      // For single-select, onChange directly updates the parent's state via props
      onChange(levelValue);
    }
  };


  return (
    <div>
      <div className="space-y-2">
      {levels.map((level) => {
         // Prüfen, ob das aktuelle Level ausgewählt ist
         const isSelected = multiSelect
           ? selectedValues.includes(level.value)
           : value === level.value;

         return (
          <button
            key={level.value}
            onClick={() => handleSelect(level.value)}
            className={`
              w-full text-left p-4 rounded-lg
              transition-all duration-300 ease-in-out  /* Reduzierte Dauer für bessere Reaktionsfähigkeit */
              transform hover:scale-[1.01] hover:shadow-lg
              active:scale-[0.98] active:shadow-sm
              relative overflow-hidden
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
            `}
            style={{
              backgroundColor: isSelected ? level.shade : 'white',
              border: `2px solid ${isSelected ? widgetConfig.primaryColor : '#e5e7eb'}`,
              boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' : 'none',
              // transition Dauer hier entfernt, da in className definiert
            }}
            disabled={disabled}
          >
            {/* Ripple-Effekt nur bei Auswahl anzeigen */}
            {isSelected && !disabled && (
               <div
                 key={level.value + '-ripple'} // Unique key for re-triggering animation
                 className="absolute inset-0 bg-white opacity-30 pointer-events-none"
                 style={{
                   animation: 'ripple 0.6s ease-out forwards' // Schnellere Ripple-Animation
                 }}
               />
            )}

            <div className="flex items-center gap-3 relative z-10"> {/* Inhalt über Ripple legen */}
              <div
                className={`
                  w-5 h-5 rounded-full border-2
                  flex items-center justify-center flex-shrink-0
                  transition-all duration-300 ease-in-out /* Reduzierte Dauer */
                  transform
                `}
                style={{
                  borderColor: isSelected ? widgetConfig.primaryColor : '#d1d5db',
                  backgroundColor: isSelected ? widgetConfig.primaryColor : 'transparent',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)' // Leichte Skalierung bei Auswahl
                }}
              >
                {/* Kleiner Punkt im Kreis nur bei Auswahl anzeigen */}
                {isSelected && (
                  <div
                    key={level.value + '-dot'} // Unique key
                    className="w-2 h-2 rounded-full bg-white transform scale-0"
                     style={{ animation: 'scaleIn 0.3s ease-out forwards 0.1s' }} // Verzögerte, schnellere Skalierung
                  />
                )}
              </div>
              <div className="transition-transform duration-300 ease-in-out"> {/* Reduzierte Dauer */}
                <div className="font-medium">{level.label}</div>
                <div className="text-sm text-gray-600">{level.description}</div>
              </div>
            </div>
          </button>
         );
        })}
      </div>
      {/* Zusätzlicher Inhalt, falls übergeben (z.B. Weiter-Button für MultiSelect) */}
      {children}

       {/* Globale Styles für Animationen */}
      <style jsx global>{`
        @keyframes ripple {
          from {
            transform: scale(0);
            opacity: 0.6;
          }
          to {
            transform: scale(3);
            opacity: 0;
          }
        }

        @keyframes scaleIn {
           from {
             transform: scale(0);
             opacity: 0;
           }
           to {
             transform: scale(1);
             opacity: 1;
           }
        }
      `}</style>
    </div>
  );
}