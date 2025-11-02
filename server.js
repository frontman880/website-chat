const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const path = require("path");

dotenv.config();
const app = express();

// CORS - allow all requests
app.use(cors());

// Serve static files (AI.html, style.css, etc.) from project root
app.use(express.static(__dirname));
app.use(express.json());

// Optional: serve AI.html at root so visiting / in browser returns the UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'AI.html'));
});

app.post("/chat", async (req, res) => {
  const { messages } = req.body;
  console.log("📨 Nhận được tin nhắn:", messages);

  try {
    console.log("🔑 Đang gọi Groq API với key:", process.env.GROQ_API_KEY ? "Có key" : "Không có key");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama2-70b-4096",
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Lỗi từ Groq. Status:", response.status);
      console.error("❌ Chi tiết:", errorText);
      return res.status(response.status).json({ error: "Lỗi từ Groq", detail: errorText });
    }

    console.log("✅ Groq trả lời thành công");
    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error("❌ Lỗi khi gọi Groq:", err);
    res.status(500).json({ error: "Lỗi server", detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});