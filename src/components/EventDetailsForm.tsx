import React, { useState } from 'react';

interface EventDetailsFormProps {
  onSubmit: (answer: string) => void;
  isLoading: boolean;
  widgetConfig: { primaryColor: string };
}

export function EventDetailsForm({ onSubmit, isLoading, widgetConfig }: EventDetailsFormProps) {
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [participants, setParticipants] = useState('');
  const [records, setRecords] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Compile all the information into a single string
    const details = [
      `Datum: ${date}`,
      `Ort: ${location}`,
      `Teilnehmerzahl: ${participants}`,
      `Besondere Rekorde: ${records}`,
      additionalInfo ? `Weitere Details: ${additionalInfo}` : ''
    ].filter(Boolean).join('\n\n');
    
    onSubmit(details);
  };

  return (
    <div className="mb-4">
      <div className="mb-2">
        <strong className="text-lg">Nenne die wesentlichen Details des Events:</strong>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-1">
            Datum des Events
          </label>
          <input
            id="event-date"
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="z.B. 15. März 2025"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={isLoading}
            aria-required="true"
          />
        </div>
        
        <div>
          <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 mb-1">
            Ort des Events
          </label>
          <input
            id="event-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="z.B. München, Kongresszentrum"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={isLoading}
            aria-required="true"
          />
        </div>
        
        <div>
          <label htmlFor="event-participants" className="block text-sm font-medium text-gray-700 mb-1">
            Anzahl der Teilnehmer
          </label>
          <input
            id="event-participants"
            type="text"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder="z.B. 200 Teilnehmer"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={isLoading}
            aria-required="true"
          />
        </div>
        
        <div>
          <label htmlFor="event-records" className="block text-sm font-medium text-gray-700 mb-1">
            Besondere Rekorde oder Highlights
          </label>
          <input
            id="event-records"
            type="text"
            value={records}
            onChange={(e) => setRecords(e.target.value)}
            placeholder="z.B. Neuer Weltrekord mit 200 Teilnehmern"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="event-additional-info" className="block text-sm font-medium text-gray-700 mb-1">
            Weitere Details (optional)
          </label>
          <textarea
            id="event-additional-info"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Weitere relevante Informationen zum Event..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={3}
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-white transition-colors"
          style={{ backgroundColor: widgetConfig.primaryColor }}
          disabled={isLoading || (!date && !location && !participants && !records)}
          aria-label="Event-Details senden"
        >
          Antwort senden
        </button>
      </form>
    </div>
  );
}