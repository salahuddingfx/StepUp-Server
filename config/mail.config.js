const parseEmailFrom = (emailFrom) => {
  const match = emailFrom ? emailFrom.match(/^(.*?)\s*<(.*?)>$/) : null;
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { name: 'English StepUp', email: emailFrom || 'noreply@englishstepup.com' };
};

const sendHttpRequest = async (url, options) => {
  if (typeof fetch !== 'undefined') {
    return fetch(url, options);
  }
  
  // Fallback to native https module if global fetch is not available (Node < 18)
  const https = require('https');
  const urlObj = new URL(url);
  const requestOptions = {
    method: options.method,
    hostname: urlObj.hostname,
    path: urlObj.pathname + urlObj.search,
    headers: options.headers
  };

  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          json: async () => {
            try {
              return JSON.parse(responseBody);
            } catch (e) {
              return { message: responseBody };
            }
          }
        });
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
};

const sendWithBrevo = async (data) => {
  const apiKey = process.env.BREVO_API_KEY;
  const isConfigured = apiKey && apiKey !== 'your_brevo_api_key';

  if (!isConfigured) {
    console.warn('Brevo API key is not configured. Emails will be logged to console in development.');
    console.log('--- MOCK EMAIL SENT (BREVO) ---');
    console.log(`To: ${data.to}`);
    console.log(`Subject: ${data.subject}`);
    console.log(`HTML: ${data.html}`);
    console.log('------------------------');
    return { data: { id: 'mock-email-id-' + Date.now() }, error: null };
  }

  try {
    const sender = parseEmailFrom(data.from || process.env.EMAIL_FROM);
    
    // Support single email string or array of emails
    const toEmails = Array.isArray(data.to) 
      ? data.to.map(email => ({ email }))
      : [{ email: data.to }];

    const response = await sendHttpRequest('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sender,
        to: toEmails,
        subject: data.subject,
        htmlContent: data.html
      })
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || `Brevo API returned status ${response.status}`);
    }

    return { data: { id: resData.messageId }, error: null };
  } catch (error) {
    console.error('Brevo Email sending error:', error);
    return { data: null, error };
  }
};

module.exports = {
  emails: {
    send: sendWithBrevo
  }
};
