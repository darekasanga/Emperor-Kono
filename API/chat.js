// Vercel Serverless Function (Node 18+)
// Path: /api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing message" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set" });
  }

  // Gentle, calm tutor tone (matches your app’s vibe)
  const systemPrompt = [
    "You are a calm, gentle assistant.",
    "Listen first; answer briefly and clearly.",
    "Keep a soft rhythm. Avoid harsh words.",
    "If user asks English help, correct kindly and explain simply."
  ].join(" ");

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(r.status).json({ error: txt });
    }

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content ?? "(no reply)";
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
}
