from fastapi import APIRouter, Query
from typing import Optional
import pandas as pd
import numpy as np
import app.main as main_module

router = APIRouter()


def _get_df() -> pd.DataFrame:
    return main_module.df


def _safe_records(df_grouped) -> list:
    """Convert a grouped dataframe to a list of JSON-safe dicts."""
    result = []
    for rec in df_grouped.to_dict(orient="records"):
        safe = {}
        for k, v in rec.items():
            if isinstance(v, (np.integer,)):
                safe[k] = int(v)
            elif isinstance(v, (np.floating,)):
                safe[k] = float(v) if not np.isnan(v) else 0.0
            elif pd.isna(v) if not isinstance(v, (list, dict)) else False:
                safe[k] = None
            else:
                safe[k] = v
        result.append(safe)
    return result


@router.get("/by-location")
def by_location(
    group: str = Query("state", regex="^(state|city)$"),
    limit: int = Query(20, ge=1, le=100),
):
    df = _get_df()
    if df is None or len(df) == 0:
        return []

    col_map = {
        "state": ["State", "state"],
        "city": ["City", "city"],
    }
    col = None
    for candidate in col_map[group]:
        if candidate in df.columns:
            col = candidate
            break

    if col is None:
        return []

    counts = (
        df[col]
        .dropna()
        .value_counts()
        .head(limit)
        .reset_index()
    )
    counts.columns = [group, "count"]
    counts[group] = counts[group].astype(str)
    counts["count"] = counts["count"].astype(int)
    return _safe_records(counts)


@router.get("/by-severity")
def by_severity(group: str = Query("overall", regex="^(overall|state|weather)$")):
    df = _get_df()
    if df is None or len(df) == 0:
        return []

    if "Severity" not in df.columns:
        return []

    if group == "overall":
        counts = (
            df["Severity"]
            .dropna()
            .astype(int)
            .value_counts()
            .sort_index()
            .reset_index()
        )
        counts.columns = ["severity", "count"]
        return _safe_records(counts)

    elif group == "state":
        state_col = next((c for c in ["State", "state"] if c in df.columns), None)
        if state_col is None:
            return []
        grp = (
            df.groupby([state_col, "Severity"])
            .size()
            .reset_index(name="count")
        )
        grp.columns = ["state", "severity", "count"]
        return _safe_records(grp)

    elif group == "weather":
        weather_col = next(
            (c for c in ["Weather_Condition", "Weather", "weather_condition"] if c in df.columns),
            None,
        )
        if weather_col is None:
            return []
        grp = (
            df.groupby([weather_col, "Severity"])
            .size()
            .reset_index(name="count")
        )
        grp.columns = ["weather", "severity", "count"]
        return _safe_records(grp)

    return []


@router.get("/by-weather")
def by_weather(
    group: str = Query("weather_condition", regex="^(weather_condition|road_condition)$")
):
    df = _get_df()
    if df is None or len(df) == 0:
        return []

    col_candidates = {
        "weather_condition": ["Weather_Condition", "Weather", "weather_condition"],
        "road_condition": ["Road_Condition", "road_condition", "Road_Surface_Conditions"],
    }

    col = None
    for candidate in col_candidates[group]:
        if candidate in df.columns:
            col = candidate
            break

    if col is None:
        return []

    counts = (
        df[col]
        .dropna()
        .value_counts()
        .head(30)
        .reset_index()
    )
    counts.columns = [group, "count"]
    counts[group] = counts[group].astype(str)
    counts["count"] = counts["count"].astype(int)
    return _safe_records(counts)


@router.get("/by-time")
def by_time(group: str = Query("hour", regex="^(hour|day|month)$")):
    df = _get_df()
    if df is None or len(df) == 0:
        return []

    col_map = {
        "hour": ["Hour", "hour"],
        "day": ["Day_of_Week", "Weekday", "day_of_week", "Day"],
        "month": ["Month", "month"],
    }

    col = None
    for candidate in col_map[group]:
        if candidate in df.columns:
            col = candidate
            break

    # Try to parse from datetime column if direct column missing
    if col is None:
        date_col = next(
            (c for c in ["Start_Time", "Date", "date"] if c in df.columns), None
        )
        if date_col is None:
            return []
        dates = pd.to_datetime(df[date_col], errors="coerce")
        if group == "hour":
            series = dates.dt.hour
        elif group == "day":
            series = dates.dt.day_name()
        elif group == "month":
            series = dates.dt.month
        else:
            return []
        counts = series.dropna().value_counts().sort_index().reset_index()
        counts.columns = [group, "count"]
    else:
        counts = (
            df[col]
            .dropna()
            .value_counts()
            .sort_index()
            .reset_index()
        )
        counts.columns = [group, "count"]

    counts["count"] = counts["count"].astype(int)
    return _safe_records(counts)


@router.get("/trends")
def trends(interval: str = Query("month", regex="^(month|year)$")):
    df = _get_df()
    if df is None or len(df) == 0:
        return []

    date_col = next(
        (c for c in ["Start_Time", "Date", "date"] if c in df.columns), None
    )
    if date_col is None:
        # Fallback: use Month/Year columns
        if interval == "year" and "Year" in df.columns:
            counts = (
                df["Year"]
                .dropna()
                .astype(int)
                .value_counts()
                .sort_index()
                .reset_index()
            )
            counts.columns = ["period", "count"]
            return _safe_records(counts)
        elif interval == "month" and "Month" in df.columns and "Year" in df.columns:
            tmp = df[["Year", "Month"]].dropna().astype(int)
            tmp["period"] = tmp["Year"].astype(str) + "-" + tmp["Month"].astype(str).str.zfill(2)
            counts = tmp.groupby("period").size().reset_index(name="count").sort_values("period")
            return _safe_records(counts)
        return []

    dates = pd.to_datetime(df[date_col], errors="coerce")
    if interval == "month":
        period = dates.dt.to_period("M").astype(str)
    else:
        period = dates.dt.to_period("Y").astype(str)

    counts = (
        period.dropna()
        .value_counts()
        .sort_index()
        .reset_index()
    )
    counts.columns = ["period", "count"]
    counts["count"] = counts["count"].astype(int)
    return _safe_records(counts)
