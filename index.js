// Setting the express server up 
const express = require('express');
const app  = express();
const path = require('path')
const methodOverride = require('method-override')
const session = require('express-session')
const bodyParser = require("body-parser");

// Establishing connection with mongoose
const mongoose = require('mongoose');
const Product = require('./models/product.js');
const User = require('./models/user.js');
const Cart = require('./models/cart.js')
const Order = require('./models/order.js')
const Session = require('./models/session.js')


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


app.use(session({
    secret : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:false,
    cookie: { secure: false }
}))

app.use(
    bodyParser.json({
      type: ["application/form-data", "application/json"], // Support json encoded bodies
    })
  );


app.use((req, res, next) => {
    req.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    next();
});



app.get('/login',(req,res)=>{
    // res.send("Hey you have hit the login page")
    res.render('login')
})

app.post('/login',async(req,res)=>{

    // const userNameEntered = req.body.username;
    // const userPassEntered = req.body.password;

    // User.findOne({ username: userNameEntered})
    // .then(user => {
    //     if (user) {



    //         console.log('user found')
    //         if(user.password === userPassEntered){

    //             req.session.userId = user._id;

    //             // Create a new session record
    //             await new Session({
    //                 user_id: user._id,
    //                 loginTime: Date.now(),
    //                 ipAddress: req.ipAddress
    //             }).save();

             
             
    //             cartUniqueId = user.user_id;
    //             console.log(cartUniqueId)
    //             isAuthenticated = 1;
    //             res.redirect('/products')

    //         }
    //         else{
    //             res.redirect('/login')
    //         }


    //     } else {
    //         console.log('User not found');
    //         res.redirect('/login')
    //     }
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });



    // console.log(req.body)

    const userNameEntered = req.body.username;
    const userPassEntered = req.body.password;
  
    try {
      const user = await User.findOne({ username: userNameEntered });
  
      if (user) {
        console.log('user found');
        if (user.password === userPassEntered) {
          req.session.userId = user._id;
  
          // Create a new session record
        const sessionConig =new Session({
            user_id: user._id,
            loginTime: Date.now(),
            ipAddress: req.ip
          })


          await sessionConig.save();
  
          cartUniqueId = user.user_id;
          console.log(cartUniqueId);
          isAuthenticated = 1;
          res.redirect('/products');
        } else {
          res.redirect('/login');
        }
      } else {
        console.log('User not found');
        res.redirect('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      res.redirect('/login');
    }
  
    console.log(req.body);

  
})

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








app.get('/userMode',async(req,res)=>{
    // if (req.session.userId) {
    //     // Update logout time
    //     await Session.findOneAndUpdate(
    //         { user_id: req.session.userId, logoutTime: { $exists: false } },
    //         { logoutTime: Date.now() }
    //     );
    //     req.session.destroy();
    // }

    isAuthenticated=0;
    res.redirect('/products');



   
    // res.redirect('products')
})


app.get('/logout',async(req,res)=>{
    if (req.session.userId) {
        // Update logout time
        await Session.findOneAndUpdate(
            { user_id: req.session.userId, logoutTime: { $exists: false } },
            { logoutTime: Date.now() }
        );
        req.session.destroy();
    }

    isAuthenticated=0;
    res.redirect('/login');

})


app.get('/sessions',async(req,res)=>{

    try {
        const allSessionInfo = await Session.find({});
        res.status(201).json(allSessionInfo);
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching session data.' });
      }

})



app.get('/paymentGateway',(req,res)=>{
    res.send("Payment gateway will be here ");
})


app.get('/',(req,res)=>{
    res.render('login')
})



// Removing something from the cart 
app.get('/cart/delete/:id',(req,res)=>{


    // Product id to be deleted
    const productId = req.params.id;
    const userId = cartUniqueId;

    // Current user id 


    async function deleteCartItem(userId, productId) {
        try {
          const result = await Cart.updateOne(
            { user_id: userId },
            { $pull: { items: { product_id: productId } } }
          );
      
          if (result.nModified > 0) {
            console.log(`Item with product_id ${productId} removed from cart for user_id ${userId}`);
          } else {
            console.log(`No item found with product_id ${productId} for user_id ${userId}`);
          }
        } catch (error) {
          console.error('Error removing item from cart:', error);
        }
      }

      deleteCartItem(userId,productId);
      alert = 0

    res.redirect('/cart')


 
})


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




