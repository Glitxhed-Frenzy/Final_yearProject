import DonutPlaceholder from "../components/DonutPlaceholder";

export default function AdminStats() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Statistics</h1>
      <DonutPlaceholder
        centerLabel="Distribution"
        data={[
          { name: "Electricity", value: 60 },
          { name: "Transport", value: 25 },
          { name: "Food", value: 15 },
        ]}
      />
    </>
  );
}
