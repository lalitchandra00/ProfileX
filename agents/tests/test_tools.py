from types import SimpleNamespace

from agents.tools import fill_form, navigate
from agents.tools._helpers import normalize_fields


def runtime():
    return SimpleNamespace(
        tool_call_id="test-call-1",
        context=SimpleNamespace(user_id="507f1f77bcf86cd799439011"),
    )


def test_normalize_fields_accepts_valid_values():
    cleaned, errors = normalize_fields(
        {"firstName": " Lalit ", "bloodGroup": "b+", "dob": "2004-05-21"}
    )
    assert errors == []
    assert cleaned == {"firstName": "Lalit", "bloodGroup": "B+", "dob": "2004-05-21"}


def test_normalize_fields_rejects_unknown_and_bad_enum():
    cleaned, errors = normalize_fields({"unknown": 1, "gender": "Alien"})
    assert cleaned == {}
    assert len(errors) == 2


def test_fill_form_emits_ui_action():
    result = fill_form.func({"firstName": "Lalit"}, runtime())
    assert result.update["ui_actions"] == [{"type": "fill_form", "fields": {"firstName": "Lalit"}}]
    assert result.update["messages"][0].tool_call_id == "test-call-1"


def test_navigate_rejects_unknown_page():
    result = navigate.func("/delete-everything", runtime())
    assert "ui_actions" not in result.update