//    async function findProductsByUserId(cartUniqueId) {
//         try {
//           const carts = await Cart.find({ user_id: cartUniqueId });

      
//           // Extract all items from the found carts
//           const allItems = carts.reduce((acc, cart) => {
//             return acc.concat(cart.items);
//           }, []);
      
//           console.log(allItems);
//           return allItems;
//         } catch (err) {
//           console.error(err);
//         }
//       }



// findProductsByUserId(cartUniqueId)
// .then(allItems => {
//   // Handle the resolved promise here
//   console.log("all the items are")
//   console.log(allItems);
//   res.render('cart',{allItems})
// })
// .catch(err => {
//   // Handle any errors here
//   console.error('Error:', err);
// });


async function findProductsByUserId(cartUniqueId) {
    try {
      const carts = await Cart.find({ user_id: cartUniqueId });
  
      // Extract all items from the found carts
      const allItems = carts.reduce((acc, cart) => {
        return acc.concat(cart.items);
      }, []);
  
      // Fetch product details for each item
      const detailedItems = await Promise.all(allItems.map(async (item) => {
        if (item.product_id) {
          const product = await Product.findById(item.product_id);
          return {
            ...item._doc,
            product: product ? product._doc : null
          };
        }
        return item;
      }));
      
    //   console.log(detailedItems)
      return detailedItems;
      
    } catch (err) {
      console.error(err);
      throw err; // Re-throw the error to handle it in the `.catch` block of the promise chain
    }
  }
  
  findProductsByUserId(cartUniqueId)
    .then(allItems => {
      // Handle the resolved promise here
      console.log("All the items are:");
      console.log(allItems);
      // Assuming `res` is available in your controller context
      res.render('cart', { allItems });
    })
    .catch(err => {
      // Handle any errors here
      console.error('Error:', err);
    });


})

// /order/<%=item.product_id%> 

app.get('/order',async(req,res)=>{

    console.log("Reached here")
    alert = 0;

    const carts = await Cart.find({ user_id: cartUniqueId });

    console.log(carts[0].items)

   const order = new Order({
    user_id : cartUniqueId,
    items: carts[0].items,
    quantity : carts[0].quantity,

   });
   await order.save();

   const deletecart = await Cart.findOneAndDelete({user_id: cartUniqueId })
//    await deletecart.save();

   const newCart = new Cart({user_id : cartUniqueId});
   await newCart.save();

   
   res.redirect('/products')
    
   

})

app.get('/getOrdersData',(req,res)=>{


    async function findProductsByUserId(cartUniqueId) {
        try {
          const orders = await Order.find({ user_id: cartUniqueId });
      
          // Extract all items from the found carts
          const allItems = orders.reduce((acc, cart) => {
            return acc.concat(cart.items);
          }, []);
      
          // Fetch product details for each item
          const detailedItems = await Promise.all(allItems.map(async (item) => {
            if (item.product_id) {
              const product = await Product.findById(item.product_id);
              return {
                ...item._doc,
                product: product ? product._doc : null
              };
            }
            return item;
          }));
          
        //   console.log(detailedItems)
          return detailedItems;
          
        } catch (err) {
          console.error(err);
          throw err; // Re-throw the error to handle it in the `.catch` block of the promise chain
        }
      }
      
      findProductsByUserId(cartUniqueId)
        .then(allItems => {
          // Handle the resolved promise here
          console.log("All the items are:");
          console.log(allItems);
          // Assuming `res` is available in your controller context
        //   res.render('cart', { allItems });
        res.render('order', {allItems})
        })
        .catch(err => {
          // Handle any errors here
          console.error('Error:', err);
        });
  
})

app.listen(3000,()=>{
    console.log("App is listening on port 3000")
})