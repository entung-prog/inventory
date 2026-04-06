module.exports = (req, res, next) => {
  // This middleware assumes authMiddleware has already been applied and req.user is set
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin role required" });
  }
  
  next();
};