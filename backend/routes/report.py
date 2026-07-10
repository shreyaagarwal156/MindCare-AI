"""
Report Routes
"""

from fastapi import APIRouter, HTTPException
from models.schemas import ReportRequest, ReportResponse
from services.report_service import report_service

router = APIRouter()


@router.post("/report", response_model=ReportResponse)
async def generate_session_report(request: ReportRequest):
    """
    Assembles a clinical session report using LLM analysis on
    the session conversation log history.
    """
    try:
        report_text = report_service.generate_report(request.session_id)
        return {"report": report_text}
    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Report generation failed: {str(e)}"
        )
