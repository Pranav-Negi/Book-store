const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  orderedItems: [
    {
      bookid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"]
      },
      price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
      }
    }
  ],

  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true }
  },

  paymentMethod: {
    type: String,
    default: "Cash on delivery",
    enum: ["Cash on delivery", "Credit Card", "UPI"]
  },

  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email: { type: String }
  },

  totalPrice: {
    type: Number,
    required: true,
    min: [0, "Total price must be at least 0"]
  },

  isPaid: {
    type: Boolean,
    default: false
  },

  paidAt: { type :Date},

  isDelivered: {
    type: Boolean,
    default: false
  },

  deliveredAt:  { type :Date},

  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  }

}, {
  timestamps: true
});

orderSchema.pre("save", function (next) {
    if (this.isModified("isPaid") && this.isPaid && !this.paidAt) {
      this.paidAt = new Date();
    }
    if (this.isModified("isDelivered") && this.isDelivered && !this.deliveredAt) {
        this.deliveredAt = new Date();
      }
    next();
  });

module.exports = mongoose.model("Order", orderSchema);
