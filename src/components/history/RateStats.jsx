export default function RateStats({ stats }) {
  const { high, low, changePercent } = stats;
  const isPositive = parseFloat(changePercent) >= 0;

  return (
    <div className="grid grid-cols-3 gap-3 mt-2">
      <div className="bg-gray-50 rounded-xl p-3 text-center">
        <p className="text-xs text-gray-400 mb-1">High</p>
        <p className="font-semibold text-gray-800 text-sm">
          {high?.toFixed(4)}
        </p>
      </div>
      <div className="bg-gray-50 rounded-xl p-3 text-center">
        <p className="text-xs text-gray-400 mb-1">Low</p>
        <p className="font-semibold text-gray-800 text-sm">{low?.toFixed(4)}</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-3 text-center">
        <p className="text-xs text-gray-400 mb-1">Change</p>
        <p
          className={`font-semibold text-sm ${isPositive ? "text-green-600" : "text-red-500"}`}
        >
          {isPositive ? "+" : ""}
          {changePercent}%
        </p>
      </div>
    </div>
  );
}
