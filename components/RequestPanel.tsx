
import React, { useState } from 'react';
import type { ApiRequest, AuthConfig, KeyValuePair } from '../types';
import { HttpMethod, AuthType, HTTP_METHOD_COLORS } from '../constants';
import { KeyValueEditor } from './KeyValueEditor';
import { SendIcon } from './icons';

interface RequestPanelProps {
  request: ApiRequest;
  onMethodChange: (method: HttpMethod) => void;
  onUrlChange: (url: string) => void;
  onParamsChange: (params: KeyValuePair[]) => void;
  onAuthChange: (auth: AuthConfig) => void;
  onHeadersChange: (headers: KeyValuePair[]) => void;
  onBodyChange: (body: string) => void;
  onSend: () => void;
  loading: boolean;
}

type Tab = 'params' | 'auth' | 'headers' | 'body';

const AuthEditor: React.FC<{ auth: AuthConfig, onChange: (auth: AuthConfig) => void }> = ({ auth, onChange }) => {
    return (
        <div className="p-4 space-y-4">
            <select
                value={auth.type}
                onChange={(e) => onChange({ type: e.target.value as AuthType } as AuthConfig)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
                <option value={AuthType.NONE}>No Auth</option>
                <option value={AuthType.BEARER}>Bearer Token</option>
                <option value={AuthType.API_KEY}>API Key</option>
                <option value={AuthType.BASIC}>Basic Auth</option>
            </select>

            {auth.type === AuthType.BEARER && (
                <input
                    type="text"
                    placeholder="Token"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={auth.token || ''}
                    onChange={(e) => onChange({ ...auth, token: e.target.value })}
                />
            )}
            {auth.type === AuthType.API_KEY && (
                 <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="Key"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={auth.key || ''}
                        onChange={(e) => onChange({ ...auth, key: e.target.value })}
                    />
                     <input
                        type="text"
                        placeholder="Value"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={auth.value || ''}
                        onChange={(e) => onChange({ ...auth, value: e.target.value })}
                    />
                    <select
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={auth.addTo || 'header'}
                        onChange={(e) => onChange({ ...auth, addTo: e.target.value as 'header' | 'query' })}
                    >
                        <option value="header">Add to Header</option>
                        <option value="query">Add to Query Params</option>
                    </select>
                </div>
            )}
            {auth.type === AuthType.BASIC && (
                <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={auth.username || ''}
                        onChange={(e) => onChange({ ...auth, username: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={auth.password || ''}
                        onChange={(e) => onChange({ ...auth, password: e.target.value })}
                    />
                </div>
            )}
        </div>
    );
};


export const RequestPanel: React.FC<RequestPanelProps> = ({
  request,
  onMethodChange,
  onUrlChange,
  onParamsChange,
  onAuthChange,
  onHeadersChange,
  onBodyChange,
  onSend,
  loading
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('params');

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-4">
        <select
          value={request.method}
          onChange={(e) => onMethodChange(e.target.value as HttpMethod)}
          className={`font-mono font-bold bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${HTTP_METHOD_COLORS[request.method]}`}
        >
          {Object.values(HttpMethod).map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
        <input
          type="text"
          value={request.url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://api.example.com/resource"
          className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
        />
        <button
          onClick={onSend}
          disabled={loading}
          className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          <SendIcon className="w-5 h-5" />
          <span>{loading ? 'Sending...' : 'Send'}</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
          <div className="flex border-b border-gray-700">
              {['params', 'auth', 'headers', 'body'].map((tab) => (
                  <button
                      key={tab}
                      onClick={() => setActiveTab(tab as Tab)}
                      className={`px-4 py-2 text-sm font-medium focus:outline-none ${activeTab === tab ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:bg-gray-800'}`}
                  >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
              ))}
          </div>

          <div className="flex-1 bg-gray-800 rounded-b-md overflow-y-auto">
              {activeTab === 'params' && <KeyValueEditor items={request.params} onChange={onParamsChange} />}
              {activeTab === 'auth' && <AuthEditor auth={request.auth} onChange={onAuthChange} />}
              {activeTab === 'headers' && <KeyValueEditor items={request.headers} onChange={onHeadersChange} />}
              {activeTab === 'body' && (
                  <textarea
                      value={request.body}
                      onChange={(e) => onBodyChange(e.target.value)}
                      placeholder='{ "key": "value" }'
                      className="w-full h-full p-4 bg-transparent resize-none focus:outline-none font-mono text-sm"
                  />
              )}
          </div>
      </div>
    </div>
  );
};
