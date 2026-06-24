const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      unique: true,
      maxlength: 140
    },

    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 2000
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Men', 'Women', 'Children', 'Unisex'],
        message: '{VALUE} is not a supported category'
      }
    },

    brand: {
      type: String,
      default: 'KickStreet',
      trim: true
    },

    sizes: {
      type: [{ type: String, trim: true }],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one size must be specified'
      }
    },

    colors: [
      {
        type: String,
        trim: true
      }
    ],

    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },

    images: {
      type: [{ type: String, trim: true }],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one product image is required'
      }
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0
    },

    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Auto slug generator
productSchema.pre('validate', function () {
  if (!this.slug || this.isModified('name')) {
    this.slug = slugify(this.name);
  }
});

// Indexes (performance optimization)
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ rating: -1 });

module.exports = mongoose.model('Product', productSchema);