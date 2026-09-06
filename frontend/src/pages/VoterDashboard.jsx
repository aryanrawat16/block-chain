import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function VoterDashboard() {
  const [election, setElection] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const name = localStorage.getItem("name");

  useEffect(() => {
    async function load() {
      try {
        const [electionRes, statusRes] = await Promise.all([
          api.get("/elections/active").catch((err) => {
            if (err.response?.status === 404) return { data: { election: null } };
            throw err;
          }),
          api.get("/votes/status"),
        ]);
        setElection(electionRes.data.election);
        setHasVoted(statusRes.data.hasVoted);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load dashboard.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-center mt-16 text-gray-400">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-12 px-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome, {name} 👋</h2>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <div className="bg-white rounded-xl shadow p-6">
        {!election ? (
          <p className="text-gray-500">There is no active election right now. Please check back later.</p>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{election.title}</h3>
            <p className="text-sm text-gray-400 mb-4">
              {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
            </p>

            {hasVoted ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm">
                ✅ You have already cast your vote in this election. Thank you for participating!
              </div>
            ) : (
              <Link
                to="/vote"
                className="inline-block bg-brand-600 text-white px-5 py-2 rounded-lg hover:bg-brand-700"
              >
                Cast Your Vote
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
