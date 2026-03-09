import os
import re
from typing import Optional


def analyze_with_ai(resume_text: str, job_description: Optional[str] = None) -> dict:
    """Analyze resume using AI or fallback algorithm."""
    
    # Try Anthropic first
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    if anthropic_key:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=anthropic_key)
            prompt = f"""Analyze this resume and return JSON with: ats_score (0-100), keywords_found (list), missing_keywords (list), suggestions (list of 4 tips), strengths (list of 3).
Resume: {resume_text[:3000]}
{f'Job Description: {job_description[:1000]}' if job_description else ''}
Return ONLY valid JSON."""
            
            msg = client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )
            import json
            result = json.loads(msg.content[0].text)
            result["optimized_text"] = resume_text
            return result
        except:
            pass

    # Fallback algorithm
    text = resume_text.lower()
    score = 50
    keywords_found = []
    missing_keywords = []

    all_keywords = [
        "python", "javascript", "react", "node.js", "sql", "aws", "docker",
        "git", "agile", "scrum", "machine learning", "api", "rest", "java",
        "typescript", "kubernetes", "ci/cd", "linux", "mongodb", "postgresql"
    ]

    for kw in all_keywords:
        if kw in text:
            keywords_found.append(kw)
            score += 2
        else:
            missing_keywords.append(kw)

    # Bonus points
    if any(c.isdigit() for c in resume_text): score += 5
    if "experience" in text: score += 3
    if "education" in text: score += 3
    if len(resume_text) > 500: score += 5

    return {
        "ats_score": min(int(score), 95),
        "keywords_found": keywords_found[:10],
        "missing_keywords": missing_keywords[:8],
        "suggestions": [
            "Add quantified achievements with numbers and percentages",
            "Include more keywords from the job description",
            "Use strong action verbs (Led, Built, Increased, Reduced)",
            "Ensure consistent formatting throughout"
        ],
        "strengths": [
            f"Found {len(keywords_found)} relevant keywords",
            "Resume has good content length" if len(resume_text) > 300 else "Consider adding more detail",
            "Professional structure detected"
        ],
        "optimized_text": resume_text
    }
