import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activeElection, setActiveElection] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [busy, setBusy] = useState(false);

  async function loadAll() {
    try {
      const statsRes = await api.get("/stats");
      setStats(statsRes.data);

      const electionRes = await api.get("/elections/active").catch((err) => {
        if (err.response?.status === 404) return { data: { election: null } };
        throw err;
      });
      setActiveElection(electionRes.data.election);

      if (electionRes.data.election) {
        const blocksRes = await api.get(`/blockchain?electionId=${electionRes.data.election._id}`);
        setBlocks(blocksRes.data.blocks);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not load dashboard.");
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleCreateBlock() {
    if (!activeElection) return;
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const res = await api.post("/blockchain/create-daily-block", { electionId: activeElection._id });
      setMessage(`Block #${res.data.block.index} created with hash ${res.data.block.hash.slice(0, 12)}...`);
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create daily block.");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify() {
    if (!activeElection) return;
    setBusy(true);
    setVerifyResult(null);
    try {
      const res = await api.get(`/blockchain/verify?electionId=${activeElection._id}`);
      setVerifyResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not verify blockchain.");
    } finally {
      setBusy(false);
    }
  }

  if (!stats) return <p className="text-center mt-16 text-gray-400">Loading admin dashboard...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-6 pb-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      {message && <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>}

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Registered Voters" value={stats.totalVoters} />
        <StatCard label="Total Votes" value={stats.totalVotes} />
        <StatCard label="Total Candidates" value={stats.totalCandidates} />
        <StatCard label="Election Status" value={stats.electionStatus} isText />
      </div>

      {/* Candidate results */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">
          {stats.activeElectionTitle ? `Results — ${stats.activeElectionTitle}` : "Results"}
        </h3>
        {stats.candidateResults.length === 0 ? (
          <p className="text-gray-400 text-sm">No active election or no candidates yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.candidateResults.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    {c.name} <span className="text-gray-400">({c.party})</span>
                  </span>
                  <span className="font-medium">{c.votes}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-brand-600 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.totalVotes > 0 ? (c.votes / stats.totalVotes) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blockchain section */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">Blockchain</h3>
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-400">Total Blocks</div>
            <div className="text-xl font-bold">{blocks.length}</div>
          </div>
          <div>
            <div className="text-gray-400">Latest Block</div>
            <div className="text-xl font-bold">
              {blocks.length > 0 ? `#${blocks[blocks.length - 1].index}` : "—"}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Status</div>
            <div className="text-xl font-bold">
              {verifyResult ? (verifyResult.isValid ? "✅ Valid" : "🚨 Invalid") : "Not checked"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCreateBlock}
            disabled={busy || !activeElection}
            className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-50 text-sm"
          >
            Create Daily Block
          </button>
          <button
            onClick={handleVerify}
            disabled={busy || !activeElection}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 text-sm"
          >
            Verify Blockchain
          </button>
          <Link
            to="/admin/blockchain"
            className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
          >
            Open Blockchain Explorer →
          </Link>
        </div>

        {verifyResult && !verifyResult.isValid && (
          <div className="mt-4 bg-red-50 text-red-700 p-3 rounded text-sm space-y-1">
            <div className="font-semibold">🚨 Blockchain integrity compromised</div>
            {verifyResult.errors.map((e, i) => (
              <div key={i}>
                Block #{e.blockIndex}: {e.reason}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/admin/election"
          className="bg-white rounded-xl shadow p-5 hover:shadow-md transition text-gray-700 font-medium"
        >
          🗳️ Manage Elections
        </Link>
        <Link
          to="/admin/candidates"
          className="bg-white rounded-xl shadow p-5 hover:shadow-md transition text-gray-700 font-medium"
        >
          👤 Manage Candidates
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, isText }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="text-gray-400 text-xs mb-1">{label}</div>
      <div className={isText ? "text-base font-semibold text-gray-800" : "text-2xl font-bold text-gray-800"}>
        {value}
      </div>
    </div>
  );
}
