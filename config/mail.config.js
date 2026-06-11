const { Resend } = require('resend');

let resend;
if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('re_123')) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('Resend API key is a placeholder or not provided. Emails will be logged to console in development.');
  resend = {
    emails: {
      send: async (data) => {
        console.log('--- MOCK EMAIL SENT ---');
        console.log(`To: ${data.to}`);
        console.log(`Subject: ${data.subject}`);
        console.log(`HTML: ${data.html}`);
        console.log('------------------------');
        return { data: { id: 'mock-email-id-' + Date.now() }, error: null };
      }
    }
  };
}

module.exports = resend;
