import DonutPlaceholder from "../components/DonutPlaceholder";

export default function AdminDashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <DonutPlaceholder
        centerLabel="System CO₂"
        data={[
          { name: "Electricity", value: 18000 },
          { name: "Transport", value: 9000 },
          { name: "Food", value: 5500 },
        ]}
      />
    </>
  );
}
