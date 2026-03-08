/**
 * Professional Email Template Wrapper
 * Designed for SOEIT Achievement Portal
 * Styles: Corporate, Academic, Professional
 */
const getEmailTemplate = ({ title, preheader, content, actionUrl, actionText, footerText }) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f1f5f9; padding-bottom: 40px; }
        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; font-family: sans-serif; color: #1e293b; border-radius: 8px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #002147; padding: 40px 20px; text-align: center; }
        .logo-text { color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 2px; margin: 0; }
        .department-text { color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 20px; }
        .p { font-size: 16px; color: #334155; margin-bottom: 20px; }
        .button-container { text-align: center; margin: 35px 0; }
        .button { background-color: #002147; color: #ffffff !important; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px; display: inline-block; transition: background 0.3s; }
        .footer { padding: 30px; text-align: center; color: #64748b; font-size: 13px; }
        .divider { border-top: 1px solid #e2e8f0; margin: 30px 0; }
        .social-links { margin-bottom: 15px; }
        .social-links a { color: #002147; margin: 0 10px; text-decoration: none; font-weight: 600; }
        
        /* Status Badges */
        .badge { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: 700; font-size: 12px; text-transform: uppercase; }
        .badge-success { background-color: #dcfce7; color: #166534; }
        .badge-error { background-color: #fee2e2; color: #991b1b; }
        .badge-info { background-color: #e0f2fe; color: #075985; }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main">
            <tr>
                <td class="header">
                    <div style="margin-bottom: 20px;">
                        <img src="${process.env.CLIENT_URL || 'https://soeit-acheivement-portal.vercel.app'}/aju-logo.png" alt="AJU Logo" style="width: 160px; height: auto; display: inline-block; background-color: white; padding: 10px; border-radius: 8px;">
                    </div>
                    <div>
                        <p class="logo-text">SOEIT</p>
                        <p class="department-text">Achievement & Registry Portal</p>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="content">
                    ${content}
                    
                    ${actionUrl ? `
                    <div class="button-container">
                        <a href="${actionUrl}" class="button">${actionText || 'Visit Portal'}</a>
                    </div>
                    ` : ''}
                    
                    <div class="divider"></div>
                    
                    <p class="p" style="font-size: 14px; color: #64748b; margin-bottom: 0;">
                        Best Regards,<br>
                        <strong>Registry Department</strong><br>
                        School of Engineering & IT (SOEIT)
                    </p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p style="margin-bottom: 10px;">Arka Jain University, Jamshedpur</p>
                    <p>${footerText || 'This is an official communication regarding your academic registry records.'}</p>
                    <p style="font-size: 11px; margin-top: 20px; opacity: 0.6;">© ${new Date().getFullYear()} SOEIT Portal. All rights reserved.</p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
    `;
};

module.exports = getEmailTemplate;
