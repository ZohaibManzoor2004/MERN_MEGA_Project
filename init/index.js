const mongoose = require("mongoose");
const initData = require("./data.js");
const Listings = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("Connected to DB");
})
.catch(()=>{
    console.log("Error Occured while connecting Database");
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listings.deleteMany({});
    await Listings.insertMany(initData.data);
    console.log(" Data was Initialized");
}

initDB();