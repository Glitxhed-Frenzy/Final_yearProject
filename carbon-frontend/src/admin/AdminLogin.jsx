import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={() => navigate("/admin/dashboard")}
        className="bg-white p-8 rounded-2xl shadow-sm w-96"
      >
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <input className="w-full p-3 border rounded-xl mb-4" placeholder="Username" />
        <input type="password" className="w-full p-3 border rounded-xl mb-6" placeholder="Password" />
        <button className="w-full bg-green-600 text-white py-3 rounded-xl">
          Login
        </button>
      </form>
    </div>
  );
}
