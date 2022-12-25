const express = require("express");

const router = express.Router();

const {signOut, signUp, signIn, isSignedIn} = require('../controllers/auth');

router.get("/signout",signOut);

router.post("/signup", signUp);

router.post("/signin", signIn);

router.get("/testRoute",isSignedIn, (req, res) => {
    console.log(req.auth);
    res.send("this is protected route")
})

module.exports = router;