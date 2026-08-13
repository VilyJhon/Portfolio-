
      // =========================
    // BUTTON SCROLL
    // =========================

    function scrollToSection(sectionId) {
        document.getElementById(sectionId).scrollIntoView({
            behavior: "smooth"
        });
    }
      // =========================
// CONTACT BUTTON
// =========================

function showMessage() {

    document.getElementById("message").innerHTML =
        "⚡ Thanks for visiting my portfolio!";
}
      // =========================
// NAVBAR SCROLL EFFECT
// =========================

window.addEventListener("scroll", function () {

    const nav = document.querySelector("nav");

    if (window.scrollY > 50) {nav.style.boxShadow =
            "0 0 15px rgba(0, 255, 255, 0.2)";

    } else {

        nav.style.boxShadow = "none";
    }
    });

        
  //to=========================
// THEME SWITCH (dark <-> light)
// =========================

function toggleTheme() {

    document.body.classList.toggle("light-mode");

}
// =========================
// AI CHATBOT
// =========================

// Change this to your deployed backend URL (e.g. "https://your-backend.onrender.com/api/chat")
const CHAT_API_URL = "https://your-worker-name.your-subdomain.workers.dev";

let chatHistory = [];

function toggleChat() {
    document.getElementById("chat-window").classList.toggle("open");
}

async function sendChatMessage() {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();
    if (!message) return;

    addChatBubble(message, "user");
    input.value = "";

    const typingBubble = addChatBubble("...", "bot");

    try {
        const response = await fetch(CHAT_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, history: chatHistory })
        });

        const data = await response.json();

        if (!response.ok) {
            typingBubble.textContent = "⚠️ " + (data.error || "Something went wrong.");
            return;
        }

        typingBubble.textContent = data.reply;

        chatHistory.push({ role: "user", content: message });
        chatHistory.push({ role: "assistant", content: data.reply });

    } catch (err) {
        typingBubble.textContent = "⚠️ Couldn't reach the AI server.";
        console.error(err);
    }
}

function addChatBubble(text, sender) {
    const messages = document.getElementById("chat-messages");
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble " + sender;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
}

document.getElementById("chat-input")?.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendChatMessage();
});


