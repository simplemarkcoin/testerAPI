
import React, { useState } from 'react';
import type { ApiResponse } from '../types';
import { CodeBlock } from './CodeBlock';
import { AiIcon, InfoIcon } from './icons';

interface ResponsePanelProps {
  response: ApiResponse | null;
  loading: boolean;
  aiAnalysis: string;
  onAnalyze: () => void;
  aiLoading: boolean;
}

type Tab = 'body' | 'headers' | 'ai';

const getStatusColor = (status: number) => {
  if (status >= 200 && status < 300) return 'text-green-400';
  if (status >= 400 && status < 500) return 'text-yellow-400';
  if (status >= 500 || status === 0) return 'text-red-400';
  return 'text-gray-400';
};

export const ResponsePanel: React.FC<ResponsePanelProps> = ({ response, loading, aiAnalysis, onAnalyze, aiLoading }) => {
  const [activeTab, setActiveTab] = useState<Tab>('body');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <InfoIcon className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold">Ready to send</h2>
        <p>Send a request to see the response here.</p>
        <p className="mt-4 text-xs max-w-md text-center">Note: Requests are sent directly from your browser. Cross-Origin Resource Sharing (CORS) policies on the target server may block requests. For robust testing, consider a tool that uses a server-side proxy.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-4 mb-4 text-sm">
        <span className={`font-bold ${getStatusColor(response.status)}`}>
          Status: {response.status} {response.statusText}
        </span>
        <span>Time: {response.time}ms</span>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex border-b border-gray-700">
            {['body', 'headers', 'ai'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as Tab)}
                    className={`px-4 py-2 text-sm font-medium focus:outline-none ${activeTab === tab ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                   {tab === 'ai' ? 'AI Assistant' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>

        <div className="flex-1 bg-gray-800 rounded-b-md overflow-y-auto">
          {activeTab === 'body' && (
            <CodeBlock code={response.body} />
          )}
          {activeTab === 'headers' && (
            <div className="p-4 font-mono text-sm">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="font-bold text-gray-400 w-1/4">{key}:</span>
                  <span className="text-gray-200 break-all">{value}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'ai' && (
            <div className="p-4 h-full flex flex-col">
              {!aiAnalysis && !aiLoading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <AiIcon className="w-12 h-12 mb-4 text-cyan-400"/>
                    <h3 className="text-lg font-semibold">AI Analysis</h3>
                    <p className="text-gray-400 mb-4">Get a detailed explanation of the response.</p>
                    <button
                        onClick={onAnalyze}
                        disabled={aiLoading}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                    >
                        Analyze Response
                    </button>
                </div>
              )}
              {aiLoading && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
              )}
              {aiAnalysis && (
                 <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap font-sans">
                  <h3 className="text-lg font-semibold text-cyan-400 border-b border-gray-700 pb-2 mb-2">Gemini Analysis</h3>
                  <pre className="whitespace-pre-wrap font-sans text-sm">{aiAnalysis}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
