type Column<T> = { key: keyof T; label: string };

type Props<T> = {
  title: string;
  columns: Column<T>[];
  rows: T[];
  maxRows?: number;
};

export default function DataTable<T extends Record<string, unknown>>({
  title,
  columns,
  rows,
  maxRows = 15
}: Props<T>) {
  const limited = rows.slice(0, maxRows);
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {limited.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={String(col.key)}>{String(row[col.key] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > limited.length ? (
        <div style={{ marginTop: 8, color: "#475569" }}>
          Showing {limited.length} of {rows.length} rows
        </div>
      ) : null}
    </div>
  );
}

