from __future__ import annotations

from typing import Any, List
from datetime import datetime
from pydantic import BaseModel, AwareDatetime, NaiveDatetime, field_validator


class Body(BaseModel):
    contentType: str
    content: str


class Event(BaseModel):
    id: str
    createdDateTime: AwareDatetime
    lastModifiedDateTime: AwareDatetime
    originalStartTimeZone: str
    originalEndTimeZone: str
    subject: str
    bodyPreview: str
    isCancelled: bool
    showAs: str
    type: str
    occurrenceId: Any
    body: Body
    start: NaiveDatetime
    end: NaiveDatetime
    recurrence: Any
    attendees: List

    @field_validator('start', mode='before')
    @classmethod
    def fix_start(cls, raw: dict[str, str]) -> datetime:
        return datetime.fromisoformat(raw['dateTime'])

    @field_validator('end', mode='before')
    @classmethod
    def fix_end(cls, raw: dict[str, str]) -> datetime:
        return datetime.fromisoformat(raw['dateTime'])


class InputModel(BaseModel):
    value: List[Event]


class OutputModel(BaseModel):
    today: List[Event]
    later: List[Event]
