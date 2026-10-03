export const resetPasswordEmailHtml = ({ resetUrl, appName, year }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your ${appName} password</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#333333;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 16px rgba(0,0,0,0.06);">

          <tr>
            <td align="center" style="background:linear-gradient(135deg,#4f46e5,#7c3aed); padding:32px 24px;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700;">🔐 ${appName}</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 40px 24px 40px;">
              <h2 style="margin:0 0 16px 0; font-size:22px; color:#1a1a1a;">Password Reset Request</h2>
              <p style="margin:0 0 16px 0; font-size:15px; line-height:1.6; color:#4a4a4a;">
                We received a request to reset the password for your <strong>${appName}</strong> account.
                Click the button below to choose a new password.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
                <tr>
                  <td align="center" style="border-radius:8px; background-color:#4f46e5;">
                    <a href="${resetUrl}" target="_blank"
                       style="display:inline-block; padding:14px 36px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:8px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0; font-size:14px; line-height:1.6; color:#888888;">
                ⏱️ This link will expire in <strong>1 hour</strong>.
              </p>
              <p style="margin:0; font-size:14px; line-height:1.6; color:#888888;">
                If you didn't request this, you can safely ignore this email — your password won't change.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none; border-top:1px solid #eeeeee; margin:24px 0;" />
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 32px 40px;">
              <p style="margin:0; font-size:12px; line-height:1.6; color:#999999;">
                If the button doesn't work, copy and paste this URL into your browser:<br/>
                <a href="${resetUrl}" style="color:#4f46e5; word-break:break-all;">${resetUrl}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="background-color:#fafafa; padding:20px; font-size:12px; color:#999999;">
              © ${year} ${appName}. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const resetPasswordEmailText = ({ resetUrl, appName }) => `
Password Reset Request — ${appName}

We received a request to reset your password.

Open this link to choose a new password (expires in 1 hour):
${resetUrl}

If you didn't request this, ignore this email.

— The ${appName} Team
`;