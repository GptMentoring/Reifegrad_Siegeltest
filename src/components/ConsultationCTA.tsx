import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Calendar, ArrowRight, Phone, Clock, CheckCircle, Users, FileText, Star, X } from 'lucide-react';

interface ConsultationCTAProps {
  widgetConfig: { primaryColor: string };
}

export function ConsultationCTA({ widgetConfig }: ConsultationCTAProps) {
  const [showMeetingEmbed, setShowMeetingEmbed] = useState(false);

  // Load HubSpot script when embed is shown
  useEffect(() => {
    if (showMeetingEmbed) {
      // Remove existing script if it exists
      const existingScript = document.querySelector('script[src*="MeetingsEmbedCode.js"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Create and load the HubSpot script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
      script.async = true;
      
      // Add script to document head
      document.head.appendChild(script);

      // Cleanup function
      return () => {
        const scriptToRemove = document.querySelector('script[src*="MeetingsEmbedCode.js"]');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [showMeetingEmbed]);

  return (
    <div 
      className="rounded-xl p-6 lg:p-8 mt-8 relative overflow-hidden border shadow-lg"
      style={{ 
        backgroundColor: `${widgetConfig.primaryColor}05`,
        borderColor: `${widgetConfig.primaryColor}20`
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full" 
          style={{ backgroundColor: widgetConfig.primaryColor }}></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full"
          style={{ backgroundColor: widgetConfig.primaryColor }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Header in white container */}
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
              <div 
                className="p-2 sm:p-3 rounded-xl flex-shrink-0"
                style={{ backgroundColor: `${widgetConfig.primaryColor}15` }}
              >
                <Calendar 
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  style={{ color: widgetConfig.primaryColor }}
                />
              </div>
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 mb-2">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: widgetConfig.primaryColor }}>
                    Jetzt persönliches Strategiegespräch vereinbaren und "KI-Pionier" werden
                  </h3>
                  <div className="block sm:hidden lg:block">
                    <img 
                      src="/2ba logo.png" 
                      alt="2bAHEAD" 
                      className="h-8 sm:h-10 w-auto"
                    />
                  </div>
                </div>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                  Lassen Sie uns gemeinsam Ihre Analyseergebnisse durchgehen und einen 
                  konkreten Aktionsplan für Ihre KI-Transformation entwickeln.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Offer Banner */}
        <div 
          className="rounded-lg p-4 mb-6 border-2 border-dashed bg-white shadow-sm"
          style={{ 
            borderColor: widgetConfig.primaryColor
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5" style={{ color: widgetConfig.primaryColor }} />
            <h4 className="font-bold text-lg" style={{ color: widgetConfig.primaryColor }}>
              Exklusiver Bonus für Analyse-Teilnehmer
            </h4>
          </div>
          <p className="text-gray-700">
            <strong>Erhalten Sie zusätzlich einen ausführlichen, personalisierten KI-Strategiebericht </strong> 
             (Wert: 297€) kostenlos zu Ihrem Strategiegespräch dazu. Dieser detaillierte Report 
            baut auf Ihrer Analyse auf und enthält spezifische Handlungsempfehlungen für Ihr Unternehmen, um zum "KI-Pionier" zu werden.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 lg:mb-8">
          {[
            {
              icon: Clock,
              title: '30-minütiges Expertengespräch',
              description: 'Fokussierte Analyse Ihrer Potenziale'
            },
            {
              icon: Users,
              title: 'Persönliche Beratung',
              description: 'Individuell auf Ihre Situation abgestimmt'
            },
            {
              icon: CheckCircle,
              title: 'Konkrete nächste Schritte',
              description: 'Praxisnahe Handlungsempfehlungen'
            },
            {
              icon: FileText,
              title: 'Ausführlicher Strategiebericht',
              description: 'Detaillierte Analyse + Roadmap (Wert: 297€)'
            }
          ].map((benefit, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 lg:p-4 rounded-xl transition-all duration-200 hover:shadow-md bg-white border border-gray-100"
            >
              <div 
                className="p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${widgetConfig.primaryColor}20` }}
              >
                <benefit.icon 
                  className="w-5 h-5"
                  style={{ color: widgetConfig.primaryColor }}
                />
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: widgetConfig.primaryColor }}>
                  {benefit.title}
                </h4>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setShowMeetingEmbed(true)}
            className="inline-flex items-center gap-3 px-6 lg:px-8 py-3 lg:py-4 rounded-xl text-white font-medium text-base lg:text-lg
                     transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                     w-full md:w-auto justify-center"
            style={{ backgroundColor: widgetConfig.primaryColor }}
          >
            Kostenloses Strategiegespräch + Bonus-Report sichern
            <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          <p className="mt-3 lg:mt-4 text-xs lg:text-sm text-gray-500 text-center max-w-lg">
            Nach der Terminvereinbarung erhalten Sie eine Bestätigung per E-Mail mit allen Details 
            und einem Link für das Gespräch. Der Bonus-Report wird nach dem Gespräch individuell erstellt.
          </p>
        </div>
      </div>

      {/* Pop-up Modal for HubSpot Meetings */}
      {showMeetingEmbed && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${widgetConfig.primaryColor}15` }}
                >
                  <Calendar 
                    className="w-6 h-6"
                    style={{ color: widgetConfig.primaryColor }}
                  />
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl font-bold" style={{ color: widgetConfig.primaryColor }}>
                    Strategiegespräch buchen
                  </h3>
                  <p className="text-sm text-gray-600">
                    Wählen Sie einen passenden Termin für Ihr kostenloses Beratungsgespräch
                  </p>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setShowMeetingEmbed(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                aria-label="Modal schließen"
              >
                <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 lg:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* HubSpot Meetings Embed Container */}
              <div className="bg-gray-50 rounded-lg p-4 min-h-[600px]">
                <div 
                  className="meetings-iframe-container" 
                  data-src="https://vertrieb.2bahead.com/meetings/thinktank/ki-reifegrad-auswertung?embed=true"
                  style={{ minHeight: '500px', width: '100%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}