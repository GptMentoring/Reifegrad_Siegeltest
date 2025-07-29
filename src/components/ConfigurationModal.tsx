import React from 'react';
import { Code, Maximize2, X } from 'lucide-react';
import { WidgetConfig, WidgetSize } from '../types';

interface ConfigurationModalProps {
  widgetConfig: WidgetConfig;
  setWidgetConfig: (config: WidgetConfig) => void;
  onClose: () => void;
  selectedSize: WidgetSize;
  setSelectedSize: (size: WidgetSize) => void;
  useCustomSize: boolean;
  setUseCustomSize: (use: boolean) => void;
  customWidth: string;
  setCustomWidth: (width: string) => void;
  customHeight: string;
  setCustomHeight: (height: string) => void;
  getCurrentWidgetSize: () => void;
  WIDGET_SIZES: WidgetSize[];
  getEmbedCode: () => string;
  copyEmbedCode: () => void;
  setPreviewMode: (preview: boolean) => void;
}

export function ConfigurationModal({
  widgetConfig,
  setWidgetConfig,
  onClose,
  selectedSize,
  setSelectedSize,
  useCustomSize,
  setUseCustomSize,
  customWidth,
  setCustomWidth,
  customHeight,
  setCustomHeight,
  getCurrentWidgetSize,
  WIDGET_SIZES,
  getEmbedCode,
  copyEmbedCode,
  setPreviewMode
}: ConfigurationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Widget Konfiguration</h2>
          <button
            onClick={() => onClose()}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Konfiguration schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="bot-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name des Bots
            </label>
            <input
              id="bot-name"
              type="text"
              value={widgetConfig.name}
              onChange={(e) => setWidgetConfig({ ...widgetConfig, name: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-describedby="bot-name-help"
            />
            <p id="bot-name-help" className="text-xs text-gray-500 mt-1">
              Der Name wird in der Kopfzeile des Widgets angezeigt.
            </p>
          </div>
          <div>
            <label htmlFor="primary-color" className="block text-sm font-medium text-gray-700 mb-1">
              Primärfarbe
            </label>
            <input
              id="primary-color"
              type="color"
              value={widgetConfig.primaryColor}
              onChange={(e) => setWidgetConfig({ ...widgetConfig, primaryColor: e.target.value })}
              className="w-full h-10 p-1 rounded cursor-pointer"
              aria-describedby="primary-color-help"
            />
            <p id="primary-color-help" className="text-xs text-gray-500 mt-1">
              Diese Farbe wird für Buttons und Akzente verwendet.
            </p>
          </div>
          <div>
            <label htmlFor="welcome-message" className="block text-sm font-medium text-gray-700 mb-1">
              Willkommensnachricht
            </label>
            <textarea
              id="welcome-message"
              value={widgetConfig.welcomeMessage}
              onChange={(e) => setWidgetConfig({ ...widgetConfig, welcomeMessage: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={3}
              aria-describedby="welcome-message-help"
            />
            <p id="welcome-message-help" className="text-xs text-gray-500 mt-1">
              Markdown wird unterstützt (z.B. **fett**, *kursiv*).
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Widget-Größe
            </label>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="customSize"
                  checked={useCustomSize}
                  onChange={(e) => {
                    setUseCustomSize(e.target.checked);
                    setPreviewMode(true);
                  }}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="customSize" className="text-sm text-gray-700">
                  Benutzerdefinierte Größe
                </label>
              </div>
              
              {useCustomSize ? (
                <div className="space-y-4">
                  <button
                    onClick={getCurrentWidgetSize}
                    className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    aria-label="Aktuelle Widget-Größe übernehmen"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Aktuelle Widget-Größe übernehmen
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="custom-width" className="block text-sm text-gray-600 mb-1">Breite (px)</label>
                      <input
                        id="custom-width"
                        type="number"
                        value={customWidth}
                        onChange={(e) => {
                          setCustomWidth(e.target.value);
                          setPreviewMode(true);
                        }}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                        min="200"
                        aria-label="Benutzerdefinierte Breite in Pixeln"
                      />
                    </div>
                    <div>
                      <label htmlFor="custom-height" className="block text-sm text-gray-600 mb-1">Höhe (px)</label>
                      <input
                        id="custom-height"
                        type="number"
                        value={customHeight}
                        onChange={(e) => {
                          setCustomHeight(e.target.value);
                          setPreviewMode(true);
                        }}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                        min="300"
                        aria-label="Benutzerdefinierte Höhe in Pixeln"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {WIDGET_SIZES.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => {
                        setSelectedSize(size);
                        setPreviewMode(true);
                      }}
                      className={`p-2 border rounded-lg text-sm transition-colors ${
                        selectedSize === size
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-amber-500'
                      }`}
                      aria-pressed={selectedSize === size}
                      aria-label={`Größe: ${size.name}`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="embed-code" className="block text-sm font-medium text-gray-700 mb-2">
              Embed-Code
            </label>
            <pre 
              id="embed-code"
              className="bg-gray-100 p-4 rounded overflow-x-auto text-sm mb-2"
              aria-label="HTML-Code zum Einbetten des Widgets"
            >
              {getEmbedCode()}
            </pre>
            <button
              onClick={copyEmbedCode}
              className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              aria-label="Embed-Code in die Zwischenablage kopieren"
            >
              <Code className="w-4 h-4" />
              Code kopieren
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full p-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
            aria-label="Konfiguration speichern und schließen"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}