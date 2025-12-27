import SummaryCard from "../components/SummaryCard";
import SimpleAreaChart from "../components/SimpleAreaChart";
import BarBreakdown from "../components/BarBreakdown";
import DataTable from "../components/DataTable";
import { computeExpenseMetrics, computeGiftMetrics } from "../lib/metrics";
import { useDataContext } from "../state/DataContext";

export default function DashboardPage() {
  const { expenses, gifts } = useDataContext();
  const expenseMetrics = computeExpenseMetrics(expenses);
  const giftMetrics = computeGiftMetrics(gifts);

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="section">
        <h2>Expenses overview</h2>
        <div className="grid cards">
          <SummaryCard title="Total spend" value={`£${expenseMetrics.totalSpend.toFixed(2)}`} />
          <SummaryCard title="Avg per claim" value={`£${expenseMetrics.avgPerClaim.toFixed(2)}`} />
          <SummaryCard title="Avg per person" value={`£${expenseMetrics.avgPerPerson.toFixed(2)}`} />
          <SummaryCard title="Claims counted" value={String(expenses.length)} />
        </div>
        <div className="grid" style={{ gridTemplateColumns: "2fr 1.3fr", gap: 16, marginTop: 16 }}>
          <SimpleAreaChart title="Claim totals over entries" data={expenseMetrics.trendByEntry} />
          <BarBreakdown title="Top destinations by spend" data={expenseMetrics.topDestinations} />
        </div>
        <div className="section">
          <DataTable
            title="Latest expense rows"
            columns={[
              { key: "name", label: "Name" },
              { key: "dates", label: "Dates" },
              { key: "destination", label: "Destination" },
              { key: "purpose", label: "Purpose" },
              { key: "total", label: "Total" }
            ]}
            rows={expenses}
            maxRows={12}
          />
        </div>
      </section>

      <section className="section">
        <h2>Gifts & hospitality overview</h2>
        <div className="grid cards">
          <SummaryCard title="Total declared" value={String(giftMetrics.totalGifts)} />
          <SummaryCard title="Total estimated value" value={`£${giftMetrics.totalValue.toFixed(2)}`} />
          <SummaryCard title="Avg value" value={`£${giftMetrics.avgValue.toFixed(2)}`} />
          <SummaryCard
            title="Acceptance rate"
            value={`${giftMetrics.acceptedRate.toFixed(1)}%`}
            subtitle="Accepted vs total submissions"
          />
        </div>
        <div className="grid" style={{ gridTemplateColumns: "2fr 1.3fr", gap: 16, marginTop: 16 }}>
          <SimpleAreaChart title="Gift values over entries" data={giftMetrics.trendByEntry} color="#8b5cf6" />
          <BarBreakdown title="Top organisations by value" data={giftMetrics.topOrganisations} color="#f97316" />
        </div>
        <div className="section">
          <DataTable
            title="Latest gifts & hospitality rows"
            columns={[
              { key: "name", label: "Name" },
              { key: "accepted", label: "Accepted?" },
              { key: "date", label: "Date" },
              { key: "type", label: "Type" },
              { key: "estimatedValue", label: "Est. value (£)" },
              { key: "organisation", label: "Organisation" }
            ]}
            rows={gifts}
            maxRows={12}
          />
        </div>
      </section>
    </div>
  );
}




