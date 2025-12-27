import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { TrendPoint } from "../types";

type Props = {
  title: string;
  data: TrendPoint[];
  color?: string;
};

export default function SimpleAreaChart({ title, data, color = "#0ea5e9" }: Props) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke={color} fill="url(#areaColor)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}




