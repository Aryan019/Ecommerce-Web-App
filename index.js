// Setting the express server up 
const express = require('express');
const app  = express();
const path = require('path')
const methodOverride = require('method-override')


// Establishing connection with mongoose
const mongoose = require('mongoose');
const Product = require('./models/product.js');
const User = require('./models/user.js');
const Cart = require('./models/cart.js')

// Requring the env file 
require("dotenv").config()
// const DB_Url = process.env.DB_URL   


mongoose.connect('mongodb://127.0.0.1:27017/rabloAssignDB')
.then(()=>{
    console.log("Connection open for mongoose")
})

.catch(err =>{
    console.log("Oh no mongo threw an error")
    console.log(err)

})

// Connecting to the online db 
// mongoose.connect(DB_Url)
// .then(()=>{
//     console.log("Connection open for mongoose")
// })

// .catch(err =>{
//     console.log("Oh no mongo threw an error")
//     console.log(err)

// })



// Middlewares here please 
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))

// The carriers
let featuredData;
let isAuthenticated = 0;
let cartUniqueId = "";
// console.log(cartUniqueId)
let alert = 0;


// Routing Starting from here 
app.get('/products',async(req,res)=>{

    
   
    const allProducts = await Product.find({})
    // console.log(allProducts)
    // console.log(cartUniqueId)
    res.render('index',{allProducts,isAuthenticated,alert})

})

// Route for adding in new products
app.get('/products/new',(req,res)=>{

    res.render('newProduct',{isAuthenticated})
})




// Route where the form submits to 
app.post('/products',async(req,res)=>{
    // Making the checkbox input from on to true 

    if(isAuthenticated==1){
  
    const checkFeatured = req.body.featured;
    if(req.body.image ==''){
        req.body.image = 'https://static.vecteezy.com/system/resources/previews/028/047/017/non_2x/3d-check-product-free-png.png'
    }
    // console.log(checkFeatured)

    if(checkFeatured == 'on'){
        req.body.featured = true
    }
    
    else{
        req.body.featured = false;
    }

    console.log(req.body)

    // Making in the new product 
    const newProduct = new Product(req.body);
    await newProduct.save();

    
    res.redirect('/products')}
}
)

// Updating a product 
app.get('/products/:id/edit',async(req,res)=>{

    if(isAuthenticated==1){

    // Fetching the unique product id 
    const {id} = req.params;

    // finding the product to update 
    const product = await Product.findById(id)
    res.render('edit',{product,isAuthenticated})
    }

})

app.put('/products/:id',async(req,res)=>{

    if(isAuthenticated==1){

    console.log(req.body)

    const checkFeatured = req.body.featured;
    // console.log(checkFeatured)

    if(checkFeatured == 'on'){
        req.body.featured = true
    }
    
    else{
        req.body.featured = false;
    }

    // changing the inner database
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id,req.body,{runValidators:true, new:true});
    
    console.log(product)
    res.redirect('/products')}
})

// Setting up the delete route 
app.delete('/products/:id',async(req,res)=>{
    if(isAuthenticated==1){
    const {id} = req.params;
    await Product.findByIdAndDelete(id)

    res.redirect('/products')}

})

// route to get the featured products
app.get('/featuredProducts',async(req,res)=>{
    const msg = "Displaying all the featured items"
    featuredData = await Product.find({ featured: true });
    res.render('featuredProducts',{featuredData,msg,isAuthenticated})
})

// Sorting by price route (all products)
app.get('/products/:sort',async(req,res)=>{

    let productSort;

    const {sort} = req.params;
    console.log(sort);
   
    if(sort==='over'){
    const msg = "Displaying all products over 1000"
    productSort = await Product.find({ price: { $gte: 1000 } });
    res.render('sortByCost',{productSort,msg,isAuthenticated})
    }

    else if(sort==='under'){
        const msg = "Displaying all products under 1000"
        productSort = await Product.find({ price: { $lt: 1000 } });
        res.render('sortByCost',{productSort,msg,isAuthenticated});

    }

    else if(sort==='underfeatured'){
        const msg = "Displaying all featured items under 1000"
        featuredData = await Product.find({ 
            $and: [
                { price: { $lt: 1000 } },
                { featured: true }
            ]
        });

        res.render('featuredProducts',{featuredData,msg,isAuthenticated});
        
        
    }

    else{
        const msg = "Displaying all featured items over 1000"
        featuredData = await Product.find({ 
            $and: [
                { price: { $gte: 1000 } },
                { featured: true }
            ]
        });

        res.render('featuredProducts',{featuredData,msg,isAuthenticated});
        

    }

})

