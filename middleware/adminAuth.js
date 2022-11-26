const adminModel = require("../models/adminModel.js")
const jwt = require("jsonwebtoken")


const checkAdminAuth = async (req, res, next) => {
    const token = req.cookies.JWT

    if (token) {
        try {
            // verify token --
            const { adminID } = jwt.verify(token, "thisIsMyJWTSecretKey")

            // Get admin from token -- 
            let admin = await adminModel.findById(adminID).select('-password')
            if (admin) {
                next();
            } else {
                console.log("Invalid Token");
                res.redirect("/admin/login");
            }
        } catch (error) {
            console.log(error);
            console.log("Invalid Token");
        }
    } else {
        console.log("no Token");
        res.redirect("/admin/login")
    }
}

module.exports = checkAdminAuth