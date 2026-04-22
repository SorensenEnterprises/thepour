export interface PantryItem {
  id: string;
  name: string;
  satisfies: string[];
}

export interface PantryCategory {
  category: string;
  emoji: string;
  items: PantryItem[];
}

export const PANTRY_CATEGORIES: PantryCategory[] = [
  {
    category: 'Fresh Citrus', emoji: '🍋',
    items: [
      { id: 'fresh-lime', name: 'Fresh Limes', satisfies: ['lime juice', 'fresh lime juice', 'lime', 'lime wedge', 'lime peel'] },
      { id: 'fresh-lemon', name: 'Fresh Lemons', satisfies: ['lemon juice', 'fresh lemon juice', 'lemon', 'lemon wedge', 'lemon peel'] },
      { id: 'fresh-orange', name: 'Fresh Oranges', satisfies: ['orange juice', 'fresh orange juice', 'orange', 'orange slice', 'orange twist', 'orange peel'] },
      { id: 'fresh-grapefruit', name: 'Fresh Grapefruit', satisfies: ['grapefruit juice', 'fresh grapefruit juice', 'grapefruit', 'grapefruit twist'] },
    ],
  },
  {
    category: 'Fresh Herbs', emoji: '🌿',
    items: [
      { id: 'fresh-mint', name: 'Fresh Mint', satisfies: ['mint', 'mint sprig', 'fresh mint'] },
      { id: 'fresh-basil', name: 'Fresh Basil', satisfies: ['basil', 'fresh basil'] },
      { id: 'fresh-cucumber', name: 'Fresh Cucumber', satisfies: ['cucumber', 'cucumber slice'] },
    ],
  },
  {
    category: 'Eggs and Dairy', emoji: '🥚',
    items: [
      { id: 'eggs', name: 'Eggs', satisfies: ['egg white', 'egg yolk', 'whole egg', 'egg'] },
      { id: 'heavy-cream', name: 'Heavy Cream', satisfies: ['heavy cream', 'cream', 'whipping cream'] },
    ],
  },
  {
    category: 'Sweeteners', emoji: '🍯',
    items: [
      { id: 'simple-syrup', name: 'Simple Syrup', satisfies: ['simple syrup', 'sugar syrup', '1:1 syrup'] },
      { id: 'honey', name: 'Honey', satisfies: ['honey', 'honey syrup'] },
      { id: 'agave', name: 'Agave Nectar', satisfies: ['agave', 'agave nectar', 'agave syrup'] },
      { id: 'sugar', name: 'Sugar', satisfies: ['sugar', 'white sugar', 'caster sugar', 'superfine sugar'] },
      { id: 'demerara-syrup', name: 'Demerara Syrup', satisfies: ['demerara syrup', 'rich syrup', '2:1 syrup'] },
    ],
  },
  {
    category: 'Juices and Purees', emoji: '🧃',
    items: [
      { id: 'pineapple-juice', name: 'Pineapple Juice', satisfies: ['pineapple juice', 'pineapple'] },
      { id: 'cranberry-juice', name: 'Cranberry Juice', satisfies: ['cranberry juice', 'cranberry'] },
      { id: 'passion-fruit', name: 'Passion Fruit Puree', satisfies: ['passion fruit', 'passion fruit puree', 'passionfruit'] },
      { id: 'coconut-cream', name: 'Coconut Cream', satisfies: ['coconut cream', 'cream of coconut', 'coco lopez'] },
    ],
  },
  {
    category: 'Kitchen Staples', emoji: '🧂',
    items: [
      { id: 'salt', name: 'Salt', satisfies: ['salt', 'kosher salt', 'sea salt', 'salt rim'] },
      { id: 'ice', name: 'Ice', satisfies: ['ice', 'crushed ice', 'ice cubes'] },
      { id: 'sparkling-water', name: 'Sparkling Water', satisfies: ['club soda', 'soda water', 'sparkling water', 'carbonated water'] },
    ],
  },
];
