const { sendError } = require("../utils/response");

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, "User not authenticated", 401);
    }

    if (!roles.map(r => r.toLowerCase()).includes(req.user.role.toLowerCase())) {
      return sendError(
        res,
        `User role '${req.user.role}' is not authorized to access this route`,
        403
      );
    }

    next();
  };
};

module.exports = { authorize };
