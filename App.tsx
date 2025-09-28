import React, { useState, useCallback, useEffect } from 'react';
import { RequestPanel } from './components/RequestPanel';
import { ResponsePanel } from './components/ResponsePanel';
import { Sidebar } from './components/Sidebar';
import { sendRequest } from './services/apiService';
import { analyzeApiResponse, brainstormContent, summarizeData } from './services/geminiService';
import type { ApiRequest, ApiResponse, HistoryItem } from './types';
import { HttpMethod, AuthType } from './constants';
import { MenuIcon } from './components/icons';

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
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const savedHistory = localStorage.getItem('api-tester-history');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('api-tester-history', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  // AI State
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [aiToolLoading, setAiToolLoading] = useState<boolean>(false);
  const [aiToolResult, setAiToolResult] = useState<string>('');

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const handleBrainstorm = async (prompt: string) => {
    setAiToolLoading(true);
    setAiToolResult('');
    try {
      const result = await brainstormContent(prompt);
      setAiToolResult(result);
    } catch (error: any) {
      setAiToolResult(`Error: ${error.message}`);
    } finally {
      setAiToolLoading(false);
    }
  };

  const handleSummarize = async (data: any) => {
    setAiToolLoading(true);
    setAiToolResult('');
    try {
      const result = await summarizeData(data);
      setAiToolResult(result);
    } catch (error: any) {
      setAiToolResult(`Error: ${error.message}`);
    } finally {
      setAiToolLoading(false);
    }
  };


  const loadFromHistory = useCallback((item: HistoryItem) => {
    setRequest(item);
    setResponse(null);
    setAiAnalysis('');
    if (window.innerWidth < 768) { // md breakpoint
        setIsSidebarOpen(false);
    }
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const sidebarProps = {
    history,
    onSelectHistory: loadFromHistory,
    onClearHistory: handleClearHistory,
    response,
    onBrainstorm: handleBrainstorm,
    onSummarize: handleSummarize,
    aiToolResult: aiToolResult,
    aiToolLoading: aiToolLoading,
  };

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-gray-200 overflow-hidden">
      {/* Sidebar for medium and up */}
      <div className="hidden md:flex md:w-1/3 lg:w-1/4 md:min-w-[300px] md:max-w-[400px]">
        <Sidebar {...sidebarProps} />
      </div>

      {/* Mobile Sidebar (off-canvas) */}
      <div className={`fixed inset-y-0 left-0 z-30 w-4/5 max-w-sm transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <Sidebar {...sidebarProps} />
      </div>
      {isSidebarOpen && <div className="fixed inset-0 z-20 bg-black opacity-50 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center p-2 border-b border-gray-700 md:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-700" aria-label="Open sidebar">
                <MenuIcon className="w-6 h-6"/>
            </button>
            <h1 className="text-lg font-bold ml-2">API Tester</h1>
        </header>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-2 md:p-4 overflow-y-auto">
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

          <div className="flex-1 p-2 md:p-4 border-t border-gray-700 overflow-y-auto">
            <ResponsePanel
              response={response}
              loading={loading}
              aiAnalysis={aiAnalysis}
              onAnalyze={handleAnalyze}
              aiLoading={aiLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
