import jwt from "jsonwebtoken";
import serverconfig from "../Config/serverconfig.js";

function authenticateUser(req, res, next) {
  const token = req.cookies.token; // User token
  const adminToken = req.cookies.admintoken; // Admin token

  // Check if neither token is present
  if (!token && !adminToken) {
    return res.status(401).json({ message: "No token found. Please log in." });
  }

  // Verify user token if it exists
  if (token) {
    jwt.verify(token, serverconfig.token, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.clearCookie('token'); // Clear the 'token' cookie from the browser
          return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        // For other JWT errors (invalid token, etc.), return a forbidden status
        return res.sendStatus(403);
      }

      req.user = user; // Attach the decoded token data to the request object
      req.user.isAdmin = false; // Default to non-admin

      next(); // Move to the next middleware or route handler
    });
  } 
  // Verify admin token if user token is not present or invalid
  else if (adminToken) {
    jwt.verify(adminToken, serverconfig.token, (err, admin) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.clearCookie('admintoken'); // Clear the 'admintoken' cookie from the browser
          return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        return res.sendStatus(403);
      }

      req.user = admin; // Attach the decoded admin token data to the request object
      req.user.isAdmin = true; // Flag to indicate admin access

      next(); // Move to the next middleware or route handler
    });
  }
}

export default authenticateUser;
