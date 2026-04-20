export interface EquipmentItem {
  name: string;
  reason: string;
}

// ── Keyword rules: if any keyword matches recipe name (lowercase), include item ─

const EQUIPMENT_RULES: { keywords: RegExp; item: EquipmentItem }[] = [
  {
    keywords: /mojito|caipirinha|smash|bramble|julep|old.fashioned|muddl/i,
    item: { name: 'Muddler', reason: 'needed to release oils from citrus peels, herbs, or sugar cubes' },
  },
  {
    keywords: /manhattan|martini|negroni|rob roy|vieux|gimlet|last word|bijou|adonis|bamboo|sazerac|toronto/i,
    item: { name: 'Mixing Glass', reason: 'stirred spirit-forward drinks are best diluted in a Japanese mixing glass for precise control' },
  },
  {
    keywords: /smoked|smoky|smoke/i,
    item: { name: 'Smoking Kit', reason: 'adds the wood-smoke element that defines this cocktail' },
  },
  {
    keywords: /torch|flame|flam/i,
    item: { name: 'Cocktail Torch', reason: 'needed to flame the citrus peel or caramelize garnishes' },
  },
  {
    keywords: /mule|swizzle|julep|mai tai|daiquiri.*crushed|cobbler/i,
    item: { name: "Lewis Bag & Mallet", reason: 'crushed ice requires hand-cracking in a Lewis bag for the right texture' },
  },
  {
    keywords: /fizz|ramos|foam|egg.*white|white.*egg|flip/i,
    item: { name: 'Cream Whipper (optional)', reason: 'a cream whipper produces a more consistent and stable foam than a dry shake' },
  },
];

export function getRequiredEquipment(recipeName: string, tags: string[]): EquipmentItem[] {
  const searchStr = recipeName + ' ' + tags.join(' ');
  const found: EquipmentItem[] = [];
  const seen = new Set<string>();

  for (const rule of EQUIPMENT_RULES) {
    if (rule.keywords.test(searchStr)) {
      if (!seen.has(rule.item.name)) {
        found.push(rule.item);
        seen.add(rule.item.name);
      }
    }
  }
  return found;
}
