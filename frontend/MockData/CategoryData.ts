export interface SubCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  image: string;
  subcategories: SubCategory[];
}

export const categories: Category[] = [
  { 
    id: 1, 
    name: 'Fruits & Vegetables', 
    slug: 'fruits-vegetables', 
    icon: '',
    description: 'Fresh fruits and vegetables delivered daily',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&h=300&fit=crop',
    subcategories: [
      { id: 101, name: 'Fresh Vegetables', slug: 'fresh-vegetables' },
      { id: 102, name: 'Fresh Fruits', slug: 'fresh-fruits' },
      { id: 103, name: 'Herbs & Seasonings', slug: 'herbs-seasonings' },
      { id: 104, name: 'Exotic Fruits & Veggies', slug: 'exotic-fruits-veggies' },
      { id: 105, name: 'Cuts & Sprouts', slug: 'cuts-sprouts' },
      { id: 106, name: 'Organic Fruits & Vegetables', slug: 'organic-fruits-vegetables' },
    ]
  },
  { 
    id: 2, 
    name: 'Dairy, Bread & Eggs', 
    slug: 'dairy-bread-eggs', 
    icon: '',
    description: 'Fresh dairy products, bread and eggs',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop',
    subcategories: [
      { id: 201, name: 'Milk', slug: 'milk' },
      { id: 202, name: 'Curd & Yogurt', slug: 'curd-yogurt' },
      { id: 203, name: 'Paneer & Tofu', slug: 'paneer-tofu' },
      { id: 204, name: 'Butter & Cheese', slug: 'butter-cheese' },
      { id: 205, name: 'Eggs', slug: 'eggs' },
      { id: 206, name: 'Bread & Pav', slug: 'bread-pav' },
    ]
  },
  { 
    id: 3, 
    name: 'Atta, Rice & Dal', 
    slug: 'atta-rice-dal', 
    icon: '',
    description: 'Staples for your kitchen',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop',
    subcategories: [
      { id: 301, name: 'Atta & Flours', slug: 'atta-flours' },
      { id: 302, name: 'Rice & Rice Products', slug: 'rice-products' },
      { id: 303, name: 'Dal & Pulses', slug: 'dal-pulses' },
      { id: 304, name: 'Dry Fruits', slug: 'dry-fruits' },
      { id: 305, name: 'Poha, Sooji & Rava', slug: 'poha-sooji-rava' },
    ]
  },
  { 
    id: 4, 
    name: 'Oil, Ghee & Masala', 
    slug: 'oil-ghee-masala', 
    icon: '',
    description: 'Cooking essentials',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop',
    subcategories: [
      { id: 401, name: 'Cooking Oil', slug: 'cooking-oil' },
      { id: 402, name: 'Ghee & Vanaspati', slug: 'ghee-vanaspati' },
      { id: 403, name: 'Masala & Spices', slug: 'masala-spices' },
      { id: 404, name: 'Salt, Sugar & Jaggery', slug: 'salt-sugar-jaggery' },
    ]
  },
  { 
    id: 5, 
    name: 'Snacks & Beverages', 
    slug: 'snacks-beverages', 
    icon: '',
    description: 'Chips, drinks and more',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop',
    subcategories: [
      { id: 501, name: 'Chips & Namkeen', slug: 'chips-namkeen' },
      { id: 502, name: 'Biscuits & Cookies', slug: 'biscuits-cookies' },
      { id: 503, name: 'Tea & Coffee', slug: 'tea-coffee' },
      { id: 504, name: 'Soft Drinks & Juices', slug: 'soft-drinks-juices' },
      { id: 505, name: 'Health Drinks', slug: 'health-drinks' },
      { id: 506, name: 'Chocolates & Sweets', slug: 'chocolates-sweets' },
    ]
  },
  { 
    id: 6, 
    name: 'Instant & Frozen', 
    slug: 'instant-frozen', 
    icon: '',
    description: 'Ready to eat and frozen foods',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop',
    subcategories: [
      { id: 601, name: 'Noodles & Pasta', slug: 'noodles-pasta' },
      { id: 602, name: 'Ready to Eat', slug: 'ready-to-eat' },
      { id: 603, name: 'Frozen Snacks', slug: 'frozen-snacks' },
      { id: 604, name: 'Ice Creams', slug: 'ice-creams' },
    ]
  },
  { 
    id: 7, 
    name: 'Cleaning & Household', 
    slug: 'cleaning-household', 
    icon: '',
    description: 'Home cleaning essentials',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=300&fit=crop',
    subcategories: [
      { id: 701, name: 'Detergents & Fabric Care', slug: 'detergents-fabric-care' },
      { id: 702, name: 'Dishwash', slug: 'dishwash' },
      { id: 703, name: 'Floor & Surface Cleaners', slug: 'floor-surface-cleaners' },
      { id: 704, name: 'Fresheners & Repellents', slug: 'fresheners-repellents' },
      { id: 705, name: 'Pooja Needs', slug: 'pooja-needs' },
    ]
  },
  { 
    id: 8, 
    name: 'Personal Care', 
    slug: 'personal-care', 
    icon: '',
    description: 'Beauty and personal care products',
    image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=300&h=300&fit=crop',
    subcategories: [
      { id: 801, name: 'Bath & Body', slug: 'bath-body' },
      { id: 802, name: 'Hair Care', slug: 'hair-care' },
      { id: 803, name: 'Skin Care', slug: 'skin-care' },
      { id: 804, name: 'Oral Care', slug: 'oral-care' },
      { id: 805, name: 'Deos & Perfumes', slug: 'deos-perfumes' },
      { id: 806, name: 'Feminine Hygiene', slug: 'feminine-hygiene' },
    ]
  },
];

export const getCategoryById = (id: number): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};
