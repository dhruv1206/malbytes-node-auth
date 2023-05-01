const jwt = require("jsonwebtoken");
const User = require("../models/user");

const admin = async (req, res, next)=>{
    try {
        const token = req.header("x-auth-token");
        if(!token)return res.status(401).json({msg:"No token found, access denied!"});
        const verified = jwt.verify(token, "passwordKey");
        if(!verified)res.status(401).json({msg:"Unable to verify token, authorization failed!"});
        const user = await User.findById(verified.id);
        if(user.type == "user" || user.type == "seller"){
            return res.status(401).json({msg:"You are not an Admin"})
        }
        req.user = verified.id;
        req.token = token;
        next();

    } catch (error) {
        res.status(500).json({error:error.message})
    }
};

module.exports = admin;