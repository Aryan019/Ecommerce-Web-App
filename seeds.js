
const Product = require('./models/product.js')


// Establishing connection with mongoose
const mongoose = require('mongoose')

// Offline connection 
// mongoose.connect('mongodb://127.0.0.1:27017/rabloAssignDB')
// .then(()=>{
//     console.log("Connection open for mongoose")
// })

// .catch(err =>{
//     console.log("Oh no mongo threw an error")
//     console.log(err)

// })
require("dotenv").config()


mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log("Connection open for mongoose")
})

.catch(err =>{
    console.log("Oh no mongo threw an error")
    console.log(err)

})



// Use this for seeding
const productsData = [
    {
        name: 'Product 1',
        price: 1099,
        rating: 3,
        company: 'Company A'
    },
    {
        name: 'Product 2',
        price: 2099,
        rating: 4.8,
        featured: true,
        company: 'Company B'
    },
    {
        name: 'Product 3',
        price: 1599,
        rating: 4.5,
        company: 'Company C'
    }
];


Product.insertMany(productsData)
    .then(r =>{
        console.log(r)
    })
    .catch(e => console.log("And the error occoured" + e))
