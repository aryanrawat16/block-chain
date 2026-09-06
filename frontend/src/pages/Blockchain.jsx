import { useEffect, useState } from "react";
import api from "../services/api";
import BlockchainBlock from "../components/BlockchainBlock";

export default function Blockchain() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [verifyResult, setVerifyResult] = useState(null);
  const [tamperForm, setTamperForm] = useState({ blockIndex: "", candidateName: "", fakeCount: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const role = localStorage.getItem("role");

  useEffect(() => {
    api.get(role === "admin" ? "/elections" : "/elections/active").then((res) => {
      if (role === "admin") {
        setElections(res.data.elections);
      } else if (res.data.election) {
        setElections([res.data.election]);
        setSelectedElection(res.data.election._id);
        loadBlocks(res.data.election._id);
      }
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadBlocks(electionId) {
    if (!electionId) {
      setBlocks([]);
      return;
    }
    try {
      const res = await api.get(`/blockchain?electionId=${electionId}`);
      setBlocks(res.data.blocks);
      setVerifyResult(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load blockchain.");
    }
  }

  function handleElectionSelect(e) {
    const id = e.target.value;
    setSelectedElection(id);
    loadBlocks(id);
  }

  async function handleVerify() {
    setError("");
    try {
      const res = await api.get(`/blockchain/verify?electionId=${selectedElection}`);
      setVerifyResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not verify blockchain.");
    }
  }

  async function handleTamper(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await api.post("/blockchain/tamper-demo", {
        electionId: selectedElection,
        blockIndex: Number(tamperForm.blockIndex),
        candidateName: tamperForm.candidateName,
        fakeCount: Number(tamperForm.fakeCount),
      });
      setMessage(res.data.message);
      loadBlocks(selectedElection);
    } catch (err) {
      setError(err.response?.data?.message || "Tamper demo failed.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6 pb-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Blockchain Explorer</h2>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      {message && <div className="bg-yellow-50 text-yellow-700 p-3 rounded mb-4 text-sm">{message}</div>}

      {role === "admin" && (
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">Election</label>
          <select
            value={selectedElection}
            onChange={handleElectionSelect}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">-- Choose an election --</option>
            {elections.map((e) => (
              <option key={e._id} value={e._id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedElection && (
        <>
          <div className="flex justify-center mb-4">
            <button
              onClick={handleVerify}
              className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-700 text-sm"
            >
              Verify Blockchain
            </button>
          </div>

          {verifyResult && (
            <div
              className={`text-center p-3 rounded-lg mb-6 text-sm font-medium ${
                verifyResult.isValid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {verifyResult.isValid ? "✅ Blockchain is valid." : "🚨 Blockchain integrity compromised!"}
              {!verifyResult.isValid && (
                <ul className="mt-2 text-left list-disc list-inside">
                  {verifyResult.errors.map((e, i) => (
                    <li key={i}>
                      Block #{e.blockIndex}: {e.reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex flex-col items-center mb-10">
            {blocks.length === 0 ? (
              <p className="text-gray-400 text-sm">No blocks yet. Create one from the admin dashboard.</p>
            ) : (
              blocks.map((block, i) => (
                <BlockchainBlock key={block._id} block={block} isLast={i === blocks.length - 1} />
              ))
            )}
          </div>

          {role === "admin" && (
            <div className="bg-white border-2 border-dashed border-yellow-400 rounded-xl p-6">
              <h3 className="font-semibold text-yellow-700 mb-1">⚠️ Tamper Demo (Testing Only)</h3>
              <p className="text-xs text-gray-500 mb-4">
                This directly edits a block's vote count in the database without recalculating its
                hash, purely to demonstrate that "Verify Blockchain" catches it. This is not a real
                attack tool - it's a controlled classroom demonstration.
              </p>
              <form onSubmit={handleTamper} className="grid grid-cols-3 gap-3">
                <input
                  placeholder="Block Index"
                  value={tamperForm.blockIndex}
                  onChange={(e) => setTamperForm({ ...tamperForm, blockIndex: e.target.value })}
                  required
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  placeholder="Candidate Name"
                  value={tamperForm.candidateName}
                  onChange={(e) => setTamperForm({ ...tamperForm, candidateName: e.target.value })}
                  required
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  placeholder="Fake Count"
                  value={tamperForm.fakeCount}
                  onChange={(e) => setTamperForm({ ...tamperForm, fakeCount: e.target.value })}
                  required
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <button className="col-span-3 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 text-sm">
                  Run Tamper Demo
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
