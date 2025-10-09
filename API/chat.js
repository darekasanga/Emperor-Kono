// api/chat.js  (Serverless function)
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { message } = req.body;
  if (!message)
    return res.status(400).json({ error: "Missing message" });

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an English tutor and translator." },
          { role: "user", content: message }
        ],
      }),
    });

    const data = await r.json();
    const text = data.choices?.[0]?.message?.content || "(no reply)";
    res.status(200).json({ reply: text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
