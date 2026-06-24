const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const Product = require('../models/Product');

const DUPLICATE_KEY_ERROR_CODE = 11000;

// Only admin-writable fields (secure approach)
const WRITABLE_FIELDS = [
  'name',
  'description',
  'price',
  'category',
  'brand',
  'sizes',
  'colors',
  'stock',
  'images',
  'isFeatured'
];

const pickWritableFields = (body) =>
  WRITABLE_FIELDS.reduce((acc, field) => {
    if (body[field] !== undefined) acc[field] = body[field];
    return acc;
  }, {});

// FIXED: proper regex escaping
const escapeRegex = (str = '') =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const handleDuplicateKeyError = (error) => {
  if (error?.code === DUPLICATE_KEY_ERROR_CODE) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    throw new ApiError(`A product with this ${field} already exists`, 409);
  }
  throw error;
};

const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 50);
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.category && req.query.category !== 'All') {
    filter.category = req.query.category;
  }

  if (req.query.featured === 'true') {
    filter.isFeatured = true;
  }

  if (req.query.search) {
    const safeSearch = escapeRegex(req.query.search.trim());

    if (safeSearch) {
      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
        { brand: { $regex: safeSearch, $options: 'i' } }
      ];
    }
  }

  const sort =
    req.query.sort === 'price_asc'
      ? { price: 1 }
      : req.query.sort === 'price_desc'
      ? { price: -1 }
      : { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter)
  ]);

  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  const query = isValidObjectId
    ? { $or: [{ _id: id }, { slug: id }] }
    : { slug: id };

  const product = await Product.findOne(query);

  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  res.json({
    success: true,
    product
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const data = pickWritableFields(req.body);

  let product;
  try {
    product = await Product.create(data);
  } catch (error) {
    handleDuplicateKeyError(error);
  }

  res.status(201).json({
    success: true,
    product
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  Object.assign(product, pickWritableFields(req.body));

  try {
    await product.save();
  } catch (error) {
    handleDuplicateKeyError(error);
  }

  res.json({
    success: true,
    product
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: 'Product deleted'
  });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};