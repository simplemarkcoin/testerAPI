
import React from 'react';

interface CodeBlockProps {
  code: any;
}

const syntaxHighlight = (json: string): React.ReactNode => {
    if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const formatted = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'text-green-400'; // number
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'text-cyan-400'; // key
            } else {
                cls = 'text-amber-400'; // string
            }
        } else if (/true|false/.test(match)) {
            cls = 'text-purple-400'; // boolean
        } else if (/null/.test(match)) {
            cls = 'text-gray-500'; // null
        }
        return `<span class="${cls}">${match}</span>`;
    });

    return <pre dangerouslySetInnerHTML={{ __html: formatted }} />;
};


export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
    let content;
    try {
        const parsedCode = typeof code === 'string' ? JSON.parse(code) : code;
        content = syntaxHighlight(parsedCode);
    } catch (e) {
        content = <pre className="whitespace-pre-wrap">{typeof code === 'string' ? code : JSON.stringify(code, null, 2)}</pre>;
    }
    
  return (
    <div className="p-4 bg-gray-800 font-mono text-sm overflow-auto h-full">
      {content}
    </div>
  );
};
