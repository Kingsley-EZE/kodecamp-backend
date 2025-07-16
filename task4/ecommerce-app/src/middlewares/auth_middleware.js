const jsonWebToken = require("jsonwebtoken");

function checkAuthenticatedUser(req, res, next) {
    try{

        if (!req.headers.authorization) {
            return res.status(401).json({ message: "Unauthorized. Provide your authorization token" });
        }

        const [scheme, token] = req.headers.authorization?.split(" ");

        if(scheme.toLocaleLowerCase() === "bearer"){

        }else{
            return res.status(401).json({ message: "Invalid authentication scheme" });
        }

        jsonWebToken.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Malformed token" });
            }

            req.decoded = decoded;
            next();
        });
    }catch (error) {
        console.error("Error in authentication middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = checkAuthenticatedUser;