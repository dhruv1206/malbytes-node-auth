const jwt = require("jsonwebtoken");

const auth = async (req, res, next)=>{
    try {
        const token = req.header("x-auth-token");
        if(!token) res.status(401).json({msg:"No auth token found, access denied."})
        const verified = jwt.verify(token, "passwordKey")
        if(!verified)res.status(401).json({msg:"Unable to verify token, authorization failed!"})

        req.user = verified.id;
        req.token = token;
        next();
    } catch (err) {
        res.status(500).json({error:err.message})
    }
};

module.exports = auth;