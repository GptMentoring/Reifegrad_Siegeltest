import React from 'react';
import { useState } from 'react';
import {
  Bot, ClipboardList, Settings, Star, // Icons für "So funktioniert's"
  Info, Target, AlertTriangle as AlertTriangleIcon, CheckSquare, // Icons für "Warum sinnvoll"
  Gauge, Radar, Flag, Brain, ListChecks, // Icons für "Ergebnis im Detail"
  ArrowRight, Mail, User, Building, Users // Icon für Button und Email
} from 'lucide-react';
import { WidgetConfig } from '../types';
import ReactMarkdown from 'react-markdown';

interface WelcomeScreenProps {
  onStart: (demo: boolean, userInfo?: { email: string; name: string; company: string; employees: string }) => void;
  widgetConfig: WidgetConfig;
}

export function WelcomeScreen({ onStart, widgetConfig }: WelcomeScreenProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [employees, setEmployees] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleStart = () => {
    // Reset all errors
    setEmailError(null);
    setNameError(null);
    setCompanyError(null);
    setEmployeesError(null);
    
    let hasErrors = false;
    
    if (!name.trim()) {
      setNameError('Bitte geben Sie Ihren Namen ein');
      hasErrors = true;
    }
    
    if (!company.trim()) {
      setCompanyError('Bitte geben Sie Ihren Unternehmensnamen ein');
      hasErrors = true;
    }
    
    if (!employees) {
      setEmployeesError('Bitte wählen Sie die Anzahl der Mitarbeiter');
      hasErrors = true;
    }
    
    if (!email) {
      setEmailError('Bitte geben Sie Ihre E-Mail-Adresse ein');
      hasErrors = true;
    }
    
    if (email && !validateEmail(email)) {
      setEmailError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    onStart(false, { email, name, company, employees });
  };

  // Definieren der Analyse-Ergebnisse
  const analysisDeliverables = [
    { icon: Gauge, text: "Detaillierte Reifegrad-Bewertung: Score für 5 Säulen & Gesamt." },
    { icon: Radar, text: "Visuelles Stärken/Schwächen-Profil: Ihr persönliches Pentagon." },
    { icon: Flag, text: "Top 3 Handlungsfelder: Klare Prioritäten für den Start." },
    { icon: Brain, text: "KI-gestützte Interpretation: Einblicke basierend auf Ihren Antworten." },
    { icon: ListChecks, text: "Priorisierte Handlungsempfehlungen: Erste konkrete Impulse." }
  ];

  // Definieren der "Warum sinnvoll" Punkte
  const whyPoints = [
    { icon: Info, title: "Klarheit gewinnen:", description: "Verstehen Sie genau, wo Sie stehen." },
    { icon: Target, title: "Potenziale erkennen:", description: "Identifizieren Sie ungenutzte Hebel für Effizienz und Wachstum." },
    { icon: AlertTriangleIcon, title: "Fehler vermeiden:", description: "Treffen Sie fundierte Entscheidungen statt aufwendiger Test-Experimente." },
    { icon: CheckSquare, title: "Grundlage schaffen:", description: "Erhalten Sie die perfekte Basis für Ihre weitere KI-Strategie." }
  ];


  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Hero Section */}
      <div
    className="w-full p-6 text-white text-center relative overflow-hidden shadow-md"
    style={{ background: `linear-gradient(135deg, ${widgetConfig.primaryColor}, ${widgetConfig.primaryColor}E6)` }}
  >
    <div className="absolute top-0 left-0 w-full h-full opacity-5 z-0">
      {/* Hintergrund-Bubbles */}
    </div>
    <div className="relative z-10 max-w-4xl mx-auto">
      {/* Header with Logo and Title in white container */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 text-center sm:text-left relative">
          {/* Linker Teil: 2bAHEAD Logo + Text */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left flex-grow">
            <img 
              src="/2ba logo.png" 
              alt="2bAHEAD - Tomorrowning your business" 
              className="h-12 sm:h-16 w-auto flex-shrink-0"
            />
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight" style={{ color: widgetConfig.primaryColor }}>
                KI-Pionier: Siegel
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">
                Lassen Sie Ihre KI-Kompetenz auszeichnen
              </p>
            </div>
          </div>

          {/* Rechter Teil: Siegel - größer und überlappend */}
          <div className="relative">
            <img 
              src="/PionierSiegel.png" 
              alt="KI-Pionier Logo" 
              className="h-40 sm:h-48 lg:h-56 w-auto relative z-20 transform rotate-12 drop-shadow-xl"
              style={{
                filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25))',
                marginRight: '-60px',
                marginTop: '-30px',
                marginBottom: '-30px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>


      {/* Main content */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Welcome message */}
          <div className="text-center text-sm sm:text-base text-gray-700 mb-6">
            <p>
              Werden Sie ein KI-Vorreiter mit unserem Siegel. Diese Analyse ist der erste Schritt, um sich für die Auszeichnung zu qualifizieren.
            </p>
          </div>

          {/* "So funktioniert's" Section */}
          <section className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
             <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">So funktioniert's:</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
               {/* Schritt 1 */}
               <div className="flex items-start gap-2">
                 <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${widgetConfig.primaryColor}1A` }}>
                   <ClipboardList className="w-4 h-4" style={{ color: widgetConfig.primaryColor }} />
                 </div>
                 <div> <h3 className="font-medium text-base mb-0.5">1. Fragebogen</h3> <p className="text-xs text-gray-600">Gezielte Fragen zu 5 KI-Säulen beantworten (ca. 10-15 Min.) mit anschließender Sofort-Übersicht und Analyse Ihres Standes.</p> </div>
               </div>
                {/* Schritt 2 */}
               <div className="flex items-start gap-2">
                 <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${widgetConfig.primaryColor}1A` }}>
                   <Settings className="w-4 h-4" style={{ color: widgetConfig.primaryColor }} />
                 </div>
                 <div> <h3 className="font-medium text-base mb-0.5">2. Interne Überprüfung</h3> <p className="text-xs text-gray-600">Wir prüfen Ihre Selbstauskunft intern durch unsere Experten & Tools und informieren Sie innerhalb von 3 Tagen über das Ergebnis.</p> </div>
               </div>
               {/* Schritt 3 */}
               <div className="flex items-start gap-2">
                 <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${widgetConfig.primaryColor}1A` }}>
                   <Star className="w-4 h-4" style={{ color: widgetConfig.primaryColor }} />
                 </div>
                 <div> <h3 className="font-medium text-base mb-0.5">3. Auszeichnung</h3> <p className="text-xs text-gray-600">Bei einem positiven Ergebnis erhalten Sie die Möglichkeit, Ihr persönliches „KI-Pionier" Siegel zu lizenzieren.</p> </div>
               </div>
             </div>
           </section>

          {/* Top CTA Section */}
          <section className="text-center mb-6">
            <div 
              className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 sm:p-6 border-2 border-dashed shadow-lg"
              style={{ borderColor: `${widgetConfig.primaryColor}60` }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: widgetConfig.primaryColor }}
                ></div>
                <span className="text-sm font-medium" style={{ color: widgetConfig.primaryColor }}>
                  Jetzt starten
                </span>
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: widgetConfig.primaryColor }}
                ></div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: widgetConfig.primaryColor }}>
                Bereit für Ihre KI-Pionier Qualifikation?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Starten Sie jetzt Ihre individuelle Analyse und qualifizieren Sie sich in 10-15 Minuten für das Siegel
              </p>
              <button
                onClick={() => {
                  const formSection = document.querySelector('.footer-form-section');
                  if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-base
                         transition-all duration-300 hover:scale-[1.05] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2
                         transform active:scale-[0.98]"
                style={{ backgroundColor: widgetConfig.primaryColor, ringColor: widgetConfig.primaryColor }}
              >
                <ArrowRight className="w-4 h-4" />
                KI-Pionier Analyse jetzt beginnen
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>

           {/* "Warum diese Analyse jetzt sinnvoll ist" Section */}
           <section className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
             <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">Ihr Nutzen als Siegelträger:</h2>
             <div className="space-y-3">
               <div className="flex items-start gap-2">
                 <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${widgetConfig.primaryColor}1A` }}>
                   <span className="text-xs font-bold" style={{ color: widgetConfig.primaryColor }}>1</span>
                 </div>
                 <p className="text-sm text-gray-700">Präsentation des Siegels für Ihre Außenkommunikation</p>
               </div>
               <div className="flex items-start gap-2">
                 <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${widgetConfig.primaryColor}1A` }}>
                   <span className="text-xs font-bold" style={{ color: widgetConfig.primaryColor }}>2</span>
                 </div>
                 <p className="text-sm text-gray-700">Feierliche Überreichung des Siegels durch Sven Gabor Janszky an unserem Zukunftstag</p>
               </div>
               <div className="flex items-start gap-2">
                 <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${widgetConfig.primaryColor}1A` }}>
                   <span className="text-xs font-bold" style={{ color: widgetConfig.primaryColor }}>3</span>
                 </div>
                 <p className="text-sm text-gray-700">Kostenloses Strategiegespräch mit den Experten des 2b AHEAD ThinkTank</p>
               </div>
               <div className="flex items-start gap-2">
                 <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${widgetConfig.primaryColor}1A` }}>
                   <span className="text-xs font-bold" style={{ color: widgetConfig.primaryColor }}>4</span>
                 </div>
                 <p className="text-sm text-gray-700">2x Freiticket zu unserem Zukunftskongress für Siegelträger (im Wert von 998€)</p>
               </div>
               <div className="flex items-start gap-2">
                 <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${widgetConfig.primaryColor}1A` }}>
                   <span className="text-xs font-bold" style={{ color: widgetConfig.primaryColor }}>5</span>
                 </div>
                 <p className="text-sm text-gray-700">Beitritt zu unserer exklusiven Community von innovativen und zukunftsführenden Unternehmen</p>
               </div>
             </div>
           </section>

           {/* "Warum überhaupt ein Siegel" Section */}
           <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm">
             {/* Decorative background elements */}
             <div className="absolute top-0 right-0 w-32 h-32 opacity-5" style={{ backgroundColor: widgetConfig.primaryColor }}>
               <div className="w-full h-full rounded-full transform translate-x-16 -translate-y-16"></div>
             </div>
             <div className="absolute bottom-0 left-0 w-24 h-24 opacity-5" style={{ backgroundColor: widgetConfig.primaryColor }}>
               <div className="w-full h-full rounded-full transform -translate-x-12 translate-y-12"></div>
             </div>
             
             <div className="relative z-10 p-6 sm:p-8">
               <div className="flex items-center justify-center gap-3 mb-6">
                 <div 
                   className="w-8 h-1 rounded-full"
                   style={{ backgroundColor: widgetConfig.primaryColor }}
                 ></div>
                 <h2 className="text-lg sm:text-xl font-bold text-center" style={{ color: widgetConfig.primaryColor }}>
                   Warum überhaupt ein Siegel
                 </h2>
                 <div 
                   className="w-8 h-1 rounded-full"
                   style={{ backgroundColor: widgetConfig.primaryColor }}
                 ></div>
               </div>
               
               <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
               <p>
                 Unternehmen, die langfristig erfolgreich sein wollen, müssen ihre Stärken und Qualitäten sichtbar und glaubwürdig kommunizieren. Auszeichnungen und Qualitätssiegel spielen hierbei eine entscheidende Rolle. Sie erhöhen die Sichtbarkeit, schaffen Vertrauen bei Mitarbeitern, Kunden sowie Geschäftspartnern und stärken nachhaltig die Wettbewerbsposition und das Unternehmenswachstum.
               </p>
               
               <div className="flex items-start gap-4 p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
                 <div 
                   className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                   style={{ backgroundColor: widgetConfig.primaryColor }}
                 ></div>
               <p>
                 Laut der aktuellen Studie "Employer Brand Research 2022" von YouGov werden Unternehmen mit anerkannten Qualitätssiegeln von Kunden und potenziellen Bewerbern als deutlich glaubwürdiger, innovativer und attraktiver wahrgenommen. Dies wirkt sich unmittelbar auf das Unternehmensimage aus und hilft insbesondere mittelständische Unternehmen, sich klarer vom Wettbewerb abzugrenzen.
               </p>
               </div>
               
               <p>
                 Ein „KI-Pionier"-Siegel hebt speziell die Innovationskraft und technologische Führungsrolle mittelständischer Unternehmen im Bereich Künstliche Intelligenz hervor. Es betont die Attraktivität als zukunftsorientierter Arbeitgeber, erhöht die Glaubwürdigkeit gegenüber Geschäftspartnern und stärkt zugleich die Marke bei bestehenden, sowie potenziellen Kunden.
               </p>
             </div>
             </div>
           </section>

        </div>
      </div>

      {/* Footer with start button */}
      <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0 footer-form-section"> {/* Padding angepasst */}
        <div className="max-w-md mx-auto text-center">
          {/* Scroll indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: `${widgetConfig.primaryColor}60` }}
            ></div>
            <span className="text-xs text-gray-500 font-medium">Anmeldeformular</span>
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: `${widgetConfig.primaryColor}60` }}
            ></div>
          </div>
          
          {/* User Information Form */}
          <div className="mb-4 space-y-3">
            {/* Name Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError(null);
                  }}
                  placeholder="Ihr Name"
                  className={`w-full pl-10 pr-4 py-2 border ${
                    nameError ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
                  style={{ 
                    ringColor: nameError ? '#f87171' : widgetConfig.primaryColor
                  }}
                />
              </div>
              {nameError && (
                <p className="mt-1 text-sm text-red-500">{nameError}</p>
              )}
            </div>

            {/* Company Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    setCompanyError(null);
                  }}
                  placeholder="Unternehmensname"
                  className={`w-full pl-10 pr-4 py-2 border ${
                    companyError ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
                  style={{ 
                    ringColor: companyError ? '#f87171' : widgetConfig.primaryColor
                  }}
                />
              </div>
              {companyError && (
                <p className="mt-1 text-sm text-red-500">{companyError}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null);
                }}
                placeholder="Ihre E-Mail-Adresse"
                className={`w-full pl-10 pr-4 py-2 border ${
                  emailError ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
                style={{ 
                  ringColor: emailError ? '#f87171' : widgetConfig.primaryColor
                }}
              />
            </div>
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}

            {/* Employees Select */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={employees}
                  onChange={(e) => {
                    setEmployees(e.target.value);
                    setEmployeesError(null);
                  }}
                  className={`w-full pl-10 pr-4 py-2 border ${
                    employeesError ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors appearance-none bg-white`}
                  style={{ 
                    ringColor: employeesError ? '#f87171' : widgetConfig.primaryColor
                  }}
                >
                  <option value="">Anzahl der Mitarbeiter wählen</option>
                  <option value="1">Nur ich (Einzelunternehmer)</option>
                  <option value="2-5">2-5 Mitarbeiter</option>
                  <option value="6-10">6-10 Mitarbeiter</option>
                  <option value="11-25">11-25 Mitarbeiter</option>
                  <option value="26-50">26-50 Mitarbeiter</option>
                  <option value="51-100">51-100 Mitarbeiter</option>
                  <option value="101-250">101-250 Mitarbeiter</option>
                  <option value="251-500">251-500 Mitarbeiter</option>
                  <option value="500+">Mehr als 500 Mitarbeiter</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {employeesError && (
                <p className="mt-1 text-sm text-red-500">{employeesError}</p>
              )}
            </div>
          </div>
          <button
            onClick={handleStart}
            className="w-full py-3 px-6 rounded-lg text-white font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: widgetConfig.primaryColor, ringColor: widgetConfig.primaryColor }}
            aria-label="Analyse starten"
          >
             KI-Pionier Analyse starten
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="mt-2 text-xs text-gray-500">
            Ihre Daten werden ausschließlich für die Analyse und die Siegel-Qualifikation verwendet.
          </p>
        </div>
      </div>
    </div>
  );
}