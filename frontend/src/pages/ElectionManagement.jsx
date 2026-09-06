import { useEffect, useState } from "react";
import api from "../services/api";

export default function ElectionManagement() {
  const [elections, setElections] = useState([]);
  const [form, setForm] = useState({ title: "", startDate: "", endDate: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const res = await api.get("/elections");
      setElections(res.data.elections);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load elections.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/elections", form);
      setMessage("Election created.");
      setForm({ title: "", startDate: "", endDate: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create election.");
    }
  }

  async function handleStatusChange(id, status) {
    setError("");
    try {
      await api.patch(`/elections/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6 pb-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Election Management</h2>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      {message && <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>}

      <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-6 mb-8 space-y-4">
        <h3 className="font-semibold text-gray-700">Create New Election</h3>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Election Title"
          required
          className="w-full border rounded-lg px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <button className="bg-brand-600 text-white px-5 py-2 rounded-lg hover:bg-brand-700">
          Create Election
        </button>
      </form>

      <div className="space-y-3">
        {elections.map((election) => (
          <div key={election._id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
            <div>
              <div className="font-medium text-gray-800">{election.title}</div>
              <div className="text-xs text-gray-400">
                {new Date(election.startDate).toLocaleDateString()} -{" "}
                {new Date(election.endDate).toLocaleDateString()}
              </div>
              <span
                className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                  election.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : election.status === "UPCOMING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {election.status}
              </span>
            </div>
            <select
              value={election.status}
              onChange={(e) => handleStatusChange(election._id, e.target.value)}
              className="border rounded-lg px-2 py-1 text-sm"
            >
              <option value="UPCOMING">UPCOMING</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ENDED">ENDED</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
