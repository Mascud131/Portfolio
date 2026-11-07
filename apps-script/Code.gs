const RECIPIENT = 'mascud131@gmail.com';

/**
 * Handles portfolio contact form submissions.
 * Deploy as a web app that executes as the owner and accepts requests from anyone.
 */
function doPost(e) {
  const params = (e && e.parameter) || {};

  // Ignore submissions caught by the optional hidden honeypot field.
  if (params.website) {
    return jsonResponse({ ok: true });
  }

  const name = String(params.Name || '').trim().slice(0, 120);
  const senderEmail = String(params.Email || '').trim().slice(0, 254);
  const message = String(params.Message || '').trim().slice(0, 10000);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail) || !message) {
    return jsonResponse({ ok: false, error: 'Please complete all fields with a valid email.' });
  }

  // Prevent repeated submissions from the same address in a short interval.
  const cache = CacheService.getScriptCache();
  const cacheKey = 'contact-' + Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, senderEmail.toLowerCase())
  );
  if (cache.get(cacheKey)) {
    return jsonResponse({ ok: false, error: 'Please wait a few minutes before sending another message.' });
  }

  MailApp.sendEmail({
    to: RECIPIENT,
    replyTo: senderEmail,
    subject: 'Portfolio message from ' + name,
    body: 'Name: ' + name + '\nEmail: ' + senderEmail + '\n\nMessage:\n' + message
  });

  cache.put(cacheKey, '1', 300);
  return jsonResponse({ ok: true });
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
