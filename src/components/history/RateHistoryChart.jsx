import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer
} from "recharts";
import {
  simulateRateHistory,
  getRateStats
} from "../../utils/rateHistorySimulator";
import PeriodSelector from "./PeriodSelector";
import RateStats from "./RateStats";
import { CURRENCIES } from "../../constants/currencies";

export default function RateHistoryChart({
  fromCurrency,
  toCurrency,
  currentRate
}) {
  const [period, setPeriod] = useState(30); // days

  const historyData = useMemo(() => {
    return simulateRateHistory(currentRate, period);
  }, [currentRate, period]);

  const stats = useMemo(() => getRateStats(historyData), [historyData]);

  const pair = `${fromCurrency}/${toCurrency}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">{pair} Rate History</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Simulated data for demonstration
          </p>
        </div>
        <PeriodSelector selected={period} onChange={setPeriod} />
      </div>

      <RateStats
        stats={stats}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
      />

      <div className="h-56 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={historyData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              interval={Math.floor(period / 6)}
              tickLine={false}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              width={50}
              tickFormatter={(v) => v.toFixed(2)}
            />
            <Tooltip
              formatter={(value) => [
                `${value.toFixed(4)} ${toCurrency}`,
                `1 ${fromCurrency}`
              ]}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "13px"
              }}
            />
            <ReferenceLine
              y={currentRate}
              stroke="#3b82f6"
              strokeDasharray="4 4"
              label={{ value: "Current", fill: "#3b82f6", fontSize: 11 }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: "#6366f1" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
