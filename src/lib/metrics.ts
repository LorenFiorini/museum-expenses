import { BreakdownSlice, ExpenseEntry, GiftEntry, TrendPoint } from "../types";

export type ExpenseMetrics = {
  totalSpend: number;
  avgPerClaim: number;
  avgPerPerson: number;
  topDestinations: BreakdownSlice[];
  trendByEntry: TrendPoint[];
};

export type GiftMetrics = {
  totalGifts: number;
  totalValue: number;
  avgValue: number;
  acceptedRate: number;
  trendByEntry: TrendPoint[];
  topOrganisations: BreakdownSlice[];
};

function sum(values: number[]) {
  return values.reduce((acc, v) => acc + v, 0);
}

function groupSum<T>(
  items: T[],
  key: (item: T) => string,
  value: (item: T) => number
): BreakdownSlice[] {
  const map = new Map<string, number>();
  items.forEach((item) => {
    const k = key(item) || "Unknown";
    map.set(k, (map.get(k) ?? 0) + value(item));
  });
  return Array.from(map.entries())
    .map(([label, v]) => ({ label, value: v }))
    .sort((a, b) => b.value - a.value);
}

export function computeExpenseMetrics(expenses: ExpenseEntry[]): ExpenseMetrics {
  const totalSpend = sum(expenses.map((e) => e.total));
  const avgPerClaim = expenses.length ? totalSpend / expenses.length : 0;
  const uniquePeople = new Set(expenses.map((e) => e.name || "Unknown")).size || 1;
  const avgPerPerson = totalSpend / uniquePeople;

  const topDestinations = groupSum(
    expenses,
    (e) => e.destination,
    (e) => e.total
  ).slice(0, 5);

  const trendByEntry: TrendPoint[] = expenses.map((e, idx) => ({
    label: `#${idx + 1}`,
    value: e.total
  }));

  return { totalSpend, avgPerClaim, avgPerPerson, topDestinations, trendByEntry };
}

export function computeGiftMetrics(gifts: GiftEntry[]): GiftMetrics {
  const totalGifts = gifts.length;
  const totalValue = sum(gifts.map((g) => g.estimatedValue));
  const avgValue = totalGifts ? totalValue / totalGifts : 0;
  const acceptedRate =
    totalGifts === 0
      ? 0
      : (gifts.filter((g) => g.accepted.toLowerCase().includes("accept")).length /
          totalGifts) *
        100;

  const trendByEntry: TrendPoint[] = gifts.map((g, idx) => ({
    label: `#${idx + 1}`,
    value: g.estimatedValue
  }));

  const topOrganisations = groupSum(
    gifts,
    (g) => g.organisation,
    (g) => g.estimatedValue
  ).slice(0, 5);

  return { totalGifts, totalValue, avgValue, acceptedRate, trendByEntry, topOrganisations };
}






