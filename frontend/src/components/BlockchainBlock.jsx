function shortHash(hash) {
  if (!hash) return "";
  return hash.length > 16 ? `${hash.slice(0, 8)}...${hash.slice(-8)}` : hash;
}

export default function BlockchainBlock({ block, isLast }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-72 bg-white border-2 border-gray-800 rounded-xl p-4 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-brand-700">Block #{block.index}</span>
          <span className="text-xs text-gray-400">{block.date}</span>
        </div>

        <div className="text-sm text-gray-700 space-y-1 mb-3">
          {Object.entries(block.voteCounts).map(([name, count]) => (
            <div key={name} className="flex justify-between">
              <span>{name}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </div>

        <div className="text-xs font-mono text-gray-500 border-t pt-2">
          <div>Prev: {shortHash(block.previousHash)}</div>
          <div>Hash: {shortHash(block.hash)}</div>
        </div>
      </div>

      {!isLast && <div className="text-2xl text-gray-400 my-1">↓</div>}
    </div>
  );
}
