/**
 * Must run AFTER authMiddleware, since it relies on req.voter being set.
 * Blocks any request from a logged-in voter who isn't an admin.
 */
function adminMiddleware(req, res, next) {
  if (!req.voter || req.voter.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
}

module.exports = adminMiddleware;
