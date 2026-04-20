export interface GlassInfo {
  emoji: string;
  label: string;
  reason: string;
}

const GLASS_MAP: Record<string, GlassInfo> = {
  'coupe': {
    emoji: '🍸',
    label: 'Coupe Glass',
    reason: 'The wide, shallow bowl showcases clarity and aroma for spirit-forward and citrus cocktails.',
  },
  'rocks': {
    emoji: '🥃',
    label: 'Rocks Glass',
    reason: 'The short, sturdy build is designed for drinks served over ice or neat, keeping dilution controlled.',
  },
  'old fashioned': {
    emoji: '🥃',
    label: 'Old Fashioned Glass',
    reason: 'The wide mouth lets you nose the drink while the heavy base supports muddling and large ice cubes.',
  },
  'highball': {
    emoji: '🥤',
    label: 'Highball Glass',
    reason: 'The tall, narrow shape preserves carbonation and keeps ice-to-spirit ratio balanced in long drinks.',
  },
  'copper mug': {
    emoji: '☕',
    label: 'Copper Mug',
    reason: 'Copper conducts cold beautifully and is inseparable from mule drinks — it keeps the drink frosty and sharp.',
  },
  'mug': {
    emoji: '☕',
    label: 'Mug',
    reason: 'Insulated walls keep hot cocktails warm and protect your hands from the heat.',
  },
  'irish coffee mug': {
    emoji: '☕',
    label: 'Irish Coffee Mug',
    reason: 'The glass handle lets you hold a hot drink comfortably while showing off the layered cream float.',
  },
  'collins': {
    emoji: '🥤',
    label: 'Collins Glass',
    reason: 'Taller than a highball, the Collins glass gives bubbly, citrus drinks room to stretch and stay carbonated.',
  },
  'champagne flute': {
    emoji: '🥂',
    label: 'Champagne Flute',
    reason: 'The narrow opening slows carbonation loss, keeping sparkling cocktails lively from first sip to last.',
  },
  'martini': {
    emoji: '🍸',
    label: 'Martini Glass',
    reason: 'The iconic V-shape keeps the garnish visible and allows the aromas of spirit-forward cocktails to bloom.',
  },
  'cocktail': {
    emoji: '🍸',
    label: 'Cocktail Glass',
    reason: 'The stemmed design keeps your hand from warming the drink and presents a chilled pour elegantly.',
  },
  'shot glass': {
    emoji: '🥃',
    label: 'Shot Glass',
    reason: 'Precisely sized to deliver a single serving of spirit or shooter in one clean, efficient pour.',
  },
  'shot glass (tall)': {
    emoji: '🥃',
    label: 'Shot Glass',
    reason: 'Precisely sized to deliver a single serving of spirit or shooter in one clean, efficient pour.',
  },
  'pint': {
    emoji: '🍺',
    label: 'Pint Glass',
    reason: 'The wide, tapered shape is ideal for beer-forward cocktails and bomb-style shots with plenty of volume.',
  },
  'pint (bomb-style)': {
    emoji: '🍺',
    label: 'Pint Glass (Bomb)',
    reason: 'Holds enough volume for the shot glass to drop in, delivering that signature bomb-shot rush.',
  },
  'hurricane': {
    emoji: '🍹',
    label: 'Hurricane Glass',
    reason: 'The tall, curvy shape accommodates the generous ice and fruit garnishes of tropical tiki drinks.',
  },
  'tiki': {
    emoji: '🍹',
    label: 'Tiki Mug',
    reason: 'Tiki mugs keep the drink cold and bring the island aesthetic that makes tropical cocktails feel complete.',
  },
  'tiki mug': {
    emoji: '🍹',
    label: 'Tiki Mug',
    reason: 'Tiki mugs keep the drink cold and bring the island aesthetic that makes tropical cocktails feel complete.',
  },
  'wine': {
    emoji: '🍷',
    label: 'Wine Glass',
    reason: 'The large bowl concentrates aromas and gives wine-based cocktails room to breathe and open up.',
  },
  'wine glass': {
    emoji: '🍷',
    label: 'Wine Glass',
    reason: 'The large bowl concentrates aromas and gives wine-based cocktails room to breathe and open up.',
  },
  'copa': {
    emoji: '🍷',
    label: 'Copa Glass',
    reason: 'The oversized bowl is perfect for gin and tonics, capturing botanical aromas with every sip.',
  },
  'large cup': {
    emoji: '🥤',
    label: 'Large Cup',
    reason: 'Dirty sodas are built big — the generous size holds plenty of ice, soda, and that cream float.',
  },
  'double rocks': {
    emoji: '🥃',
    label: 'Double Rocks Glass',
    reason: 'The extra volume handles large format ice and spirit-forward drinks without crowding the glass.',
  },
  'julep cup': {
    emoji: '☕',
    label: 'Julep Cup',
    reason: 'Silver or tin julep cups frost beautifully and keep crushed-ice drinks ice-cold throughout.',
  },
  'goblet': {
    emoji: '🍷',
    label: 'Goblet',
    reason: 'The wide, deep bowl is ideal for complex, garnish-heavy cocktails that need room to breathe.',
  },
  'zombie glass': {
    emoji: '🍹',
    label: 'Zombie Glass',
    reason: 'The tall, straight-sided glass handles the generous layered build of tiki drinks without spilling.',
  },
};

const DEFAULT_GLASS: GlassInfo = {
  emoji: '🥃',
  label: 'Rocks Glass',
  reason: 'A rocks glass works well for most cocktails — short, solid, and ready for ice or neat pours.',
};

export function getGlassInfo(glassType: string): GlassInfo {
  const key = glassType.toLowerCase().trim();
  return GLASS_MAP[key] ?? DEFAULT_GLASS;
}
