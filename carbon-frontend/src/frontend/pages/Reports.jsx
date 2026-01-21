import DonutPlaceholder from "../components/DonutPlaceholder";

export default function Reports() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <DonutPlaceholder
        centerLabel="Annual Split"
        data={[
          { name: "Electricity", value: 55 },
          { name: "Transport", value: 30 },
          { name: "Food", value: 15 },
        ]}
      />
    </main>
  );
}
