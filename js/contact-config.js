/**
 * Contact form — backend API only (Nodemailer on server)
 *
 * 1. Copy server/.env.example → server/.env
 * 2. Set EMAIL_USER and EMAIL_PASS (Gmail App Password)
 * 3. Run: cd server && npm install && npm start
 * 4. Open http://localhost:3001
 */
window.CONTACT_HUB_CONFIG = {
  delivery: 'api',
  ownerEmail: 'kumarakash030528@gmail.com',
  /** Leave empty = auto (uses http://localhost:3001/api/contact when needed) */
  apiURL: '',
  apiBase: 'http://localhost:3001'
};
