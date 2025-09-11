const express = require("express");
const app = express();
// const users= require("./routes/user.js");
// const posts = require("./routes/posts.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

const sessionOptions = {
        secret:"mysupersecretstring",
        resave: false,
        saveUninitialized: false,
};

app.use(session(sessionOptions));
app.use(flash());


app.get("/hello", (req,res)=>{
    res.locals.ErrMsg = req.flash("error");
    res.locals.SuccMsg = req.flash("success");
    res.render("page.ejs", {name: req.session.name});
});
app.get("/register",(req,res)=>{
    //extracting the name from user request 
    let {name="anonymous" } = req.query;
    //storing the name into session's name varibale to the extracted user request name
    req.session.name = name;

    if (name === "anonymous"){
        req.flash("error", "User not Registered!");
    }
    else{
        req.flash("success", "User Registered Successfully!");
    }
    //console.log(req.session);
    res.redirect("/hello");
});
// app.get("/hello", (req,res)=>{
//    res.render("page.ejs", {name: req.session.name, msg: req.flash("success")});
// });
// app.get("/register",(req,res)=>{
//     //extracting the name from user request 
//     let {name=" anonymous" } = req.query;
//     //storing the name into session's name varibale to the extracted user request name
//     req.session.name = name;
//     req.flash("success", "User Registered Successfully!");
//     //console.log(req.session);
//     res.redirect("/hello");
// });
///////////////////////////////////////////////
// app.get("/reqcount", (req,res)=>{
//     if (req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });

//app.use(session({ secret: "mysupersecretstring"  }));

app.get("/test", ( req,res)=>{
    res.send("test successful");
});
let port = 3030;
app.listen(port, ()=>{
    console.log("Server is Listening to ",port)
}) 

/*
const cookieParser = require("cookie-parser");
app.use(cookieParser("secretcode"));
app.get("/getSignedCookies",(req,res)=>{
    res.cookie("made-in", "Russia", {signed : true});
    res.send("Signed cookie sent");
});
app.get("/verify",(req,res)=>{
    console.log("UnSigned Cookies ",req.cookies);
    console.log("Signed Cookies ",req.signedCookies);
    res.send("verified");
})
app.get("/getcookies",(req,res)=>{
    res.cookie("name","Zohaib");
    res.cookie("Madein", "Pakistan");
    res.send("Sent you some cookies");
});
app.get("/greet", (req,res)=>{
    let {name = "anonymous"} =req.cookies;
    res.send(`Hi, ${name}`);
})
app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("Hi, I am root");
});
*/