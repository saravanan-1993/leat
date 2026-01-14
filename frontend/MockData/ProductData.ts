export interface WeightVariant {
  weight: string;
  price: number;
  mrp: number;
  discount: number;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  categoryId: number;
  variants: WeightVariant[];
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  description?: string;
  inStock: boolean;
  deliveryTime: string;
}

export const products: Product[] = [
  // Fresh Fruits & Vegetables (categoryId: 1)
  {
    id: 1,
    name: "Banana - Robusta",
    brand: "Fresho",
    categoryId: 1,
    variants: [
      { weight: "1 kg (Approx. 6-8 pcs)", price: 49, mrp: 65, discount: 25 },
      { weight: "500 g (Approx. 3-4 pcs)", price: 28, mrp: 35, discount: 20 },
    ],
    rating: 4.3,
    reviews: 2847,
    image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&h=300&fit=crop",
    badge: "10 MINS",
    badgeColor: "bg-green-600",
    description: "Fresh Robusta bananas, rich in potassium and fiber",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 2,
    name: "Green Capsicum",
    brand: "Fresho",
    categoryId: 1,
    variants: [
      { weight: "250 g", price: 18, mrp: 24, discount: 24 },
      { weight: "500 g", price: 36, mrp: 48, discount: 24 },
      { weight: "1 kg", price: 70, mrp: 95, discount: 26 },
    ],
    rating: 4.1,
    reviews: 1523,
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=300&fit=crop",
    badge: "10 MINS",
    badgeColor: "bg-green-600",
    description: "Fresh green capsicum, perfect for salads and cooking",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 3,
    name: "Cauliflower",
    brand: "Fresho",
    categoryId: 1,
    variants: [
      { weight: "1 pc (approx. 400-600 g)", price: 34, mrp: 45, discount: 24 },
    ],
    rating: 4.2,
    reviews: 1876,
    image: "https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?w=300&h=300&fit=crop",
    badge: "10 MINS",
    badgeColor: "bg-green-600",
    description: "Fresh cauliflower, rich in vitamins and minerals",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 4,
    name: "Tomato - Local",
    brand: "Fresho",
    categoryId: 1,
    variants: [
      { weight: "500 g", price: 22, mrp: 30, discount: 27 },
      { weight: "1 kg", price: 42, mrp: 58, discount: 28 },
    ],
    rating: 4.0,
    reviews: 3421,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=300&fit=crop",
    badge: "10 MINS",
    badgeColor: "bg-green-600",
    description: "Fresh local tomatoes, perfect for everyday cooking",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 5,
    name: "Onion",
    brand: "Fresho",
    categoryId: 1,
    variants: [
      { weight: "1 kg", price: 35, mrp: 45, discount: 22 },
      { weight: "2 kg", price: 68, mrp: 88, discount: 23 },
    ],
    rating: 4.4,
    reviews: 5234,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&h=300&fit=crop",
    description: "Fresh onions, essential for Indian cooking",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 6,
    name: "Potato",
    brand: "Fresho",
    categoryId: 1,
    variants: [
      { weight: "1 kg", price: 32, mrp: 40, discount: 20 },
      { weight: "2 kg", price: 62, mrp: 78, discount: 21 },
    ],
    rating: 4.3,
    reviews: 4521,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=300&fit=crop",
    description: "Fresh potatoes, versatile for all dishes",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 7,
    name: "Apple - Shimla",
    brand: "Fresho",
    categoryId: 1,
    variants: [
      { weight: "4 pcs (approx. 450-550 g)", price: 115, mrp: 145, discount: 21 },
      { weight: "1 kg", price: 189, mrp: 240, discount: 21 },
    ],
    rating: 4.2,
    reviews: 2134,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop",
    badge: "10 MINS",
    badgeColor: "bg-green-600",
    description: "Fresh Shimla apples, crisp and sweet",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 8,
    name: "Carrot - Orange",
    brand: "Fresho",
    categoryId: 1,
    variants: [
      { weight: "500 g", price: 28, mrp: 36, discount: 22 },
      { weight: "1 kg", price: 54, mrp: 70, discount: 23 },
    ],
    rating: 4.1,
    reviews: 1876,
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop",
    badge: "10 MINS",
    badgeColor: "bg-green-600",
    description: "Fresh orange carrots, rich in beta-carotene",
    inStock: true,
    deliveryTime: "10 mins"
  },
  // Dairy, Bread & Eggs (categoryId: 2)
  {
    id: 9,
    name: "Amul Taaza Toned Fresh Milk",
    brand: "Amul",
    categoryId: 2,
    variants: [
      { weight: "500 ml", price: 27, mrp: 28, discount: 4 },
      { weight: "1 L", price: 54, mrp: 56, discount: 4 },
    ],
    rating: 4.5,
    reviews: 8934,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop",
    badge: "10 MINS",
    badgeColor: "bg-green-600",
    description: "Fresh toned milk from Amul",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 10,
    name: "Amul Butter",
    brand: "Amul",
    categoryId: 2,
    variants: [
      { weight: "100 g", price: 56, mrp: 58, discount: 3 },
      { weight: "500 g", price: 270, mrp: 285, discount: 5 },
    ],
    rating: 4.6,
    reviews: 12453,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&h=300&fit=crop",
    badge: "Best Seller",
    badgeColor: "bg-yellow-500",
    description: "Utterly butterly delicious Amul butter",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 11,
    name: "Britannia Brown Bread",
    brand: "Britannia",
    categoryId: 2,
    variants: [
      { weight: "400 g", price: 42, mrp: 45, discount: 7 },
    ],
    rating: 4.2,
    reviews: 3421,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop",
    description: "Healthy brown bread for daily nutrition",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 12,
    name: "Farm Fresh White Eggs",
    brand: "Fresho",
    categoryId: 2,
    variants: [
      { weight: "6 pcs", price: 48, mrp: 54, discount: 11 },
      { weight: "12 pcs", price: 92, mrp: 105, discount: 12 },
      { weight: "30 pcs", price: 225, mrp: 260, discount: 13 },
    ],
    rating: 4.4,
    reviews: 6789,
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop",
    badge: "10 MINS",
    badgeColor: "bg-green-600",
    description: "Farm fresh white eggs, protein rich",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 13,
    name: "Amul Cheese Slices",
    brand: "Amul",
    categoryId: 2,
    variants: [
      { weight: "100 g (5 slices)", price: 75, mrp: 80, discount: 6 },
      { weight: "200 g (10 slices)", price: 145, mrp: 155, discount: 6 },
    ],
    rating: 4.5,
    reviews: 4532,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&h=300&fit=crop",
    description: "Processed cheese slices, perfect for sandwiches",
    inStock: true,
    deliveryTime: "10 mins"
  },
  // Atta, Rice & Dal (categoryId: 3)
  {
    id: 14,
    name: "Aashirvaad Whole Wheat Atta",
    brand: "Aashirvaad",
    categoryId: 3,
    variants: [
      { weight: "1 kg", price: 52, mrp: 58, discount: 10 },
      { weight: "5 kg", price: 245, mrp: 275, discount: 11 },
      { weight: "10 kg", price: 475, mrp: 540, discount: 12 },
    ],
    rating: 4.6,
    reviews: 15678,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop",
    badge: "Best Seller",
    badgeColor: "bg-yellow-500",
    description: "100% whole wheat atta for soft rotis",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 15,
    name: "India Gate Basmati Rice - Classic",
    brand: "India Gate",
    categoryId: 3,
    variants: [
      { weight: "1 kg", price: 145, mrp: 165, discount: 12 },
      { weight: "5 kg", price: 695, mrp: 795, discount: 13 },
    ],
    rating: 4.5,
    reviews: 9876,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop",
    badge: "10 MINS",
    badgeColor: "bg-green-600",
    description: "Premium basmati rice with long grains",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 16,
    name: "Toor Dal",
    brand: "bb Popular",
    categoryId: 3,
    variants: [
      { weight: "500 g", price: 72, mrp: 85, discount: 15 },
      { weight: "1 kg", price: 140, mrp: 165, discount: 15 },
    ],
    rating: 4.3,
    reviews: 5432,
    image: "https://images.unsplash.com/photo-1585996746495-4b5e8e4d0e5a?w=300&h=300&fit=crop",
    description: "Premium quality toor dal for daily cooking",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 17,
    name: "Moong Dal",
    brand: "bb Popular",
    categoryId: 3,
    variants: [
      { weight: "500 g", price: 85, mrp: 98, discount: 13 },
      { weight: "1 kg", price: 165, mrp: 190, discount: 13 },
    ],
    rating: 4.2,
    reviews: 3245,
    image: "https://images.unsplash.com/photo-1585996746495-4b5e8e4d0e5a?w=300&h=300&fit=crop",
    description: "Yellow moong dal, easy to digest",
    inStock: true,
    deliveryTime: "10 mins"
  },
  // Oil & Ghee (categoryId: 4)
  {
    id: 18,
    name: "Fortune Sunflower Oil",
    brand: "Fortune",
    categoryId: 4,
    variants: [
      { weight: "1 L", price: 145, mrp: 165, discount: 12 },
      { weight: "5 L", price: 695, mrp: 795, discount: 13 },
    ],
    rating: 4.4,
    reviews: 8765,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop",
    badge: "10 MINS",
    badgeColor: "bg-green-600",
    description: "Light and healthy sunflower oil",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 19,
    name: "Amul Pure Ghee",
    brand: "Amul",
    categoryId: 4,
    variants: [
      { weight: "200 ml", price: 125, mrp: 135, discount: 7 },
      { weight: "500 ml", price: 295, mrp: 320, discount: 8 },
      { weight: "1 L", price: 575, mrp: 625, discount: 8 },
    ],
    rating: 4.7,
    reviews: 14532,
    image: "https://images.unsplash.com/photo-1631209121750-a9f656d7e8d4?w=300&h=300&fit=crop",
    badge: "Best Seller",
    badgeColor: "bg-yellow-500",
    description: "Pure cow ghee with rich aroma",
    inStock: true,
    deliveryTime: "10 mins"
  },
  // Snacks & Beverages (categoryId: 5)
  {
    id: 20,
    name: "Lay's Classic Salted Chips",
    brand: "Lay's",
    categoryId: 5,
    variants: [
      { weight: "52 g", price: 20, mrp: 20, discount: 0 },
      { weight: "90 g", price: 35, mrp: 40, discount: 13 },
      { weight: "177 g", price: 85, mrp: 99, discount: 14 },
    ],
    rating: 4.3,
    reviews: 6543,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop",
    description: "Crispy salted potato chips",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 21,
    name: "Coca Cola",
    brand: "Coca Cola",
    categoryId: 5,
    variants: [
      { weight: "300 ml", price: 35, mrp: 40, discount: 13 },
      { weight: "750 ml", price: 42, mrp: 45, discount: 7 },
      { weight: "2 L", price: 95, mrp: 105, discount: 10 },
    ],
    rating: 4.5,
    reviews: 12345,
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=300&fit=crop",
    description: "Refreshing cola drink",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 22,
    name: "Parle-G Biscuits",
    brand: "Parle",
    categoryId: 5,
    variants: [
      { weight: "79.9 g", price: 10, mrp: 10, discount: 0 },
      { weight: "250 g", price: 27, mrp: 30, discount: 10 },
      { weight: "800 g", price: 82, mrp: 95, discount: 14 },
    ],
    rating: 4.6,
    reviews: 18765,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop",
    badge: "Best Seller",
    badgeColor: "bg-yellow-500",
    description: "India's favorite glucose biscuits",
    inStock: true,
    deliveryTime: "10 mins"
  },
  // Masala & Spices (categoryId: 6)
  {
    id: 23,
    name: "MDH Garam Masala",
    brand: "MDH",
    categoryId: 6,
    variants: [
      { weight: "50 g", price: 52, mrp: 58, discount: 10 },
      { weight: "100 g", price: 98, mrp: 110, discount: 11 },
    ],
    rating: 4.5,
    reviews: 7654,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop",
    description: "Authentic blend of aromatic spices",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 24,
    name: "Everest Turmeric Powder",
    brand: "Everest",
    categoryId: 6,
    variants: [
      { weight: "100 g", price: 35, mrp: 40, discount: 13 },
      { weight: "200 g", price: 68, mrp: 78, discount: 13 },
      { weight: "500 g", price: 165, mrp: 190, discount: 13 },
    ],
    rating: 4.4,
    reviews: 5432,
    image: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=300&h=300&fit=crop",
    description: "Pure turmeric powder for cooking",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 25,
    name: "Red Chilli Powder",
    brand: "bb Popular",
    categoryId: 6,
    variants: [
      { weight: "100 g", price: 32, mrp: 38, discount: 16 },
      { weight: "200 g", price: 62, mrp: 74, discount: 16 },
      { weight: "500 g", price: 150, mrp: 180, discount: 17 },
    ],
    rating: 4.3,
    reviews: 4321,
    image: "https://images.unsplash.com/photo-1599909533681-74084861b8a5?w=300&h=300&fit=crop",
    description: "Spicy red chilli powder",
    inStock: true,
    deliveryTime: "10 mins"
  },
  // Cleaning & Household (categoryId: 7)
  {
    id: 26,
    name: "Surf Excel Easy Wash",
    brand: "Surf Excel",
    categoryId: 7,
    variants: [
      { weight: "500 g", price: 65, mrp: 75, discount: 13 },
      { weight: "1 kg", price: 125, mrp: 145, discount: 14 },
      { weight: "3 kg", price: 365, mrp: 420, discount: 13 },
    ],
    rating: 4.5,
    reviews: 9876,
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=300&fit=crop",
    badge: "10 MINS",
    badgeColor: "bg-green-600",
    description: "Powerful detergent for tough stains",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 27,
    name: "Vim Dishwash Bar",
    brand: "Vim",
    categoryId: 7,
    variants: [
      { weight: "200 g", price: 22, mrp: 25, discount: 12 },
      { weight: "500 g", price: 52, mrp: 60, discount: 13 },
    ],
    rating: 4.4,
    reviews: 6543,
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300&h=300&fit=crop",
    description: "Effective dishwash bar for sparkling utensils",
    inStock: true,
    deliveryTime: "10 mins"
  },
  // Personal Care (categoryId: 8)
  {
    id: 28,
    name: "Dove Soap",
    brand: "Dove",
    categoryId: 8,
    variants: [
      { weight: "100 g", price: 52, mrp: 58, discount: 10 },
      { weight: "100 g x 3", price: 148, mrp: 170, discount: 13 },
    ],
    rating: 4.6,
    reviews: 11234,
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=300&h=300&fit=crop",
    badge: "Best Seller",
    badgeColor: "bg-yellow-500",
    description: "Moisturizing beauty bar",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 29,
    name: "Colgate MaxFresh Toothpaste",
    brand: "Colgate",
    categoryId: 8,
    variants: [
      { weight: "80 g", price: 55, mrp: 62, discount: 11 },
      { weight: "150 g", price: 98, mrp: 112, discount: 13 },
      { weight: "300 g", price: 185, mrp: 215, discount: 14 },
    ],
    rating: 4.5,
    reviews: 8765,
    image: "https://images.unsplash.com/photo-1628359355624-855c74c79e5b?w=300&h=300&fit=crop",
    description: "Fresh breath with cooling crystals",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 30,
    name: "Head & Shoulders Shampoo",
    brand: "Head & Shoulders",
    categoryId: 8,
    variants: [
      { weight: "180 ml", price: 185, mrp: 210, discount: 12 },
      { weight: "340 ml", price: 345, mrp: 395, discount: 13 },
      { weight: "650 ml", price: 625, mrp: 720, discount: 13 },
    ],
    rating: 4.4,
    reviews: 7654,
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=300&h=300&fit=crop",
    description: "Anti-dandruff shampoo for healthy scalp",
    inStock: true,
    deliveryTime: "10 mins"
  },
  // More Fruits & Vegetables
  {
    id: 31,
    name: "Spinach (Palak)",
    brand: "Fresho",
    categoryId: 1,
    variants: [
      { weight: "250 g", price: 15, mrp: 20, discount: 25 },
      { weight: "500 g", price: 28, mrp: 38, discount: 26 },
    ],
    rating: 4.1,
    reviews: 2345,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop",
    badge: "10 MINS",
    badgeColor: "bg-green-600",
    description: "Fresh spinach leaves, iron rich",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 32,
    name: "Cucumber",
    brand: "Fresho",
    categoryId: 1,
    variants: [
      { weight: "500 g", price: 22, mrp: 28, discount: 21 },
      { weight: "1 kg", price: 42, mrp: 54, discount: 22 },
    ],
    rating: 4.2,
    reviews: 1876,
    image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=300&h=300&fit=crop",
    description: "Fresh cucumbers for salads",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 33,
    name: "Mango - Alphonso",
    brand: "Fresho",
    categoryId: 1,
    variants: [
      { weight: "1 kg (3-4 pcs)", price: 450, mrp: 520, discount: 13 },
      { weight: "2 kg (6-8 pcs)", price: 875, mrp: 1020, discount: 14 },
    ],
    rating: 4.7,
    reviews: 5678,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=300&fit=crop",
    badge: "Premium",
    badgeColor: "bg-purple-600",
    description: "King of mangoes - Alphonso from Ratnagiri",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 34,
    name: "Grapes - Green Seedless",
    brand: "Fresho",
    categoryId: 1,
    variants: [
      { weight: "500 g", price: 85, mrp: 105, discount: 19 },
      { weight: "1 kg", price: 165, mrp: 205, discount: 20 },
    ],
    rating: 4.3,
    reviews: 3456,
    image: "https://images.unsplash.com/photo-1599819177331-6d0b4cd1e8d7?w=300&h=300&fit=crop",
    badge: "10 MINS",
    badgeColor: "bg-green-600",
    description: "Sweet seedless green grapes",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 35,
    name: "Paneer - Fresh",
    brand: "Amul",
    categoryId: 2,
    variants: [
      { weight: "200 g", price: 85, mrp: 95, discount: 11 },
      { weight: "500 g", price: 205, mrp: 235, discount: 13 },
      { weight: "1 kg", price: 395, mrp: 460, discount: 14 },
    ],
    rating: 4.5,
    reviews: 8765,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=300&fit=crop",
    badge: "Best Seller",
    badgeColor: "bg-yellow-500",
    description: "Fresh cottage cheese for cooking",
    inStock: true,
    deliveryTime: "10 mins"
  },
  {
    id: 36,
    name: "Curd - Natural",
    brand: "Amul",
    categoryId: 2,
    variants: [
      { weight: "200 g", price: 25, mrp: 28, discount: 11 },
      { weight: "400 g", price: 48, mrp: 54, discount: 11 },
      { weight: "1 kg", price: 75, mrp: 85, discount: 12 },
    ],
    rating: 4.4,
    reviews: 6543,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop",
    description: "Fresh natural curd",
    inStock: true,
    deliveryTime: "10 mins"
  },
];

// Helper functions
export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: number): Product[] => {
  return products.filter(product => product.categoryId === categoryId);
};

export const getAllProducts = (): Product[] => {
  return products;
};

export const getProductsByBrand = (brand: string): Product[] => {
  return products.filter(product => product.brand.toLowerCase() === brand.toLowerCase());
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.brand.toLowerCase().includes(lowerQuery)
  );
};
