from pydantic import BaseModel
from typing import Optional


class AccidentRecord(BaseModel):
    id: Optional[int] = None
    severity: Optional[int] = None
    start_lat: Optional[float] = None
    start_lng: Optional[float] = None
    city: Optional[str] = None
    state: Optional[str] = None
    weather_condition: Optional[str] = None
    hour: Optional[int] = None
    month: Optional[int] = None
    year: Optional[int] = None
    day_of_week: Optional[str] = None
    road_condition: Optional[str] = None
    temperature: Optional[float] = None
    visibility: Optional[float] = None
    wind_speed: Optional[float] = None
    description: Optional[str] = None
