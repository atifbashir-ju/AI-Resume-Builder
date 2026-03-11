from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import getSampleStyleSheet
import io

TEMPLATES = {
    "modern-pro":    {"primary": colors.HexColor("#00b894"), "secondary": colors.HexColor("#1a1a2e"), "accent": colors.HexColor("#636e72")},
    "executive":     {"primary": colors.HexColor("#2980b9"), "secondary": colors.HexColor("#1a1a2e"), "accent": colors.HexColor("#7f8c8d")},
    "creative-bold": {"primary": colors.HexColor("#8e44ad"), "secondary": colors.HexColor("#1a1a2e"), "accent": colors.HexColor("#9b59b6")},
    "minimal-clean": {"primary": colors.HexColor("#333333"), "secondary": colors.HexColor("#000000"), "accent": colors.HexColor("#777777")},
    "tech-dark":     {"primary": colors.HexColor("#e67e22"), "secondary": colors.HexColor("#1a1a2e"), "accent": colors.HexColor("#e74c3c")},
    "academic":      {"primary": colors.HexColor("#c0392b"), "secondary": colors.HexColor("#1a1a2e"), "accent": colors.HexColor("#7f8c8d")},
    "startup":       {"primary": colors.HexColor("#00b894"), "secondary": colors.HexColor("#0f1923"), "accent": colors.HexColor("#636e72")},
    "elegant":       {"primary": colors.HexColor("#b8860b"), "secondary": colors.HexColor("#1c1c24"), "accent": colors.HexColor("#888888")},
}


