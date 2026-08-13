// worker.js
// Paste this into a Cloudflare Worker (dashboard.cloudflare.com > Workers > Create).
// No npm, no package.json, no local server needed.

export default {
  async fetch(request, env) {

    // Allow your portfolio site to call this Worker
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const { message, history = [] } = await request.json();

      if (!message) {
        return new Response(JSON.stringify({ error: "Missing message" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const messages = [...history, { role: "user", content: message }];

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,   // set as a Worker secret, not in this file
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-5",
          max_tokens: 500,
          system: "You are a friendly assistant on Vily Jhon Amen's portfolio website. Answer questions about his projects, skills, and background helpfully and briefly.",
          messages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return new Response(JSON.stringify({ error: data.error?.message || "API error" }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const reply = data.content?.[0]?.text || "Sorry, no response.";

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};