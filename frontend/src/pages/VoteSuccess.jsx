import { Link } from "react-router-dom";

export default function VoteSuccess() {
  return (
    <div className="max-w-md mx-auto mt-24 text-center bg-white p-10 rounded-xl shadow">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Vote Cast Successfully!</h2>
      <p className="text-gray-500 mb-6">
        Thank you for participating. Your vote has been securely recorded and cannot be
        changed or cast again.
      </p>
      <Link to="/voter/dashboard" className="text-brand-600 hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
