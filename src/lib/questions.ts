import { Step } from '../types';

export const PRESS_RELEASE_STEPS: Step[] = [
  {
    id: 1,
    title: "Kompetenz aufbauen",
    description: "Hier bewerten wir das vorhandene Wissen und die Lernkultur bezüglich KI in Ihrem Unternehmen / Ihrer Tätigkeit.",
    questions: [
      {
        id: "1.1",
        text: "Grundverständnis: Wie bewerten Sie das vorhandene Grundverständnis in Ihrem Unternehmen über Funktionsweise und konkrete Einsatzmöglichkeiten generativer KI?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "1.2",
        text: "Bedarfsanalyse: Wie systematisch wurde der spezifische KI-Kompetenzbedarf für unterschiedliche Rollen und Aufgaben (z.B. Führung, Marketing, Service) analysiert und dokumentiert?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "1.3",
        text: "Kontinuierliche Weiterbildung: Inwieweit ist ein strukturierter Prozess für die kontinuierliche KI-Weiterbildung etabliert, um mit der Technologieentwicklung Schritt zu halten?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "1.4",
        text: "Praktische Anwendung: Wie hoch schätzen Sie die Fähigkeit von Ihnen / relevanten Mitarbeitern ein, KI-Tools gezielt und effektiv für konkrete Arbeitsaufgaben zu nutzen?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "1.5",
        text: "Interner Wissensaustausch: Wie etabliert und effektiv sind interne Mechanismen für den Austausch von KI-Wissen und -Erfahrungen?",
        options: ["1", "2", "3", "4", "5"]
      },
      
/*      {
        id: "1.6",
        text: "Was ist die größte Hürde beim Aufbau von KI-Kompetenz in Ihrem Umfeld?",
        multiSelect: true,
        options: [
          "a) Mangel an Zeit oder Budget für Weiterbildung",
          "b) Unklarheit, welche spezifischen Fähigkeiten am dringendsten benötigt werden",
          "c) Fehlender Zugang zu praxisnaher, aktueller und strukturierter Wissensvermittlung",
          "d) Kulturelle Hürden: Skepsis, Angst vor Veränderung oder Jobverlust",
          "e) Fehlende strategische Priorisierung durch die Führungsebene"
        ]
      },
*/
      
 {
        id: "1.6",
        text: "Wie wird KI-Wissen aktuell hauptsächlich erworben und geteilt?",
        multiSelect: true,
        options: [
          "a) Individuelles Ausprobieren und gelegentliche Internetrecherche",
          "b) Besuch von einmaligen, unspezifischen Webinaren oder Workshops",
          "c) Über interne \"Enthusiasten\", die ihr Wissen informell weitergeben",
          "d) Durch strukturierte, begleitete Lernformate",
          "e) Es gibt keinen systematischen Ansatz zum Wissenserwerb/-teilung"
        ]
      }, 

      {
        id: "1.7",
        text: "(Optional) Welche gezielten Kompetenzen wurden zum Einsatz von generativer KI im unternehmen aufgebaut?",
        isMultiline: true,
        placeholder: "Beschreiben Sie die Prozesse, die am meisten von verbesserter KI-Kompetenz profitieren würden...",
        optional: true
      }
    ]
  },
  {
    id: 2,
    title: "Tools gezielt einsetzen",
    description: "Hier geht es darum, wie KI-Tools ausgewählt und implementiert werden.",
    questions: [
      {
        id: "2.1",
        text: "Prozessidentifikation & -analyse: Wie systematisch werden relevante Geschäftsprozesse identifiziert und analysiert, um Potenziale für KI-gestützte Effizienzsteigerung oder Automatisierung aufzudecken?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "2.2",
        text: "Bedarfsorientierte Tool-Auswahl: Inwieweit basiert die Auswahl von KI-Tools auf einer klaren Anforderungsdefinition und den Ergebnissen der Prozessanalyse?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "2.3",
        text: "Strukturierte Evaluierung & Testung: Wie strukturiert ist der Prozess zur Bewertung und Erprobung potenzieller KI-Tools vor einer breiteren Einführung?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "2.4",
        text: "Integration in Arbeitsabläufe: Wie gut sind die eingesetzten KI-Tools technisch und organisatorisch in die bestehenden Arbeitsabläufe und IT-Systeme integriert?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "2.5",
        text: "Performance-Messung & Optimierung: Wie konsequent wird der Nutzen und die Performance der eingesetzten KI-Tools gemessen und werden die Tools/Prozesse darauf basierend regelmäßig optimiert?",
        options: ["1", "2", "3", "4", "5"]
      },
/*      {
        id: "2.6",
        text: "Falls Sie bereits KI-Tools nutzen: Was ist der häufigste Grund für suboptimale Ergebnisse oder Frustration?",
        multiSelect: true,
        options: [
          "a) Die Ergebnisse der Tools sind oft ungenau, irrelevant oder nicht spezifisch genug für unsere Aufgaben",
          "b) Die Bedienung der Tools ist zu kompliziert oder die Einarbeitung kostet zu viel Zeit",
          "c) Es fehlt eine klare Strategie, welches Tool für welchen Zweck am besten geeignet ist",
          "d) Die Tools lassen sich schlecht mit unseren bestehenden Daten oder Systemen verbinden",
          "e) Wir nutzen KI-Tools bisher zu wenig / zu unsystematisch, um dies bewerten zu können"
        ]
      },
*/
      {
        id: "2.6",
        text: "Welcher Ansatz beschreibt am besten, wie neue KI-Tools identifiziert und ausgewählt werden?",
        multiSelect: true,
        options: [
          "a) Zufälliges Testen von Tools, die gerade populär sind oder empfohlen werden",
          "b) Fokus auf die KI-Funktionen, die in bereits genutzter Standardsoftware enthalten sind",
          "c) Systematische Suche basierend auf klar definierten Prozessanforderungen und Zielen",
          "d) Orientierung an den Tools, die Wettbewerber oder Branchenführer einsetzen",
          "e) Bisher keine aktive Identifikation oder Auswahl von KI-Tools"
        ]
      },
      {
        id: "2.7",
        text: "Welcher spezifische, wiederkehrende und zeitaufwändige Prozess könnte Ihrer Meinung nach am dringendsten von einem passenden KI-Tool profitieren?",
        isMultiline: true,
        placeholder: "Beschreiben Sie den Prozess und den erwarteten Nutzen durch KI-Unterstützung..."
      }
    ]
  },
  {
    id: 3,
    title: "Struktur und Steuerung etablieren",
    description: "Eine erfolgreiche KI-Integration benötigt klare Verantwortlichkeiten, messbare Ziele und eine aktive Steuerung durch die Führungsebene. Ohne dies bleiben KI-Initiativen oft unverbindlich und ohne messbaren Erfolg.",
    questions: [
      {
        id: "3.1",
        text: "Verantwortlichkeiten & Rollen: Wie klar sind die Rollen und Verantwortlichkeiten für KI-Initiativen im Unternehmen / Ihrer Tätigkeit definiert und kommuniziert?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "3.2",
        text: "Zieldefinition & Messbarkeit: Inwieweit sind spezifische, messbare Ziele für KI-Initiativen definiert und kommuniziert, um den Erfolg nachverfolgen zu können?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "3.3",
        text: "Management Commitment: Wie stark ist das Commitment und die aktive Unterstützung der Geschäftsführung / von Ihnen für die strategische Integration von KI?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "3.4",
        text: "Reporting & Controlling: Wie etabliert ist ein regelmäßiger Prozess zur Überwachung des Fortschritts, zur Messung der Zielerreichung und zur Anpassung von KI-Projekten?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "3.5",
        text: "Ressourcenallokation: Inwieweit werden die für KI-Initiativen notwendigen Ressourcen systematisch geplant und adäquat bereitgestellt?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "3.6",
        text: "Was ist die größte Herausforderung bei der Umsetzung und Steuerung von KI-Projekten bei Ihnen?",
        multiSelect: true,
        options: [
          "a) Fehlende übergreifende KI-Strategie oder unklare Prioritäten",
          "b) Schwierigkeiten, den konkreten Nutzen oder ROI von KI-Maßnahmen zu messen",
          "c) Unklare Zuständigkeiten oder mangelnde Projektmanagement-Strukturen für KI",
          "d) Zu geringe Priorität oder zu wenig aktive Unterstützung durch die Führungsebene",
          "e) Mangelnde Ressourcen (Zeit, Budget, Fachwissen) für die Umsetzung"
        ]
      },
      {
        id: "3.7",
        text: "Wie werden Entscheidungen über den Start neuer KI-Projekte oder die Einführung neuer Tools typischerweise getroffen?",
        multiSelect: true,
        options: [
          "a) Ad-hoc durch einzelne motivierte Mitarbeiter oder Abteilungen",
          "b) Basierend auf kurzfristigen Gelegenheiten oder weil ein bestimmtes Tool verfügbar ist",
          "c) Im Rahmen einer definierten KI-Strategie mit klaren Prioritäten durch die Führungsebene",
          "d) Durch einen formalisierten Prozess zur Bewertung von Potenzial, Aufwand und Risiko",
          "e) Es gibt bisher keinen etablierten Entscheidungsprozess für KI-Initiativen"
        ]
      },
      {
        id: "3.8",
        text: "Wenn Sie EINE Sache zur Verbesserung der Steuerung von KI-Aktivitäten sofort ändern könnten, welche wäre das und warum?",
        isMultiline: true,
        placeholder: "Beschreiben Sie die wichtigste Veränderung für bessere KI-Steuerung..."
      }
    ]
  },
  {
    id: 4,
    title: "Eigene KI-Produkte entwickeln",
    description: "Neben der Optimierung interner Prozesse liegt großes Potenzial darin, auf Basis eigener Daten oder Expertise maßgeschneiderte KI-Lösungen oder Produkte zu entwickeln – für interne Nutzung oder als neues Angebot für Kunden.",
    questions: [
      {
        id: "4.1",
        text: "Datenpotenzial-Bewertung: Wie systematisch wurde das Potenzial eigener, einzigartiger Daten für die Entwicklung eigener KI-Anwendungen bewertet?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "4.2",
        text: "Datenqualität & -zugänglichkeit: Wie bewerten Sie die Struktur, Qualität und Zugänglichkeit interner Daten für die Nutzung durch KI-Anwendungen?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "4.3",
        text: "Use-Case-Definition: Wie klar und spezifisch sind potenzielle Anwendungsfälle für eigene KI-Produkte definiert?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "4.4",
        text: "Entwicklungskompetenz: Inwieweit ist das notwendige technische Know-how zur Entwicklung oder Anpassung eigener KI-Lösungen realistisch einschätzbar und verfügbar?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "4.5",
        text: "Strategische Priorität: Welche strategische Priorität hat die Entwicklung eigener KI-basierter Lösungen oder Produkte in Ihrem Unternehmen / Ihrer Tätigkeit aktuell?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "4.6",
        text: "Welchen primären strategischen Nutzen würde die Entwicklung einer eigenen KI-Lösung für Sie bringen?",
        multiSelect: true,
        options: [
          "a) Signifikante Effizienzsteigerung durch Automatisierung interner Prozesse",
          "b) Verbesserung der Servicequalität oder Kundenerfahrung durch personalisierte KI-Unterstützung",
          "c) Erschließung neuer Geschäftsfelder oder Einnahmequellen durch datenbasierte Produkte/Services",
          "d) Differenzierung vom Wettbewerb durch einzigartige, KI-gestützte Fähigkeiten oder Angebote",
          "e) Aktuell ist der Nutzen noch unklar oder das Thema hat keine Priorität"
        ]
      },
      {
        id: "4.7",
        text: "Was sehen Sie als größte Hürde bei der potenziellen Entwicklung einer eigenen, spezifischen KI-Anwendung?",
        multiSelect: true,
        options: [
          "a) Fehlende oder unzureichend strukturierte/qualitative Daten als Grundlage",
          "b) Mangelndes internes technisches Know-how für die Entwicklung oder Anpassung",
          "c) Hoher erwarteter Aufwand oder unklare Kosten/Nutzen-Rechnung (ROI)",
          "d) Bedenken hinsichtlich Datenschutz und Sicherheit bei der Nutzung eigener Daten",
          "e) Fehlende klare Idee oder Vision für eine konkrete Anwendung"
        ]
      },
      {
        id: "4.8",
        text: "Beschreiben Sie kurz eine Idee für eine eigene KI-Anwendung, die auf Ihrem spezifischen Wissen oder Ihren Daten aufbauen könnte und einen echten Mehrwert schaffen würde.",
        isMultiline: true,
        placeholder: "Beschreiben Sie Ihre Idee für eine eigene KI-Anwendung..."
      }
    ]
  },
  {
    id: 5,
    title: "Langfristige Strategien sicherstellen",
    description: "Die KI-Landschaft entwickelt sich rasant. Eine erfolgreiche Integration erfordert daher eine kontinuierliche Anpassung, das Monitoring von Trends und den Aufbau von Netzwerken, um dauerhaft wettbewerbsfähig zu bleiben.",
    questions: [
      {
        id: "5.1",
        text: "Trend & Technologie-Monitoring: Wie systematisch und proaktiv werden relevante KI-Technologietrends sowie neue Tools beobachtet, bewertet und auf ihre Relevanz für Ihr Geschäft geprüft?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "5.2",
        text: "Strategische Anpassungsfähigkeit: Wie flexibel ist Ihre KI-Strategie gestaltet, um auf schnelle Marktveränderungen oder technologische Sprünge reagieren zu können?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "5.3",
        text: "Kontinuierliche Optimierung: Wie etabliert ist ein Prozess zur regelmäßigen Überprüfung und Optimierung bestehender KI-Anwendungen und der damit verbundenen Prozesse?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "5.4",
        text: "Externes Netzwerk & Lernen: Wie aktiv nutzen Sie externe Quellen für den kontinuierlichen Wissensaufbau und zur Inspiration im Bereich KI?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "5.5",
        text: "Zukunftsorientierung: Wie intensiv setzen Sie sich bereits mit zukünftigen Entwicklungen wie KI-Agenten auseinander und bewerten deren potenzielle Auswirkungen?",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "5.6",
        text: "Wie gehen Sie/Ihr Unternehmen mit der hohen Geschwindigkeit der KI-Entwicklung um?",
        multiSelect: true,
        options: [
          "a) Wir fühlen uns eher überfordert und reagieren abwartend",
          "b) Wir versuchen, relevante News nebenbei zu verfolgen, aber ohne feste Struktur",
          "c) Wir fokussieren uns auf die Optimierung der aktuell genutzten Tools/Prozesse",
          "d) Wir haben einen proaktiven Prozess etabliert, um Trends zu beobachten und unsere Strategie regelmäßig anzupassen",
          "e) Das Thema wird derzeit nicht aktiv strategisch behandelt"
        ]
      },
      {
        id: "5.7",
        text: "Welche langfristige strategische Perspektive auf KI verfolgen Sie am ehesten?",
        multiSelect: true,
        options: [
          "a) KI als Werkzeug zur punktuellen Effizienzsteigerung in bestehenden Prozessen",
          "b) KI als Chance zur Entwicklung völlig neuer Angebote, Services oder Geschäftsmodelle",
          "c) Eine Kombination aus Optimierung und schrittweiser Innovation, je nach Gelegenheit",
          "d) KI wird als fundamentaler Treiber für die zukünftige Wettbewerbsfähigkeit gesehen",
          "e) Es gibt noch keine klar definierte langfristige Perspektive auf KI"
        ]
      },
      {
        id: "5.8",
        text: "Welche strategische Anpassung halten Sie für die wichtigste, um auch in 3-5 Jahren von den KI-Entwicklungen profitieren zu können?",
        isMultiline: true,
        placeholder: "Beschreiben Sie die wichtigsten strategischen Anpassungen für die Zukunft..."
      }
    ]
  }
];