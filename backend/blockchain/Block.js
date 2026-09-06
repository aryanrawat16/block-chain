const crypto = require("crypto");

/**
 * A single block in our educational blockchain.
 * This class only knows how to hold data and hash itself -
 * it doesn't know about MongoDB at all. That's handled separately
 * in models/Block.js and controllers/blockchainController.js.
 */
class Block {
  constructor(index, date, voteCounts, previousHash, timestamp) {
    this.index = index;
    this.date = date; // "YYYY-MM-DD"
    this.voteCounts = voteCounts; // plain object { "Candidate A": 450, ... }
    this.previousHash = previousHash;
    this.timestamp = timestamp; // ISO string
    this.hash = this.calculateHash();
  }

  /**
   * Deterministic serialization is the key to a trustworthy hash.
   * If we serialized voteCounts using JSON.stringify directly, two
   * objects with the same data but different key order would produce
   * different JSON strings, and therefore different hashes, even
   * though nothing was actually tampered with. Sorting the keys first
   * guarantees the same data always produces the same hash.
   */
  static serializeVoteCounts(voteCounts) {
    const sortedKeys = Object.keys(voteCounts).sort();
    const sortedEntries = sortedKeys.map((key) => `${key}:${voteCounts[key]}`);
    return sortedEntries.join("|");
  }

  calculateHash() {
    const dataToHash =
      this.index +
      this.date +
      Block.serializeVoteCounts(this.voteCounts) +
      this.previousHash +
      this.timestamp;

    return crypto.createHash("sha256").update(dataToHash).digest("hex");
  }
}

module.exports = Block;
