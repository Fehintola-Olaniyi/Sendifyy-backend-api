// Middleware(e.g., auth, error handling)

// Token-based authentication middleware (API key)
//used to verify JWT tokens for protected routes
//apply this middleware to routes that require authentication, such as creating email accounts or ccessing user data

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  //get token from the header
  const token = req.header("Authorization")?.split(" ")[1]; //extract bearer token
  console.log("Recieved token:", token);

  //check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //attach user ID to request object; save user info to request object for later user
    req.user = decoded; // this should contain userId
    // console.log('middleware: req.user = ', req.user);//want to check if req.user is being set correctly

    next(); //pass/ continue to the next middleware or route handler
  } catch (err) {
    console.error("Token Validation error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
