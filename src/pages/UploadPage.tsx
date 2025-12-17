import { useState } from "react";
import FileDrop from "../components/FileDrop";
import { useDataContext } from "../state/DataContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const { setData, clearData } = useDataContext();
  const navigate = useNavigate();
   const { token } = useAuth();

  const handleSubmit = async () => {
    if (!token) {
      navigate("/login", { replace: true, state: { from: "/upload" } });
      return;
    }

    setBusy(true);
    setError(null);
    setWarnings([]);
    try {
      const form = new FormData();
      files.forEach((file) => form.append("files", file));

      const res = await fetch("http://localhost:4000/api/files/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      const body = (await res.json().catch(() => ({}))) as {
        message?: string;
        payload?: { expenses: unknown[]; gifts: unknown[] };
        warnings?: string[];
      };

      if (!res.ok || !body.payload) {
        throw new Error(body.message || "Upload failed");
      }

      setWarnings(body.warnings || []);
      setData(body.payload as any);
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <h2>Upload spreadsheets</h2>
        <p style={{ color: "#475569" }}>
          Drop the two XLSX files (Expenses, Gifts &amp; Hospitality). We&apos;ll validate the
          expected columns and parse them for the dashboard.
        </p>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <FileDrop
            label="Expenses (Trustee & Directors Expenses 2024-25.xlsx)"
            accept=".xlsx"
            onFiles={(picked) => setFiles((prev) => [...prev.filter((f) => f !== picked[0]), ...picked])}
          />
          <FileDrop
            label="Gifts & Hospitality (Trustee & Directors Gifts & Hospitality 2024-25.xlsx)"
            accept=".xlsx"
            onFiles={(picked) => setFiles((prev) => [...prev.filter((f) => f !== picked[0]), ...picked])}
          />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button className="btn" onClick={handleSubmit} disabled={!files.length || busy}>
            {busy ? "Parsing..." : "Parse & view dashboard"}
          </button>
          <button className="btn secondary" onClick={clearData} type="button">
            Clear stored data
          </button>
        </div>
        {error ? <div className="error">{error}</div> : null}
        {warnings.length ? (
          <div style={{ marginTop: 8, color: "#d97706" }}>
            {warnings.map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>
        ) : null}
        {files.length ? (
          <div style={{ marginTop: 12 }}>
            <strong>Selected files:</strong>
            <div className="chips">
              {files.map((f) => (
                <span className="chip" key={f.name}>
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}


