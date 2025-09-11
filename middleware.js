const Listing = require("./models/listing.js");
const {listingSchema, reviewSchema} = require("./Schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) =>{
    // .isAuthenticate  Authenticates if the user object (created through session once user logs in ) exists or not!
if (!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be Logged in to create listing!");
        //res.locals.redirectUrl = req.session.redirectUrl;
        //console.log("the intended path for req when not login ", res.locals.redirectUrl)
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next ) => {
    if (req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        //console.log("the intended path for req when not login ", res.locals.redirectUrl)
    }
    next();
};

module.exports.isOwner = async(req, res, next )=>{
    let {id} = req.params;
    id = id.trim();
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to Edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next ) => {
    let {error } = listingSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        //throw ExpressError(404, result.error);
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req, res, next ) => {
    let {error } = reviewSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        //throw ExpressError(404, result.error);
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async(req, res, next )=>{
    let { id, reviewId } = req.params;
    console.log("this is isReviewAuthor id from req.params", id);
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the Author if this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};