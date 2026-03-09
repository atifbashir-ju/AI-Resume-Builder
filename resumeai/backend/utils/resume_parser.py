import io
import re
from typing import Optional

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        return f"Error extracting PDF: {str(e)}"

def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        from docx import Document
        doc = Document(io.BytesIO(file_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        return f"Error extracting DOCX: {str(e)}"

def parse_resume(file_bytes: bytes, filename: str) -> str:
    fname = filename.lower()
    if fname.endswith('.pdf'):
        return extract_text_from_pdf(file_bytes)
    elif fname.endswith('.docx') or fname.endswith('.doc'):
        return extract_text_from_docx(file_bytes)
    else:
        try:
            return file_bytes.decode('utf-8')
        except:
            return file_bytes.decode('latin-1', errors='ignore')
