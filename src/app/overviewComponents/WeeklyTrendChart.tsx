import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WeeklyTrendChart = ({ data, title }: { data: any[]; title: string }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-black">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 12 }} />
          <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="interviews"
            stroke="#1F2937"
            strokeWidth={3}
            dot={{ fill: "#1F2937", strokeWidth: 2, r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyTrendChart;
