export interface MaturityScores {
  strategy: number;   // Kompetenz aufbauen
  team: number;       // Tools gezielt einsetzen
  data: number;       // Struktur und Steuerung
  infrastructure: number; // KI-Produkte entwickeln
  governance: number; // Langfristige Strategien
}

export interface WidgetConfig {
  name: string;
  primaryColor: string;
  welcomeMessage?: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  multiSelect?: boolean;
  isMultiline?: boolean;
  placeholder?: string;
  optional?: boolean;
}

export interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface WidgetSize {
  name: string;
  width: number;
  height: number;
}

export interface AnalysisResult {
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  developmentAreas: string[];
}

export interface PromptTemplate {
  name: string;
  content: string;
}

export interface FocusArea {
  title: string;
  description: string;
  baseAnswer: string;
  timeline: string;
}