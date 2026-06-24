const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    size: { type: String, required: true },
    image: { type: String, default: '' }
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    line1: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, default: 'IN', trim: true },
    phone: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Order must contain at least one item'
      }
    },

    amountTotal: {
      type: Number,
      required: true,
      min: 0
    },

    currency: {
      type: String,
      default: 'INR'
    },

    paymentMethod: {
      type: String,
      enum: ['cod'],
      default: 'cod'
    },

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending'
    },

    orderStatus: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
      default: 'Processing'
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true
    },

    trackingId: {
      type: String,
      default: null,
      trim: true
    },

    paidAt: {
      type: Date,
      default: null
    },

    deliveredAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Indexes for performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ trackingId: 1 }, { sparse: true });

module.exports = mongoose.model('Order', orderSchema);