# AgenticInsight 🧠💼

An advanced Semantic Data Reasoning Agent built for the **Microsoft Agents League Hackathon 2026** under the **Reasoning Agents** challenge track.

AgenticInsight democratizes corporate data analytics by allowing non-technical business managers to upload any enterprise spreadsheet (`.csv` / `.xlsx`) and immediately extract production-grade relational charts and verified SQL scripts using plain natural language—fully protected by localized compliance guardrails.

---

## 💡 Microsoft IQ Integration (Fabric IQ)

AgenticInsight fundamentally implements the core architecture principles of the **Microsoft Fabric IQ** intelligence layer:
* **Dynamic Semantic Abstraction:** Instead of hardcoding query endpoints to static data tables, the agent acts as an abstraction layer. It reflects column metadata attributes via live database pragmas at runtime.
* **Universal Multi-Table Ingestion:** Ingests unstructured or flat ledger files on-the-fly, instantly spinning up an isolated relational sandbox storage core mapping categorical dimensions to numeric metrics.

---

## 🛠️ Key Architectural Features

### 1. Multi-Step Reasoning Graph (`Accuracy & Reasoning: 40%`)
The frontend dashboard exposes the agent's absolute step-by-step cognitive footprint log. This reveals the logic chain (Initialization -> Ingestion -> Reflection -> Query Compilation -> Serialization) to users before any statement hits the database, ensuring enterprise-grade auditability.

### 2. Automated Analytical Summary Ingestion
Upon ingestion, the backend engine automatically computes overarching high-level data summaries (Total Sum density, categorical means, record distribution counts) and prints a natural language summary directly to the execution feed.

### 3. Absolute Security Guardrails Layer (`Reliability & Safety: 20%`)
Features an integrated token and keyword scanning firewall at the API gateway layer. Any unauthorized structural database manipulation phrases (`DROP`, `DELETE`, `ALTER`, `TRUNCATE`) are instantly intercepted, halting execution paths before they connect to the core server.

### 4. Human-in-the-Loop Gateway (`UX & Presentation: 15%`)
Includes a live, interactive **Active Target SQL Sandbox Editor**. If an analyst needs to manually override, optimize, or fine-tune the agent's generated SQL statement, they can edit and test code directly within the UI container workspace context.

---

## 🏗️ Technology & Component Stack

* **Frontend:** React.js, Recharts Engine (Dynamic Bar/Line Plotting Matrices), Lucide Architecture Vectors, Custom Non-Blocking Flexbox Grid CSS.
* **Backend:** FastAPI (Python Gateway Middleware), Pandas Data-Frame Structuring Ingestion Engine, Secure SQLite Relational Sandbox Database.

---

## 🚀 Local Deployment Setup

Follow these steps to activate the unified sandbox execution pipeline:

### 1. Initialize the Python Backend Engine
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt  # Installs FastAPI, Pandas, python-multipart, openpyxl
uvicorn main:app --reload --port 8001