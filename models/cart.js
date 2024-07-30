const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  
  },
  items: [
    {
      product_id: {
        type: String,
        // ref: 'Product', // Reference to the Product schema
        // required: true,
        default:null
      },

      price:{
        type : Number,
        default : null

      },
      quantity: {
        type: Number,
        // required: true,
        default:null,
        min: 1 // Ensure that quantity is at least 1

      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});



const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
