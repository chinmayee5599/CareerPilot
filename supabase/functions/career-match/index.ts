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
    const { skills, experience, targetRole } = await req.json();

    const companies = [
      { company: "Google", role: "Senior Software Engineer — Backend", location: "Bangalore, IN", salary_range: "₹52–68L", match: 91, skills_matched: ["Python", "Distributed Systems"], skills_missing: ["Kubernetes"], color: "#3b82f6", letter: "G" },
      { company: "Stripe", role: "Staff Engineer — Payments Platform", location: "Remote", salary_range: "₹70–90L", match: 87, skills_matched: ["Go", "Ruby"], skills_missing: ["gRPC"], color: "#7c6bff", letter: "S" },
      { company: "Atlassian", role: "Senior Backend Engineer", location: "Sydney / Remote", salary_range: "₹58–75L", match: 79, skills_matched: ["Java"], skills_missing: ["Kafka", "Terraform"], color: "#f59e0b", letter: "A" },
      { company: "Uber", role: "Engineering Lead — Backend", location: "Bangalore", salary_range: "₹60–85L", match: 74, skills_matched: ["Python"], skills_missing: ["Leadership", "OKRs"], color: "#22c55e", letter: "U" },
      { company: "Microsoft", role: "Principal Engineer", location: "Hyderabad", salary_range: "₹65–95L", match: 68, skills_matched: ["Azure"], skills_missing: ["C#", "ML Infra"], color: "#ec4899", letter: "M" },
      { company: "Flipkart", role: "Senior SWE — Infrastructure", location: "Bangalore", salary_range: "₹40–55L", match: 63, skills_matched: ["Python"], skills_missing: ["Infra-as-Code"], color: "#3b82f6", letter: "F" },
    ];

    const matches = companies.map(c => ({
      company: c.company,
      role: c.role,
      location: c.location,
      salary_range: c.salary_range,
      match_pct: c.match,
      skills_matched: c.skills_matched,
      skills_missing: c.skills_missing,
      logo_color: c.color,
      logo_letter: c.letter,
      is_new: Math.random() > 0.5,
    }));

    return new Response(
      JSON.stringify({ success: true, matches }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
