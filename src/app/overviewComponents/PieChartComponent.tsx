import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const PieChartComponent = ({ data, title }: { data: any[]; title: string }) => {
  const COLORS = ["#1F2937", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB"];

  return (
    <div className="bg-white p-6 rounded-lg border border-black">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${((percent || 0) * 100).toFixed(0)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
