export async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    // If secret key is not configured, warn and bypass for ease of local development
    console.warn("RECAPTCHA_SECRET_KEY is not configured in .env. Bypassing CAPTCHA check.");
    return true;
  }

  if (!token) return false;

  try {
    const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("reCAPTCHA validation error:", err);
    return false;
  }
}
