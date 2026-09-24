export type EstimateRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zip: string;
  project: string;
  howDidYouHear?: string;
};

const sourceLabels: Record<string, string> = {
  google: 'Google',
  facebook: 'Facebook',
  referral: 'Referral',
  'yard-sign': 'Yard Sign',
  other: 'Other',
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

export function estimateRequestSubject(data: EstimateRequest) {
  return `New estimate request — ${data.firstName} ${data.lastName} (${data.zip})`;
}

/** Plain-text version for mail clients that don't render HTML. */
export function estimateRequestText(data: EstimateRequest, submittedAt: string) {
  return [
    'NEW ESTIMATE REQUEST',
    `Submitted ${submittedAt}`,
    '',
    `Name: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Zip code: ${data.zip}`,
    `Heard about us: ${sourceLabels[data.howDidYouHear ?? ''] ?? 'Not specified'}`,
    '',
    'Project details:',
    data.project,
    '',
    '— Sent from the Construction Specialties website contact form. Reply to this email to respond to the customer.',
  ].join('\n');
}

/** Email-client-safe HTML (tables + inline styles). */
export function estimateRequestHtml(data: EstimateRequest, submittedAt: string) {
  const e = {
    name: escapeHtml(`${data.firstName} ${data.lastName}`),
    firstName: escapeHtml(data.firstName),
    email: escapeHtml(data.email),
    phone: escapeHtml(data.phone),
    zip: escapeHtml(data.zip),
    source: escapeHtml(sourceLabels[data.howDidYouHear ?? ''] ?? 'Not specified'),
    project: escapeHtml(data.project).replace(/\r?\n/g, '<br />'),
    submittedAt: escapeHtml(submittedAt),
  };

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #ECEAE5;width:150px;vertical-align:top;font:500 11px/1.4 'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:1.4px;text-transform:uppercase;color:#77736B;">${label}</td>
      <td style="padding:14px 0;border-bottom:1px solid #ECEAE5;vertical-align:top;font:15px/1.5 Helvetica,Arial,sans-serif;color:#141414;">${value}</td>
    </tr>`;

  const link = (href: string, text: string) =>
    `<a href="${href}" style="color:#141414;text-decoration:underline;text-decoration-color:#C8C4BB;">${text}</a>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>New estimate request</title>
</head>
<body style="margin:0;padding:0;background:#F4F2EE;">
  <div style="display:none;max-height:0;overflow:hidden;">${e.name} requested a free estimate (${e.zip}).</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F2EE;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid #E4E1DA;">
          <tr>
            <td style="background:#0F0F0F;padding:28px 36px;">
              <p style="margin:0;font:600 18px/1.2 Helvetica,Arial,sans-serif;color:#FFFFFF;letter-spacing:0.2px;">Construction Specialties</p>
              <p style="margin:6px 0 0;font:11px/1.4 'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:1.6px;text-transform:uppercase;color:#9A968E;">Roofing &amp; Construction</p>
            </td>
          </tr>
          <tr><td style="height:3px;background:#D1121B;line-height:3px;font-size:0;">&nbsp;</td></tr>
          <tr>
            <td style="padding:36px 36px 8px;">
              <p style="margin:0;font:500 11px/1.4 'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:1.6px;text-transform:uppercase;color:#D1121B;">New estimate request</p>
              <h1 style="margin:10px 0 0;font:600 26px/1.2 Helvetica,Arial,sans-serif;color:#141414;">${e.name}</h1>
              <p style="margin:8px 0 0;font:14px/1.5 Helvetica,Arial,sans-serif;color:#77736B;">Submitted ${e.submittedAt}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 36px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row('Email', link(`mailto:${e.email}`, e.email))}
                ${row('Phone', link(telHref(data.phone), e.phone))}
                ${row('Zip code', e.zip)}
                ${row('Heard about us', e.source)}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 36px 8px;">
              <p style="margin:0 0 10px;font:500 11px/1.4 'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:1.4px;text-transform:uppercase;color:#77736B;">Project details</p>
              <div style="padding:18px 20px;background:#F7F6F3;border-left:3px solid #D1121B;font:15px/1.6 Helvetica,Arial,sans-serif;color:#141414;">${e.project}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 36px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#D1121B;">
                    <a href="mailto:${e.email}?subject=${encodeURIComponent('Your estimate request — Construction Specialties')}" style="display:inline-block;padding:13px 22px;font:600 14px/1 Helvetica,Arial,sans-serif;color:#FFFFFF;text-decoration:none;">Reply to ${e.firstName}</a>
                  </td>
                  <td style="width:10px;"></td>
                  <td style="border:1px solid #141414;">
                    <a href="${telHref(data.phone)}" style="display:inline-block;padding:12px 22px;font:600 14px/1 Helvetica,Arial,sans-serif;color:#141414;text-decoration:none;">Call ${e.phone}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px;border-top:1px solid #ECEAE5;font:12px/1.6 Helvetica,Arial,sans-serif;color:#9A968E;">
              Sent from the contact form on the Construction Specialties website. Replying to this email goes straight to the customer.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
