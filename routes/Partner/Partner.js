const express = require('express');
const router = express.Router();
const auth = require('../../Controller/PartnerController/Auth');
const { isAuthenticatedUser } = require('../../Middleware/Authentication');

//users routes

// router.get("/login", auth.loginPartner)
// router.post("/register", auth.registerPartner)
router.post("/checkuser", auth.checkUser)
router.delete("/logout",isAuthenticatedUser, auth.logoutPartner)


module.exports =router;

