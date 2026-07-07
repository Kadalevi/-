const PROMPTS = {
  fr: (mood, text) => `Tu es le compagnon d'écriture bienveillant de l'application "Lueur", un journal intime pour des personnes qui se sentent isolées et qui ont parfois du mal à s'exprimer ou à se sentir comprises.

Une personne vient d'écrire cette entrée de journal${mood ? ` (humeur choisie : ${mood})` : ""} :
"""
${text}
"""

Réponds en français, en 3 à 5 phrases maximum, comme une présence chaleureuse et non-jugeante — jamais comme un thérapeute, jamais de diagnostic. Reflète ce que tu comprends de son ressenti avec ses propres mots reformulés, pose éventuellement une question douce. Ton chaleureux, simple, jamais mièvre.`,
  en: (mood, text) => `You are the caring writing companion for "Lueur", a private journal for people who feel isolated and sometimes struggle to express themselves or feel understood.

Someone just wrote this journal entry${mood ? ` (chosen mood: ${mood})` : ""}:
"""
${text}
"""

Reply in English, in 3 to 5 sentences maximum, as a warm, non-judgmental presence — never as a therapist, never a diagnosis. Reflect back what you understand of their feeling, optionally ask one gentle question. Warm, simple, never saccharine.`,
  es: (mood, text) => `Eres el compañero de escritura de "Lueur", un diario íntimo para personas que se sienten aisladas y a veces les cuesta expresarse o sentirse comprendidas.

Alguien acaba de escribir esta entrada${mood ? ` (estado de ánimo elegido: ${mood})` : ""}:
"""
${text}
"""

Responde en español, en 3 a 5 frases como máximo, con calidez y sin juicios — nunca como terapeuta, nunca un diagnóstico. Refleja lo que entiendes de su sentir y, si acaso, pregunta con suavidad. Tono cálido, simple, nunca cursi.`,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { lang = "fr", mood, text } = req.body || {};
  if (!text || typeof text !== "string" || text.length > 4000) {
    return res.status(400).json({ error: "Invalid entry" });
  }

  const buildPrompt = PROMPTS[lang] || PROMPTS.fr;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        messages: [{ role: "user", content: buildPrompt(mood, text) }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return res.status(502).json({ error: "Upstream error" });
    }

    const data = await response.json();
    const reflection = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return res.status(200).json({ reflection });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
}
