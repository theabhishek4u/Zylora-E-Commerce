import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Clear existing data (respect foreign key order) ───
  console.log('🗑️  Clearing existing data...');
  await prisma.notification.deleteMany();
  await prisma.recentlyViewed.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ All existing data cleared.');

  // ─── Hash passwords ───
  const adminPasswordHash = await bcrypt.hash('Admin@123', 12);
  const userPasswordHash = await bcrypt.hash('User@123', 12);

  // ─── Create Users ───
  console.log('👤 Creating users...');
  const admin = await prisma.user.create({
    data: {
      name: 'Admin ZShop',
      email: 'admin@zshop.in',
      phone: '+919876543210',
      password: adminPasswordHash,
      role: 'admin',
      emailVerified: true,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
  });

  const demoUser1 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@zshop.in',
      phone: '+919988776655',
      password: userPasswordHash,
      role: 'user',
      emailVerified: true,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    },
  });

  const demoUser2 = await prisma.user.create({
    data: {
      name: 'Rahul Verma',
      email: 'rahul@zshop.in',
      phone: '+919123456789',
      password: userPasswordHash,
      role: 'user',
      emailVerified: true,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
  });

  const demoUser3 = await prisma.user.create({
    data: {
      name: 'Ananya Iyer',
      email: 'ananya@zshop.in',
      phone: '+919876512340',
      password: userPasswordHash,
      role: 'user',
      emailVerified: true,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
  });

  console.log('✅ Users created.');

  // ─── Create Addresses ───
  console.log('📍 Creating addresses...');
  await prisma.address.createMany({
    data: [
      {
        userId: admin.id,
        name: 'Admin ZShop',
        phone: '+919876543210',
        address: '42, MG Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        isDefault: true,
        type: 'home',
      },
      {
        userId: demoUser1.id,
        name: 'Priya Sharma',
        phone: '+919988776655',
        address: 'A-201, Jubilee Hills, Road No 36',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        isDefault: true,
        type: 'home',
      },
      {
        userId: demoUser1.id,
        name: 'Priya Sharma',
        phone: '+919988776655',
        address: 'Plot 9, Sector 18, Cyber City',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122015',
        isDefault: false,
        type: 'office',
      },
      {
        userId: demoUser2.id,
        name: 'Rahul Verma',
        phone: '+919123456789',
        address: 'B-12, Juhu Tara Road, Juhu',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400049',
        isDefault: true,
        type: 'home',
      },
      {
        userId: demoUser2.id,
        name: 'Rahul Verma',
        phone: '+919123456789',
        address: '5th Floor, WeWork, BKC',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400051',
        isDefault: false,
        type: 'office',
      },
      {
        userId: demoUser3.id,
        name: 'Ananya Iyer',
        phone: '+919876512340',
        address: '14, Nungambakkam High Road',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600034',
        isDefault: true,
        type: 'home',
      },
    ],
  });
  console.log('✅ Addresses created.');

  // ─── Create Categories ───
  console.log('📂 Creating categories...');
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop',
      description: 'Latest gadgets, smartphones, laptops, and consumer electronics from top brands at the best prices in India.',
      icon: '💻',
    },
  });

  const fashion = await prisma.category.create({
    data: {
      name: 'Fashion',
      slug: 'fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
      description: 'Trendy clothing, footwear, and accessories for men, women, and kids. Discover the latest fashion styles online.',
      icon: '👗',
    },
  });

  const homeKitchen = await prisma.category.create({
    data: {
      name: 'Home & Kitchen',
      slug: 'home-kitchen',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      description: 'Transform your home with premium kitchen appliances, furniture, decor, and essential household items.',
      icon: '🏠',
    },
  });

  const books = await prisma.category.create({
    data: {
      name: 'Books',
      slug: 'books',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
      description: 'Explore a vast collection of bestsellers, academic books, fiction, non-fiction, and competitive exam preparation material.',
      icon: '📚',
    },
  });

  const beauty = await prisma.category.create({
    data: {
      name: 'Beauty & Personal Care',
      slug: 'beauty-personal-care',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
      description: 'Premium skincare, makeup, haircare, and grooming products from trusted Indian and international brands.',
      icon: '✨',
    },
  });

  const sports = await prisma.category.create({
    data: {
      name: 'Sports & Fitness',
      slug: 'sports-fitness',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
      description: 'Gear up for your fitness journey with sports equipment, gym wear, supplements, and outdoor adventure gear.',
      icon: '🏋️',
    },
  });

  console.log('✅ Categories created.');

  // ─── Create Products ───
  console.log('📦 Creating products...');

  const productsData = [
    // ── Electronics (7 products) ──
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Experience the pinnacle of mobile innovation with the Samsung Galaxy S24 Ultra. Featuring a 6.8-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 3 processor, 200MP camera with AI-powered Nightography, and the iconic built-in S Pen for seamless productivity. Titanium frame ensures durability while Galaxy AI brings intelligent features right to your fingertips.',
      brand: 'Samsung',
      sku: 'SAM-S24U-256',
      price: 129999,
      originalPrice: 149999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop',
      ]),
      stock: 50,
      rating: 4.7,
      reviewCount: 342,
      featured: true,
      onSale: true,
      newArrival: false,
      categoryId: electronics.id,
      tags: JSON.stringify(['smartphone', '5G', 'flagship', 'S Pen', 'AI']),
    },
    {
      name: 'Apple MacBook Air M3',
      slug: 'apple-macbook-air-m3',
      description: 'The incredibly thin and light MacBook Air now with the powerful M3 chip. Up to 18 hours of battery life, a stunning 13.6-inch Liquid Retina display, 8GB unified memory, and 256GB SSD. Perfect for professionals and students who demand performance on the go. Features MagSafe charging, two Thunderbolt ports, and a 1080p FaceTime HD camera.',
      brand: 'Apple',
      sku: 'APL-MBA-M3-256',
      price: 114900,
      originalPrice: 119900,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop',
      ]),
      stock: 30,
      rating: 4.8,
      reviewCount: 218,
      featured: true,
      onSale: false,
      newArrival: true,
      categoryId: electronics.id,
      tags: JSON.stringify(['laptop', 'MacBook', 'M3 chip', 'ultrabook', 'Apple']),
    },
    {
      name: 'Sony WH-1000XM5 Wireless Headphones',
      slug: 'sony-wh-1000xm5-headphones',
      description: 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. Up to 30 hours of battery life with quick charging. Multipoint connection lets you connect to two devices simultaneously. Ultra-comfortable lightweight design at just 250g.',
      brand: 'Sony',
      sku: 'SONY-WH1000XM5-BK',
      price: 26990,
      originalPrice: 34990,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      ]),
      stock: 75,
      rating: 4.6,
      reviewCount: 567,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: electronics.id,
      tags: JSON.stringify(['headphones', 'noise-cancelling', 'wireless', 'Bluetooth', 'ANC']),
    },
    {
      name: 'Apple iPad Air M2 11-inch',
      slug: 'apple-ipad-air-m2-11',
      description: 'Powerful. Colourful. Wonderful. The iPad Air with M2 chip delivers next-level performance in a thin and light design. Features a stunning 11-inch Liquid Retina display, 12MP Wide camera, and supports Apple Pencil Pro and Magic Keyboard. Perfect for creativity, productivity, and entertainment.',
      brand: 'Apple',
      sku: 'APL-IPA-M2-128',
      price: 69900,
      originalPrice: 74900,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1585790050231-866cdf2d5f92?w=800&h=800&fit=crop',
      ]),
      stock: 40,
      rating: 4.5,
      reviewCount: 156,
      featured: true,
      onSale: false,
      newArrival: true,
      categoryId: electronics.id,
      tags: JSON.stringify(['tablet', 'iPad', 'M2 chip', 'Apple Pencil', 'productivity']),
    },
    {
      name: 'OnePlus 12R 5G',
      slug: 'oneplus-12r-5g',
      description: 'Flagship killer reloaded. The OnePlus 12R features a 6.78-inch LTPO4 AMOLED display with 120Hz refresh rate, Snapdragon 8 Gen 2 processor, 50MP Sony IMX890 main camera with OIS, and a massive 5500mAh battery with 100W SUPERVOOC charging. OxygenOS delivers a clean, fast, and smooth experience.',
      brand: 'OnePlus',
      sku: 'OP-12R-256',
      price: 39999,
      originalPrice: 45999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&h=800&fit=crop',
      ]),
      stock: 60,
      rating: 4.4,
      reviewCount: 423,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: electronics.id,
      tags: JSON.stringify(['smartphone', '5G', 'flagship killer', 'fast charging', 'OnePlus']),
    },
    {
      name: 'JBL Flip 6 Bluetooth Speaker',
      slug: 'jbl-flip-6-bluetooth-speaker',
      description: 'Your iconic sound, now even better. The JBL Flip 6 features IP67 waterproof and dustproof rating, powerful racetrack-shaped driver, separate tweeter, and dual passive radiators for deep bass. 12 hours of playtime and PartyBoost to link multiple speakers. Perfect for outdoor adventures and beach parties.',
      brand: 'JBL',
      sku: 'JBL-FLIP6-BLK',
      price: 8999,
      originalPrice: 14999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&h=800&fit=crop',
      ]),
      stock: 100,
      rating: 4.5,
      reviewCount: 892,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: electronics.id,
      tags: JSON.stringify(['speaker', 'Bluetooth', 'waterproof', 'portable', 'bass']),
    },
    {
      name: 'Samsung 55" Crystal 4K Neo UHD Smart TV',
      slug: 'samsung-55-crystal-4k-smart-tv',
      description: 'Elevate your viewing experience with Samsung Crystal 4K Neo UHD Smart TV. Powered by Crystal Processor 4K, this TV delivers stunning picture quality with PurColor technology. Smart TV features include built-in Alexa, Google Assistant, and access to all your favorite streaming apps. Slim design with bezel-less display.',
      brand: 'Samsung',
      sku: 'SAM-TV-55CU',
      price: 42990,
      originalPrice: 64900,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1574375927938-d5a98e8d6e2b?w=800&h=800&fit=crop',
      ]),
      stock: 25,
      rating: 4.3,
      reviewCount: 678,
      featured: true,
      onSale: true,
      newArrival: false,
      categoryId: electronics.id,
      tags: JSON.stringify(['TV', '4K', 'Smart TV', 'Samsung', 'LED']),
    },

    // ── Fashion (6 products) ──
    {
      name: 'Nike Air Max 270 Running Shoes',
      slug: 'nike-air-max-270-running-shoes',
      description: 'The Nike Air Max 270 delivers visible cushioning under every step. Updated for modern comfort, it features Nike\'s biggest heel Air unit yet for a soft, bouncy ride. Breathable mesh upper with synthetic overlays provides support and style. Perfect for running, gym workouts, and everyday wear.',
      brand: 'Nike',
      sku: 'NKE-AM270-BLK10',
      price: 11995,
      originalPrice: 14995,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop',
      ]),
      stock: 80,
      rating: 4.6,
      reviewCount: 1024,
      featured: true,
      onSale: true,
      newArrival: false,
      categoryId: fashion.id,
      tags: JSON.stringify(['shoes', 'running', 'sneakers', 'Air Max', 'Nike']),
    },
    {
      name: "Levi's 511 Slim Fit Men's Jeans",
      slug: 'levis-511-slim-fit-mens-jeans',
      description: "The Levi's 511 Slim Fit Jean is a modern slim with room to move. Sits below the waist with a slim fit from hip to ankle. Crafted from premium stretch denim for all-day comfort. A timeless wardrobe essential that pairs perfectly with everything from casual tees to smart shirts.",
      brand: "Levi's",
      sku: 'LEV-511-SLB-32',
      price: 2799,
      originalPrice: 4999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop',
      ]),
      stock: 150,
      rating: 4.4,
      reviewCount: 2156,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: fashion.id,
      tags: JSON.stringify(['jeans', 'slim fit', 'denim', "Levi's", 'men']),
    },
    {
      name: 'Allen Solly Women\'s Formal Blazer',
      slug: 'allen-solly-womens-formal-blazer',
      description: 'Command attention in the boardroom with this elegant Allen Solly formal blazer. Tailored from premium poly-viscose blend fabric with a notched lapel and single-button closure. Fully lined interior with internal pockets. Perfect for corporate meetings, presentations, and professional events. Dry clean only.',
      brand: 'Allen Solly',
      sku: 'AS-WBL-NVY-38',
      price: 3999,
      originalPrice: 5999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop',
      ]),
      stock: 45,
      rating: 4.3,
      reviewCount: 387,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: fashion.id,
      tags: JSON.stringify(['blazer', 'formal', 'women', 'office wear', 'Allen Solly']),
    },
    {
      name: 'Puma Men\'s Sports T-Shirt',
      slug: 'puma-mens-sports-tshirt',
      description: 'Stay cool and dry during intense workouts with this Puma sports tee. Made with dryCELL moisture-wicking technology that draws sweat away from your body. Regular fit with crew neck and short sleeves. Features Puma branding on chest. Ideal for gym, running, and active sports.',
      brand: 'Puma',
      sku: 'PUM-ST-BLU-M',
      price: 999,
      originalPrice: 1999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop',
      ]),
      stock: 200,
      rating: 4.2,
      reviewCount: 876,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: fashion.id,
      tags: JSON.stringify(['t-shirt', 'sports', 'gym wear', 'dryCELL', 'Puma']),
    },
    {
      name: 'Fossil Grant Chronograph Watch',
      slug: 'fossil-grant-chronograph-watch',
      description: 'Classic design meets modern functionality with the Fossil Grant Chronograph. Featuring a 44mm stainless steel case, genuine brown leather strap, and three sub-dials for chronograph functionality. 50m water resistance, mineral crystal glass, and quartz movement. An elegant timepiece for the discerning gentleman.',
      brand: 'Fossil',
      sku: 'FOS-GR-CHR-BRN',
      price: 8995,
      originalPrice: 12995,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop',
      ]),
      stock: 35,
      rating: 4.5,
      reviewCount: 234,
      featured: true,
      onSale: true,
      newArrival: false,
      categoryId: fashion.id,
      tags: JSON.stringify(['watch', 'chronograph', 'leather', 'Fossil', 'men']),
    },
    {
      name: 'H&M Cotton Blend Kurta Set',
      slug: 'hm-cotton-blend-kurta-set',
      description: 'Embrace ethnic elegance with this H&M cotton blend kurta set. Featuring a beautifully printed straight-cut kurta with 3/4 sleeves and a matching pair of palazzo pants. Lightweight and breathable fabric perfect for Indian summers. Ideal for festive occasions, casual outings, and everyday ethnic wear.',
      brand: 'H&M',
      sku: 'HM-KUR-GRN-S',
      price: 1499,
      originalPrice: 2499,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=800&fit=crop',
      ]),
      stock: 90,
      rating: 4.1,
      reviewCount: 543,
      featured: false,
      onSale: true,
      newArrival: true,
      categoryId: fashion.id,
      tags: JSON.stringify(['kurta', 'ethnic', 'women', 'cotton', 'H&M']),
    },

    // ── Home & Kitchen (5 products) ──
    {
      name: 'Prestige Popular Plus Induction Base Pressure Cooker 5L',
      slug: 'prestige-popular-plus-pressure-cooker-5l',
      description: 'The Prestige Popular Plus pressure cooker is an essential kitchen companion. Made from high-quality aluminium with an induction base for versatile cooking. Features a unique anti-bulge bottom, safety valve, and gasket release system. 5-litre capacity perfect for families of 4-5. Compatible with both gas and induction cooktops.',
      brand: 'Prestige',
      sku: 'PRE-PP-IND-5L',
      price: 1899,
      originalPrice: 2850,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=800&fit=crop',
      ]),
      stock: 120,
      rating: 4.4,
      reviewCount: 3421,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: homeKitchen.id,
      tags: JSON.stringify(['pressure cooker', 'kitchen', 'induction', 'Prestige', 'cookware']),
    },
    {
      name: 'Dyson V15 Detect Cordless Vacuum Cleaner',
      slug: 'dyson-v15-detect-cordless-vacuum',
      description: 'The most powerful, intelligent cordless vacuum. Dyson V15 Detect features a laser that reveals microscopic dust, piezo sensor that counts and sizes dust particles, and an LCD screen that shows what has been sucked up. Up to 60 minutes of run time. Converts to a handheld vacuum for versatile cleaning.',
      brand: 'Dyson',
      sku: 'DYS-V15-DET-YLW',
      price: 52900,
      originalPrice: 62900,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=800&h=800&fit=crop',
      ]),
      stock: 15,
      rating: 4.7,
      reviewCount: 187,
      featured: true,
      onSale: false,
      newArrival: true,
      categoryId: homeKitchen.id,
      tags: JSON.stringify(['vacuum cleaner', 'cordless', 'Dyson', 'laser detect', 'cleaning']),
    },
    {
      name: 'Philips Air Fryer HD9252/90',
      slug: 'philips-air-fryer-hd9252',
      description: 'Eat healthy without compromising on taste. The Philips Air Fryer with Rapid Air Technology creates delicious meals with up to 90% less fat. 4.1L capacity, 7 preset cooking programs, and a digital touchscreen for easy operation. QuickClean basket with non-stick mesh makes cleaning effortless. Perfect for Indian snacks like samosas and pakoras.',
      brand: 'Philips',
      sku: 'PHL-AF-HD9252',
      price: 8999,
      originalPrice: 13995,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1626508035297-0cd52b3b1ea5?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=800&h=800&fit=crop',
      ]),
      stock: 85,
      rating: 4.5,
      reviewCount: 1567,
      featured: true,
      onSale: true,
      newArrival: false,
      categoryId: homeKitchen.id,
      tags: JSON.stringify(['air fryer', 'healthy cooking', 'Philips', 'kitchen appliance', 'low fat']),
    },
    {
      name: 'Butterfly Rapid 4 Burner Gas Stove',
      slug: 'butterfly-rapid-4-burner-gas-stove',
      description: 'Cook multiple dishes simultaneously with the Butterfly Rapid 4-burner gas stove. Features toughened glass top, brass burners for efficient heat distribution, and sturdy stainless steel body. Auto-ignition feature eliminates the need for lighters or matches. Ergonomic knob design for easy flame control. Compatible with LPG cylinders.',
      brand: 'Butterfly',
      sku: 'BTF-RPD-4B-BK',
      price: 4499,
      originalPrice: 6999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&h=800&fit=crop',
      ]),
      stock: 50,
      rating: 4.2,
      reviewCount: 987,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: homeKitchen.id,
      tags: JSON.stringify(['gas stove', '4 burner', 'kitchen', 'Butterfly', 'glass top']),
    },
    {
      name: 'Wakefit Orthopedic Memory Foam Mattress',
      slug: 'wakefit-orthopedic-memory-foam-mattress',
      description: 'Sleep better, live better. The Wakefit Orthopedic Memory Foam Mattress adapts to your body shape, providing optimal support and pressure relief. Features 3 layers: premium memory foam on top, transition layer in the middle, and high-density support foam at the base. Comes with a removable and washable outer cover. Queen size (72x60x6 inches).',
      brand: 'Wakefit',
      sku: 'WKF-MAT-QN-6',
      price: 11999,
      originalPrice: 21999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop',
      ]),
      stock: 40,
      rating: 4.6,
      reviewCount: 8934,
      featured: true,
      onSale: true,
      newArrival: false,
      categoryId: homeKitchen.id,
      tags: JSON.stringify(['mattress', 'memory foam', 'orthopedic', 'Wakefit', 'sleep']),
    },

    // ── Books (4 products) ──
    {
      name: 'The Psychology of Money by Morgan Housel',
      slug: 'psychology-of-money-morgan-housel',
      description: 'Timeless lessons on wealth, greed, and happiness. Doing well with money isn\'t necessarily about what you know. It\'s about how you behave. And behavior is hard to teach, even to really smart people. Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of one of life\'s most important topics.',
      brand: 'Jaico Publishing',
      sku: 'JAI-PSY-MNY-PB',
      price: 299,
      originalPrice: 499,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop',
      ]),
      stock: 500,
      rating: 4.8,
      reviewCount: 12456,
      featured: true,
      onSale: true,
      newArrival: false,
      categoryId: books.id,
      tags: JSON.stringify(['finance', 'self-help', 'bestseller', 'money', 'investing']),
    },
    {
      name: 'Indian Polity by M. Laxmikanth',
      slug: 'indian-polity-m-laxmikanth',
      description: 'The definitive book for UPSC Civil Services and State PSC examinations. Indian Polity by M. Laxmikanth comprehensively covers the Indian Constitution, governance structure, political system, and all relevant constitutional amendments. Updated with latest developments and judicial pronouncements. An absolute must-have for every competitive exam aspirant.',
      brand: 'McGraw Hill',
      sku: 'MGH-IP-LAX-7E',
      price: 495,
      originalPrice: 795,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=800&fit=crop',
      ]),
      stock: 300,
      rating: 4.7,
      reviewCount: 18765,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: books.id,
      tags: JSON.stringify(['UPSC', 'competitive exam', 'polity', 'constitution', 'India']),
    },
    {
      name: 'Rich Dad Poor Dad by Robert Kiyosaki',
      slug: 'rich-dad-poor-dad-robert-kiyosaki',
      description: 'Rich Dad Poor Dad is Robert Kiyosaki\'s best-selling book about the financial lessons he learned from his two dads – his real father (poor dad) and his best friend\'s father (rich dad). The book explains how to achieve financial independence through investing, financial literacy, and smart money management. A must-read for anyone who wants to build lasting wealth.',
      brand: 'Plata Publishing',
      sku: 'PLA-RDP-RK-PB',
      price: 399,
      originalPrice: 599,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop',
      ]),
      stock: 400,
      rating: 4.6,
      reviewCount: 23456,
      featured: true,
      onSale: true,
      newArrival: false,
      categoryId: books.id,
      tags: JSON.stringify(['finance', 'investing', 'self-help', 'bestseller', 'wealth']),
    },
    {
      name: 'Ikigai: The Japanese Secret to a Long and Happy Life',
      slug: 'ikigai-japanese-secret-long-happy-life',
      description: 'According to the Japanese, everyone has an ikigai – a reason for being. And according to the residents of the Japanese village with the world\'s longest-living people, finding it is the key to a happier, longer life. This book explores the concept of ikigai, offering practical tools and insights to help you discover your own purpose and live a more meaningful, fulfilling life.',
      brand: 'Penguin Books',
      sku: 'PNG-IKG-GH-PB',
      price: 249,
      originalPrice: 399,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=800&fit=crop',
      ]),
      stock: 350,
      rating: 4.4,
      reviewCount: 8976,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: books.id,
      tags: JSON.stringify(['self-help', 'Japanese', 'happiness', 'purpose', 'wellness']),
    },

    // ── Beauty & Personal Care (4 products) ──
    {
      name: 'Lakme Absolute Perfect Radiance Skin Brightening Kit',
      slug: 'lakme-absolute-perfect-radiance-kit',
      description: 'Achieve a luminous, radiant complexion with the Lakme Absolute Perfect Radiance kit. This comprehensive skincare set includes a face wash, day cream, and night cream enriched with micro-crystals and vitamins. Gently removes impurities, brightens skin tone, and reduces dark spots. Dermatologically tested and suitable for all skin types.',
      brand: 'Lakme',
      sku: 'LKM-AB-PRKIT',
      price: 1299,
      originalPrice: 1999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop',
      ]),
      stock: 75,
      rating: 4.2,
      reviewCount: 567,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: beauty.id,
      tags: JSON.stringify(['skincare', 'brightening', 'Lakme', 'face care', 'beauty']),
    },
    {
      name: 'Mamaearth Vitamin C Face Serum',
      slug: 'mamaearth-vitamin-c-face-serum',
      description: 'Get glowing, youthful skin with Mamaearth Vitamin C Face Serum. Enriched with Vitamin C and Turbine, this lightweight serum brightens skin, reduces dark spots, and fights signs of aging. Made with natural ingredients and free from harmful chemicals. Toxin-free, paraben-free, and suitable for all skin types. Dermatologically tested.',
      brand: 'Mamaearth',
      sku: 'MMA-VC-SRM-30',
      price: 599,
      originalPrice: 999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop',
      ]),
      stock: 200,
      rating: 4.3,
      reviewCount: 4321,
      featured: true,
      onSale: true,
      newArrival: true,
      categoryId: beauty.id,
      tags: JSON.stringify(['serum', 'vitamin C', 'skincare', 'Mamaearth', 'anti-aging']),
    },
    {
      name: 'Maybelline Fit Me Foundation Matte + Poreless',
      slug: 'maybelline-fit-me-foundation-matte-poreless',
      description: 'Maybelline Fit Me Matte + Poreless Foundation gives you a natural, flawless matte finish. Micro-powders control oil and reduce the appearance of pores, while hydrating ingredients keep skin comfortable all day. Available in 18 shades specially formulated for Indian skin tones. Oil-free, dermatologist-tested, and non-comedogenic.',
      brand: 'Maybelline',
      sku: 'MAY-FM-FDN-128',
      price: 449,
      originalPrice: 599,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop',
      ]),
      stock: 180,
      rating: 4.4,
      reviewCount: 7865,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: beauty.id,
      tags: JSON.stringify(['foundation', 'makeup', 'matte', 'Maybelline', 'oily skin']),
    },
    {
      name: 'Bombay Shaving Company Complete Grooming Kit',
      slug: 'bombay-shaving-company-grooming-kit',
      description: 'The ultimate grooming kit for the modern man. Includes a precision razor with 6-blade cartridges, shaving cream, after-shave balm, face wash, and charcoal face scrub. Premium quality products made with natural ingredients like aloe vera, vitamin E, and activated charcoal. Comes in a stylish gift box – perfect for personal use or gifting.',
      brand: 'Bombay Shaving Company',
      sku: 'BSC-GRM-KIT-MN',
      price: 1799,
      originalPrice: 2999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=800&fit=crop',
      ]),
      stock: 60,
      rating: 4.5,
      reviewCount: 1234,
      featured: true,
      onSale: true,
      newArrival: false,
      categoryId: beauty.id,
      tags: JSON.stringify(['grooming', 'shaving', 'men', 'gift set', 'skincare']),
    },

    // ── Sports & Fitness (5 products) ──
    {
      name: 'Yoga Mandir Premium Anti-Slip Yoga Mat',
      slug: 'yoga-mandir-premium-anti-slip-yoga-mat',
      description: 'Elevate your yoga practice with the Yoga Mandir Premium Mat. Made from eco-friendly TPE material with dual-layer anti-slip texture. 6mm thickness provides perfect cushioning for joints while maintaining balance. Lightweight and portable with a carrying strap included. Dimensions: 72 x 24 inches. Free from PVC, latex, and harmful chemicals.',
      brand: 'Yoga Mandir',
      sku: 'YM-MAT-TPE-BLU',
      price: 899,
      originalPrice: 1499,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop',
      ]),
      stock: 150,
      rating: 4.5,
      reviewCount: 3456,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: sports.id,
      tags: JSON.stringify(['yoga mat', 'fitness', 'anti-slip', 'TPE', 'eco-friendly']),
    },
    {
      name: 'Boldfit Adjustable Dumbbells Set 10kg Pair',
      slug: 'boldfit-adjustable-dumbbells-10kg-pair',
      description: 'Build strength at home with Boldfit Adjustable Dumbbells. Each dumbbell can be adjusted from 2.5kg to 5kg using weight plates. Anti-slip textured grip ensures safe workouts. Durable PVC coating protects floors and reduces noise. Comes with a connector rod that converts dumbbells to a barbell. Perfect for home gym setups.',
      brand: 'Boldfit',
      sku: 'BLD-DB-10KG-PR',
      price: 1299,
      originalPrice: 2499,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=800&fit=crop',
      ]),
      stock: 80,
      rating: 4.3,
      reviewCount: 2345,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: sports.id,
      tags: JSON.stringify(['dumbbells', 'weights', 'home gym', 'Boldfit', 'strength']),
    },
    {
      name: 'Adidas Ultraboost Light Running Shoes',
      slug: 'adidas-ultraboost-light-running-shoes',
      description: 'Run lighter, run farther. The Adidas Ultraboost Light features a BOOST midsole for incredible energy return and a Primeknit+ upper that adapts to the movement of your foot. Continental rubber outsole provides extraordinary grip in wet and dry conditions. 30% lighter than the previous Ultraboost. Perfect for marathon training and daily runs.',
      brand: 'Adidas',
      sku: 'ADI-UBL-BLK-9',
      price: 13999,
      originalPrice: 18999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556048219-bb6978360b84?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&h=800&fit=crop',
      ]),
      stock: 55,
      rating: 4.7,
      reviewCount: 876,
      featured: true,
      onSale: true,
      newArrival: true,
      categoryId: sports.id,
      tags: JSON.stringify(['running shoes', 'Ultraboost', 'Adidas', 'marathon', 'BOOST']),
    },
    {
      name: 'MuscleBlaze Biozyme Whey Protein 1kg',
      slug: 'muscleblaze-biozyme-whey-protein-1kg',
      description: 'India\'s first clinically tested whey protein with enhanced absorption. MuscleBlaze Biozyme delivers 25g protein per scoop with 5.51g BCAAs. Clinically tested to have 50% higher protein absorption and 60% faster muscle recovery. Enriched with digestive enzymes for better digestion. Rich Chocolate flavor. Lab tested for purity and banned substance free.',
      brand: 'MuscleBlaze',
      sku: 'MB-BZ-WP-CHO-1',
      price: 2499,
      originalPrice: 3499,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1593095948071-474c5cc2c729?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&h=800&fit=crop',
      ]),
      stock: 100,
      rating: 4.4,
      reviewCount: 5678,
      featured: false,
      onSale: true,
      newArrival: false,
      categoryId: sports.id,
      tags: JSON.stringify(['whey protein', 'supplement', 'MuscleBlaze', 'gym', 'fitness']),
    },
    {
      name: 'Decathlon Rockrider ST 100 Mountain Bicycle',
      slug: 'decathlon-rockrider-st-100-mountain-bicycle',
      description: 'Hit the trails with confidence on the Decathlon Rockrider ST 100. Features a sturdy steel frame, 21-speed Shimano gears for smooth shifting, and 27.5-inch wheels for excellent terrain handling. Front suspension fork absorbs shocks on rough trails. V-brakes for reliable stopping power. 80% assembled – minimal setup required. Ideal for beginners and recreational mountain bikers.',
      brand: 'Decathlon',
      sku: 'DEC-RR-ST100-M',
      price: 9999,
      originalPrice: 13999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=800&fit=crop',
      ]),
      stock: 20,
      rating: 4.2,
      reviewCount: 456,
      featured: false,
      onSale: true,
      newArrival: true,
      categoryId: sports.id,
      tags: JSON.stringify(['bicycle', 'mountain bike', 'cycling', 'Decathlon', 'outdoor']),
    },
  ];

  const createdProducts = [];
  for (const productData of productsData) {
    const product = await prisma.product.create({ data: productData });
    createdProducts.push(product);
  }
  console.log(`✅ ${createdProducts.length} products created.`);

  // ─── Create Reviews ───
  console.log('⭐ Creating reviews...');
  const users = [demoUser1, demoUser2, demoUser3];

  const reviewsData = [
    // Samsung Galaxy S24 Ultra
    { userId: demoUser1.id, productId: createdProducts[0].id, rating: 5, title: 'Best flagship phone of 2024!', comment: 'Absolutely love this phone. The camera is mind-blowing, especially the 200MP mode. S Pen integration is super smooth. Battery easily lasts a full day. Worth every rupee!', verified: true, helpful: 24 },
    { userId: demoUser2.id, productId: createdProducts[0].id, rating: 4, title: 'Great phone but pricey', comment: 'Performance is top-notch. Galaxy AI features are actually useful, not gimmicky. Only downside is the price could have been a bit lower for the Indian market. Still, a solid flagship.', verified: true, helpful: 12 },

    // Apple MacBook Air M3
    { userId: demoUser3.id, productId: createdProducts[1].id, rating: 5, title: 'Perfect laptop for developers', comment: 'M3 chip is a beast! Compiles my projects in seconds. Battery lasts me 2 days of normal use. The display is gorgeous. Best laptop I have ever owned.', verified: true, helpful: 31 },
    { userId: demoUser1.id, productId: createdProducts[1].id, rating: 4, title: 'Amazing but limited ports', comment: 'The performance and battery life are incredible. Only wish there were more ports – 2 Thunderbolt is a bit limiting. Had to buy a dock separately. Otherwise perfect.', verified: true, helpful: 8 },

    // Sony WH-1000XM5
    { userId: demoUser2.id, productId: createdProducts[2].id, rating: 5, title: 'Noise cancellation king', comment: 'Used these on a flight to Delhi and could not hear the engine at all! Super comfortable for long listening sessions. Sound quality is warm and detailed. Best purchase this year.', verified: true, helpful: 45 },
    { userId: demoUser3.id, productId: createdProducts[2].id, rating: 4, title: 'Great upgrade from XM4', comment: 'Noticeably lighter than the XM4. Noise cancellation is slightly better. Sound is more balanced. My only complaint is the carrying case is bigger. Still, totally worth the upgrade.', verified: true, helpful: 15 },

    // Apple iPad Air M2
    { userId: demoUser1.id, productId: createdProducts[3].id, rating: 5, title: 'Perfect for digital art', comment: 'Using this with Apple Pencil Pro is a game-changer. The M2 chip handles Procreate without any lag. Display colors are accurate. Light enough to hold for hours. Highly recommended for artists!', verified: true, helpful: 19 },

    // OnePlus 12R
    { userId: demoUser2.id, productId: createdProducts[4].id, rating: 4, title: 'Value for money flagship', comment: 'Snapdragon 8 Gen 2 handles everything I throw at it. 100W charging is insanely fast – 0 to 100 in about 30 mins. Camera is decent but not at the level of Samsung or Apple. Great value though!', verified: true, helpful: 27 },

    // JBL Flip 6
    { userId: demoUser3.id, productId: createdProducts[5].id, rating: 5, title: 'Best portable speaker under 10K', comment: 'Took this to a Goa trip and it survived sand, water, and drops! Sound is loud and bassy for its size. Battery lasts the full 12 hours. PartyBoost feature is fun. Must-buy!', verified: true, helpful: 38 },

    // Samsung TV
    { userId: demoUser1.id, productId: createdProducts[6].id, rating: 4, title: 'Great TV for the price', comment: '4K content looks stunning on this. Smart TV interface is smooth. Built-in Alexa is handy. Only wish it had Dolby Vision. But at this price point, it is an excellent deal.', verified: true, helpful: 16 },

    // Nike Air Max 270
    { userId: demoUser2.id, productId: createdProducts[7].id, rating: 5, title: 'Most comfortable sneakers ever', comment: 'The Air unit in the heel makes you feel like walking on clouds. Great for long walks and casual outings. Fits true to size. The black colorway goes with everything. Highly recommended!', verified: true, helpful: 42 },
    { userId: demoUser3.id, productId: createdProducts[7].id, rating: 4, title: 'Good but gets warm', comment: 'Super comfortable and looks great. My only issue is that the mesh upper could be more breathable in Indian summer. Otherwise, excellent shoes for the price.', verified: true, helpful: 9 },

    // Levi's 511
    { userId: demoUser1.id, productId: createdProducts[8].id, rating: 4, title: 'Classic fit, great quality', comment: 'The slim fit is perfect – not too tight, not too loose. Denim quality is excellent as expected from Levi\'s. Stretch fabric makes them comfortable all day. Grabbed them on sale – amazing value!', verified: true, helpful: 23 },

    // Allen Solly Blazer
    { userId: demoUser3.id, productId: createdProducts[9].id, rating: 4, title: 'Professional and stylish', comment: 'Wore this for a big presentation and got so many compliments. Fit is true to size. Fabric feels premium. The navy color is versatile for any formal setting. Great buy for working women!', verified: true, helpful: 11 },

    // Puma T-Shirt
    { userId: demoUser2.id, productId: createdProducts[10].id, rating: 4, title: 'Great gym t-shirt', comment: 'dryCELL technology actually works – stays dry even after an intense workout. Fits well and looks sporty. Puma branding is subtle and classy. Ordered 3 more in different colors!', verified: true, helpful: 14 },

    // Fossil Watch
    { userId: demoUser1.id, productId: createdProducts[11].id, rating: 5, title: 'Stunning timepiece', comment: 'The leather strap and chronograph dials look so premium. Gets compliments every time I wear it. The 44mm case size is perfect for my wrist. Fossil quality at this price is unbeatable.', verified: true, helpful: 20 },

    // H&M Kurta
    { userId: demoUser3.id, productId: createdProducts[12].id, rating: 4, title: 'Beautiful ethnic wear', comment: 'The print and fabric quality exceeded my expectations for this price. Very comfortable for all-day wear. The palazzo pants fit perfectly. Just wish there were more color options!', verified: true, helpful: 7 },

    // Prestige Pressure Cooker
    { userId: demoUser1.id, productId: createdProducts[13].id, rating: 5, title: 'Kitchen essential', comment: 'Every Indian kitchen needs this. Cooks dal in 10 minutes! The induction base is a huge plus since I have both gas and induction. Safety features give peace of mind. Prestige quality is unmatched.', verified: true, helpful: 56 },

    // Dyson V15
    { userId: demoUser2.id, productId: createdProducts[14].id, rating: 5, title: 'Worth the investment', comment: 'The laser feature is not a gimmick – you can actually see the dust! Suction power is incredible. Converted to handheld mode to clean the sofa and car. LCD screen is informative. Premium product, premium experience.', verified: true, helpful: 33 },

    // Philips Air Fryer
    { userId: demoUser3.id, productId: createdProducts[15].id, rating: 5, title: 'Healthy cooking made easy', comment: 'Made samosas and pakoras with almost no oil – tasted just as good! The digital controls are intuitive. Cleaning is super easy with the non-stick basket. Best kitchen purchase of the year.', verified: true, helpful: 41 },

    // Butterfly Gas Stove
    { userId: demoUser1.id, productId: createdProducts[16].id, rating: 4, title: 'Good value for 4 burners', comment: 'Glass top looks elegant in the kitchen. All 4 burners have good flame distribution. Auto-ignition works most of the time. Knobs feel a bit cheap but functional. Overall satisfied for the price.', verified: true, helpful: 18 },

    // Wakefit Mattress
    { userId: demoUser2.id, productId: createdProducts[17].id, rating: 5, title: 'Best sleep investment', comment: 'Was skeptical about buying a mattress online but Wakefit exceeded all expectations. Back pain is gone after just 2 weeks! Memory foam adapts perfectly. The 10-year warranty gives confidence. Delivered in perfect condition.', verified: true, helpful: 67 },

    // Psychology of Money
    { userId: demoUser3.id, productId: createdProducts[18].id, rating: 5, title: 'Must-read for everyone', comment: 'This book changed my perspective on money completely. Written in simple, engaging language with real-world examples. Finished it in one sitting. Every Indian should read this book – it is not about getting rich quick, but about making smart decisions with money.', verified: true, helpful: 89 },
    { userId: demoUser1.id, productId: createdProducts[18].id, rating: 4, title: 'Great insights, quick read', comment: 'Short chapters with powerful messages. Some stories are repetitive if you already follow personal finance content. But overall, a wonderful book that makes you think differently about wealth and happiness.', verified: true, helpful: 34 },

    // Mamaearth Serum
    { userId: demoUser2.id, productId: createdProducts[21].id, rating: 4, title: 'Visible results in 2 weeks', comment: 'My dark spots have noticeably reduced after using this serum for 2 weeks. Lightweight formula absorbs quickly. No stickiness. Natural ingredients give me confidence. Will repurchase!', verified: true, helpful: 22 },

    // Maybelline Foundation
    { userId: demoUser3.id, productId: createdProducts[22].id, rating: 4, title: 'Finally found my shade', comment: 'Shade 128 is perfect for medium Indian skin tones. Gives a beautiful matte finish that lasts 6-7 hours. Does not oxidize or look cakey. Affordable and effective – what more could you want?', verified: true, helpful: 28 },

    // Bombay Shaving Company Kit
    { userId: demoUser2.id, productId: createdProducts[23].id, rating: 5, title: 'Perfect gift for men', comment: 'Bought this as a birthday gift for my brother and he loved it. Every product in the kit is high quality. The razor gives a close, smooth shave. The face scrub is amazing. Packaging is premium. Will buy again.', verified: true, helpful: 16 },

    // Yoga Mat
    { userId: demoUser1.id, productId: createdProducts[24].id, rating: 4, title: 'Good quality mat', comment: 'The anti-slip texture actually works – even during hot yoga! 6mm thickness is just right. Carrying strap is useful. Only issue is the initial smell, but it goes away after a day. Great value.', verified: true, helpful: 31 },

    // Boldfit Dumbbells
    { userId: demoUser3.id, productId: createdProducts[25].id, rating: 4, title: 'Good for home workouts', comment: 'PVC coating prevents floor damage which is great. The connector rod to make a barbell is a nice bonus. Weight adjustment is easy. Grip could be slightly better for sweaty hands. Good product for the price.', verified: true, helpful: 13 },

    // Adidas Ultraboost
    { userId: demoUser2.id, productId: createdProducts[26].id, rating: 5, title: 'Cloud-like running experience', comment: 'Used these for the Mumbai Half Marathon and my feet felt fresh even at the finish line. BOOST cushioning is addictive. Continental outsole grips wet roads confidently. Worth every penny for serious runners.', verified: true, helpful: 25 },

    // MuscleBlaze Whey
    { userId: demoUser1.id, productId: createdProducts[27].id, rating: 4, title: 'Good protein, great price', comment: 'Mixes well with water and milk. Chocolate flavor is decent – not too sweet. Seeing good results after 2 months of consistent use. The Biozyme formula seems to work – no bloating like other proteins I have tried.', verified: true, helpful: 37 },
  ];

  for (const reviewData of reviewsData) {
    await prisma.review.create({ data: reviewData });
  }
  console.log(`✅ ${reviewsData.length} reviews created.`);

  // ─── Create Coupons ───
  console.log('🎟️  Creating coupons...');
  await prisma.coupon.createMany({
    data: [
      {
        code: 'ZSHOP10',
        type: 'percentage',
        value: 10,
        minOrder: 999,
        maxDiscount: 2000,
        usageLimit: 1000,
        usedCount: 0,
        active: true,
        expiresAt: new Date('2026-12-31T23:59:59.000Z'),
      },
      {
        code: 'WELCOME50',
        type: 'flat',
        value: 500,
        minOrder: 1999,
        maxDiscount: null,
        usageLimit: 500,
        usedCount: 0,
        active: true,
        expiresAt: new Date('2026-06-30T23:59:59.000Z'),
      },
      {
        code: 'FLASH20',
        type: 'percentage',
        value: 20,
        minOrder: 2999,
        maxDiscount: 5000,
        usageLimit: 200,
        usedCount: 0,
        active: true,
        expiresAt: new Date('2026-03-31T23:59:59.000Z'),
      },
      {
        code: 'NEWUSER15',
        type: 'percentage',
        value: 15,
        minOrder: 1499,
        maxDiscount: 3000,
        usageLimit: 10000,
        usedCount: 0,
        active: true,
        expiresAt: new Date('2026-12-31T23:59:59.000Z'),
      },
    ],
  });
  console.log('✅ Coupons created.');

  // ─── Create Notifications ───
  console.log('🔔 Creating notifications...');
  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser1.id,
        title: 'Welcome to Z Shop!',
        message: 'Thank you for joining Z Shop! Use code WELCOME50 to get ₹500 off on your first order above ₹1999.',
        type: 'info',
        read: false,
      },
      {
        userId: demoUser1.id,
        title: 'Flash Sale is Live! 🎉',
        message: 'Up to 40% off on Electronics! Use code FLASH20 for extra 20% off. Hurry, sale ends tonight!',
        type: 'promo',
        read: false,
      },
      {
        userId: demoUser2.id,
        title: 'Welcome to Z Shop!',
        message: 'Thank you for joining Z Shop! Use code WELCOME50 to get ₹500 off on your first order above ₹1999.',
        type: 'info',
        read: true,
      },
      {
        userId: demoUser2.id,
        title: 'Your order has been confirmed',
        message: 'Order #ZS2024001 has been confirmed and will be shipped soon. Track your order in My Orders.',
        type: 'order',
        read: false,
      },
      {
        userId: demoUser3.id,
        title: 'Welcome to Z Shop!',
        message: 'Thank you for joining Z Shop! Use code WELCOME50 to get ₹500 off on your first order above ₹1999.',
        type: 'info',
        read: false,
      },
      {
        userId: demoUser3.id,
        title: 'Price Drop Alert! 📉',
        message: 'The Mamaearth Vitamin C Serum in your wishlist is now available at ₹599 (was ₹999). Grab it before the offer ends!',
        type: 'promo',
        read: false,
      },
    ],
  });
  console.log('✅ Notifications created.');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('─────────────────────────────────');
  console.log(`👤 Users:          4 (1 admin + 3 demo)`);
  console.log(`📍 Addresses:      6`);
  console.log(`📂 Categories:     6`);
  console.log(`📦 Products:       ${createdProducts.length}`);
  console.log(`⭐ Reviews:        ${reviewsData.length}`);
  console.log(`🎟️  Coupons:        4`);
  console.log(`🔔 Notifications:  6`);
  console.log('─────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
