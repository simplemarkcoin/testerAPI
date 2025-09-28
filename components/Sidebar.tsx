import React, { useState } from 'react';
import type { HistoryItem, ApiResponse } from '../types';
import { HistoryPanel } from './HistoryPanel';
import { AiToolsPanel } from './AiToolsPanel';
import { LogoIcon } from './icons';

interface SidebarProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  response: ApiResponse | null;
  onBrainstorm: (prompt: string) => Promise<void>;
  onSummarize: (data: any) => Promise<void>;
  aiToolResult: string;
  aiToolLoading: boolean;
}

type Tab = 'history' | 'tools';

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab>('history');

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 border-r border-gray-700">
      <div className="p-4 border-b border-gray-700 flex items-center space-x-2">
        <LogoIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-xl font-bold">Gemini API Tester</h1>
      </div>

      <div className="flex border-b border-gray-700" role="tablist">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-2 text-sm font-medium focus:outline-none ${activeTab === 'history' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:bg-gray-800'}`}
          role="tab"
          aria-selected={activeTab === 'history'}
          aria-controls="history-panel"
        >
          History
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex-1 px-4 py-2 text-sm font-medium focus:outline-none ${activeTab === 'tools' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:bg-gray-800'}`}
          role="tab"
          aria-selected={activeTab === 'tools'}
          aria-controls="tools-panel"
        >
          AI Tools
        </button>
      </div>
      
      <div className="flex-1 min-h-0">
        {activeTab === 'history' && (
          <div id="history-panel" role="tabpanel">
            <HistoryPanel
              history={props.history}
              onSelect={props.onSelectHistory}
              onClear={props.onClearHistory}
            />
          </div>
        )}
        {activeTab === 'tools' && (
          <div id="tools-panel" role="tabpanel" className="h-full">
            <AiToolsPanel
              response={props.response}
              onBrainstorm={props.onBrainstorm}
              onSummarize={props.onSummarize}
              aiToolResult={props.aiToolResult}
              aiToolLoading={props.aiToolLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};
