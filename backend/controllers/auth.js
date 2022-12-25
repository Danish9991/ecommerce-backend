require("dotenv").config();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const jwtExpress = require('express-jwt');


exports.signUp = (req, res, next) => {
  var user = new User(req.body);
  user.save((err, user)=> {
      if(err || !user){
          return res.status(400).json({err: "data not valid"})
      }
     return res.json({
         name: user.name,
         id: user._id,
         email: user.email
     });
  });
};

exports.signIn = (req, res, next) => {
   const {email, password} = req.body;

   User.findOne({email : email}, (err, user) => {
       if(err || !user)
       return res.status(400).json({
           err: "email doesnot exist"
       });

       if(!user.authenticate(password)){
         return  res.status(401).json({
             err : "email or password doesnot match"
         });
       }
       //creating token
       const token = jwt.sign({_id: user._id}, process.env.SECRET);
       //storing token in cookie
       res.cookie('token', token,{ expire: new Date() + 9999 })
       //sending response
       const {_id, name, email, role} = user;
       return res.json({token,user:{ _id, name, email, role}})
   });
};

exports.signOut = (req, res, next) => {
    res.clearCookie("token");
    res.json({
        msg: "user signout sucessfully"
    });
};

//protected route
exports.isSignedIn = jwtExpress({
    secret : process.env.SECRET,
    userProperty : "auth"
});

//custom middleware
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker) return res.json({ err: "Access denied"});
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role == 1) return res.json({err: "you have not previledges to access this"});
    next();
};
