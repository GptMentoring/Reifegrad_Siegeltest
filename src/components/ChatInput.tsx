import React from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  widgetConfig: { primaryColor: string };
}

export function ChatInput({ input, setInput, isLoading, handleSubmit, widgetConfig }: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Schreiben Sie Ihre Nachricht..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`p-2 rounded-lg transition-colors ${
            isLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'text-white hover:opacity-90'
          }`}
          style={{ backgroundColor: isLoading ? '#d1d5db' : widgetConfig.primaryColor }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
}