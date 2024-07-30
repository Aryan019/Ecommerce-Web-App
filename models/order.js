const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const orderSchema = new Schema({


    order_id: {
        type: String,
        default: () => uuidv4(),  // Generate a unique ID by default
        unique: true,
    
      },
   

  user_id: {
    type: String,
    required: true,
  },


  items: [
    {
      product_id: {
        type: String,
        default: null
      },
      price: {
        type: Number,
        default: null
      },
      quantity: {
        type: Number,
        default: null,
        min: 1
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

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
