const express = require("express"); // đŸ‘ˆ THĂM DĂ’NG NĂ€Y
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

dotenv.config();
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://127.0.0.1:5500"
}));
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("âŒ Lá»—i tá»« Groq:", errorText);
      return res.status(response.status).json({ error: "Lá»—i tá»« Groq", detail: errorText });
    }

    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error("âŒ Lá»—i khi gá»i Groq:", err);
    res.status(500).json({ error: "Lá»—i server", detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`âœ… Server Ä‘ang cháº¡y táº¡i http://localhost:${PORT}`);
});
