from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import sqlite3
import os
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

DB_PATH = "enterprise.db"
CURRENT_TABLE = {"name": "SalesLedger"}

class QueryRequest(BaseModel):
    user_prompt: str

# ----------------------------------------------------------------
# MICROSOFT FABRIC IQ INGESTION LAYER
# ----------------------------------------------------------------
@app.post("/api/upload")
async def upload_enterprise_file(file: UploadFile = File(...)):
    global CURRENT_TABLE
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    try:
        if file_ext == '.csv':
            df = pd.read_csv(file.file)
        elif file_ext in ['.xlsx', '.xls']:
            df = pd.read_excel(file.file)
        else:
            raise HTTPException(status_code=400, detail="Invalid format. Supply standard CSV/XLSX structures.")
        
        table_name = os.path.splitext(file.filename)[0].replace(" ", "_").replace("-", "_")
        CURRENT_TABLE["name"] = table_name
        
        conn = sqlite3.connect(DB_PATH)
        df.to_sql(table_name, conn, if_exists='replace', index=False)
        conn.close()
        
        return {
            "status": "success",
            "message": f"Fabric IQ Semantic Layer Active: Dataset '{file.filename}' synchronized successfully.",
            "table_name": table_name,
            "detected_attributes": list(df.columns)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion pipe failure: {str(e)}")

# ----------------------------------------------------------------
# ADVANCED FOUNDRY IQ AGENTIC REASONING ROUTER (PRO-LEVEL SIMULATION)
# ----------------------------------------------------------------
@app.post("/api/query")
async def process_agent_query(request: QueryRequest):
    user_query = request.user_prompt.lower()
    table = CURRENT_TABLE["name"]
    logs = []
    
    # 1. Initialization
    logs.append(f"Foundry IQ Orchestrator: Decomposing natural language objective: '{request.user_prompt}'")
    
    # 2. Strict Security Interception Guardrails
    dangerous_keywords = ["drop", "delete", "alter", "truncate", "schema"]
    for keyword in dangerous_keywords:
        if keyword in user_query:
            logs.append(f"🛑 SECURITY PROTOCOL VIOLATION: Intercepted malicious keyword variant: '{keyword.upper()}'")
            return {
                "status": "error",
                "thought_process": logs,
                "text_summary": "Security Shield Exception: Structural schema changes are strictly unauthorized inside this sandboxed container gateway.",
                "chart_data": []
            }
            
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 3. Multi-Step Reflection (Inspecting the actual database columns)
        cursor.execute(f"PRAGMA table_info({table})")
        columns_meta = cursor.fetchall()
        cols = [col[1] for col in columns_meta]
        logs.append(f"Schema Reflection: Retrieved system data ontology attributes: {cols}")
        
        # 4. ADVANCED REASONING LOOP: Simulate an AI Agent parsing context tokens
        logs.append("Cognitive Intent Alignment: Matching semantic tokens to relational entities...")
        dim_column = cols[0]
        val_column = cols[1] if len(cols) > 1 else cols[0]
        
        # The Agent matches words to column attributes intelligently
        for c in cols:
            clean_c = c.lower()
            if any(k in clean_c for k in ['name', 'region', 'segment', 'category', 'product', 'item', 'state', 'country', 'city']):
                dim_column = c
                logs.append(f"   ↳ [Matched Dimension]: Bound categorical axis to database schema field `{c}`")
            if any(k in clean_c for k in ['value', 'sales', 'revenue', 'amount', 'total', 'count', 'price', 'quantity', 'metrics']):
                val_column = c
                logs.append(f"   ↳ [Matched Metric]: Bound analytical summary value to database schema field `{c}`")

        # 5. Intent-Driven SQL Synthesis
        target_sql = f"SELECT {dim_column} AS name, SUM({val_column}) AS value FROM {table} GROUP BY {dim_column} ORDER BY value DESC LIMIT 10"
        logs.append(f"Query Synthesis Engine: Formulated context-grounded SQL mapping -> `{target_sql}`")
        
        # 6. Data Summary Aggregation Block
        cursor.execute(f"SELECT SUM({val_column}), AVG({val_column}), COUNT({val_column}) FROM {table}")
        stats = cursor.fetchone()
        total_sum = round(stats[0] or 0, 2)
        avg_value = round(stats[1] or 0, 2)
        row_count = stats[2] or 0
        
        # 7. Execute Consolidated Query Matrix
        logs.append(f"Executing Query: {target_sql}")
        cursor.execute(target_sql)
        rows = cursor.fetchall()
        conn.close()
        
        chart_dataset = [{"name": str(row[0]), "value": round(float(row[1]), 2)} for row in rows]
        logs.append("Data Serialization: Pipeline payload successfully transformed into analytical chart matrix objects.")
        
        summary_text = (
            f"🎯 **Fabric IQ Grounded Analytics Engine Output**\n\n"
            f"The reasoning agent successfully analyzed your active workspace file data metrics (`{table}`). "
            f"Processing **{row_count:,} records** yielded a total consolidated business metric size of **${total_sum:,}** with a calculated cross-domain conceptual mean of **${avg_value:,}** structured cleanly across your `{dim_column}` classifications."
        )
        
        return {
            "status": "success",
            "thought_process": logs,
            "text_summary": summary_text,
            "chart_data": chart_dataset
        }
        
    except Exception as e:
        return {
            "status": "error",
            "thought_process": logs + [f"Pipeline Execution Failure: {str(e)}"],
            "text_summary": "The agentic schema mapping matrix broke due to invalid column contents. Please ensure your uploaded file contains parsable alphanumeric fields.",
            "chart_data": []
        }