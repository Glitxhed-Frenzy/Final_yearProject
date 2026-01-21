import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">404</h1>
      <Link to="/dashboard" className="text-green-600 underline mt-3">
        Go Home
      </Link>
    </div>
  );
}