app.get('/login',(req,res)=>{
    // res.send("Hey you have hit the login page")
    res.render('login')
})


app.get('/register',(req,res)=>{
    res.render('register')
})

// Post request for handling the register form data
app.post('/register',async(req,res)=>{
    console.log(req.body)
    
    const usernameID = req.body.username;
    const newUser = new User(req.body);
    await newUser.save();


    // console.log(username)

    // featuredData = await Product.find({ featured: true });
    const userData = await User.find({username : usernameID})
    console.log(userData[0])

    console.log(userData[0].user_id)

    // Initializing the new persons cart if he is visting first time 
    // that is registering 

    const cartId = userData[0].user_id +"";

    const newCart = new Cart({user_id : cartId});
    await newCart.save();



    res.redirect('/login')

})

app.post('/login',(req,res)=>{

    const userNameEntered = req.body.username;
    const userPassEntered = req.body.password;

    User.findOne({ username: userNameEntered})
    .then(user => {
        if (user) {
            console.log('user found')
            if(user.password === userPassEntered){

             
                cartUniqueId = user.user_id;
                console.log(cartUniqueId)
                isAuthenticated = 1;
                res.redirect('/products')

            }
            else{
                res.redirect('/login')
            }


        } else {
            console.log('User not found');
            res.redirect('/login')
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });



    console.log(req.body)
})


app.get('/logout',(req,res)=>{
    isAuthenticated=0;
    res.redirect('products')
})

app.get('/',(req,res)=>{
    res.render('login')
})


// Setting up the cart 
{/* <form class="d-inline-flex " action="/products/<%=product._id%>/edit" method="get">
          <button class="btn btn-primary">Edit</button></form> */}

app.post('/cart/:id',async(req,res)=>{

    console.log("here i am ")
console.log(cartUniqueId)

const product_id = req.params.id;
console.log(product_id)

// Finding out the price from the product id 
const particularProduct = await Product.findOne({_id : product_id})
console.log("particular pro is ")
console.log("price is")
console.log(particularProduct.price);

const price = particularProduct.price;



let quantity = 1;
// const cartData = await Cart.findOne({user_id : cartUniqueId});

// console.log(cartData.items);

// const oldArr = cartData.items;
// oldArr.push({ product_id, quantity });
// console.log(oldArr);

  const updatedCart = await Cart.findOneAndUpdate(
      { user_id : cartUniqueId}, // Filter to find the document
      { $push: { items: { product_id,price, quantity } }, $set: { updatedAt: Date.now() } }, // Update operation
      { new: true, useFindAndModify: false } // Options: return the updated document
    );


console.log("Cart data")
console.log(updatedCart);

alert = 1;

res.redirect('/products')








// alert("Item successfully added to the cart")
// console.log(cartData)
// res.send("Added to the cart")


})

app.get('/cart',async(req,res)=>{

    // res.render('cart',{cartUniqueId})
    // const getAllProducts = 




   async function findProductsByUserId(cartUniqueId) {
        try {
          const carts = await Cart.find({ user_id: cartUniqueId });
          
      
          // Extract all items from the found carts
          const allItems = carts.reduce((acc, cart) => {
            return acc.concat(cart.items);
          }, []);
      
          console.log(allItems);
          return allItems;
        } catch (err) {
          console.error(err);
        }
      }



findProductsByUserId(cartUniqueId)
.then(allItems => {
  // Handle the resolved promise here
  console.log("all the items are")
  console.log(allItems);
  res.render('cart',{allItems})
})
.catch(err => {
  // Handle any errors here
  console.error('Error:', err);
});



      

})

app.listen(3000,()=>{
    console.log("App is listening on port 3000")
})