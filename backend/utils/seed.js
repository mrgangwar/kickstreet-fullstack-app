const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config();

const products = [
  {
    name: 'KickStreet Velocity Runner',
    description: 'Lightweight everyday sneaker with a breathable knit upper and responsive street-ready cushioning.',
    price: 5499,
    category: 'Men',
    brand: 'KickStreet',
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Black', 'Volt'],
    stock: 24,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80'],
    isFeatured: true
  },
  {
    name: 'KickStreet Aura High',
    description: 'A high-top silhouette with padded ankle support, matte overlays, and clean court-inspired lines.',
    price: 6799,
    category: 'Unisex',
    brand: 'KickStreet',
    sizes: ['6', '7', '8', '9', '10'],
    colors: ['White', 'Crimson'],
    stock: 18,
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80'],
    isFeatured: true
  },
  {
    name: 'KickStreet Mini Flex',
    description: 'Durable kids sneaker with flexible sole grooves, soft lining, and easy all-day wear.',
    price: 2999,
    category: 'Children',
    brand: 'KickStreet',
    sizes: ['1', '2', '3', '4', '5'],
    colors: ['Navy', 'Sky'],
    stock: 30,
    images: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=80'],
    isFeatured: false
  }
];

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Product.deleteMany({})]);

  await User.create({
    name: 'Kick Street Admin',
    email: 'admin@kickstreet.app',
    phone: '9999999999',
    password: 'Admin@12345',
    role: 'admin'
  });

  await Product.create(products);
  console.log('Seed data imported');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
