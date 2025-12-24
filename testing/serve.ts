import { serve } from "bun";

const file = Bun.file("./testing/dashboard.html");

serve({
  fetch(req) {
    return new Response(file, {
      headers: { "Content-Type": "text/html" },
    });
  },
  port: 3001,
});

console.log("📊 Dashboard server running at http://localhost:3001");
