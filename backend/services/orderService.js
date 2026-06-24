const ApiError = require('../utils/apiError');
const Product = require('../models/Product');

/**
 * Builds validated order items from cart
 */
const buildOrderFromCart = async (items, { session } = {}) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError('Your cart is empty', 400);
  }

  // Merge duplicates (product + size)
  const consolidated = new Map();

  for (const item of items) {
    if (!item.productId || !item.size) {
      throw new ApiError('Each cart item must include a product and size', 400);
    }

    const quantity = Number(item.quantity);

    if (!quantity || quantity < 1) {
      throw new ApiError('Choose a valid quantity for each item', 400);
    }

    const key = `${item.productId}::${item.size}`;

    consolidated.set(key, {
      productId: item.productId,
      size: item.size,
      quantity: (consolidated.get(key)?.quantity || 0) + quantity
    });
  }

  const orderItems = [];
  let amountTotal = 0;

  for (const { productId, size, quantity } of consolidated.values()) {
    const product = await Product.findById(productId).session(session ?? null);

    if (!product) {
      throw new ApiError('A product in your cart no longer exists', 404);
    }

    // Stock check
    if (product.stock < quantity) {
      throw new ApiError(`${product.name} has only ${product.stock} left`, 400);
    }

    // Size validation
    if (!product.sizes.includes(size)) {
      throw new ApiError(`Choose a valid size for ${product.name}`, 400);
    }

    amountTotal += product.price * quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      quantity,
      price: product.price,
      size,
      image: product.images?.[0] || ''
    });
  }

  return { orderItems, amountTotal };
};

/**
 * Decrements product stock safely (atomic update)
 */
const decrementStock = async (items, { session } = {}) => {
  for (const item of items) {
    const updated = await Product.findOneAndUpdate(
      {
        _id: item.product,
        stock: { $gte: item.quantity }
      },
      {
        $inc: { stock: -item.quantity }
      },
      {
        new: true,
        session: session ?? null
      }
    );

    if (!updated) {
      throw new ApiError(
        `${item.name} is no longer available in the requested quantity`,
        409
      );
    }
  }
};

module.exports = { buildOrderFromCart, decrementStock };