import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BreakdownSlice } from "../types";

type Props = {
  title: string;
  data: BreakdownSlice[];
  color?: string;
};

export default function BarBreakdown({ title, data, color = "#22c55e" }: Props) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}




