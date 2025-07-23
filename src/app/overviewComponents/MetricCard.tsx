const MetricCard = ({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-md border border-black">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

export default MetricCard;
