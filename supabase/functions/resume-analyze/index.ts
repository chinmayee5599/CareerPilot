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
    const { resumeText, targetRole } = await req.json();

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: "Resume text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // AI-powered resume analysis simulation
    // In production, this would call OpenAI/Anthropic API
    const analysis = {
      ats_compatibility: Math.floor(70 + Math.random() * 25),
      keyword_density: Math.floor(60 + Math.random() * 30),
      impact_statements: Math.floor(65 + Math.random() * 25),
      readability: Math.floor(75 + Math.random() * 20),
      format_structure: Math.floor(70 + Math.random() * 25),
      grammar_spelling: Math.floor(85 + Math.random() * 15),
      overall_score: 0,
      issues: [
        {
          type: "error",
          title: "Missing quantified impact",
          message: "3 bullet points lack metrics. Add numbers like improved latency by 40%"
        },
        {
          type: "warning",
          title: `Keyword gap: ${targetRole ? 'relevant skills' : 'Kubernetes'}`,
          message: "High-frequency keyword in target JDs. Add relevant experience."
        },
        {
          type: "info",
          title: "Summary section too vague",
          message: "Make it specific to target role. Mention years of experience and key tech."
        },
        {
          type: "success",
          title: "Strong action verbs",
          message: "Great use of Architected, Optimized, Led throughout experience section."
        }
      ],
      keywords_present: ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis", "REST APIs", "Microservices", "Git"],
      keywords_missing: ["Kubernetes", "gRPC", "Terraform", "Kafka", "Prometheus"],
      ai_suggestions: [
        {
          original: "Worked on backend services to make them faster",
          suggested: "Architected and optimized 6 high-traffic microservices, reducing average API latency by 43% (P99: 120ms to 68ms) serving 2M+ daily requests"
        }
      ]
    };

    analysis.overall_score = Math.round(
      (analysis.ats_compatibility + analysis.keyword_density + analysis.impact_statements +
       analysis.readability + analysis.format_structure + analysis.grammar_spelling) / 6
    );

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
