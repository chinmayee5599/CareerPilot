import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();

    // Simple AI response simulation
    // In production, this would call OpenAI/Claude API
    const responses: Record<string, string> = {
      resume: "I can help you improve your resume. Focus on quantifying your impact with metrics, using strong action verbs, and matching keywords from the job description.",
      interview: "For interview prep, practice the STAR method for behavioral questions. For technical rounds, focus on explaining your thought process clearly.",
      career: "Based on your skills, I recommend targeting Senior Backend Engineer roles at product companies. Your Python and distributed systems experience is a strong match.",
      default: "I am your AI career coach. I can help with resume optimization, interview preparation, career matching, and learning roadmaps. What would you like to work on?",
    };

    const lowerMsg = message.toLowerCase();
    let response = responses.default;
    if (lowerMsg.includes("resume") || lowerMsg.includes("cv")) response = responses.resume;
    else if (lowerMsg.includes("interview")) response = responses.interview;
    else if (lowerMsg.includes("career") || lowerMsg.includes("job")) response = responses.career;

    return new Response(
      JSON.stringify({ success: true, response }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
