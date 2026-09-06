import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import api from "../services/api";
import PasswordInput from "../components/PasswordInput";

export default function AdminLogin() {
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

      if (voter.role !== "admin") {
        setError("This account is not an admin account.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", voter.role);
      localStorage.setItem("name", voter.name);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border-t-4 border-gray-800 p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-gray-100 rounded-2xl p-3.5 mb-3">
              <ShieldCheck size={24} className="text-gray-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Admin Login</h2>
            <p className="text-sm text-gray-400">Election management access</p>
          </div>

          {error && (
            <div className="bg-tint-magenta-bg text-tint-magenta-text p-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Admin Voter ID
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
              className="w-full bg-gray-800 text-white py-2.5 rounded-xl font-medium hover:bg-gray-700 disabled:opacity-50 transition"
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>
          </form>
        </div>

        <p className="text-xs text-gray-400 mt-5 text-center">
          First time? Run <code className="bg-gray-200 px-1.5 py-0.5 rounded">node utils/createAdmin.js</code> in the backend to create this account.
        </p>
      </div>
    </div>
  );
}
