// server.js
// Minimal backend that safely proxies chat messages to the Anthropic API.
// Your API key stays here on the server — it never reaches the browser.

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());              // allows your portfolio site to call this server
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = "claude-sonnet-5";

app.post("/api/chat", async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message || typeof message !== "string") {
            return res.status(400).json({ error: "Missing 'message' string in request body." });
        }

        const messages = [
            ...history, // [{role: "user"|"assistant", content: "..."}]
            { role: "user", content: message }
        ];

        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 500,
                system: "You are a friendly assistant on Vily Jhon Amen's portfolio website. Answer questions about his projects, skills, and background helpfully and briefly.",
                messages: messages
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Anthropic API error:", data);
            return res.status(response.status).json({ error: data.error?.message || "API request failed." });
        }

        const reply = data.content?.[0]?.text || "Sorry, I couldn't generate a response.";
        res.json({ reply });

    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Something went wrong on the server." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI backend running on port ${PORT}`));


