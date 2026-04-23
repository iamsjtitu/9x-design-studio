# 9x.design — VPS Deployment (Super Simple)

Deploy 9x.design to your existing VPS alongside `admin.9x.design`.  
**Zero impact on admin.9x.design** — completely isolated.

## ⚡ Architecture (final)

```
Internet
   ↓
Cloudflare (DNS + SSL)
   ↓
Cloudflare Tunnel  →  VPS
                         ├─ admin.9x.design  → :7000  (existing, untouched)
                         └─ 9x.design        → :8001  (new — this guide)
                                                │
                                                └─ uvicorn (FastAPI)
                                                   serves frontend static
                                                   + /api/* endpoints
```

**Key insight:** One Python process on port 8001 serves **both** the React frontend (static build) AND the `/api` routes. No MongoDB, no nginx, no separate frontend server.

---

## ✅ Before you start

- [x] Cloudflare Tunnel already running on VPS (admin.9x.design uses it)
- [x] `9x.design` domain added to Cloudflare
- [x] Cloudflare Email Routing configured (`sales@9x.design` → `t2@host9x.com`)
- [x] Code pushed to GitHub: `https://github.com/iamsjtitu/9x-design-studio`

---

## Phase 1 — Install Node.js + Python (skip what's already there)

```bash
# Check what's already installed
node --version   # need >= 18. If missing or old, install below
python3 --version  # need >= 3.10 (usually already there)

# If Node.js is missing or too old:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g yarn

# Python venv support (usually already there)
sudo apt-get install -y python3-venv python3-pip
```

Verify:
```bash
node --version   # should print v20.x.x
yarn --version   # should print 1.22.x
python3 -m venv --help   # should NOT error
```

---

## Phase 2 — Clone the repo

```bash
sudo mkdir -p /var/www
sudo chown $USER:$USER /var/www
cd /var/www
git clone https://github.com/iamsjtitu/9x-design-studio.git 9x-design
cd 9x-design
ls -la
```

**Expected** — you should see:
```
backend/   frontend/   DEPLOYMENT.md   README.md   ...
```

If you see only old files (no `backend/`, no `frontend/` folders), checkout the branch Emergent pushed to:
```bash
git branch -r            # list remote branches
git checkout <branch>    # usually 'main' but might be 'emergent-main' or similar
```

---

## Phase 3 — Build the frontend

```bash
cd /var/www/9x-design/frontend

# Configure: no backend URL means "same origin" (what we want in production)
cat > .env << 'EOF'
VITE_BACKEND_URL=
REACT_APP_BACKEND_URL=
EOF

# Install deps + build
yarn install
yarn build
```

**Expected** — `yarn build` finishes with:
```
✓ built in X.XXs
```

Verify the build output:
```bash
ls /var/www/9x-design/frontend/dist/
# should see: index.html, assets/, favicon.svg, etc.
```

---

## Phase 4 — Setup the backend

```bash
cd /var/www/9x-design/backend

# Create venv + install deps
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

**Edit the backend `.env` file:**

```bash
nano .env
```

Replace the contents with:

```env
# Email (Resend)
RESEND_API_KEY=re_FS8RA7H5_MBnjJzFJybqbzganCzRc9iNc
SENDER_EMAIL=hello@9x.design
RECEIVER_EMAIL=sales@9x.design

# CORS — tighten to your real domains in production
CORS_ORIGINS=https://9x.design,https://www.9x.design

# Serve the Vite build from the same FastAPI process
SERVE_STATIC=true
FRONTEND_DIST_DIR=/var/www/9x-design/frontend/dist

# These two are not used (no MongoDB) but kept for safety
MONGO_URL=
DB_NAME=
```

**Quick smoke test** (before systemd):

```bash
cd /var/www/9x-design/backend
source venv/bin/activate
uvicorn server:app --host 127.0.0.1 --port 8001

# In ANOTHER shell window:
curl http://127.0.0.1:8001/api/health
# Expected: {"status":"ok","email_configured":true,"sender":"hello@9x.design",...}

curl -I http://127.0.0.1:8001/
# Expected: HTTP/1.1 200 OK  + content-type: text/html
# (This means frontend is being served too ✅)

# Stop the manual run with Ctrl-C
```

### Create systemd service (auto-start, auto-restart on crash)

```bash
sudo nano /etc/systemd/system/9x-design.service
```

Paste (change `YOUR_USER` to your VPS user — likely `root`):

```ini
[Unit]
Description=9x.design full-stack (FastAPI + Vite static)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/9x-design/backend
EnvironmentFile=/var/www/9x-design/backend/.env
ExecStart=/var/www/9x-design/backend/venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001 --workers 2
Restart=always
RestartSec=5
StandardOutput=append:/var/log/9x-design.log
StandardError=append:/var/log/9x-design.err.log

[Install]
WantedBy=multi-user.target
```

Enable + start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable 9x-design
sudo systemctl start 9x-design
sudo systemctl status 9x-design    # should show "active (running)"
```

Verify:
```bash
curl http://127.0.0.1:8001/api/health
curl -I http://127.0.0.1:8001/
```

(Press `q` to exit `systemctl status`.)

---

## Phase 5 — Cloudflare Tunnel route

