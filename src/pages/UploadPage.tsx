import { useState } from "react";
import FileDrop from "../components/FileDrop";
import { parseWorkbook } from "@/lib/parser";
import { useDataContext } from "../state/DataContext";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const { setData, clearData } = useDataContext();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setBusy(true);
    setError(null);
    setWarnings([]);
    const result = await parseWorkbook(files);
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setWarnings(result.warnings);
    setData(result.data);
    navigate("/dashboard");
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

