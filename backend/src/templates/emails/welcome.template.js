export const welcomeEmailHtml = ({ name, appName, ctaUrl, year }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ${appName}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#333333;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 16px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#4f46e5,#7c3aed); padding:36px 24px;">
              <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight:700; letter-spacing:0.5px;">
                🔐 ${appName}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 24px 40px;">
              <h2 style="margin:0 0 16px 0; font-size:22px; color:#1a1a1a;">
                Welcome aboard, ${name}! 👋
              </h2>
              <p style="margin:0 0 16px 0; font-size:15px; line-height:1.6; color:#4a4a4a;">
                Thanks for signing up for <strong>${appName}</strong>. Your account has been successfully created, and you're all set to get started.
              </p>

              <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#4a4a4a;">
                Here's what you can do next:
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:8px 0; font-size:15px; color:#4a4a4a;">
                    <span style="color:#4f46e5; font-weight:700;">✓</span>&nbsp; Sign in securely with your email or Google account
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-size:15px; color:#4a4a4a;">
                    <span style="color:#4f46e5; font-weight:700;">✓</span>&nbsp; Access your personalized dashboard
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-size:15px; color:#4a4a4a;">
                    <span style="color:#4f46e5; font-weight:700;">✓</span>&nbsp; Manage your profile and account settings
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 8px auto;">
                <tr>
                  <td align="center" style="border-radius:8px; background-color:#4f46e5;">
                    <a href="${ctaUrl}" target="_blank"
                       style="display:inline-block; padding:14px 36px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:8px;">
                      Get Started
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none; border-top:1px solid #eeeeee; margin:24px 0;" />
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 36px 40px;">
              <p style="margin:0 0 8px 0; font-size:13px; line-height:1.6; color:#888888;">
                If you have any questions, just reply to this email — we're happy to help.
              </p>
              <p style="margin:0; font-size:13px; line-height:1.6; color:#888888;">
                Cheers,<br/>
                <strong style="color:#1a1a1a;">The ${appName} Team</strong>
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

export const welcomeEmailText = ({ name, appName, ctaUrl }) => `Welcome to ${appName}, ${name}!

Your account has been successfully created. Visit ${ctaUrl} to get started.

Cheers,
The ${appName} Team`;