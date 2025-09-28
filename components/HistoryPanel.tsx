
import React from 'react';
import type { HistoryItem } from '../types';
import { HTTP_METHOD_COLORS } from '../constants';
import { TrashIcon } from './icons';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear }) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-2 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-400 uppercase">History</h2>
        <button onClick={onClear} className="text-gray-500 hover:text-red-400 transition-colors" title="Clear History">
          <TrashIcon className="w-5 h-5"/>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 && <p className="text-center text-sm text-gray-500 p-4">No history yet.</p>}
        <ul>
          {history.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSelect(item)}
                className="w-full text-left px-3 py-2 hover:bg-gray-800 focus:outline-none focus:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className={`font-mono font-bold text-xs w-16 text-right ${HTTP_METHOD_COLORS[item.method]}`}>
                    {item.method}
                  </span>
                  <span className="flex-1 truncate text-sm text-gray-300">{item.url}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
