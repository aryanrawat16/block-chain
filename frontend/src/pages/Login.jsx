import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import api from "../services/api";
import PasswordInput from "../components/PasswordInput";

export default function Login() {
  const [form, setForm] = useState({ voterId: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const { token, voter } = res.data;

      if (voter.role !== "voter") {
        setError("This account is an admin account. Please use the Admin login page.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", voter.role);
      localStorage.setItem("name", voter.name);
      navigate("/voter/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-tint-violet-bg rounded-2xl p-3.5 mb-3">
              <LogIn size={24} className="text-tint-violet-icon" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Voter Login</h2>
            <p className="text-sm text-gray-400">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="bg-tint-magenta-bg text-tint-magenta-text p-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Voter ID
              </label>
              <input
                name="voterId"
                value={form.voterId}
                onChange={handleChange}
                required
                autoComplete="username"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <PasswordInput
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-brand-600 text-white py-2.5 rounded-xl font-medium hover:bg-brand-700 disabled:opacity-50 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <p className="text-sm text-gray-500 mt-5 text-center">
          No account yet?{" "}
          <Link to="/register" className="text-brand-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
