export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  subcategory: string;
  brand: string;
  inStock: boolean;
  stockCount: number;
  vendorId: string;
  vendorName: string;
  tags: string[];
  specs: Record<string, string>;
  variants: { name: string; options: string[] }[];
  featured: boolean;
  trending: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  subcategories: string[];
  productCount: number;
}

const IMG = (seed: string) => `https://images.unsplash.com/${seed}?w=400&h=400&fit=crop`;

export const categories: Category[] = [
  { id: "cat-1", name: "Electronics", slug: "electronics", icon: "📱", subcategories: ["Smartphones", "Laptops", "Tablets", "Headphones", "Cameras"], productCount: 2840 },
  { id: "cat-2", name: "Fashion", slug: "fashion", icon: "👗", subcategories: ["Men", "Women", "Kids", "Footwear", "Accessories"], productCount: 5200 },
  { id: "cat-3", name: "Home & Living", slug: "home-living", icon: "🏠", subcategories: ["Furniture", "Decor", "Kitchen", "Bedding", "Lighting"], productCount: 1890 },
  { id: "cat-4", name: "Beauty", slug: "beauty", icon: "💄", subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrances", "Tools"], productCount: 3100 },
  { id: "cat-5", name: "Sports", slug: "sports", icon: "⚽", subcategories: ["Fitness", "Running", "Cycling", "Swimming", "Team Sports"], productCount: 980 },
  { id: "cat-6", name: "Books", slug: "books", icon: "📚", subcategories: ["Fiction", "Non-Fiction", "Academic", "Children", "Comics"], productCount: 4500 },
  { id: "cat-7", name: "Groceries", slug: "groceries", icon: "🛒", subcategories: ["Fruits", "Vegetables", "Dairy", "Snacks", "Beverages"], productCount: 2200 },
  { id: "cat-8", name: "Toys & Games", slug: "toys", icon: "🎮", subcategories: ["Board Games", "Action Figures", "Puzzles", "Educational", "Outdoor"], productCount: 1150 },
];

export const products: Product[] = [
  {
    id: "prod-1", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max",
    description: "The most powerful iPhone ever with A17 Pro chip, titanium design, and a 48MP camera system for stunning photos and videos.",
    price: 134900, originalPrice: 159900, discount: 16, rating: 4.6, reviewCount: 12843,
    images: [IMG("photo-1695048133142-1a20484d2569"), IMG("photo-1592750475338-74b7b21085ab")],
    category: "Electronics", subcategory: "Smartphones", brand: "Apple", inStock: true, stockCount: 234,
    vendorId: "v-1", vendorName: "AppleZone Official", tags: ["5G", "Pro Camera", "Titanium"],
    specs: { "Display": "6.7\" Super Retina XDR", "Chip": "A17 Pro", "Storage": "256GB", "Battery": "4422 mAh" },
    variants: [{ name: "Storage", options: ["256GB", "512GB", "1TB"] }, { name: "Color", options: ["Natural Titanium", "Blue", "White", "Black"] }],
    featured: true, trending: true,
  },
  {
    id: "prod-2", name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra",
    description: "Galaxy AI is here. Search like never before, Icons live translate calls, and Icons Icons Icons Icons circle to search.",
    price: 129999, originalPrice: 144999, discount: 10, rating: 4.5, reviewCount: 8921,
    images: [IMG("photo-1610945265064-0e34e5519bbf")],
    category: "Electronics", subcategory: "Smartphones", brand: "Samsung", inStock: true, stockCount: 567,
    vendorId: "v-2", vendorName: "Samsung Flagship Store", tags: ["Galaxy AI", "S Pen", "200MP"],
    specs: { "Display": "6.8\" QHD+ Dynamic AMOLED", "Chip": "Snapdragon 8 Gen 3", "Storage": "256GB", "Battery": "5000 mAh" },
    variants: [{ name: "Storage", options: ["256GB", "512GB", "1TB"] }, { name: "Color", options: ["Titanium Gray", "Violet", "Yellow", "Black"] }],
    featured: true, trending: true,
  },
  {
    id: "prod-3", name: "MacBook Air M3 15\"", slug: "macbook-air-m3-15",
    description: "Supercharged by M3. The strikingly thin MacBook Air with the blazingly fast M3 chip for superfast multitasking.",
    price: 139900, originalPrice: 149900, discount: 7, rating: 4.8, reviewCount: 5634,
    images: [IMG("photo-1517336714731-489689fd1ca8")],
    category: "Electronics", subcategory: "Laptops", brand: "Apple", inStock: true, stockCount: 189,
    vendorId: "v-1", vendorName: "AppleZone Official", tags: ["M3 Chip", "15-inch", "18hr Battery"],
    specs: { "Display": "15.3\" Liquid Retina", "Chip": "Apple M3", "RAM": "8GB", "Storage": "256GB SSD" },
    variants: [{ name: "RAM", options: ["8GB", "16GB", "24GB"] }, { name: "Color", options: ["Midnight", "Starlight", "Space Gray", "Silver"] }],
    featured: true, trending: false,
  },
  {
    id: "prod-4", name: "Sony WH-1000XM5 Headphones", slug: "sony-wh-1000xm5",
    description: "Industry-leading noise canceling with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones.",
    price: 26990, originalPrice: 34990, discount: 23, rating: 4.7, reviewCount: 15678,
    images: [IMG("photo-1618366712010-f4ae9c647dcb")],
    category: "Electronics", subcategory: "Headphones", brand: "Sony", inStock: true, stockCount: 890,
    vendorId: "v-3", vendorName: "SoundWorld", tags: ["ANC", "30hr Battery", "LDAC"],
    specs: { "Driver": "30mm", "ANC": "Yes (Auto NC Optimizer)", "Battery": "30 hours", "Weight": "250g" },
    variants: [{ name: "Color", options: ["Black", "Silver", "Midnight Blue"] }],
    featured: true, trending: true,
  },
  {
    id: "prod-5", name: "Nike Air Max 270 React", slug: "nike-air-max-270-react",
    description: "The Nike Air Max 270 React combines lifestyle Nike Air cushioning with soft React foam for an impossibly soft ride.",
    price: 12995, originalPrice: 16995, discount: 24, rating: 4.3, reviewCount: 3421,
    images: [IMG("photo-1542291026-7eec264c27ff")],
    category: "Fashion", subcategory: "Footwear", brand: "Nike", inStock: true, stockCount: 456,
    vendorId: "v-4", vendorName: "SneakerHub", tags: ["Air Max", "React Foam", "Lifestyle"],
    specs: { "Upper": "Mesh and synthetic", "Sole": "Air Max 270 + React", "Closure": "Lace-up" },
    variants: [{ name: "Size", options: ["7", "8", "9", "10", "11"] }, { name: "Color", options: ["Black/White", "Blue Void", "Bauhaus"] }],
    featured: false, trending: true,
  },
  {
    id: "prod-6", name: "Levi's 501 Original Fit Jeans", slug: "levis-501-original",
    description: "The icon. The original. The 501 Original Fit Jeans sit at the waist with a straight leg. A blank canvas for self-expression.",
    price: 3499, originalPrice: 5999, discount: 42, rating: 4.4, reviewCount: 7821,
    images: [IMG("photo-1542272604-787c3835535d")],
    category: "Fashion", subcategory: "Men", brand: "Levi's", inStock: true, stockCount: 1200,
    vendorId: "v-5", vendorName: "DenimWorld", tags: ["Original Fit", "100% Cotton", "Classic"],
    specs: { "Material": "100% Cotton", "Fit": "Original/Straight", "Rise": "Regular" },
    variants: [{ name: "Size", options: ["30", "32", "34", "36", "38"] }, { name: "Wash", options: ["Dark Indigo", "Medium Stonewash", "Black"] }],
    featured: false, trending: false,
  },
  {
    id: "prod-7", name: "Dyson V15 Detect Vacuum", slug: "dyson-v15-detect",
    description: "Dyson's most powerful, most intelligent cordless vacuum. A laser reveals microscopic dust. Counts and sizes particles.",
    price: 52900, originalPrice: 62900, discount: 16, rating: 4.6, reviewCount: 2345,
    images: [IMG("photo-1558618666-fcd25c85f82e")],
    category: "Home & Living", subcategory: "Kitchen", brand: "Dyson", inStock: true, stockCount: 78,
    vendorId: "v-6", vendorName: "HomeEssentials", tags: ["Laser Detect", "HEPA", "60min Runtime"],
    specs: { "Motor": "Hyperdymium", "Runtime": "60 minutes", "Filtration": "Whole-machine HEPA" },
    variants: [{ name: "Model", options: ["V15 Detect", "V15 Detect+"] }],
    featured: true, trending: false,
  },
  {
    id: "prod-8", name: "The Alchemist by Paulo Coelho", slug: "the-alchemist",
    description: "Paulo Coelho's masterwork tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel.",
    price: 299, originalPrice: 599, discount: 50, rating: 4.5, reviewCount: 45678,
    images: [IMG("photo-1544947950-fa07a98d237f")],
    category: "Books", subcategory: "Fiction", brand: "HarperOne", inStock: true, stockCount: 5600,
    vendorId: "v-7", vendorName: "BookHaven", tags: ["Bestseller", "Fiction", "Classic"],
    specs: { "Pages": "197", "Language": "English", "Format": "Paperback" },
    variants: [{ name: "Format", options: ["Paperback", "Hardcover", "Kindle"] }],
    featured: false, trending: true,
  },
  {
    id: "prod-9", name: "L'Oreal Paris Revitalift Serum", slug: "loreal-revitalift-serum",
    description: "1.5% Pure Hyaluronic Acid Serum for a replumped, hydrated, more youthful-looking complexion in just one week.",
    price: 699, originalPrice: 999, discount: 30, rating: 4.2, reviewCount: 9876,
    images: [IMG("photo-1620916566398-39f1143ab7be")],
    category: "Beauty", subcategory: "Skincare", brand: "L'Oreal", inStock: true, stockCount: 3400,
    vendorId: "v-8", vendorName: "GlamourBox", tags: ["Hyaluronic Acid", "Anti-Aging", "Serum"],
    specs: { "Volume": "30ml", "Key Ingredient": "1.5% Hyaluronic Acid", "Skin Type": "All" },
    variants: [{ name: "Size", options: ["15ml", "30ml", "50ml"] }],
    featured: false, trending: true,
  },
  {
    id: "prod-10", name: "PlayStation 5 Console", slug: "playstation-5",
    description: "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback and adaptive triggers.",
    price: 49990, originalPrice: 54990, discount: 9, rating: 4.8, reviewCount: 23456,
    images: [IMG("photo-1606144042614-b2417e99c4e3")],
    category: "Electronics", subcategory: "Gaming", brand: "Sony", inStock: true, stockCount: 45,
    vendorId: "v-3", vendorName: "SoundWorld", tags: ["4K Gaming", "Ray Tracing", "DualSense"],
    specs: { "Storage": "825GB SSD", "GPU": "10.28 TFLOPS", "Resolution": "Up to 4K 120fps" },
    variants: [{ name: "Edition", options: ["Standard", "Digital"] }],
    featured: true, trending: true,
  },
  {
    id: "prod-11", name: "Organic Green Tea - 100 Bags", slug: "organic-green-tea",
    description: "Premium organic green tea sourced from the highlands. Rich in antioxidants, smooth taste with no bitterness.",
    price: 449, originalPrice: 699, discount: 36, rating: 4.1, reviewCount: 5432,
    images: [IMG("photo-1556679343-c7306c1976bc")],
    category: "Groceries", subcategory: "Beverages", brand: "TeaVeda", inStock: true, stockCount: 8900,
    vendorId: "v-9", vendorName: "NaturalFoods", tags: ["Organic", "Antioxidant", "100 Bags"],
    specs: { "Quantity": "100 Tea Bags", "Type": "Green Tea", "Certification": "USDA Organic" },
    variants: [{ name: "Pack", options: ["50 Bags", "100 Bags", "200 Bags"] }],
    featured: false, trending: false,
  },
  {
    id: "prod-12", name: "LEGO Technic Porsche 911 GT3 RS", slug: "lego-porsche-911",
    description: "Build an icon of engineering excellence with this detailed LEGO Technic replica of the Porsche 911 GT3 RS.",
    price: 42999, originalPrice: 49999, discount: 14, rating: 4.9, reviewCount: 1234,
    images: [IMG("photo-1587654780291-39c9404d7dd0")],
    category: "Toys & Games", subcategory: "Board Games", brand: "LEGO", inStock: true, stockCount: 23,
    vendorId: "v-10", vendorName: "ToyLand", tags: ["Technic", "2704 Pieces", "Collector"],
    specs: { "Pieces": "2704", "Age": "18+", "Dimensions": "57 x 25 x 17 cm" },
    variants: [],
    featured: true, trending: false,
  },
];

export const banners = [
  { id: "b1", title: "Mega Electronics Sale", subtitle: "Up to 60% off on top brands", cta: "Shop Now", gradient: "gradient-primary" },
  { id: "b2", title: "Fashion Week Special", subtitle: "New arrivals starting ₹499", cta: "Explore", gradient: "gradient-warm" },
  { id: "b3", title: "Home Makeover", subtitle: "Furniture & decor at best prices", cta: "Discover", gradient: "gradient-cool" },
];

export const deals = products.filter(p => p.discount >= 20);
export const featuredProducts = products.filter(p => p.featured);
export const trendingProducts = products.filter(p => p.trending);
