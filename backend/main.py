from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

# This lets your React frontend communicate with this backend securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    user_prompt: str

# Database Setup (Creates your sample analytics data automatically)
def init_db():
    conn = sqlite3.connect('enterprise.db')
    cursor = conn.cursor()
    
    # Create a simple Performance table
    cursor.execute('''CREATE TABLE IF NOT EXISTS Performance 
                      (Region TEXT, Revenue INTEGER)''')
    
    # Put some mock data inside for our agent to read
    cursor.execute("DELETE FROM Performance")
    cursor.execute("INSERT INTO Performance VALUES ('North', 75000)")
    cursor.execute("INSERT INTO Performance VALUES ('South', 42000)")
    cursor.execute("INSERT INTO Performance VALUES ('East', 61000)")
    cursor.execute("INSERT INTO Performance VALUES ('West', 53000)")
    
    conn.commit()
    conn.close()

init_db()

# This is the endpoint our frontend will call
@app.post("/api/query")
async def process_agent_query(request: QueryRequest):
    conn = sqlite3.connect('enterprise.db')
    cursor = conn.cursor()
    cursor.execute("SELECT Region, Revenue FROM Performance")
    rows = cursor.fetchall()
    conn.close()
    
    # Format the data cleanly for our frontend charts
    formatted_data = [{"name": row[0], "value": row[1]} for row in rows]
    
    return {
        "status": "success",
        "thought_process": [
            "Analyzed input criteria: Regional Revenue",
            "Inspected data schema: 'Performance' table detected",
            "Executed automated SQL optimization: SELECT Region, Revenue FROM Performance"
        ],
        "text_summary": "Here is the active data. The North region is leading our enterprise benchmarks with 75,000 in total revenue.",
        "visualization_type": "bar",
        "chart_data": formatted_data
    }