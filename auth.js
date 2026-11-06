
try { document.documentElement.setAttribute("data-bs-theme", localStorage.getItem("theme") || "light"); } catch (e) { }
const cfg = window.APP_CONFIG;
const configured = cfg.SUPABASE_URL.startsWith("https://") && !cfg.SUPABASE_ANON_KEY.startsWith("PASTE");
const db = configured ? supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

function goLogin(reason) { location.replace("index.html?reason=" + encodeURIComponent(reason)); }

// Call at the top of every protected page. Pass "owner" for owner-only pages.
async function requireAuth(role) {
  if (!configured) { goLogin("Supabase is not connected. Check js/config.js."); return null; }
  const { data: { session } } = await db.auth.getSession();
  if (!session) { goLogin("You are not signed in. Please sign in."); return null; }
  const { data: p, error } = await db.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
  if (error) { goLogin("Signed in, but the database returned an error: " + error.message + ". Make sure 01_schema.sql was run in Supabase."); return null; }
  if (!p) { goLogin("Signed in, but no profile exists for this account. It was probably created before 01_schema.sql was run. See the fix below the form."); return null; }
  if (!p.is_active) { await db.auth.signOut(); goLogin("This account is waiting for the owner's approval, or has been disabled. Please ask the owner."); return null; }
  if (role === "owner" && p.role !== "owner") { location.replace("dashboard.html"); return null; }
  return p;
}

async function logout() { await db.auth.signOut(); location.replace("index.html"); }