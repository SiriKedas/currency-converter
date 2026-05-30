export default function PeriodSelector({ selected, onChange }) {
  const periods = [
    { label: "7D", value: 7 },
    { label: "30D", value: 30 },
    { label: "90D", value: 90 }
  ];

  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {periods.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
            ${
              selected === value
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
