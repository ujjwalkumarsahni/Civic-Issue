const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};

// Check if user is the owner of the resource
const checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Allow if user is admin or owner
      if (req.user.role === 'admin' || resource.user.toString() === req.user.id) {
        req.resource = resource;
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error during ownership check'
      });
    }
  };
};

module.exports = { authorize, checkOwnership };