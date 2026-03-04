import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowDown, ArrowUp, Activity } from 'lucide-react';

export default function DebugConsole() {
    // Environment Check
    if (!import.meta.env.DEV) return null;

    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const logsEndRef = useRef(null);

    useEffect(() => {
        const handleDebugEvent = (event) => {
            setLogs(prev => [...prev, event.detail]);
        };

        window.addEventListener('api-debug', handleDebugEvent);
        return () => window.removeEventListener('api-debug', handleDebugEvent);
    }, []);

    useEffect(() => {
        if (isOpen && logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, isOpen]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-black/80 text-green-400 p-3 rounded-full shadow-lg hover:bg-black transition-all z-[100] border border-green-900"
            >
                <Activity size={20} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-[400px] h-[500px] bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl flex flex-col overflow-hidden z-[100] font-mono text-xs">
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-neutral-800 border-b border-neutral-700">
                <span className="text-green-400 font-bold flex items-center gap-2">
                    <Activity size={14} /> Network Debugger
                </span>
                <div className="flex gap-2">
                    <button onClick={() => setLogs([])} className="text-neutral-400 hover:text-white px-2">Clear</button>
                    <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white"><X size={16} /></button>
                </div>
            </div>

            {/* Logs Area */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-neutral-950/90">
                {logs.length === 0 && (
                    <div className="text-neutral-600 text-center mt-10 italic">No network activity...</div>
                )}
                {logs.map((log, index) => (
                    <div key={index} className={`p-2 rounded border ${log.type === 'error' ? 'bg-red-900/10 border-red-900/30' :
                            log.type === 'request' ? 'bg-blue-900/10 border-blue-900/30' : 'bg-green-900/10 border-green-900/30'
                        }`}>
                        <div className="flex justify-between items-start mb-1">
                            <span className={`uppercase font-bold ${log.type === 'error' ? 'text-red-400' :
                                    log.type === 'request' ? 'text-blue-400' : 'text-green-400'
                                }`}>
                                {log.type === 'request' ? <ArrowUp size={10} className="inline mr-1" /> : <ArrowDown size={10} className="inline mr-1" />}
                                {log.method || log.status || 'ERR'}
                            </span>
                            <span className="text-neutral-500">{log.timestamp.split('T')[1].split('.')[0]}</span>
                        </div>

                        <div className="text-neutral-300 break-all mb-1">{log.url}</div>

                        {log.duration && <div className="text-neutral-500 mb-1">{log.duration}</div>}

                        {log.body && (
                            <details className="mt-1">
                                <summary className="cursor-pointer text-neutral-500 hover:text-neutral-300 select-none">Body</summary>
                                <pre className="mt-1 p-1 bg-black/50 rounded overflow-x-auto text-[10px] text-neutral-400">
                                    {JSON.stringify(log.body, null, 2)}
                                </pre>
                            </details>
                        )}
                        {log.headers && (
                            <details className="mt-1">
                                <summary className="cursor-pointer text-neutral-500 hover:text-neutral-300 select-none">Headers</summary>
                                <pre className="mt-1 p-1 bg-black/50 rounded overflow-x-auto text-[10px] text-neutral-400">
                                    {JSON.stringify(log.headers, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                ))}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
}
