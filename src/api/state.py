"""In-memory global state for the application."""
from datetime import datetime

# Structure:
# PATIENT_DB = {
#     patient_id: {
#         "info": {"name": str, "age": int, "id": str},
#         "history": [analysis_objects]
#     }
# }
PATIENT_DB = {
    "patient-john-doe": {
        "info": {"name": "John Doe", "age": 45, "id": "patient-john-doe"},
        "history": []
    },
    "patient-aisha-khan": {
        "info": {"name": "Aisha Khan", "age": 52, "id": "patient-aisha-khan"},
        "history": []
    }
}
