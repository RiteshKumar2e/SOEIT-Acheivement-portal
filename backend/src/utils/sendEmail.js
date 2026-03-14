/**
 * High-Performance Email Service using Brevo (Sendinblue) Direct API
 * Replaces SMTP for better reliability and performance.
 */
const sendEmail = async (options) => {
    try {
        const apiKey = process.env.BREVO_API_KEY;
        if (!apiKey) {
            console.warn('❌ [BREVO] API Key missing. Skipping email send.');
            console.log('--- MAIL SIMULATION ---');
            console.log('To:', options.to);
            console.log('Subject:', options.subject);
            return;
        }

        const url = 'https://api.brevo.com/v3/smtp/email';

        // Handle multiple recipients (comma-separated string)
        const recipientList = options.to ? options.to.split(',').map(email => ({ email: email.trim() })) : [];
        if (recipientList.length === 0) return;

        const isMulti = recipientList.length > 1;

        const body = {
            sender: {
                name: process.env.FROM_NAME || 'SOEIT Portal',
                email: process.env.FROM_EMAIL || 'ritesh221403@arkajainuniversity.ac.in'
            },
            subject: options.subject,
            htmlContent: options.html,
            textContent: options.message || 'Please view this email in an HTML-capable viewer.'
        };

        // If multi-recipient (events/notices), use BCC for privacy and deliverability
        if (isMulti) {
            body.to = [{ email: process.env.FROM_EMAIL || 'ritesh221403@arkajainuniversity.ac.in' }]; // Send to self as primary
            body.bcc = recipientList;
        } else {
            body.to = recipientList;
        }

        console.log(`🚀 [BREVO] Dispatching: "${options.subject}" to ${recipientList.length} recipients...`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ [BREVO] Successfully sent. Message ID:', data.messageId);
        } else {
            console.error('❌ [BREVO] Dispatch Failed:', data.code || 'Unknown Error');
            console.error('🔍 [BREVO] API Response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('❌ [BREVO] Fatal API Error:', error.message);
    }
};

module.exports = sendEmail;
