/**
 * Interactive setup — run: node setup-env.js
 * Saves Gmail App Password to server/.env (not .env.example)
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envPath = path.join(__dirname, '.env');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(q) {
  return new Promise((resolve) => rl.question(q, resolve));
}

async function main() {
  console.log('\n=== FinBiz email setup ===\n');
  console.log('Use Gmail APP PASSWORD (16 chars), not your normal Gmail password.');
  console.log('Get it: https://myaccount.google.com/apppasswords\n');

  let email = await ask('Gmail (Enter = kumarakash030528@gmail.com): ');
  email = (email || 'kumarakash030528@gmail.com').trim();

  let pass = await ask('Gmail App Password (paste, spaces OK): ');
  pass = pass.replace(/\s/g, '').trim();

  if (pass.length < 10) {
    console.error('\nPassword too short.\n');
    process.exit(1);
  }

  const content = `PORT=3001
OWNER_EMAIL=${email}
EMAIL_USER=${email}
EMAIL_PASS=${pass}
EMAIL_FROM="FinBiz Solutions" <${email}>
`;

  fs.writeFileSync(envPath, content, 'utf8');
  console.log('\nSaved server/.env\n');

  rl.close();

  require('dotenv').config({ path: envPath });
  const { verifyMailer } = require('./lib/mailer');
  const ok = await verifyMailer();
  if (ok) {
    console.log('SMTP verified. Run: npm start\n');
  } else {
    console.log('Saved, but SMTP verify failed. Check App Password.\n');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
