import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CandidateCard from "../components/CandidateCard";

export default function Vote() {
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const electionRes = await api.get("/elections/active");
        const activeElection = electionRes.data.election;
        setElection(activeElection);

        const candidatesRes = await api.get(`/candidates/${activeElection._id}`);
        setCandidates(candidatesRes.data.candidates);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load the ballot.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit() {
    if (!selectedId) {
      setError("Please select a candidate before submitting.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.post("/votes", { candidateId: selectedId });
      navigate("/vote/success");
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit your vote.");
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-center mt-16 text-gray-400">Loading ballot...</p>;
  if (error && !election) {
    return <p className="text-center mt-16 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-12 px-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">{election?.title}</h2>
      <p className="text-sm text-gray-400 mb-6">Select one candidate, then submit your vote.</p>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <div className="space-y-3 mb-6">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate._id}
            candidate={candidate}
            selected={selectedId === candidate._id}
            onSelect={setSelectedId}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Vote"}
      </button>
    </div>
  );
}
