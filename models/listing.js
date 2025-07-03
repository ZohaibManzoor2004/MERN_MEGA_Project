//Once it is made/initailized , we can call it  by its required fun assined variable name to perform db operations.

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    //shraddha
    image:{
        type:Object,
        filename: { 
            type:String,
            required:true,
            default:"Default Image",
        },
        url:{
            type: String,
            required: true,
            default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        set: (url) => 
            url && url.trim() === ""
            ?"https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
            : url,
        }},
    // image: {
    //     filename: String,
    //     type:Object,
    //     url: String,
    //     default:{ 
    //         url : "https://unsplash.com/photos/white-and-red-wooden-house-miniature-on-brown-table-rgJ1J8SDEAY",
    //     },
    //   // set: (v) => v === "" ? "https://unsplash.com/photos/white-and-red-wooden-house-miniature-on-brown-table-rgJ1J8SDEAY" : v,
    // },
    // image: {
    //     type:String,
    //     default: "https://unsplash.com/photos/white-and-red-wooden-house-miniature-on-brown-table-rgJ1J8SDEAY",
    //     set: (v) => v === "" ? "https://unsplash.com/photos/white-and-red-wooden-house-miniature-on-brown-table-rgJ1J8SDEAY" : v,
    // },
    price:Number,
    location:String,
    country:String,
});
const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;