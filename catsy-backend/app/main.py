from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import supabase

app = FastAPI(title="Catsy Coffee API Bridge")

# IMPORTANT: This allows your Web and Mobile apps to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your specific domains
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "✅ Catsy API is online"}

# Example route for your classmates to fill in
@app.get("/api/coffee")
def get_coffee():
    # TODO: Classmate needs to implement the logic here
    # Example: response = supabase.table('coffee_items').select("*").execute()
    return {"message": "Coffee list skeleton ready"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


#This is the url
@app.get("/api/db-check")
def check_db():
    try:
        response = supabase.table('products').select("*", count='exact').limit(1).execute()
        
        return {
            "status": "📡 Supabase Connected!",
            "data_preview": response.data,
            "count": response.count
        }
    except Exception as e:
        return {
            "status": "❌ Supabase Connection Failed",
            "error": str(e)
        }