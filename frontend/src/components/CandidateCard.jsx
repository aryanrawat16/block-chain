export default function CandidateCard({ candidate, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(candidate._id)}
      className={`w-full text-left p-4 rounded-xl border-2 transition ${
        selected
          ? "border-brand-600 bg-brand-50"
          : "border-gray-200 bg-white hover:border-brand-300"
      }`}
    >
      <div className="font-semibold text-gray-800">{candidate.name}</div>
      <div className="text-sm text-gray-500">{candidate.party}</div>
    </button>
  );
}
