const express = require("express");
const app = express();
const session = require("express-session");
const mongoose= require("mongoose");//db
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const {listingSchema, reviewSchema} = require("./Schema.js");
const path = require("path");
app.use(express.urlencoded({extended: true}));
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate=require("ejs-mate");
const { nextTick } = require("process");
app.engine("ejs", ejsMate);
//Views Setup
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.static(path.join(__dirname, '/sources')));
 //for middleware req_path shortening parsing
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//Acquiring database 
//const MONGO_URL="mongodb://mongo:KGbMEWGsGbxuziXtjqrRDnflXpJhBJGA@mongodb.railway.internal:27017";

const MONGO_URL = "mongodb://localhost:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}
main()
    .then(()=>{
        console.log("connected to Database");
    })
    .catch((err)=>{
        console.log("Error Occured while connecting database: ", err);
    })
//server Response Flag after getting started to server
let port = 8080;
app.listen( port , ()=>{
    console.log(" listening at port 8080 server");
});  

//Setting up the Session middleware /////////////////////////////////////////////////////SESSION///////////////////////////////
//Session Options
const sessionOptions = {
    secret:"mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        //setting expiry for a week
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, 
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.get("/", (req,res)=>{
    res.send("I am on the Home route");
});

app.use(session(sessionOptions));
app.use(flash());
//Passport Action
app.use(passport.initialize());
//For user Info carrying through out the Session(Login in the case)
//Important to remember about user from page to page
app.use(passport.session());
//serialize:to put the user login info into sesssion once started, deserialize:to remove user info once session ends
passport.use(new LocalStrategy(User.authenticate()));
passport.deserializeUser(User.deserializeUser());
passport.serializeUser(User.serializeUser());
////////////////////////////Session Setup Ends///////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////Flash Messages initialization (Must To do)////////////
app.use((req,res, next ) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; 
    console.log("This is the logged User info",res.locals.currUser);
    //user(when logged in auto assigned object)  is passed for availabiltiy to other/any template for a request
    next();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });


//as we are using route to map the listing prefix for the routes: this maps to listings/rel_route
/////////////////////////////////////////////////////////////////////////////////Request prefix joining with (separated) file routes /////////////////////////////
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Page unmatched default response (page not found)
app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong" } = err;
    res.render("error.ejs",{err});
    //res.status(500).send("Soemthing went wrong while Saving Data to Database");
    //res.status(statusCode).send(message);
});

