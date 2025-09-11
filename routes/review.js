//Should conatain all the routes for Reviews
const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../Schema.js");
//this is listing Model 
const Listing = require("../models/listing.js");
//this is Review Model
const Review = require("../models/review.js");
const {validateReview, isReviewAuthor} = require("../middleware.js");
const {isLoggedIn, isOwner} = require("../middleware.js");

console.log("the content of middleware: ", validateReview);
// const validateReview = (req, res, next ) => {
//     let {error } = reviewSchema.validate(req.body);
//     if (error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         //throw ExpressError(404, result.error);
//         throw new ExpressError(404, errMsg);
//     }else{
//         next();
//     }
// }
// Reviews
//Post Route
router.post("/",
    isLoggedIn ,
    validateReview , 

    wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log("This is new Review info console: ",newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
    //res.send("Review Posted");
}));
//Delete Review
router.delete("/:reviewId",
    isLoggedIn ,
    isReviewAuthor ,
    wrapAsync(async (req,res)=>{
        console.log("the req body at the isReviewAuthor middleware: ", req);
        let { id, reviewId } = req.params;
        //console.log("Review delete req recieved ");
        //pull operator deletes the item(s) that match the condition
        //the line below deletes the 
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        //Deleting the review from review collection
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted!");
        res.redirect(`/listings/${id}`);
 }));

module.exports = router;