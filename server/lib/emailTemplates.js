const { escapeHtml } = require('./sanitize');

function formatSubmittedAt(iso) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    });
  } catch {
    return iso || '—';
  }
}

function adminInquiryEmail(data) {
  const {
    fullName,
    email,
    phone,
    company,
    serviceTypeLabel,
    budgetLabel,
    deadline,
    message,
    receivedAt
  } = data;

  const submittedAt = formatSubmittedAt(receivedAt);
  const safeName = escapeHtml(fullName);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeCompany = escapeHtml(company || '—');
  const safeService = escapeHtml(serviceTypeLabel);
  const safeBudget = escapeHtml(budgetLabel);
  const safeDeadline = escapeHtml(deadline || 'Not specified');
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Re: Your FinBiz project inquiry')}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project Inquiry</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);padding:28px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.85);">FinBiz Solutions</p>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">🚀 New Project Inquiry</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;">
              <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6;">A new lead was submitted from your website contact form.</p>
              <span style="display:inline-block;background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:600;padding:6px 12px;border-radius:999px;margin-bottom:20px;">${safeService}</span>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;color:#334155;">
                <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><strong style="color:#0f172a;">Full Name</strong></td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;">${safeName}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><strong style="color:#0f172a;">Email</strong></td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;"><a href="mailto:${safeEmail}" style="color:#2563eb;">${safeEmail}</a></td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><strong style="color:#0f172a;">Phone</strong></td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;"><a href="tel:${safePhone}" style="color:#2563eb;">${safePhone}</a></td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><strong style="color:#0f172a;">Company</strong></td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;">${safeCompany}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><strong style="color:#0f172a;">Budget</strong></td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;">${safeBudget}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><strong style="color:#0f172a;">Deadline</strong></td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;">${safeDeadline}</td></tr>
                <tr><td style="padding:10px 0;"><strong style="color:#0f172a;">Submitted</strong></td><td style="padding:10px 0;text-align:right;">${escapeHtml(submittedAt)}</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;">
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Project description</p>
                <p style="margin:0;font-size:14px;line-height:1.7;color:#334155;">${safeMessage}</p>
              </div>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px auto 0;">
                <tr>
                  <td style="border-radius:10px;background:#2563eb;">
                    <a href="${mailto}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Reply to customer</a>
                  </td>
                  <td width="12"></td>
                  <td style="border-radius:10px;border:2px solid #2563eb;">
                    <a href="tel:${safePhone}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#2563eb;text-decoration:none;">Call now</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 24px;background:#f8fafc;text-align:center;font-size:12px;color:#94a3b8;">
              FinBiz Solutions · Website contact form
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function customerConfirmationEmail(data) {
  const { fullName, serviceTypeLabel, email } = data;

  const safeName = escapeHtml(fullName);
  const safeService = escapeHtml(serviceTypeLabel || 'your project');
  const safeEmail = escapeHtml(email);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Request Has Been Sent Successfully</title>
</head>

<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
    style="background:#0f172a;padding:32px 16px;">

    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
          style="max-width:560px;background:#111827;border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.35);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);padding:40px 30px;text-align:center;">

              <div style="
                width:72px;
                height:72px;
                margin:0 auto 20px;
                background:rgba(255,255,255,0.15);
                border:2px solid rgba(255,255,255,0.35);
                border-radius:50%;
                line-height:68px;
                font-size:34px;
                color:#ffffff;
              ">
                ✓
              </div>

              <h1 style="
                margin:0 0 10px;
                font-size:30px;
                line-height:1.4;
                font-weight:700;
                color:#ffffff;
              ">
                Your Request Has Been Sent Successfully
              </h1>

              <p style="
                margin:0;
                font-size:15px;
                color:rgba(255,255,255,0.92);
              ">
                Thank you for contacting FinBiz Solutions
              </p>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 32px;background:#111827;">

              <p style="
                margin:0 0 18px;
                font-size:18px;
                color:#ffffff;
                font-weight:600;
              ">
                Hi ${safeName},
              </p>

              <p style="
                margin:0 0 20px;
                font-size:16px;
                line-height:1.8;
                color:#d1d5db;
              ">
                Thank you for contacting
                <strong style="color:#ffffff;">FinBiz Solutions</strong>.
                Your request for
                <strong style="color:#93c5fd;">${safeService}</strong>
                has been sent successfully and our team has received your inquiry.
              </p>

              <p style="
                margin:0 0 22px;
                font-size:16px;
                line-height:1.8;
                color:#d1d5db;
              ">
                We are currently reviewing your request and will contact you shortly with further details.
              </p>

              <!-- Status Box -->
              <div style="
                background:#0f172a;
                border:1px solid #334155;
                border-radius:12px;
                padding:18px;
                margin-bottom:24px;
              ">

                <p style="
                  margin:0 0 8px;
                  font-size:12px;
                  letter-spacing:0.08em;
                  text-transform:uppercase;
                  color:#64748b;
                  font-weight:700;
                ">
                  Request Status
                </p>

                <p style="
                  margin:0;
                  font-size:15px;
                  color:#4ade80;
                  font-weight:700;
                ">
                  ✓ Request Sent Successfully
                </p>

                <p style="
                  margin:10px 0 0;
                  font-size:13px;
                  color:#94a3b8;
                ">
                  Confirmation email delivered to ${safeEmail}
                </p>

              </div>

              <p style="
                margin:0 0 18px;
                font-size:15px;
                line-height:1.8;
                color:#cbd5e1;
              ">
                Our support team usually responds within
                <strong style="color:#ffffff;">24–48 hours</strong>.
              </p>

              <p style="
                margin:0;
                font-size:14px;
                color:#94a3b8;
              ">
                — FinBiz Solutions Team
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              padding:22px;
              background:#0b1120;
              text-align:center;
              font-size:13px;
              color:#64748b;
            ">

              © 2026 FinBiz Solutions. All rights reserved.

            </td>
          </tr>

        </table>

      </td>
    </tr>

  </table>

</body>
</html>`;
}

function customerConfirmationText(data) {
  return `Hi ${data.fullName},

Your request has been sent successfully.

Thank you for contacting FinBiz Solutions. Our team has received your inquiry regarding ${data.serviceTypeLabel || 'your project'}.

We are currently reviewing your request and will contact you shortly.

Our support team usually responds within 24–48 hours.

— FinBiz Solutions Team`;
}

function adminInquiryText(data) {
  return `
New Project Inquiry — FinBiz Solutions
--------------------------------------
Full Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company || '—'}
Service: ${data.serviceTypeLabel}
Budget: ${data.budgetLabel}
Deadline: ${data.deadline || 'Not specified'}
Submitted: ${formatSubmittedAt(data.receivedAt)}

Project Description:
${data.message}
`.trim();
}

function customerConfirmationText(data) {
  return `Hi ${data.fullName},

Your request was sent successfully.

Thank you for contacting FinBiz Solutions. We have received your project inquiry (${data.serviceTypeLabel || 'project'}) and our team is reviewing it.

Our team will contact you within 24–48 hours.

— FinBiz Solutions Team`;
}

module.exports = {
  adminInquiryEmail,
  customerConfirmationEmail,
  adminInquiryText,
  customerConfirmationText
};
