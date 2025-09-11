//Should conatain all the routes for Users
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
//SignUp Get 
// Renders the Signup Form only
router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

//SignUp Post Handle
//Just takes the input data and saves into DB(also checks if the user is already registered, then can't signup or needs to login!! )
router.post("/signup", async (req,res)=>{
    try{
    let {username, email, password} = req.body;
    //Creates the user with username and email
    const newUser = new User({email, username});
    //Auto merges with salted and hashed password with user(username, email) with buildin fn register!
    const registeredUser = await User.register(newUser, password);
    //console.log("registered User data after register method", registeredUser);
    console.log(registeredUser);
    req.login(registeredUser, (err)=>{
        if (err){
            return next(err);
        }
        req.flash("success", "Welcome to wanderlust");
        res.redirect("/listings");
    });
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
});

//Login Get
//Renders the Login form only
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

//For Login 
//Authenticates if the users exists/(Already signed Up) in DB with input(ed) credentials (especially the authenticate method)
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {
    failureRedirect:"/login", 
    failureFlash: true,
    }),
    async(req,res)=>{
        req.flash("success", "Welcome back to Wanderlust");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged you Out!")
        res.redirect("/login");
    });
});


module.exports = router;
