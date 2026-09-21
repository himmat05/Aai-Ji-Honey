/**
 * Role-Based Access Control (RBAC) Middleware
 * Enforces least privilege by verifying user role server-side
 */

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const role = req.user.role;
  if (role !== 'admin' && role !== 'owner') {
    console.warn(`🚨 Unauthorized admin access attempt by user: ${req.user.id || req.user.email} (role: ${role})`);
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }

  next();
};

const requireCustomer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'user') {
    return res.status(403).json({ error: 'Access denied. Customer account required.' });
  }

  next();
};

module.exports = {
  requireAdmin,
  requireCustomer,
};
