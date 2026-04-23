from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import asyncio
import html
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional
import uuid
from datetime import datetime, timezone

import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Email config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
RECEIVER_EMAIL = os.environ.get('RECEIVER_EMAIL', 'sales@9x.design')

# Static files config (for production — serve Vite build output)
FRONTEND_DIST_DIR = os.environ.get(
    'FRONTEND_DIST_DIR',
    str((ROOT_DIR / '..' / 'frontend' / 'dist').resolve()),
)
SERVE_STATIC = os.environ.get('SERVE_STATIC', 'false').lower() in ('1', 'true', 'yes')

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app
app = FastAPI(title="9x.design API", version="2.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ── Models ───────────────────────────────────────────────────────────────────
SERVICE_CHOICES = {"web", "software", "mobile", "uiux", "other"}


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    service: Optional[str] = Field(default="other", max_length=40)
    message: str = Field(..., min_length=5, max_length=4000)
    company: Optional[str] = Field(default=None, max_length=120)
    budget: Optional[str] = Field(default=None, max_length=40)


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    service: str = "other"
    message: str
    company: Optional[str] = None
    budget: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactResponse(BaseModel):
    id: str
    success: bool = True
    message: str = "Thanks! We'll get back to you within 24 hours."


# ── Email helpers ────────────────────────────────────────────────────────────
def _build_lead_email_html(lead: Lead) -> str:
    service_label = {
        "web": "Website Development",
        "software": "Software Development",
        "mobile": "Mobile App Development",
        "uiux": "UI/UX Design",
        "other": "Other",
    }.get(lead.service, lead.service.title())

    e_name = html.escape(lead.name)
    e_email = html.escape(lead.email)
    e_message = html.escape(lead.message)
    e_company = html.escape(lead.company) if lead.company else ''
    e_budget = html.escape(lead.budget) if lead.budget else ''
    first_name = html.escape(lead.name.split()[0]) if lead.name.strip() else 'them'

    return f"""\
<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f6f7f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(20,20,30,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#FF4400,#FFA500);padding:28px 32px;color:#ffffff;">
              <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:0.9;">9x.design · New Lead</div>
              <div style="font-size:24px;font-weight:700;margin-top:6px;">{e_name}</div>
              <div style="font-size:14px;opacity:0.9;margin-top:2px;">{e_email}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;color:#1a1d23;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Service</td>
                </tr>
                <tr>
                  <td style="padding:0 0 16px 0;font-size:15px;color:#111827;font-weight:600;">{service_label}</td>
                </tr>
                {"<tr><td style='padding:6px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;'>Company</td></tr><tr><td style='padding:0 0 16px 0;font-size:15px;color:#111827;'>" + e_company + "</td></tr>" if e_company else ""}
                {"<tr><td style='padding:6px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;'>Budget</td></tr><tr><td style='padding:0 0 16px 0;font-size:15px;color:#111827;'>" + e_budget + "</td></tr>" if e_budget else ""}
                <tr>
                  <td style="padding:6px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Project Details</td>
                </tr>
                <tr>
                  <td style="padding:0;font-size:15px;line-height:1.6;color:#111827;white-space:pre-wrap;">{e_message}</td>
                </tr>
              </table>
              <hr style="border:0;border-top:1px solid #e5e7eb;margin:24px 0;" />
              <p style="font-size:12px;color:#6b7280;margin:0;">Received on {lead.created_at.strftime('%d %b %Y, %H:%M UTC')} · Lead ID: {lead.id}</p>
              <div style="margin-top:20px;">
                <a href="mailto:{e_email}" style="display:inline-block;background:#FF4400;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:14px;">Reply to {first_name}</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:16px 32px;text-align:center;color:#9ca3af;font-size:12px;">
              9x.design — Digital Studio · Automated notification
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


async def _send_lead_email(lead: Lead) -> str | None:
    """Send the lead notification email. Returns Resend message id or None on failure."""
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set — email skipped")
        return None
    params = {
        "from": SENDER_EMAIL,
        "to": [RECEIVER_EMAIL],
        "reply_to": lead.email,
        "subject": f"New Lead — {lead.name} ({lead.service})",
        "html": _build_lead_email_html(lead),
    }
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        msg_id = email.get("id")
        logger.info(f"Lead email sent: {msg_id}")
        return msg_id
    except Exception as e:
        logger.error(f"Failed to send lead email: {e}")
        return None


# ── Routes ───────────────────────────────────────────────────────────────────
@api_router.get("/")
async def root():
    return {"message": "9x.design API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {
        "status": "ok",
        "email_configured": bool(RESEND_API_KEY),
        "sender": SENDER_EMAIL,
        "receiver": RECEIVER_EMAIL,
    }


@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(payload: LeadCreate):
    service = (payload.service or "other").lower().strip()
    if service not in SERVICE_CHOICES:
        service = "other"

    lead = Lead(
        name=payload.name.strip(),
        email=payload.email.lower().strip(),
        service=service,
        message=payload.message.strip(),
        company=payload.company.strip() if payload.company else None,
        budget=payload.budget.strip() if payload.budget else None,
    )

    msg_id = await _send_lead_email(lead)
    if not msg_id:
        # Email failed — still return success to user but log error
        # (User already filled form; we don't want them to retry)
        logger.error(f"Email delivery failed for lead {lead.id} ({lead.email})")
        raise HTTPException(
            status_code=502,
            detail="Unable to send your message right now. Please email us directly at sales@9x.design",
        )

    return ContactResponse(id=lead.id)


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Static file serving (production only) ───────────────────────────────────
# When SERVE_STATIC=true, FastAPI also serves the Vite build as the frontend
# so you can run a single process on the VPS: uvicorn server:app. Cloudflare
# Tunnel → localhost:8001 and you're done — no nginx needed.
if SERVE_STATIC and Path(FRONTEND_DIST_DIR).is_dir():
    assets_dir = Path(FRONTEND_DIST_DIR) / 'assets'
    if assets_dir.is_dir():
        app.mount('/assets', StaticFiles(directory=str(assets_dir)), name='assets')

    @app.get('/{full_path:path}', include_in_schema=False)
    async def serve_spa(full_path: str):
        # API routes are already handled by the router above
        if full_path.startswith('api/'):
            raise HTTPException(status_code=404)

        # Try the requested file first (favicon.svg, vite.svg, _redirects, etc.)
        candidate = Path(FRONTEND_DIST_DIR) / full_path
        if full_path and candidate.is_file():
            return FileResponse(str(candidate))

        # Fallback to index.html (SPA routing)
        index = Path(FRONTEND_DIST_DIR) / 'index.html'
        if index.is_file():
            return FileResponse(str(index))
        raise HTTPException(status_code=404)

    logger.info(f"Serving frontend from: {FRONTEND_DIST_DIR}")
else:
    logger.info("Static file serving disabled (dev mode — Vite handles frontend on :3000)")
