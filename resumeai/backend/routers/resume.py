from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import io
import base64

from models.database import get_db
from models.models import User, Resume
from routers.auth import get_current_user
from services.pdf_service import generate_resume_pdf, generate_text_resume_pdf
from utils.resume_parser import parse_resume

router = APIRouter(prefix="/api/resume", tags=["resume"])


class ResumeData(BaseModel):
    personal: dict = {}
    experience: list = []
    education: list = []
    skills: dict = {}
    projects: list = []
    certifications: list = []


class BuildResumeRequest(BaseModel):
    title: str
    template: str = "modern-pro"
    resume_data: ResumeData


class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = None


def _run_analysis(resume_text: str, job_description: Optional[str]) -> dict:
    def attach_download_payload(payload: dict) -> dict:
        pdf_bytes = generate_text_resume_pdf(payload.get("optimized_text") or resume_text or "")
        payload["download_pdf"] = base64.b64encode(pdf_bytes).decode("utf-8")
        payload["download_filename"] = "resumeai-analysis.pdf"
        payload["download_message"] = "You can use this ready resume or download it for quick sharing."
        return payload

    try:
        from services.ai_service import analyze_with_ai
        result = analyze_with_ai(resume_text, job_description)
        return attach_download_payload(result)
    except Exception:
        text = (resume_text or "").lower()
        score = 60
        keywords_found = []
        missing = []

        tech_keywords = ["python", "javascript", "react", "node", "sql", "aws", "docker", "git"]
        for kw in tech_keywords:
            if kw in text:
                keywords_found.append(kw)
                score += 2
            else:
                missing.append(kw)

        fallback = {
            "ats_score": min(score, 95),
            "keywords_found": keywords_found[:10],
            "missing_keywords": missing[:5],
            "suggestions": [
                "Add more quantified achievements (numbers, percentages)",
                "Include relevant keywords from job description",
                "Use action verbs to start bullet points",
                "Keep resume to 1-2 pages"
            ],
            "strengths": ["Resume parsed successfully"],
            "optimized_text": resume_text
        }
        return attach_download_payload(fallback)


@router.post("/analyze")
def analyze_resume(
    req: AnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze resume and return ATS score + suggestions."""
    return _run_analysis(req.resume_text, req.job_description)


@router.post("/analyze/upload")
async def analyze_resume_upload(
    job_description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    extracted_text = parse_resume(data, file.filename or "resume.txt")
    analysis = _run_analysis(extracted_text, job_description)
    analysis["extracted_text"] = extracted_text
    analysis["original_filename"] = file.filename
    return analysis


@router.post("/build")
def build_resume(
    req: BuildResumeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save a built resume."""
    resume = Resume(
        user_id=current_user.id,
        title=req.title,
        content=str(req.resume_data.dict()),
        template=req.template,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return {"id": resume.id, "title": resume.title, "message": "Resume saved!"}


@router.post("/generate-pdf")
def generate_pdf(
    req: BuildResumeRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate PDF resume."""
    try:
        from services.pdf_service import generate_resume_pdf
        pdf_bytes = generate_resume_pdf(req.resume_data.dict(), req.template)
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=resume.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


@router.get("/list")
def list_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return [{"id": r.id, "title": r.title, "template": r.template, "created_at": r.created_at} for r in resumes]


@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    db.delete(resume)
    db.commit()
    return {"message": "Deleted"}
