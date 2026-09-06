const Block = require("./Block");

const GENESIS_PREVIOUS_HASH = "GENESIS";

/**
 * This class works on an array of block-like objects (either plain
 * objects loaded from MongoDB, or fresh Block instances). It never
 * touches the database itself - that separation makes it easy to unit
 * test and easy to reason about.
 */
class Blockchain {
  /**
   * Builds the next block given the previous stored block (or null if
   * this is the very first block for an election).
   */
  static createNextBlock(previousStoredBlock, date, voteCounts) {
    const index = previousStoredBlock ? previousStoredBlock.index + 1 : 1;
    const previousHash = previousStoredBlock
      ? previousStoredBlock.hash
      : GENESIS_PREVIOUS_HASH;
    const timestamp = new Date().toISOString();

    return new Block(index, date, voteCounts, previousHash, timestamp);
  }

  /**
   * Recalculates a stored block's hash from its data and checks it
   * against the hash that was saved. If they don't match, someone
   * edited the block's fields directly in the database without going
   * through the proper block-creation process.
   */
  static isBlockHashValid(storedBlock) {
    const voteCountsObj =
      storedBlock.voteCounts instanceof Map
        ? Object.fromEntries(storedBlock.voteCounts)
        : storedBlock.voteCounts;

    const recalculated = new Block(
      storedBlock.index,
      storedBlock.date,
      voteCountsObj,
      storedBlock.previousHash,
      storedBlock.timestamp
    );

    return recalculated.hash === storedBlock.hash;
  }

  /**
   * Walks the full chain (already sorted by index ascending) and checks
   * two things for every block:
   *   1. Its stored hash matches a hash recalculated from its own data.
   *   2. Its previousHash matches the actual hash of the block before it.
   * Returns a detailed report so the UI can point at exactly which
   * block failed and why.
   */
  static validateChain(storedBlocks) {
    const errors = [];

    for (let i = 0; i < storedBlocks.length; i++) {
      const current = storedBlocks[i];

      if (!Blockchain.isBlockHashValid(current)) {
        errors.push({
          blockIndex: current.index,
          reason: "Stored hash does not match recalculated hash. Block data was likely modified after creation.",
        });
      }

      if (i === 0) {
        if (current.previousHash !== GENESIS_PREVIOUS_HASH) {
          errors.push({
            blockIndex: current.index,
            reason: `Genesis block should have previousHash "${GENESIS_PREVIOUS_HASH}".`,
          });
        }
      } else {
        const previous = storedBlocks[i - 1];
        if (current.previousHash !== previous.hash) {
          errors.push({
            blockIndex: current.index,
            reason: `previousHash does not match the hash of block #${previous.index}. The chain link is broken here.`,
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

module.exports = { Blockchain, GENESIS_PREVIOUS_HASH };
