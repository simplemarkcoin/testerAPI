import React, { useState } from 'react';
import type { ApiResponse } from '../types';
import { AiIcon, InfoIcon } from './icons';

interface AiToolsPanelProps {
  response: ApiResponse | null;
  onBrainstorm: (prompt: string) => Promise<void>;
  onSummarize: (data: any) => Promise<void>;
  aiToolResult: string;
  aiToolLoading: boolean;
}

type Tool = 'brainstorm' | 'summarize';

export const AiToolsPanel: React.FC<AiToolsPanelProps> = ({
  response,
  onBrainstorm,
  onSummarize,
  aiToolResult,
  aiToolLoading,
}) => {
  const [selectedTool, setSelectedTool] = useState<Tool>('brainstorm');
  const [prompt, setPrompt] = useState('');

  const handleSummarize = () => {
    if (response?.body) {
      onSummarize(response.body);
    }
  };

  const handleBrainstorm = () => {
    if (prompt) {
      onBrainstorm(prompt);
    }
  };

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-400 uppercase flex items-center">
          <AiIcon className="w-5 h-5 mr-2 text-cyan-400" />
          AI Tools
        </h2>
      </div>

      <select
        value={selectedTool}
        onChange={(e) => setSelectedTool(e.target.value as Tool)}
        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <option value="brainstorm">Content Brainstorming</option>
        <option value="summarize">Summarize API Data</option>
      </select>

      {selectedTool === 'brainstorm' && (
        <div className="flex flex-col space-y-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a topic to brainstorm..."
            className="w-full h-24 p-2 bg-gray-800 border border-gray-600 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
            aria-label="Brainstorming topic"
          />
          <button
            onClick={handleBrainstorm}
            disabled={!prompt || aiToolLoading}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            {aiToolLoading ? 'Generating...' : 'Generate Ideas'}
          </button>
        </div>
      )}

      {selectedTool === 'summarize' && (
        <div className="flex flex-col space-y-2">
          {!response ? (
            <div className="text-center text-sm text-gray-500 p-4 border border-dashed border-gray-600 rounded-md">
              <InfoIcon className="w-8 h-8 mx-auto mb-2" />
              <p>Make an API request first to summarize its response data.</p>
            </div>
          ) : (
            <button
              onClick={handleSummarize}
              disabled={aiToolLoading}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
              {aiToolLoading ? 'Summarizing...' : 'Summarize Response'}
            </button>
          )}
        </div>
      )}

      <div className="flex-1 mt-4 border-t border-gray-700 pt-4 overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Result</h3>
        {aiToolLoading && (
          <div className="flex items-center justify-center h-full" aria-label="AI result is loading">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        )}
        {aiToolResult && !aiToolLoading && (
          <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap font-sans bg-gray-800 p-3 rounded-md">
            <pre className="whitespace-pre-wrap font-sans text-sm">{aiToolResult}</pre>
          </div>
        )}
        {!aiToolResult && !aiToolLoading && (
            <div className="text-center text-sm text-gray-500 pt-8">
                Your AI-generated content will appear here.
            </div>
        )}
      </div>
    </div>
  );
};
