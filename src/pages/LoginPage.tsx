import { FormEvent, useState } from "react";
import { useAuth } from "../state/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

type AuthResponse = {
  token: string;
  user: { id: string; email: string };
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/20c33166-aba8-40eb-bbfa-5cc347b1fc58", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "pre-fix",
          hypothesisId: "H1",
          location: "src/pages/LoginPage.tsx:handleSubmit:beforeFetch",
          message: "Submitting auth form",
          data: { mode, emailLength: email.length },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion

      const res = await fetch(
        `http://localhost:4000/api/auth/${mode === "login" ? "login" : "register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      if (!res.ok) {
        // #region agent log
        fetch("http://127.0.0.1:7242/ingest/20c33166-aba8-40eb-bbfa-5cc347b1fc58", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "pre-fix",
            hypothesisId: "H2",
            location: "src/pages/LoginPage.tsx:handleSubmit:nonOk",
            message: "Auth response not ok",
            data: { status: res.status },
            timestamp: Date.now()
          })
        }).catch(() => {});
        // #endregion
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(body.message || "Authentication failed");
      }

      const data = (await res.json()) as AuthResponse;
      login(data.token, data.user);

      const redirectTo = location.state?.from || "/upload";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/20c33166-aba8-40eb-bbfa-5cc347b1fc58", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "pre-fix",
          hypothesisId: "H3",
          location: "src/pages/LoginPage.tsx:handleSubmit:catch",
          message: "Auth request threw error",
          data: { errorMessage: (err as Error).message },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h2>{mode === "login" ? "Log in" : "Create an account"}</h2>
        <p style={{ color: "#475569", marginBottom: 16 }}>
          Use your email and a password to access your saved uploads.
        </p>
        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? <div className="error" style={{ marginTop: 8 }}>{error}</div> : null}
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Submitting..." : mode === "login" ? "Log in" : "Register"}
          </button>
        </form>
        <div style={{ marginTop: 16, fontSize: 14 }}>
          {mode === "login" ? (
            <>
              Need an account?{" "}
              <button
                type="button"
                className="link-button"
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" className="link-button" onClick={() => setMode("login")}>
                Log in
              </button>
            </>
          )}
        </div>
        <div style={{ marginTop: 16, fontSize: 14 }}>
          <Link to="/">Back to home</Link>
        </div>
      </section>
    </div>
  );
}


