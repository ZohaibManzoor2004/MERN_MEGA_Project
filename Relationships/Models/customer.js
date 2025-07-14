const mongoose = require("mongoose");
const {Schema} = mongoose;
main()
    .then(()=> console.log("Connection successful"))
    .catch((err)=> console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/relationDemo");
}


const orderSchema = new Schema({
    item: String,
    price: Number
});
 const customerSchema = new Schema({
    name:String,
    orders:[
        {
            type: Schema.Types.ObjectId,
            ref: "Order" ,
        },
    ],
 });

const Order = mongoose.model("Order", orderSchema);
const Customer = mongoose.model("customer", customerSchema);

//now filled  the data in the customer model/collection in the DB
const addCustomer = async()=>{
    let cust1=new Customer({
        name:"Zohaib Manzoor",
    });
    //find the data by specific condition (chips, chocolate in the case) and include its' refrence to the parent(customer)
    let order1 = await Order.findOne({item: "Chips"});
    let order2= await Order.findOne({item: "Chocolate"});
//Here we push the entire object but in actual, the database only stores the id of the child object in the parent object
    cust1.orders.push(order1);
    cust1.orders.push(order2);
    //let result= await cust1.save();
    let result= await cust1.save();
    console.log( "Customer1 Data is:", result);
}
//addCustomer();

//initially inserted data in the Model/Collection
const addOrders = async()=>{
    let orders= await Order.insertMany([
        {item: "Samosa", price: 12},
        {item: "Chips", price: 10},
        {item: "Chocolate", price: 40}
    ]);
    console.log(orders);
}
//addOrders();

//Random fn for testing populate function
//Populate: a process/fn to replace the parent reference to convert it to the data in the database rather then id ref there.
const findCustomer= async()=>{
    let result = await Customer.find({}).populate("orders");
    console.log("The All customer's collection data is: ", result[0]);
}
//findCustomer();





