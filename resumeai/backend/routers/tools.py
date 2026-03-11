from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import os
import random
import string

from config import settings
from models.database import get_db
from models.models import User
from routers.auth import get_current_user

router = APIRouter(prefix="/api/tools", tags=["tools"])


# ─── BULLET REWRITER ───────────────────────────────────────────────

class BulletRewriteRequest(BaseModel):
    bullet: str
    tone: str = "impactful"  # professional | impactful | technical | leadership


TONE_PROMPTS = {
    "impactful": "results-driven with strong metrics and bold action verbs showing clear business impact",
    "professional": "formal and polished corporate language suitable for traditional industries",
    "technical": "technical precision with specific technologies, methodologies and measurable outcomes",
    "leadership": "leadership-focused emphasizing team management, strategic decisions and organizational impact",
}

ACTION_VERBS = {
    "impactful": ["Drove", "Spearheaded", "Achieved", "Delivered", "Accelerated", "Transformed", "Boosted", "Generated", "Launched", "Pioneered"],
    "professional": ["Managed", "Coordinated", "Executed", "Established", "Facilitated", "Implemented", "Directed", "Administered", "Conducted", "Maintained"],
    "technical": ["Engineered", "Architected", "Developed", "Optimized", "Automated", "Deployed", "Integrated", "Built", "Designed", "Implemented"],
    "leadership": ["Led", "Mentored", "Oversaw", "Championed", "Guided", "Mobilized", "Orchestrated", "Cultivated", "Empowered", "Scaled"],
}


def rewrite_bullet_locally(bullet: str, tone: str) -> List[str]:
    """Generate improved bullet points using rule-based transformations."""
    verbs = ACTION_VERBS.get(tone, ACTION_VERBS["impactful"])
    
    # Clean the input
    clean = bullet.strip().lstrip('•-–').strip()
    
    # Remove weak starters
    weak_starters = ["worked on", "helped with", "was part of", "did ", "assisted with", "responsible for", "had to", "tried to"]
    clean_lower = clean.lower()
    for weak in weak_starters:
        if clean_lower.startswith(weak):
            clean = clean[len(weak):].strip()
            break
    
    # Capitalize first letter
    if clean:
        clean = clean[0].upper() + clean[1:]
    
    # Generate 3 versions with different action verbs and improvements
    suggestions = []
    
    # Version 1: Direct improvement with metric hint
    v1_verb = verbs[0]
    suggestions.append(f"{v1_verb} {clean}, resulting in measurable improvement in team productivity and project outcomes")
    
    # Version 2: Add scope and impact
    v2_verb = verbs[1]
    suggestions.append(f"{v2_verb} cross-functional initiative to {clean.lower()}, improving efficiency by 30% and reducing turnaround time")
    
    # Version 3: Leadership angle
    v3_verb = verbs[2]
    suggestions.append(f"{v3_verb} end-to-end {clean.lower()}, collaborating with 5+ stakeholders and delivering results 2 weeks ahead of schedule")
    
    return suggestions


def rewrite_with_ai(bullet: str, tone: str) -> List[str]:
    """Use AI to generate improved bullet points."""
    tone_desc = TONE_PROMPTS.get(tone, TONE_PROMPTS["impactful"])
    
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    
    if anthropic_key:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=anthropic_key)
            message = client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=600,
                messages=[{
                    "role": "user",
                    "content": f"""Rewrite this weak resume bullet point into 3 powerful, ATS-optimized versions.

Tone: {tone_desc}

Original bullet: "{bullet}"

Rules:
1. Start each with a strong action verb
2. Add quantifiable metrics where possible (%, $, numbers, timeframes)
3. Show impact/outcome not just tasks
4. Keep each under 2 lines
5. Make each version distinctly different

Return ONLY a JSON array of exactly 3 strings, no other text:
["version 1", "version 2", "version 3"]"""
                }]
            )
            import json
            text = message.content[0].text.strip()
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"): text = text[4:]
            return json.loads(text.strip())
        except Exception as e:
            print(f"Anthropic rewrite failed: {e}")
    
    if openai_key:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=openai_key)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{
                    "role": "user",
                    "content": f"""Rewrite this resume bullet 3 ways. Tone: {tone_desc}. Original: "{bullet}"
Return ONLY JSON array: ["v1", "v2", "v3"]"""
                }],
                temperature=0.7,
            )
            import json
            return json.loads(response.choices[0].message.content.strip())
        except Exception as e:
            print(f"OpenAI rewrite failed: {e}")
    
    # Fallback to local
    return rewrite_bullet_locally(bullet, tone)


@router.post("/rewrite-bullet")
def rewrite_bullet(
    req: BulletRewriteRequest,
    current_user: User = Depends(get_current_user),
):
    if len(req.bullet.strip()) < 10:
        raise HTTPException(status_code=400, detail="Bullet point is too short")
    if len(req.bullet) > 500:
        raise HTTPException(status_code=400, detail="Bullet point is too long (max 500 chars)")

    suggestions = rewrite_with_ai(req.bullet, req.tone)
    
    return {
        "original": req.bullet,
        "tone": req.tone,
        "suggestions": suggestions,
    }


# ─── REFERRAL SYSTEM ───────────────────────────────────────────────

class SendInviteRequest(BaseModel):
    email: EmailStr


def generate_referral_code(name: str, user_id: int) -> str:
    """Generate a unique referral code."""
    clean_name = ''.join(c.upper() for c in name if c.isalpha())[:6]
    suffix = ''.join(random.choices(string.digits, k=4))
    return f"{clean_name}{suffix}"


@router.get("/referral/my-referrals")
def get_my_referrals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Generate referral code if user doesn't have one
    # (In production, store this in the User model)
    referral_code = generate_referral_code(current_user.name, current_user.id)
    referral_link = f"{settings.frontend_url}/signup?ref={referral_code}"
    
    return {
        "referral_code": referral_code,
        "referral_link": referral_link,
        "total_referrals": 0,
        "successful_referrals": 0,
        "pending_rewards": 0,
        "total_earned_days": 0,
        "reward_per_referral": 30,
        "referrals": [],
    }


@router.post("/referral/send-invite")
def send_invite(
    req: SendInviteRequest,
    current_user: User = Depends(get_current_user),
):
    # In production: send actual email via SendGrid/SES
    # For now just return success
    referral_code = generate_referral_code(current_user.name, current_user.id)
    referral_link = f"{settings.frontend_url}/signup?ref={referral_code}"
    
    print(f"[INVITE] {current_user.email} invited {req.email} with code {referral_code}")
    # TODO: Integrate email service (SendGrid, AWS SES, etc.)
    # send_email(to=req.email, subject="...", body=f"Join at {referral_link}")
    
    return {
        "message": f"Invite sent to {req.email}",
        "referral_link": referral_link,
    }
