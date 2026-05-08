# Models module
from app.models.case import Case
from app.models.suspect import Suspect
from app.models.evidence import Evidence
from app.models.interrogation import Interrogation
from app.models.timeline import Timeline
from app.models.case_suspect import CaseSuspect

__all__ = ["Case", "Suspect", "Evidence", "Interrogation", "Timeline", "CaseSuspect"]