**Easiest way — use the Cloudflare Zero Trust dashboard:**

1. Go to 👉 https://one.dash.cloudflare.com
2. Left sidebar → **Networks** → **Tunnels**
3. Find your existing tunnel (the one running admin.9x.design) → click it → **Configure**
4. Switch to the **Public Hostnames** tab
5. Click **Add a public hostname**
6. Fill in:
   - **Subdomain:** *(leave empty)*
   - **Domain:** `9x.design`
   - **Path:** *(leave empty)*
   - **Service type:** `HTTP`
   - **URL:** `localhost:8001`
7. Click **Save hostname**
8. Repeat for **www.9x.design**:
   - Subdomain: `www`
   - Domain: `9x.design`
   - Same service: `http://localhost:8001`
9. Save

Cloudflare automatically:
- Creates DNS records (CNAME for 9x.design + www pointing to the tunnel)
- Issues SSL certificates
- Routes traffic through the tunnel to your VPS

**No changes to nginx, no firewall rule, nothing else to do.**

---

## Phase 6 — Test 🎉

Open in browser:

- ✅ `https://9x.design` → your landing page loads
- ✅ `https://www.9x.design` → same page
- ✅ `https://9x.design/api/health` → JSON response
- ✅ Fill the contact form → submit → check `t2@host9x.com` inbox
- ✅ `https://admin.9x.design` → still works (untouched)

---

## Re-deploy workflow (next time you update code)

From Emergent, click **"Save to GitHub"** to push the latest changes.

Then on VPS:

```bash
cd /var/www/9x-design
git pull

# Rebuild frontend (only if frontend changed)
cd frontend
yarn install --frozen-lockfile
yarn build

# Restart backend (picks up any backend changes)
sudo systemctl restart 9x-design

echo "✅ Redeployed"
```

Optional — save as a script:

```bash
cat > /var/www/9x-design/redeploy.sh << 'EOF'
#!/usr/bin/env bash
set -e
cd /var/www/9x-design
git pull
cd frontend && yarn install --frozen-lockfile && yarn build
sudo systemctl restart 9x-design
echo "✅ 9x.design redeployed at $(date)"
EOF
chmod +x /var/www/9x-design/redeploy.sh
```

Then just run `/var/www/9x-design/redeploy.sh` whenever you push changes.

---

## Troubleshooting

### `https://9x.design` shows 502 Bad Gateway / Tunnel error
Backend isn't running on port 8001.
```bash
sudo systemctl status 9x-design
sudo tail -n 50 /var/log/9x-design.err.log
curl http://127.0.0.1:8001/api/health
```

### Website loads but contact form fails
```bash
# Test the API directly
curl -X POST http://127.0.0.1:8001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@t.com","service":"web","message":"testing"}'

# Check logs for "Lead email sent" or "Failed to send"
sudo tail -f /var/log/9x-design.err.log
```

### Email sent (200 OK in logs) but nothing in t2@host9x.com
1. Check Resend dashboard → https://resend.com/emails → delivery status
2. Check Cloudflare Email Routing → Rules → is `sales@9x.design → t2@host9x.com` "Enabled"?
3. Check spam folder in t2@host9x.com
4. Verify MX records at Cloudflare DNS — should have Cloudflare's MX (not Zoho/Google conflicting)

### Port 8001 conflict (if anything else uses it)
Change the port:
```bash
# 1. Edit systemd service
sudo nano /etc/systemd/system/9x-design.service
# Change --port 8001 to --port 8002 (or whatever)

# 2. Reload
sudo systemctl daemon-reload
sudo systemctl restart 9x-design

# 3. Update Cloudflare Tunnel hostname to point to localhost:8002
```

### Redeploy pulled old code / no changes
```bash
cd /var/www/9x-design
git log --oneline -5    # see last 5 commits
git fetch --all
git reset --hard origin/main    # force sync with remote main branch
```

---

## Quick reference card

| Thing                    | Command / Path                                     |
| ------------------------ | -------------------------------------------------- |
| App code                 | `/var/www/9x-design/`                              |
| Frontend build output    | `/var/www/9x-design/frontend/dist/`                |
| Backend service          | `sudo systemctl {status,restart,stop} 9x-design`   |
| Backend logs             | `sudo tail -f /var/log/9x-design.err.log`          |
| Health check             | `curl https://9x.design/api/health`                |
| Redeploy                 | `/var/www/9x-design/redeploy.sh`                   |
| Backend port             | `127.0.0.1:8001` (internal only — tunnel proxies)  |
| Cloudflare Tunnel config | https://one.dash.cloudflare.com → Networks → Tunnels |

---

## What about the admin app?

**Bilkul same rahega.** We did not:
- Touch any admin file
- Change any port admin uses (7000)
- Modify the tunnel config for admin.9x.design (it already has a `public hostname` entry)
- Install anything that conflicts (MongoDB is now removed — no conflict)

Admin is in `/opt/mille*` on port 7000. 9x.design is in `/var/www/9x-design` on port 8001. Completely separate.

---

**That's it — 6 phases, ~15 mins total.** 🚀

Agar kahin stuck ho, yahan paste karo:
```bash
sudo tail -n 100 /var/log/9x-design.err.log
sudo systemctl status 9x-design
```
Mai debug kar dunga.
