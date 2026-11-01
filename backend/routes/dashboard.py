from fastapi import APIRouter
import pandas as pd
import numpy as np
import app.main as main_module

router = APIRouter()


def _get_df() -> pd.DataFrame:
    return main_module.df


@router.get("/summary")
def get_summary():
    df = _get_df()
    if df is None or len(df) == 0:
        return {
            "total_accidents": 0,
            "severe_accidents": 0,
            "hotspots_count": 0,
            "avg_per_day": 0.0,
            "most_affected_location": "N/A",
            "data_source": "NONE",
            "date_range": "N/A",
        }

    total = int(len(df))

    # Severe accidents (Severity == 4)
    if "Severity" in df.columns:
        severe = int((df["Severity"] == 4).sum())
    else:
        severe = 0

    # Hotspots count: grid cells with high accident density
    if "Start_Lat" in df.columns and "Start_Lng" in df.columns:
        tmp = df.copy()
        tmp["grid_lat"] = tmp["Start_Lat"].round(2)
        tmp["grid_lng"] = tmp["Start_Lng"].round(2)
        cell_counts = tmp.groupby(["grid_lat", "grid_lng"]).size()
        threshold = float(np.percentile(cell_counts.values, 85))
        hotspots_count = int((cell_counts >= threshold).sum())
    else:
        hotspots_count = 0

    # Average accidents per day
    date_col = None
    for c in ["Start_Time", "Date", "date"]:
        if c in df.columns:
            date_col = c
            break

    date_range_str = "N/A"
    avg_per_day = 0.0
    if date_col:
        try:
            dates = pd.to_datetime(df[date_col], errors="coerce").dropna()
            if len(dates) > 0:
                min_date = dates.min()
                max_date = dates.max()
                delta_days = max((max_date - min_date).days, 1)
                avg_per_day = round(total / delta_days, 2)
                date_range_str = f"{min_date.strftime('%Y-%m-%d')} to {max_date.strftime('%Y-%m-%d')}"
        except Exception:
            pass
    else:
        avg_per_day = round(total / 365, 2)

    # Most affected location
    most_affected = "N/A"
    for loc_col in ["City", "city", "State", "state"]:
        if loc_col in df.columns:
            top = df[loc_col].dropna().value_counts()
            if len(top) > 0:
                most_affected = str(top.index[0])
            break

    # Data source detection
    data_source = "REAL"
    for col in df.columns:
        if "synthetic" in str(col).lower():
            data_source = "SYNTHETIC"
            break
    if total < 10000:
        data_source = "SYNTHETIC"

    return {
        "total_accidents": total,
        "severe_accidents": severe,
        "hotspots_count": hotspots_count,
        "avg_per_day": avg_per_day,
        "most_affected_location": most_affected,
        "data_source": data_source,
        "date_range": date_range_str,
    }
