/**
 * Test Gmail SMTP — run after filling EMAIL_PASS in server/.env
 *   node test-email.js
 */
require('dotenv').config();
const { verifyMailer, sendInquiryEmails, isMailConfigured } = require('./lib/mailer');

async function main() {
  if (!isMailConfigured()) {
    console.error('\n❌ EMAIL_PASS is empty in server/.env');
    console.error('   Add your Gmail App Password, then run: node test-email.js\n');
    process.exit(1);
  }

  const ok = await verifyMailer();
  if (!ok) {
    console.error('\n❌ SMTP verification failed. Check EMAIL_USER and EMAIL_PASS.\n');
    process.exit(1);
  }

  const owner = process.env.OWNER_EMAIL || process.env.EMAIL_USER;
  console.log('\n📧 Sending test inquiry to', owner, '...\n');

  await sendInquiryEmails({
    ownerEmail: owner,
    inquiry: {
      fullName: 'Test User (FinBiz)',
      email: process.env.EMAIL_USER,
      phone: '+919999999999',
      company: 'Test Co',
      serviceTypeLabel: 'Website Development',
      budgetLabel: 'Under ₹50,000',
      deadline: null,
      message: 'This is a test email from FinBiz contact API. If you see this, SMTP works.',
      receivedAt: new Date().toISOString()
    }
  });

  console.log('✅ Test emails sent. Check inbox:', owner);
  console.log('   (Also check Spam/Promotions)\n');
}

main().catch((err) => {
  console.error('\n❌', err.message);
  if (err.response) console.error(err.response);
  process.exit(1);
});
