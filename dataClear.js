// Connecting to the DB
const mongoose = require('mongoose');
const Product = require('./models/product')


mongoose.connect('mongodb://127.0.0.1:27017/rabloAssignDB')
.then(()=>{
    console.log("Connection open for mongoose")
})

.catch(err =>{
    console.log("Oh no mongo threw an error")
    console.log(err)

})






// Handling the errors
async function clearData(){
try{
const clearData =  await Product.deleteMany({});
console.log(clearData)

}
catch(e){
    console.log("error occoured");
    console.log(e)
}
console.log("All data cleared successfully")

}

clearData();