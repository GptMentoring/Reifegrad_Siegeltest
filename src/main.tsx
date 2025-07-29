import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';

const defaultConfig = {
  name: "KI-Reifegrad Analyse",
  primaryColor: "#722F37",
  welcomeMessage: "**Verschaffen Sie sich Klarheit über Ihr KI-Potenzial.** Diese Analyse ist der erste Schritt, um Fehlinvestitionen zu vermeiden und gezielte Maßnahmen für Ihr Unternehmen abzuleiten."
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App widgetConfig={defaultConfig} />
  </StrictMode>
)