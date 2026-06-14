import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BotMessageSquare, BrainCircuit, Play, BarChart3, PieChart, Sparkles, AlertTriangle, Download, Code, Terminal, UploadCloud, ShieldCheck, Database } from 'lucide-react';

const suggestions = [
  "Execute Fabric IQ multi-table sales audit",
  "Summarize enterprise customer metrics",
  "Run security sandboxed trend analysis"
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState([
    { role: 'agent', text: 'Agents League Core Sandbox active. Framework connected to Microsoft Fabric IQ intelligence layer. Please ingest an enterprise dataset to begin multivariable reasoning loops.' }
  ]);
  const [chartData, setChartData] = useState([]);
  const [thoughtProcess, setThoughtProcess] = useState([]);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [generatedSql, setGeneratedSql] = useState("SELECT * FROM SalesLedger;");
  const [activeTable, setActiveTable] = useState("SalesLedger");
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

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
        
        const sqlStep = data.thought_process.find(step => step.includes("Executing Query:"));
        if (sqlStep) {
          setGeneratedSql(sqlStep.replace("Executing Query: ", ""));
        }
      } else {
        setChatLog(prev => [...prev, { role: 'agent', text: data.text_summary }]);
        setError(data.text_summary || 'The agent reasoning framework encountered an aggregation loop boundary.');
        setThoughtProcess(data.thought_process || []);
      }
    } catch (err) {
      setError('Connection refused (8001). Ensure your FastAPI backend engine terminal is running.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (chartData.length === 0) return;
    
    const headers = ['Dimension_Target', 'Metric_Aggregation_Value'];
    const csvRows = [headers.join(',')];
    
    chartData.forEach(row => {
      csvRows.push(`"${row.name.replace(/"/g, '""')}",${row.value}`);
    });
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `FabricIQ_AgenticInsight_${activeTable}_Summary.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-container">
      
      {/* 🧭 LEFT CONTROL CABIN SIDEBAR */}
      <div className="sidebar">
        
        <div className="sidebar-header">
          <div className="brand">
            <BrainCircuit className="brand-icon" />
            <h1>AgenticInsight</h1>
          </div>
          <span className="version-tag">Fabric IQ Enabled</span>
        </div>

        {/* DATASET INGESTION ZONE */}
        <div style={{ padding: '14px', borderBottom: '1px solid #1e293b', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
          <label style={{ fontSize: '9px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>
            Microsoft Fabric IQ Gateway Ingestion
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px', background: '#020617', padding: '8px', borderRadius: '8px', border: '1px dashed #4338ca' }}>
            <UploadCloud style={{ width: '14px', height: '14px', color: '#c084fc', flexShrink: 0 }} />
            <input 
              type="file" 
              accept=".csv, .xlsx, .xls"
              onChange={async (e) => {
                const uploadedFile = e.target.files[0];
                if (!uploadedFile) return;
                
                const formData = new FormData();
                formData.append("file", uploadedFile);
                setLoading(true);
                
                try {
                  const res = await fetch("http://127.0.0.1:8001/api/upload", {
                    method: "POST",
                    body: formData
                  });
                  const uploadResult = await res.json();
                  if (uploadResult.status === "success") {
                    setActiveTable(uploadResult.table_name);
                    setChatLog(prev => [...prev, { 
                      role: 'agent', 
                      text: `✨ Fabric IQ Semantic Layer Active! Target linked into localized datastore slice: \`${uploadResult.table_name}\`. Extracted attributes: ${uploadResult.detected_attributes.join(", ")}` 
                    }]);
                  }
                } catch (err) {
                  setError("Data streaming connection to IQ routing infrastructure lost.");
                } finally {
                  setLoading(false);
                }
              }}
              style={{ fontSize: '11px', color: '#94a3b8', width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Scrollable Conversation Feed */}
        <div className="chat-viewport">
          {chatLog.map((msg, index) => (
            <div key={index} className={`chat-row ${msg.role === 'user' ? 'user-align' : 'agent-align'}`}>
              <div className={`chat-bubble ${msg.role === 'user' ? 'user-bubble' : 'agent-bubble'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
          
          {loading && (
            <div className="loading-status">
              <Sparkles className="spin-icon" /> 
              <span>Fabric IQ tracking variable relations...</span>
            </div>
          )}
          
          {error && (
            <div className="error-status" style={{ display: 'flex', gap: '8px', color: '#f43f5e', fontSize: '11px', padding: '10px', background: 'rgba(159, 18, 57, 0.1)', border: '1px solid rgba(225, 29, 72, 0.2)', borderRadius: '8px' }}>
              <AlertTriangle style={{ width: '14px', height: '14px', flexShrink: 0 }} />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Action Controls Panel */}
        <div className="controls-panel">
          <label className="panel-label">Agent Execution Targets</label>
          <div className="suggestions-list">
            {suggestions.map((text, i) => (
              <button key={i} type="button" onClick={() => executePipeline(text)} className="suggestion-btn">
                ⚡ {text}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); executePipeline(); }} className="input-form">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask the reasoning agent..."
              className="chat-input"
            />
            <button type="submit" disabled={loading} className="run-btn">
              <Play className="play-icon" /> Run
            </button>
          </form>
        </div>
      </div>

      {/* 📊 RIGHT CANVAS WORKSPACE AREA */}
      <div className="main-content">
        
        <div className="visualization-card">
          <div className="card-header">
            <div className="card-title">
              <BarChart3 className="chart-icon" />
              <h2>Fabric IQ Analytical Pipeline Workspace</h2>
            </div>
            
            <div className="action-hub">
              <div className="toggle-group">
                <button onClick={() => setChartType('bar')} className={`toggle-btn ${chartType === 'bar' ? 'active' : ''}`}>Bar</button>
                <button onClick={() => setChartType('line')} className={`toggle-btn ${chartType === 'line' ? 'active' : ''}`}>Line</button>
              </div>

              <button onClick={downloadCSV} disabled={chartData.length === 0} className="export-btn">
                <Download className="btn-icon" /> Export CSV
              </button>
            </div>
          </div>
          
          <div className="chart-container">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tick={{fill: '#94a3b8'}} />
                    <YAxis stroke="#64748b" fontSize={10} tick={{fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }} />
                    <Bar dataKey="value" fill="url(#purpleGrad)" radius={[4, 4, 0, 0]} barSize={40} />
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c084fc" stopOpacity={0.8}/><stop offset="95%" stopColor="#7c3aed" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                ) : (
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tick={{fill: '#94a3b8'}} />
                    <YAxis stroke="#64748b" fontSize={10} tick={{fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }} />
                    <Line type="monotone" dataKey="value" stroke="#c084fc" strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 4 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="chart-placeholder">
                <PieChart className="placeholder-icon" />
                <p>Fabric IQ multi-step visualization space awaiting incoming matrix stream parameters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Logging System Layout Panel */}
        <div className="bottom-logs-grid">
          
          <div className="log-card">
            <div className="log-header" style={{ justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal className="log-icon-label" />
                <h3>Fabric IQ Multi-Step Reasoning Graph</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                <ShieldCheck style={{ width: '12px', height: '12px' }} /> Guardrails: Enforced
              </div>
            </div>
            
            {chartData.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px', padding: '2px 0' }}>
                {chartData.map((row, idx) => (
                  <span key={idx} style={{ fontSize: '9px', fontFamily: 'monospace', color: '#c084fc', background: '#111026', border: '1px solid #4338ca', padding: '1px 5px', borderRadius: '4px' }}>
                    📦 {row.name}
                  </span>
                ))}
              </div>
            )}

            <div className="log-content-area">
              {thoughtProcess.length > 0 ? (
                thoughtProcess.map((step, i) => <p key={i}>⚙️ {step}</p>)
              ) : (
                <p className="fallback-text">No active agentic reasoning traces compiled inside this environment segment.</p>
              )}
            </div>
          </div>

          <div className="log-card">
            <div className="log-header" style={{ justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code className="log-icon-label" />
                <h3>Target Semantic SQL Generator</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: '#94a3b8' }}>
                <Database style={{ width: '11px', height: '11px' }} /> Engine: SQLite Sandbox
              </div>
            </div>
            <div className="sql-editor-container">
              <textarea 
                value={generatedSql}
                onChange={(e) => setGeneratedSql(e.target.value)}
                className="sql-textarea"
              />
              <div className="editor-footer">
                Interactive Human-in-the-Loop Gateway
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;