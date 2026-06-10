import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MessageSquare, Database, Play, RefreshCw, BarChart2 } from 'lucide-react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState([
    { role: 'agent', text: 'Welcome to AgenticInsight. Ask me anything about your enterprise performance data.' }
  ]);
  const [chartData, setChartData] = useState([]);
  const [thoughtProcess, setThoughtProcess] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setChatLog(prev => [...prev, { role: 'user', text: userMessage }]);
    setPrompt('');
    setLoading(true);

    try {
      // Connects directly to your running Python API slot
      const response = await fetch('http://127.0.0.1:8001/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_prompt: userMessage }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setChatLog(prev => [...prev, { role: 'agent', text: data.text_summary }]);
        setChartData(data.chart_data);
        setThoughtProcess(data.thought_process);
      }
    } catch (error) {
      setChatLog(prev => [...prev, { role: 'agent', text: 'Connection error. Check if your backend server is running on port 8001.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      
      {/* LEFT COLUMN: CHAT-FIRST BI USER INTERFACE */}
      <div className="w-1/3 border-r border-slate-800 flex flex-col justify-between bg-slate-950">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <Database className="text-purple-400" />
          <h1 className="font-bold text-lg tracking-wide">AgenticInsight</h1>
        </div>

        {/* Chat Stream Panel */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {chatLog.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs animate-pulse">
              <RefreshCw className="animate-spin w-3 h-3" /> Agent is reasoning over schema...
            </div>
          )}
        </div>

        {/* Input Text Box Bar */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Analyze revenue trends across regions..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-slate-100"
          />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-all">
            <Play className="w-3 h-3 fill-current" /> Run
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: ANALYTICS CANVAS & REASONING LOGS */}
      <div className="w-2/3 flex flex-col p-6 space-y-6 overflow-y-auto">
        
        {/* Dynamic Visualization Canvas */}
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl flex-1 flex flex-col justify-between min-h-[350px]">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="text-purple-400" />
            <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-400">Dynamic Visualization Canvas</h2>
          </div>
          
          <div className="flex-1 min-h-[250px] w-full mt-4 flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-sm italic">Run a query to generate data visualizations automatically</p>
            )}
          </div>
        </div>

        {/* Transparent Agent Thought Process Chain */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
          <h3 className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-2">Agent Multi-Step Reasoning Logs</h3>
          <div className="space-y-1 font-mono text-xs text-purple-400">
            {thoughtProcess.length > 0 ? (
              thoughtProcess.map((step, i) => <p key={i}>📌 [Step {i+1}]: {step}</p>)
            ) : (
              <p className="text-slate-600 italic">No execution steps logged yet</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;