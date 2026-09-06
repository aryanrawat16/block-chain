import { useEffect, useState } from "react";
import api from "../services/api";

export default function CandidateManagement() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({ name: "", party: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/elections")
      .then((res) => setElections(res.data.elections))
      .catch((err) => setError(err.response?.data?.message || "Could not load elections."));
  }, []);

  async function loadCandidates(electionId) {
    if (!electionId) {
      setCandidates([]);
      return;
    }
    try {
      const res = await api.get(`/candidates/${electionId}`);
      setCandidates(res.data.candidates);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load candidates.");
    }
  }

  function handleElectionSelect(e) {
    const id = e.target.value;
    setSelectedElection(id);
    loadCandidates(id);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!selectedElection) {
      setError("Please select an election first.");
      return;
    }
    try {
      await api.post("/candidates", { ...form, electionId: selectedElection });
      setMessage("Candidate added.");
      setForm({ name: "", party: "" });
      loadCandidates(selectedElection);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add candidate.");
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await api.delete(`/candidates/${id}`);
      loadCandidates(selectedElection);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete candidate.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-6 pb-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Candidate Management</h2>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      {message && <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>}

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-1">Select Election</label>
        <select
          value={selectedElection}
          onChange={handleElectionSelect}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">-- Choose an election --</option>
          {elections.map((e) => (
            <option key={e._id} value={e._id}>
              {e.title} ({e.status})
            </option>
          ))}
        </select>
      </div>

      {selectedElection && (
        <>
          <form onSubmit={handleAdd} className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Add Candidate</h3>
            <input
              placeholder="Candidate Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              placeholder="Party"
              value={form.party}
              onChange={(e) => setForm({ ...form, party: e.target.value })}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <button className="bg-brand-600 text-white px-5 py-2 rounded-lg hover:bg-brand-700">
              Add Candidate
            </button>
          </form>

          <div className="space-y-2">
            {candidates.map((c) => (
              <div key={c._id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">{c.name}</div>
                  <div className="text-xs text-gray-400">{c.party}</div>
                </div>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
