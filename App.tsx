
import React, { useState, useCallback } from 'react';
import { RequestPanel } from './components/RequestPanel';
import { ResponsePanel } from './components/ResponsePanel';
import { HistoryPanel } from './components/HistoryPanel';
import { sendRequest } from './services/apiService';
import { analyzeApiResponse } from './services/geminiService';
import type { ApiRequest, ApiResponse, HistoryItem, AuthConfig, KeyValuePair } from './types';
import { HttpMethod, AuthType } from './constants';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [request, setRequest] = useState<ApiRequest>({
    id: crypto.randomUUID(),
    method: HttpMethod.GET,
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    headers: [],
    params: [],
    body: '',
    auth: { type: AuthType.NONE },
  });
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const updateRequest = useCallback(<K extends keyof ApiRequest>(key: K, value: ApiRequest[K]) => {
    setRequest(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    setAiAnalysis('');
    
    try {
      const res = await sendRequest(request);
      setResponse(res);
      
      const historyItem: HistoryItem = { ...request, id: crypto.randomUUID() };
      setHistory(prev => [historyItem, ...prev.slice(0, 49)]); // Keep last 50
    } catch (error: any) {
      const errorResponse: ApiResponse = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        body: error.message,
        time: 0,
        error: true,
      };
      setResponse(errorResponse);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!response) return;
    setAiLoading(true);
    setAiAnalysis('');
    try {
      const analysis = await analyzeApiResponse(request, response);
      setAiAnalysis(analysis);
    } catch (error: any) {
      setAiAnalysis(`Error analyzing response: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const loadFromHistory = useCallback((item: HistoryItem) => {
    setRequest(item);
    setResponse(null);
    setAiAnalysis('');
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-gray-200">
      <div className="w-1/5 min-w-[250px] max-w-[350px] flex flex-col border-r border-gray-700">
        <div className="p-4 border-b border-gray-700 flex items-center space-x-2">
            <LogoIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-xl font-bold">Gemini API Tester</h1>
        </div>
        <HistoryPanel history={history} onSelect={loadFromHistory} onClear={handleClearHistory} />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          <RequestPanel
            request={request}
            onMethodChange={(method) => updateRequest('method', method)}
            onUrlChange={(url) => updateRequest('url', url)}
            onParamsChange={(params) => updateRequest('params', params)}
            onAuthChange={(auth) => updateRequest('auth', auth)}
            onHeadersChange={(headers) => updateRequest('headers', headers)}
            onBodyChange={(body) => updateRequest('body', body)}
            onSend={handleSend}
            loading={loading}
          />
        </div>

        <div className="flex-1 p-4 border-t border-gray-700 overflow-y-auto">
          <ResponsePanel
            response={response}
            loading={loading}
            aiAnalysis={aiAnalysis}
            onAnalyze={handleAnalyze}
            aiLoading={aiLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
