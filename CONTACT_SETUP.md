# Contact form email setup (Nodemailer + Gmail)

The contact form sends email **only through the backend** (`server/index.js`). There is no FormSubmit, Web3Forms, or other browser-only mail service.

## Quick start (local)

1. Copy `server/.env.example` → `server/.env`
2. Set `EMAIL_USER` and `EMAIL_PASS` (Gmail **App Password**, not your normal Gmail password)
3. Run:

```bash
cd server
npm install
npm start
```

4. Open **http://localhost:3001** (not `file://`)
5. Submit the form — success appears **only** if both emails were sent:
   - Admin: `kumarakash030528@gmail.com` — subject: **🚀 New Project Inquiry Received**
   - Customer: auto-reply — subject: **Your Request Has Been Received**

## Environment variables

| Variable | Description |
|----------|-------------|
| `EMAIL_USER` | Gmail address (sender) |
| `EMAIL_PASS` | Gmail App Password (16 chars) |
| `OWNER_EMAIL` | Admin inbox (default: same Gmail) |
| `EMAIL_FROM` | Optional display name |
| `PORT` | Default `3001` |
| `CORS_ORIGIN` | Comma-separated production URLs |

Legacy names `SMTP_USER` / `SMTP_PASS` still work.

## API

- `POST /api/contact` — validate, send emails, save backup JSON
- `GET /api/contact/status` — `{ mailConfigured: true/false }`
- `GET /health` — server health

### Success response

```json
{ "ok": true, "emailed": true, "message": "Your request was sent successfully." }
```

### Failure (no fake success)

```json
{ "ok": false, "emailed": false, "message": "..." }
```

HTTP `503` if `.env` is missing. HTTP `500` if SMTP fails.

## Deployment

### Static site + Node API (recommended)

| Frontend | Backend |
|----------|---------|
| Netlify / Vercel / GitHub Pages | Render / Railway / VPS |

1. Deploy `server/` as a Node service.
2. Set env vars on the host: `EMAIL_USER`, `EMAIL_PASS`, `OWNER_EMAIL`, `CORS_ORIGIN`.
3. Point frontend `js/contact-config.js`:

```javascript
apiURL: 'https://your-api.onrender.com/api/contact'
```

Or leave `apiURL` empty if frontend and API share the same domain.

### Same VPS

Run `npm start` in `server/` — it serves the website and API on one port.

## Security

- Honeypot field (`website`)
- Rate limit: 25 requests / 15 min per IP
- Input validation + sanitization
- Helmet headers

## Troubleshooting

| Issue | Fix |
|-------|-----|
| “Cannot reach the server” | Run `npm start` in `server/`, use `http://localhost:3001` |
| HTTP 503 | Create `server/.env` with App Password |
| HTTP 500 / SMTP error | Wrong App Password; enable 2FA; use App Password not login password |
| Success but no mail | Check Spam; verify terminal shows `[finbiz-mail] Admin email sent` |
| CORS error in production | Set `CORS_ORIGIN` to your live site URL |

Saved inquiries backup: `server/data/inquiries.json` (after successful email send).
