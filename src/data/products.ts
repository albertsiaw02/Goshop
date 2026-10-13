export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  weight: string;
  emoji: string;
  description: string;
  mrp?: number;
};

export const CATEGORIES = [
  { id: 'fruits', name: 'Fruits', emoji: '🍎' },
  { id: 'vegetables', name: 'Vegetables', emoji: '🥦' },
  { id: 'dairy', name: 'Dairy & Eggs', emoji: '🥛' },
  { id: 'bakery', name: 'Bakery', emoji: '🥐' },
  { id: 'meat', name: 'Meat & Fish', emoji: '🥩' },
  { id: 'snacks', name: 'Snacks', emoji: '🍿' },
  { id: 'drinks', name: 'Drinks', emoji: '🧃' },
] as const;

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Fresh Apples', category: 'fruits', price: 75, unit: 'piece', weight: '300g', emoji: '🍎', description: 'Crisp and juicy red apples, perfect for a healthy snack.', mrp: 90 },
  { id: '2', name: 'Organic Spinach', category: 'vegetables', price: 20, unit: 'bundle', weight: '300g', emoji: '🌿', description: 'Fresh leafy spinach, rich in iron and vitamins.', mrp: 30 },
  { id: '3', name: 'Sweet Oranges', category: 'fruits', price: 30, unit: 'piece', weight: '300g', emoji: '🍊', description: 'Tangy and sweet oranges, rich in vitamin C.', mrp: 40 },
  { id: '4', name: 'Organic Lettuce', category: 'vegetables', price: 25, unit: 'bundle', weight: '300g', emoji: '🥬', description: 'Crisp lettuce perfect for salads and sandwiches.', mrp: 30 },
  { id: '5', name: 'Fresh Tomatoes', category: 'vegetables', price: 20, unit: 'kg', weight: '300g', emoji: '🍅', description: 'Ripe red tomatoes ideal for salads and sauces.', mrp: 30 },
  { id: '6', name: 'Raw Sweet Corn', category: 'vegetables', price: 25, unit: 'piece', weight: '300g', emoji: '🌽', description: 'Sweet and juicy corn, perfect for grilling or boiling.', mrp: 30 },
  { id: '7', name: 'Whole Milk', category: 'dairy', price: 1.5, unit: 'L', weight: '1 L', emoji: '🥛', description: 'Fresh pasteurized whole milk.' },
  { id: '8', name: 'Free-Range Eggs', category: 'dairy', price: 3.4, unit: 'dozen', weight: '12 pcs', emoji: '🥚', description: 'Pasture-raised brown eggs from local farms.' },
  { id: '9', name: 'Cheddar Cheese', category: 'dairy', price: 4.2, unit: 'pack', weight: '250 g', emoji: '🧀', description: 'Aged sharp cheddar, perfect for sandwiches.' },
  { id: '10', name: 'Baguette', category: 'bakery', price: 1.9, unit: 'piece', weight: '250 g', emoji: '🥖', description: 'Freshly baked French baguette, crispy outside.' },
  { id: '11', name: 'Croissant', category: 'bakery', price: 1.4, unit: 'piece', weight: '80 g', emoji: '🥐', description: 'Buttery flaky croissants baked this morning.' },
  { id: '12', name: 'Whole Wheat Bread', category: 'bakery', price: 2.1, unit: 'loaf', weight: '600 g', emoji: '🍞', description: 'Hearty whole-wheat loaf with seeds.' },
  { id: '13', name: 'Chicken Breast', category: 'meat', price: 6.5, unit: 'kg', weight: '1 kg', emoji: '🍗', description: 'Fresh boneless chicken breast, skinless.' },
  { id: '14', name: 'Salmon Fillet', category: 'meat', price: 12.0, unit: 'kg', weight: '500 g', emoji: '🐟', description: 'Wild-caught salmon fillet, rich in omega-3.' },
  { id: '15', name: 'Potato Chips', category: 'snacks', price: 1.8, unit: 'bag', weight: '150 g', emoji: '🍟', description: 'Classic salted potato chips.' },
  { id: '16', name: 'Popcorn', category: 'snacks', price: 1.5, unit: 'bag', weight: '100 g', emoji: '🍿', description: 'Lightly salted movie-style popcorn.' },
  { id: '17', name: 'Orange Juice', category: 'drinks', price: 2.6, unit: 'L', weight: '1 L', emoji: '🧃', description: '100% pure squeezed orange juice, no added sugar.' },
  { id: '18', name: 'Sparkling Water', category: 'drinks', price: 1.2, unit: 'L', weight: '1 L', emoji: '💧', description: 'Refreshing lightly carbonated sparkling water.' },
];

export function getProductById(id: string | string[] | undefined): Product | undefined {
  if (!id) return undefined;
  const key = Array.isArray(id) ? id[0] : id;
  return PRODUCTS.find((p) => p.id === key);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return PRODUCTS.filter((p) => p.category === categoryId);
}
