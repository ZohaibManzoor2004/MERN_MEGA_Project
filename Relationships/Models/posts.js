const mongoose = require("mongoose");
const {Schema} = mongoose;

main()
    .then(()=> console.log("Connection successful"))
    .catch((err)=> console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/relationDemo");
}

const userSchema = new Schema({
    username: String,
    email: String
});

const postSchema = new Schema({
    content: String,
    likes: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

const addData = async () =>{
    // let user1 = new User({
    //     username: "Zahoor Qasmi",
    //     email :"zahoorqasmi2002@gmail.com"
    // });
    // let post1 = new Post({
    //     content: "Hello Pakis/Gypsies",
    //     likes: 7
    // });
    // post1.user = user1;
    // await user1.save();
    // await post1.save();

    let user2 = await User.findOne({username: "Zahoor Qasmi"});
    let post2 = new Post({
        content: "Hello Useless People of the Group",
        likes: 25
    });
    post2.user = user2;
    await post2.save();
};
//addData();
const getdata = async ()=>{
    //here the Populate function restructures the data with id in the child doc,
    let result = await Post.findOne({}).populate("user","username");
    console.log(result);
};

getdata();
