import { useEffect, useState } from "react";
import { useAuth } from "../state/AuthContext";

type FileItem = {
  _id: string;
  originalName: string;
  fileType: "expenses" | "gifts" | "unknown";
  uploadedAt: string;
};

type FileWithData = FileItem & {
  parsedData?: unknown;
};

type ParsedPayload = {
  expenses: unknown[];
  gifts: unknown[];
};

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:4000/api/files", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { message?: string };
          throw new Error(body.message || "Failed to load files");
        }
        const data = (await res.json()) as FileItem[];
        setFiles(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [token]);

  const handleUseInDashboard = async (fileId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:4000/api/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(body.message || "Failed to load file");
      }
      const data = (await res.json()) as FileWithData;
      if (!data.parsedData) return;
      // For now this just logs; DataContext integration can hook here if needed.
      // eslint-disable-next-line no-console
      console.log("Parsed data for reuse", data.parsedData);
      alert("File loaded. Hook this into DataContext.setData to reuse in dashboard.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <h2>Your uploads</h2>
        <p style={{ color: "#475569" }}>
          Signed in as <strong>{user?.email}</strong>. Browse files you&apos;ve previously
          uploaded and reuse them.
        </p>
        {loading && <p>Loading files...</p>}
        {error && <div className="error">{error}</div>}
        {!loading && !files.length && (
          <p style={{ marginTop: 12 }}>You haven&apos;t uploaded any files yet.</p>
        )}
        {files.length ? (
          <div className="table-wrapper" style={{ marginTop: 16 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Uploaded</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file._id}>
                    <td>{file.originalName}</td>
                    <td>{file.fileType}</td>
                    <td>{new Date(file.uploadedAt).toLocaleString()}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn secondary"
                        type="button"
                        onClick={() => handleUseInDashboard(file._id)}
                      >
                        Use in dashboard
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}


