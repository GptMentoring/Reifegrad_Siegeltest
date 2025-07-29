import React from 'react';
import { WidgetConfig } from '../types';

interface LandingPageProps {
  onStart: (demo: boolean) => void;
  widgetConfig: WidgetConfig;
}

export function LandingPage({ onStart, widgetConfig }: LandingPageProps) {
  // Platzhalter-Bild URL (z.B. 350x550 Pixel)
  const placeholderImageUrl = 'https://via.placeholder.com/350x550/e8e8e8/cccccc?text=KI+Report';

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="text-xl font-bold" style={{ color: widgetConfig.primaryColor }}>AI Solutions</div>
        <nav className="space-x-6">
          <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900">Preise</a>
          <a href="#about" className="text-gray-600 hover:text-gray-900">Über uns</a>
        </nav>
        <button 
          className="px-4 py-2 rounded-lg text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: widgetConfig.primaryColor }}
        >
          Login / Registrieren
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Klare Strategie für Ihre KI-Zukunft</h1>
          <p className="text-xl text-gray-600 mb-8">
            Individuelle Potenzial-Analyse mit konkreten Handlungsempfehlungen.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div 
                className="w-12 h-12 rounded-full mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${widgetConfig.primaryColor}20` }}
              >
                <span className="text-2xl" style={{ color: widgetConfig.primaryColor }}>📋</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Einfacher Fragebogen</h3>
              <p className="text-gray-600">
                Alle relevanten Informationen schnell und strukturiert erfassen, online oder im Gespräch.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div 
                className="w-12 h-12 rounded-full mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${widgetConfig.primaryColor}20` }}
              >
                <span className="text-2xl" style={{ color: widgetConfig.primaryColor }}>📊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Sofort-Übersicht</h3>
              <p className="text-gray-600">
                Erhalten Sie direkt nach der Eingabe eine erste Übersicht mit konkreten Lösungsansätzen.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div 
                className="w-12 h-12 rounded-full mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${widgetConfig.primaryColor}20` }}
              >
                <span className="text-2xl" style={{ color: widgetConfig.primaryColor }}>📄</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Detaillierter PDF-Report</h3>
              <p className="text-gray-600">
                Ihr individueller Bericht zum Download, inklusive detaillierter Analyse und Empfehlungen.
              </p>
            </div>
          </div>
        </div>

        <div className="relative max-w-sm mx-auto">
          <span 
            className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: widgetConfig.primaryColor }}
          >
            Kundenbericht
          </span>
          <img 
            src={placeholderImageUrl} 
            alt="KI Analyse Report Platzhalter" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </main>

      {/* Call to Action Section */}
      <section className="p-8 bg-white border-t">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Individueller Fragebogen</h3>
              <p className="text-gray-600">
                Wir stellen die richtigen Fragen für Ihre Branche und spezifischen Herausforderungen.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Aufbau interner KI-Kompetenzen</h3>
              <p className="text-gray-600">
                Erhalten Sie Ihren Report online. 100% DSGVO-konform und sicher.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => onStart(false)}
            className="w-full py-4 rounded-lg text-white font-semibold text-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: widgetConfig.primaryColor }}
          >
            Potenzial-Analyse Starten – Nur 149 €
          </button>
        </div>
      </section>
    </div>
  );
}