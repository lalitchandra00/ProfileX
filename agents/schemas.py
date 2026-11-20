from dataclasses import dataclass
from operator import add
from typing import Annotated, Any, TypedDict

from langchain.agents import AgentState
from pydantic import BaseModel, Field


FIELD_SPECS: dict[str, dict[str, Any]] = {
    "firstName": {"label": "First Name", "type": "text", "example": "Lalit"},
    "lastName": {"label": "Last Name", "type": "text", "example": "Chandra"},
    "dob": {"label": "Date of Birth", "type": "date", "example": "2004-05-21"},
    "gender": {"label": "Gender", "type": "enum", "values": ["Male", "Female", "Other"]},
    "email": {"label": "Email", "type": "email", "example": "lalit@example.com"},
    "phone1": {"label": "Phone Number 1", "type": "text", "example": "+91 99999 99999"},
    "phone2": {"label": "Phone Number 2", "type": "text", "example": "+91 88888 88888"},
    "collegeName": {"label": "College Name", "type": "text", "example": "DTU"},
    "year": {
        "label": "Year",
        "type": "enum",
        "values": ["1st Year", "2nd Year", "3rd Year", "4th Year", "Passout"],
    },
    "branch": {"label": "Branch", "type": "text", "example": "Computer Science"},
    "bloodGroup": {
        "label": "Blood Group",
        "type": "enum",
        "values": ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    "maritalStatus": {
        "label": "Marital Status",
        "type": "enum",
        "values": ["Single", "Married", "Divorced", "Widowed"],
    },
    "work": {"label": "Work / Occupation", "type": "text", "example": "Software Engineer"},
    "correspondenceAddress": {
        "label": "Correspondence Address",
        "type": "long_text",
        "example": "Flat 12, Delhi",
    },
    "permanentAddress": {
        "label": "Permanent Address",
        "type": "long_text",
        "example": "Village, Uttar Pradesh",
    },
}

PAGES: dict[str, str] = {
    "home": "/home",
    "home page": "/home",
    "form": "/home",
    "fill": "/home",
    "profile": "/profile",
    "profile page": "/profile",
    "my profile": "/profile",
    "login": "/login",
    "signup": "/signup",
    "sign up": "/signup",
}
ALLOWED_PAGES = {"/home", "/profile", "/login", "/signup"}


class UIAction(TypedDict, total=False):
    type: str
    fields: dict[str, Any]
    to: str


class ProfileAgentState(AgentState):
    ui_actions: Annotated[list[UIAction], add]


@dataclass
class AgentContext:
    user_id: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    userId: str = Field(min_length=1, max_length=64)
    threadId: str | None = Field(default=None, max_length=120)
    actionCursor: int = Field(default=0, ge=0)
    resume: bool = False


class ChatResponse(BaseModel):
    reply: str
    actions: list[UIAction]
    actionCursor: int
    threadId: str
    needsInput: bool = False
    question: str | None = None
