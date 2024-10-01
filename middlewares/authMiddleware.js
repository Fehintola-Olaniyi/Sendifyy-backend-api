// Middleware(e.g., auth, error handling)


// Token-based authentication middleware (API key)

const jwt = require('jsonwebtoken');

const authMiddleware = ( req, res, next ) => {
    //get token from the header
    const token = req.header('Authorization').replace('Bearer', '');

    //check if no token
    if (!token){
        return res.status(401).json({ message: 'No token, authorization needed' });
    }

    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //attach user ID to request object
        req.user = decoded;

        next();  //pass to the next middleware or route
    } catch(err) {
        res.status(401).json({ message: 'Token is not valid'});
    }
};

module.exports = authMiddleware;
