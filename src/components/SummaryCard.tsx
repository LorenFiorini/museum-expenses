type Props = {
  title: string;
  value: string;
  subtitle?: string;
};

export default function SummaryCard({ title, value, subtitle }: Props) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <strong>{value}</strong>
      {subtitle ? <div style={{ color: "#475569", marginTop: 4 }}>{subtitle}</div> : null}
    </div>
  );
}

