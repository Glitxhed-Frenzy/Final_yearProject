export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white p-8 rounded-2xl shadow-sm w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <input className="w-full p-3 border rounded-xl mb-4" placeholder="Email" />
        <input type="password" className="w-full p-3 border rounded-xl mb-6" placeholder="Password" />
        <button className="w-full bg-green-600 text-white py-3 rounded-xl">
          Login
        </button>
      </form>
    </div>
  );
}
