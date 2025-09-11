//Should conatain all the routes for Listings
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
//this is listing Model 
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");


//Index Route
router.get("/" ,async (req,res)=>{
    let allListings = await Listing.find({});
    //console.log(allListings);
    //res.render("listings/index.ejs", {allListings});
    res.render("listings/index.ejs", {allListings});
    //console.log(allListings[0].image.url);
});

//New Route
router.get("/new" ,
    isLoggedIn ,(req,res)=>{
    //condition if the user Logged in, then allow him to create listing
    // .isAuthenticate method checks if the 
    console.log("req reached on new");
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id",
    // isLoggedIn,
    wrapAsync(async (req,res)=>{
    let {id}=req.params;
    //console.log(id);
    //used populate for reviews to be reconstructed for complete object instead of key
    const listing = await Listing.findById(id)
    .populate("owner")
    .populate("reviews")
    .populate({
        path: "reviews",
        populate: { path: "author" }
    });
    //console.log("The information about listing of review etc purposes", listing);
    console.log("The information about Owner of review etc purposes", 
        listing.reviews.author);

    //console.log("this is the info of listing owner",listing.owner);
    if (!listing){
        req.flash("error", "Requested Path for Listing does not Exist!");
        res.redirect
        ("/listings");
    }
    res.render("listings/show.ejs",{listing});
    })
);
//Post the New Listing 
//OR Create Route
//here we can remove wrapAsync
router.post("/", 
    validateListing,
    isLoggedIn,
    wrapAsync(async (req,res,next)=>{
        let newListing=req.body.listing;
        //condition to check if the body is not null and deal the error
        //console.log("Image URL: ", newListing.image.url);
        if (newListing.image.url === ""){
            let DefaultURL= "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
            newListing.image.url = DefaultURL;
        }
        let result = listingSchema.validate(req.body);
        //console.log(result);
        if (result.error){
            throw new ExpressError( 400, result.error); // optional: better error
            //console.log("error occured in validating new listing");
        }

        //console.log("NEW LISTING Object DATA: ", newListing.image.url);
        newListing = new Listing(newListing);
        newListing.owner = req.user._id;

        await newListing.save();
        //console.log("Listing was inserted: ");
        //flash message is defined in local var at this moment!
        req.flash("success", "New Listing Created!");
        //to be removed!!
        //req.flash("error", "listing Not Created!");
        res.redirect("/listings"); 
    }
));

//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    //Ok till here
    const listing = await Listing.findById(id);
    //condition to flash msg if requested wrong/incorrect/unexisting id
    if (!listing){
        req.flash("error", "Requested Path for Listing does not Exist!");
        res.redirect("/listings");
    }
    //console.log("Request reached at edit route with listing: ", listing);
    res.render("listings/edit.ejs",{listing});
    })
);
 
//Post/Put the Edited Route//Update Route
router.put("/:id/edit",
    isLoggedIn,
    isOwner,
    validateListing, 
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    id = id.trim();
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    //let editedListing = req.body.listing;
    //console.log(editedListing);
    req.flash("success", "listing Updated!");
    res.redirect("/listings");
    })
);

//Delete Route
router.delete("/:id/delete",
    isLoggedIn,
    isOwner,
    wrapAsync(async(req,res)=>{
    console.log("reached at delete");
    let {id} = req.params;
    let DelListing = await Listing.findByIdAndDelete(id);
    //console.log("The Listing was Deleted: ",DelListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
    }
));




module.exports = router;