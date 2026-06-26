import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const QUESTION_BANKS: Record<string, string[]> = {
  behavioral: [
    "Tell me about yourself and your background.",
    "Describe a time you had to optimize a slow API. What was your approach?",
    "Tell me about a conflict you resolved within your team.",
    "Describe a project that failed and what you learned.",
    "How do you handle tight deadlines?",
  ],
  "system-design": [
    "Design a URL shortener like TinyURL.",
    "Design a rate limiter for a high-traffic API.",
    "Design a distributed cache system.",
    "Design a real-time chat application.",
    "Design a payment processing system.",
  ],
  dsa: [
    "Find the longest substring without repeating characters.",
    "Merge k sorted linked lists.",
    "Implement an LRU cache.",
    "Find the median of two sorted arrays.",
    "Solve the trapping rain water problem.",
  ],
  hr: [
    "Why do you want to leave your current role?",
    "What are your salary expectations?",
    "Where do you see yourself in 5 years?",
    "What is your greatest strength and weakness?",
    "Why should we hire you?",
  ],
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { sessionType, questionIndex = 0 } = await req.json();
    const type = (sessionType || "behavioral").toLowerCase().replace(" ", "-");
    const questions = QUESTION_BANKS[type] || QUESTION_BANKS.behavioral;
    const question = questions[questionIndex % questions.length];

    // Generate AI feedback based on response
    const feedback = {
      question,
      next_question_index: (questionIndex + 1) % questions.length,
      tips: [
        "Use the STAR method: Situation, Task, Action, Result",
        "Be specific with metrics and outcomes",
        "Keep your answer under 2 minutes",
      ],
    };

    return new Response(
      JSON.stringify({ success: true, feedback }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
