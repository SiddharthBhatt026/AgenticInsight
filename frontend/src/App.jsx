import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { BotMessageSquare, User, BrainCircuit, Play, BarChart3, PieChart, Sparkles, AlertTriangle, Layers, Server } from 'lucide-react';

const suggestions = [
  "Analyze regional sales distribution",
  "Summarize key customer segment metrics",
  "Analyze high-value region trends",
  "Summarize top products by growth",
  "Synthesize cross-table product sales"
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState([
    { role: 'agent', text: 'Systems operational. Select an analysis target or input a custom prompt below.' }
  ]);
  const [chartData, setChartData] = useState([]);
  const [thoughtProcess, setThoughtProcess] = useState([]);
  const [error, setError] = useState('');

  const executePipeline = async (queryText) => {
    if (loading) return;
    const finalQuery = queryText || prompt;
    if (!finalQuery.trim()) return;

    setPrompt(''); 
    setError(''); 
    setChatLog(prev => [...prev, { role: 'user', text: finalQuery }]);
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8001/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_prompt: finalQuery }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setChatLog(prev => [...prev, { role: 'agent', text: data.text_summary }]);
        setChartData(data.chart_data);
        setThoughtProcess(data.thought_process);
      } else {
        setError(data.message || 'The agent could not complete the optimization request.');
      }
    } catch (err) {
      setError('Connection refused (8001). Verify that your backend server terminal is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    executePipeline();
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      
      {/* 🧭 LEFT SIDEBAR: AGENT CONTROL INTERFACE */}
      <div className="w-[30%] border-r border-slate-800 flex flex-col justify-between bg-slate-900/50 backdrop-blur-md">
        
        {/* App Title Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <BrainCircuit className="text-purple-400 w-6 h-6 animate-pulse" />
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">AgenticInsight</h1>
          </div>
          <span className="text-[10px] font-mono bg-purple-950/60 text-purple-300 px-2 py-0.5 border border-purple-800 rounded">v1.0.0</span>
        </div>

        {/* Chat Stream Viewport */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-950/20">
          {chatLog.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role !== 'user' && (
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-900/30 text-purple-400 border border-purple-800/50 shadow-sm">
                  <BotMessageSquare className="w-4 h-4"/>
                </div>
              )}
              <div className={`p-3.5 rounded-xl text-xs leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none max-w-[80%]' : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none max-w-[80%]'}`}>
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  <User className="w-4 h-4"/>
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex items-center gap-2.5 text-slate-400 text-xs animate-pulse pl-1">
              <Sparkles className="animate-spin w-3.5 h-3.5 text-purple-400" /> 
              <span>Agent compiling query optimization graph...</span>
            </div>
          )}
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-300 text-xs flex gap-2.5 items-center">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Action Controls Panel */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/90 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block">Analysis Shortcuts</label>
            <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
              {suggestions.map((text, i) => (
                <button 
                  key={i} 
                  type="button"
                  onClick={() => executePipeline(text)} 
                  className="w-full text-left bg-slate-800/40 hover:bg-slate-800 hover:border-purple-500/50 text-slate-300 px-3 py-2 rounded-lg text-xs font-medium border border-slate-700/50 transition duration-150 truncate"
                >
                  🚀 {text}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleInputSubmit} className="flex gap-2 pt-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask for data insights..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500 text-slate-100 transition duration-150"
            />
            <button 
              type="submit" 
              disabled={loading} 
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition duration-200 ${loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-900/20'}`}
            >
              <Play className="w-3 h-3 fill-current" /> Run
            </button>
          </form>
        </div>
      </div>

      {/* 📊 RIGHT MAIN CANVAS: REASONING LOGS & CHARTS */}
      <div className="w-[70%] flex flex-col p-6 space-y-6 overflow-y-auto bg-slate-950">
        
        {/* Dynamic Visualization Block */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex-1 flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="text-purple-400 w-5 h-5" />
              <h2 className="text-sm font-bold tracking-tight text-slate-200">Dynamic Analytics Workspace</h2>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] font-mono py-1 px-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center gap-1">
                <Server className="w-3 h-3" /> Database: enterprise.db
              </span>
              <span className="text-[10px] font-mono py-1 px-2.5 rounded-lg bg-purple-950/40 border border-purple-800/60 text-purple-300 flex items-center gap-1">
                <Layers className="w-3 h-3" /> Execution: Relational JOIN
              </span>
            </div>
          </div>
          
          <div className="flex-1 w-full flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tick={{fill: '#94a3b8'}} axisLine={{stroke: '#334155'}} />
                  <YAxis stroke="#64748b" fontSize={10} tick={{fill: '#94a3b8'}} axisLine={{stroke: '#334155'}} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} cursor={{fill: 'rgba(139, 92, 246, 0.05)'}} />
                  <Bar dataKey="value" name="Aggregate Revenue" fill="url(#purpleGradient)" radius={[4, 4, 0, 0]} barSize={45} />
                  <Legend wrapperStyle={{fontSize: '11px', paddingTop: '15px'}} />
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-500 space-y-2">
                <PieChart className="w-12 h-12 mx-auto stroke-slate-700" strokeWidth={1.5} />
                <p className="text-xs font-medium">Visualization canvas idle.</p>
                <p className="text-[11px] text-slate-600">Select an execution matrix tool or prompt from the command layout.</p>
              </div>
            )}
          </div>
        </div>

        {/* Agentic Reasoner Multi-Step Chain Output */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="text-slate-400 w-4 h-4" />
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400">Agent Multi-Step Execution Logs</h3>
          </div>
          <div className="space-y-1.5 font-mono text-[10px] leading-relaxed text-purple-400/90 bg-slate-950/40 p-4 border border-slate-800/60 rounded-xl">
            {thoughtProcess.length > 0 ? (
              thoughtProcess.map((step, i) => <p key={i} className="flex gap-2"><span>[Step&nbsp;{i+1}]:</span><span className="text-slate-300">{step}</span></p>)
            ) : (
              <p className="text-slate-600 italic">No execution trace data currently tracked inside environment.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;