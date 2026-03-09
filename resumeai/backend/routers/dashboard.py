from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.database import get_db
from models.models import User, Resume
from routers.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats")
def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    scores = [r.ats_score for r in resumes if r.ats_score]
    avg_score = sum(scores) / len(scores) if scores else 0

    return {
        "total_resumes": len(resumes),
        "avg_ats_score": round(avg_score, 1),
        "best_score": max(scores) if scores else 0,
        "recent_resumes": [
            {"id": r.id, "title": r.title, "template": r.template, "created_at": str(r.created_at)}
            for r in resumes[-5:]
        ]
    }
