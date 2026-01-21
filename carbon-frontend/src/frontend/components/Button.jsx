export default function Button({ children, variant = "primary", ...props }) {
  const styles = {
    primary: "bg-green-600 text-white",
    secondary: "bg-gray-200 text-gray-800",
    danger: "bg-red-600 text-white",
  };

  return (
    <button
      className={`px-4 py-2 rounded-xl font-medium ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
