const express=require("express");
const app=express();
app.listen(8080,()=>{
    console.log("Hello, listening at port 8080");
});
// //Middlware for Logging Information:
// // Logger
// app.use((req,res,next)=>{
//     req.time= new Date(Date.now());
//     console.log( "Hello, i am the Home Middleware console: ",req.method, req.hostname, req.time);
//     next();
// })
// app.use((req,res,next) =>{
//     console.log(" Hi, i am Middleware");
//     res.send("Hello i am Middleware");
//     // const {query} = req.query;
//     // console.log(query);
//     // res.redirect("/random");
//     next();
// });
// app.use((req,res,next) =>{
//     console.log(" Hi, i am 2nd Middleware");
//     // res.send("Hello i am Middleware");
//     // const {query} = req.query;
//     // console.log(query);
//     // res.redirect("/random");
//     // next();
// });


app.get("/",(req,res)=>{
    console.log("Hi, I am root API console");
     res.send("Hello i am Root");
});

app.use("/random",(req,res,next)=>{
    console.log("This is random Middleware for console log");
    next();
})
app.get("/random",(req,res)=>{
    console.log("Hi, I am Random");
    res.send("Hello i am Random");
});

//API Token
const checkToken= ("/api",(req,res,next)=>{
    let {token}=req.query;
    if (token=="giveaccess"){
        next();
    }
    throw new Error("Access Denied");
});
//Token Authentication passed in request API Arguments/parameters

app.get("/api",checkToken,(req,res)=>{
    res.send("Data");
});


//At Last Unfound API/Page Response: OR Error Handling Middleware;
app.get("/err",(req,res)=>{
    abcd=abcd;
});

app.use((err,req,res,next)=>{
    console.log("____ERROR________");
    console.log(err);
    next(err);
});

app.use((req,res)=>{ 
    res.status(404).send("Page not found");
});
    