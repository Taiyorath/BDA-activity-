from pydantic import BaseModel
from typing import Literal


class Hotspot(BaseModel):
    lat: float
    lng: float
    city: str
    state: str
    total_accidents: int
    severe_accidents: int
    moderate_accidents: int
    minor_accidents: int
    risk_score: int
    risk_level: Literal["Low Risk", "Moderate Risk", "High Risk", "Critical Risk"]