def generate_resume_pdf(resume_data: dict, template: str = "modern-pro") -> bytes:
    colors_scheme = TEMPLATES.get(template, TEMPLATES["modern-pro"])
    buffer = io.BytesIO()

    doc = SimpleDocTemplate(buffer, pagesize=A4,
        rightMargin=0.65*inch, leftMargin=0.65*inch,
        topMargin=0.65*inch, bottomMargin=0.65*inch)

    story = []
    p_color = colors_scheme["primary"]
    s_color = colors_scheme["secondary"]
    a_color = colors_scheme["accent"]
    personal = resume_data.get("personal", {})

    name_style = ParagraphStyle("Name", fontSize=24, fontName="Helvetica-Bold", textColor=s_color, alignment=TA_LEFT, spaceAfter=3)
    contact_style = ParagraphStyle("Contact", fontSize=8.5, textColor=a_color, alignment=TA_LEFT, spaceAfter=4, leading=13)
    section_head_style = ParagraphStyle("SectionHead", fontSize=10, fontName="Helvetica-Bold", textColor=p_color, spaceBefore=10, spaceAfter=3)
    body_style = ParagraphStyle("Body", fontSize=9.5, textColor=colors.HexColor("#2d2d2d"), spaceAfter=3, leading=14)
    bold_style = ParagraphStyle("Bold", fontSize=9.5, fontName="Helvetica-Bold", textColor=s_color, spaceAfter=1)
    italic_style = ParagraphStyle("Italic", fontSize=9, fontName="Helvetica-Oblique", textColor=a_color, spaceAfter=2)
    bullet_style = ParagraphStyle("Bullet", fontSize=9.5, textColor=colors.HexColor("#2d2d2d"), spaceAfter=2, leading=14, leftIndent=10)

    story.append(Paragraph(personal.get("name", "Your Name"), name_style))
    story.append(Spacer(1, 4))

    contact_parts = []
    if personal.get("email"): contact_parts.append(personal["email"])
    if personal.get("phone"): contact_parts.append(personal["phone"])
    if personal.get("location"): contact_parts.append(personal["location"])

    linkedin_link = None
    website_link = None
    if personal.get("linkedin"):
        linkedin_link = personal["linkedin"].strip()
    if personal.get("website"):
        website_link = personal["website"].strip()

    if contact_parts:
        story.append(Paragraph(" | ".join(contact_parts), contact_style))
    if linkedin_link or website_link:
        link_parts = []
        if linkedin_link:
            link_parts.append(f"LinkedIn: {linkedin_link}")
        if website_link:
            link_parts.append(f"Portfolio: {website_link}")
        story.append(Paragraph(" | ".join(link_parts), contact_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=p_color, spaceAfter=6, spaceBefore=2))

    def add_section(title):
        story.append(Paragraph(title.upper(), section_head_style))
        story.append(HRFlowable(width="100%", thickness=0.4, color=p_color, spaceAfter=5))

    if personal.get("summary"):
        add_section("Professional Summary")
        story.append(Paragraph(personal["summary"], body_style))
        story.append(Spacer(1, 4))

    experience = resume_data.get("experience", [])
    valid_exp = [e for e in experience if e.get("company") or e.get("role")]
    if valid_exp:
        add_section("Work Experience")
        for exp in valid_exp:
            end = "Present" if exp.get("current") else exp.get("end_date", "")
            date_str = f"{exp.get('start_date', '')} - {end}".strip(" -")
            row = [[Paragraph(exp.get("role", ""), bold_style), Paragraph(exp.get("company", ""), italic_style), Paragraph(date_str, italic_style)]]
            t = Table(row, colWidths=[2.4*inch, 2.4*inch, 1.8*inch])
            t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('ALIGN',(2,0),(2,0),'RIGHT'),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0)]))
            story.append(t)
            if exp.get("description"):
                for line in exp["description"].split('\n'):
                    line = line.strip().lstrip('-').strip()
                    if line:
                        story.append(Paragraph(f"- {line}", bullet_style))
            story.append(Spacer(1, 5))

    education = resume_data.get("education", [])
    valid_edu = [e for e in education if e.get("institution") or e.get("degree")]
    if valid_edu:
        add_section("Education")
        for edu in valid_edu:
            degree_line = edu.get("degree", "")
            if edu.get("field"): degree_line += f" in {edu['field']}"
            date_str = f"{edu.get('start_year', '')} - {edu.get('end_year', '')}".strip(" -")
            row = [[Paragraph(edu.get("institution", ""), bold_style), Paragraph(degree_line, italic_style), Paragraph(date_str, italic_style)]]
            t = Table(row, colWidths=[2.4*inch, 2.4*inch, 1.8*inch])
            t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('ALIGN',(2,0),(2,0),'RIGHT'),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0)]))
            story.append(t)
            if edu.get("gpa"):
                story.append(Paragraph(f"GPA: {edu['gpa']}", body_style))
            story.append(Spacer(1, 4))

    skills = resume_data.get("skills", {})
    if any(v for v in skills.values() if v):
        add_section("Skills")
        if skills.get("technical"): story.append(Paragraph(f"<b>Technical:</b> {skills['technical']}", body_style))
        if skills.get("tools"): story.append(Paragraph(f"<b>Tools:</b> {skills['tools']}", body_style))
        if skills.get("soft"): story.append(Paragraph(f"<b>Soft Skills:</b> {skills['soft']}", body_style))
        story.append(Spacer(1, 4))

    projects = resume_data.get("projects", [])
    valid_proj = [p for p in projects if p.get("name")]
    if valid_proj:
        add_section("Projects")
        for proj in valid_proj:
            story.append(Paragraph(f"<b>{proj['name']}</b>", bold_style))
            if proj.get("technologies"): story.append(Paragraph(f"<b>Tech:</b> {proj['technologies']}", body_style))
            if proj.get("description"): story.append(Paragraph(proj["description"], bullet_style))
            story.append(Spacer(1, 4))

    certs = resume_data.get("certifications", [])
    valid_certs = [c for c in certs if c.get("name")]
    if valid_certs:
        add_section("Certifications")
        for cert in valid_certs:
            parts = [cert["name"]]
            if cert.get("issuer"): parts.append(cert["issuer"])
            if cert.get("year"): parts.append(cert["year"])
            story.append(Paragraph(f"- {' - '.join(parts)}", bullet_style))

    doc.build(story)
    return buffer.getvalue()


def generate_text_resume_pdf(resume_text: str, title: str = "ResumeAI Analyzer") -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=0.65 * inch,
        leftMargin=0.65 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "AnalyzerTitle",
        fontSize=18,
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#1a1a2e"),
        spaceAfter=12,
    )
    body_style = ParagraphStyle(
        "AnalyzerBody",
        fontSize=11,
        textColor=colors.HexColor("#2d2d2d"),
        leading=16,
        spaceAfter=6,
    )

    story = [Paragraph(title, title_style), HRFlowable(width="100%", thickness=1, color=colors.HexColor("#00b894"), spaceAfter=10)]

    text = resume_text or "Resume content not provided."
    for line in text.splitlines():
        clean_line = line.strip() or "&nbsp;"
        story.append(Paragraph(clean_line, body_style))

    doc.build(story)
    return buffer.getvalue()
