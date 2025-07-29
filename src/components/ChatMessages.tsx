import React from 'react';
import { Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, WidgetConfig } from '../types';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  widgetConfig: WidgetConfig;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatMessages({ messages, isLoading, widgetConfig, messagesEndRef }: ChatMessagesProps) {
  // Function to format the message text for better display
  const formatMessageText = (text: string): string => {
    // Format options to display on separate lines
    text = text.replace(/([a-d]\))\s(.*?)(?=\s[a-d]\)|$)/g, '$1 $2\n');
    
    // Format questions to stand out
    text = text.replace(/\*\*Frage (\d+\.\d+):(.*?)\*\*/g, '**Frage $1:**$2**');
    
    // Add spacing after section headers
    text = text.replace(/(## .*?)\n/g, '$1\n\n');
    text = text.replace(/(# .*?)\n/g, '$1\n\n');
    
    // Add spacing after horizontal rules
    text = text.replace(/---\n/g, '---\n\n');
    
    return text;
  };

  return (
    <div className="h-[400px] overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-lg ${
              message.isBot
                ? 'bg-gray-100 text-gray-800'
                : 'text-white'
            }`}
            style={{ backgroundColor: message.isBot ? '#f3f4f6' : widgetConfig.primaryColor }}
          >
            <div className="flex items-center gap-2 mb-1">
              {message.isBot ? (
                <Bot className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span className="text-xs opacity-75">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div className="markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-3" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-md font-bold mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="mb-2" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                  em: ({node, ...props}) => <em className="italic" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-amber-300 pl-4 my-2 bg-amber-50 p-2 rounded" {...props} />
                  ),
                  code: ({node, inline, ...props}) => 
                    inline ? (
                      <code className="bg-gray-200 px-1 rounded" {...props} />
                    ) : (
                      <code className="block bg-gray-200 p-2 rounded my-2" {...props} />
                    ),
                  hr: () => <hr className="my-4 border-t border-gray-200" />,
                }}
              >
                {formatMessageText(message.text)}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Denke nach...</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}