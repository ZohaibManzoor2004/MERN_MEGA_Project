const express = require("express");
const app = express();
const mongoose= require("mongoose");//db
const Listing = require("./models/listing.js");
const {listingSchema} = require("./Schema.js");
const path = require("path");//
app.use(express.urlencoded({extended: true}));
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
//Acquiring database 
const MONGO_URL="mongodb://mongo:KGbMEWGsGbxuziXtjqrRDnflXpJhBJGA@mongodb.railway.internal:27017";
//const MONGO_URL = "mongodb://localhost:27017/wanderlust";

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
//Joi schema Validation
const validateListing = (req, res, next ) => {
    let {error } = listingSchema.validate(req.body);
    if (error){
        let errMsg= error.details.map((el) => el.message).join(",");
        //throw ExpressError(404, result.error);
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}
//Index Route
app.get("/listings" ,async (req,res)=>{
    let allListings = await Listing.find({});
    //console.log(allListings);
    //res.render("listings/index.ejs", {allListings});
    res.render("listings/index.ejs", {allListings});
    //console.log(allListings[0].image.url);
});
//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
//////////Extra Work for routes////////////////////////////to///////////////////////////////////////////////

//Home Route
app.get("/", (req,res)=>{
    res.render("listings/Home.ejs");
});
//Login Route
app.get("/login",(req,res)=>{
    res.render("listings/login.ejs");
})
//About Route
app.get("/about" ,(req, res)=>{
    res.render("listings/about.ejs");
});
//Privacy  Route
app.get("/privacy",(req,res)=>{
    res.render("listings/privacy.ejs");
});
//Terms Route
app.get("/terms",(req,res)=>{
    res.render("listings/terms.ejs");
}); 
//////////////////////////////////////////////////////till///////////////////////////////////////////////////////////
//Show Route
app.get("/listings/:id" ,
    wrapAsync(async (req,res)=>{
    let {id}=req.params;
    //console.log(id);
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
    })
);
//Post the New Listing 
//OR Create Route
//here we can remove wrapAsync
app.post("/listings", validateListing,
    wrapAsync(async (req,res,next)=>{
    let newListing=req.body.listing;
    //condition to check if the body is not null and deal the error
    //console.log("Image URL: ", newListing.image.url);
    if (newListing.image.url === ""){
        let DefaultURL= "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
        newListing.image.url = DefaultURL;
    }
    let result = listingSchema.validate(req.body);
    console.log(result);
    
    if (result.error){
        throw new ExpressError(400, result.error); // optional: better error
}

    //console.log("NEW LISTING Object DATA: ", newListing.image.url);
    newListing = new Listing(newListing);
    await newListing.save();
    //console.log("Listing was inserted: ");
    res.redirect("/listings");  
    }
));

//Edit Route
app.get("/listing/:id/edit",
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    //Ok till here
    const listing = await Listing.findById(id);
    //console.log("Request reached at edit route with listing: ", listing);
    res.render("listings/edit.ejs",{listing});
    })
);

//Post/Put the Edited Route//Update Route

app.put("/listing/:id/edit",validateListing, 
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    id = id.trim();
    //console.log(req.body.listing);
    //let listing = await Listing.findById(id);
    //console.log("Edited listing is : ", listing);
    let listing=await Listing.findByIdAndUpdate(id , {...req.body.listing})
    //let editedListing = req.body.listing;
    //console.log(editedListing);
    res.redirect("/listings");
    })
);

//Delete Route
app.delete("/listing/:id/delete",
    wrapAsync(async(req,res)=>{
    //console.log("reached at delete");
    let {id} = req.params;
    let DelListing = await Listing.findByIdAndDelete(id);
    //console.log("The Listing was Deleted: ",DelListing);
    res.redirect("/listings");
    }
));

//Page unmatched default response (page not found)
app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page not Found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong" } = err;
    res.render("error.ejs",{err});
    //res.status(500).send("Soemthing went wrong while Saving Data to Database");
    //res.status(statusCode).send(message);
});
// app.get("/testListing" ,async (req,res)=>{
//     let sampleListing = new Listing({ 
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Galata Tower, Istanbul",
//         country: "Turkey",
//     });
//     await sampleListing.save();
//     console.log("Sample was Saved");
//     res.send("Successful testing");
// });

