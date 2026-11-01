from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import pandas as pd
import numpy as np
import os
from app.config import settings

# Global dataframe
df: pd.DataFrame = None


def load_data():
    global df
    path = settings.DATA_PATH
    if os.path.exists(path):
        df = pd.read_csv(path, low_memory=False)
        # Ensure numeric types
        for col in ["Start_Lat", "Start_Lng", "Severity", "Hour", "Month", "Year"]:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce")
        df.dropna(subset=["Start_Lat", "Start_Lng"], inplace=True)
        print(f"[DATA] Loaded {len(df):,} records from {path}")
    else:
        print(f"[DATA] WARNING: {path} not found. Using empty dataframe.")
        df = pd.DataFrame()


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_data()
    yield


app = FastAPI(title="Road Accident Analytics API", version="1.0.0", lifespan=lifespan, redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include all routers
from routes import dashboard, accidents, hotspots, hadoop_ops

app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(accidents.router, prefix="/api/accidents", tags=["Accidents"])
app.include_router(hotspots.router, prefix="/api/hotspots", tags=["Hotspots"])
app.include_router(hadoop_ops.router, prefix="/api/hadoop", tags=["Hadoop"])


@app.get("/api/health")
def health():
    return {"status": "ok", "records": len(df) if df is not None else 0}
