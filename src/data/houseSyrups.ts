// House Syrup Recipes for thepour
// These are bar staples users can make at home
// Each syrup links to cocktail recipes that use it
// Displayed in a "House Syrups" section and linked from recipe cards

export interface SyrupRecipe {
  id: string;
  name: string;
  category: 'citrus' | 'sweet' | 'spiced' | 'floral' | 'tropical' | 'savory';
  difficulty: 'easy' | 'medium' | 'hard';
  timeMinutes: number;
  yieldOz: number;
  shelfLifeDays: number;
  storageNote: string;
  vesperQuip: string;
  unlockIngredientId: string; // canonical ingredient ID it satisfies
  ingredients: Array<{ name: string; amount: number; unit: string }>;
  instructions: string;
  vesperTip: string;
  usedIn: string[]; // recipe names that use this syrup
}

export const houseSyrups: SyrupRecipe[] = [

  // ===== THE ESSENTIALS =====
  {
    id: "s001",
    name: "Simple Syrup",
    category: "sweet",
    difficulty: "easy",
    timeMinutes: 5,
    yieldOz: 12,
    shelfLifeDays: 30,
    storageNote: "Refrigerate in a sealed bottle. Lasts a month.",
    vesperQuip: "If you don't have simple syrup, you're not a home bartender. You're someone who owns bottles. Fix this now.",
    unlockIngredientId: "simple-syrup",
    ingredients: [
      { name: "White Sugar", amount: 1, unit: "cup" },
      { name: "Hot Water", amount: 1, unit: "cup" }
    ],
    instructions: "Combine equal parts sugar and hot water in a jar or bottle. Stir or shake until sugar is completely dissolved — about 60 seconds. That's it. Cool before using. Do not cook it. You don't need to.",
    vesperTip: "Use filtered water if you can taste the tap. Store in a squeeze bottle for easy pouring. Make a double batch — you'll use it faster than you think.",
    usedIn: ["Whiskey Sour", "Tom Collins", "Daiquiri", "Mojito", "Gimlet", "Gold Rush", "Southside", "Bee's Knees"]
  },

  {
    id: "s002",
    name: "Rich Demerara Syrup",
    category: "sweet",
    difficulty: "easy",
    timeMinutes: 10,
    yieldOz: 14,
    shelfLifeDays: 45,
    storageNote: "Refrigerate. Lasts longer than simple syrup due to higher sugar content.",
    vesperQuip: "This is what separates a good Old Fashioned from a great one. Demerara has a depth that plain sugar never achieves.",
    unlockIngredientId: "demerara-syrup",
    ingredients: [
      { name: "Demerara Sugar", amount: 2, unit: "cups" },
      { name: "Hot Water", amount: 1, unit: "cup" }
    ],
    instructions: "Combine 2 parts demerara sugar to 1 part hot water. Stir until fully dissolved — takes a bit longer than simple syrup because of the ratio. Do not boil. Cool completely before bottling. The 2:1 ratio gives it a richer, more viscous texture that coats a drink differently than 1:1.",
    vesperTip: "The molasses notes in demerara are what make tiki drinks taste right. Use this anywhere a recipe says 'rich syrup' or '2:1 syrup.' Old Fashioned, Rum Old Fashioned, most tiki drinks.",
    usedIn: ["Old Fashioned", "Rum Old Fashioned", "Navy Grog", "Planter's Punch", "Rum Swizzle", "Dead Reckoning"]
  },

  {
    id: "s003",
    name: "Honey Syrup",
    category: "sweet",
    difficulty: "easy",
    timeMinutes: 5,
    yieldOz: 12,
    shelfLifeDays: 30,
    storageNote: "Refrigerate. Honey syrup can crystallize — warm gently if needed.",
    vesperQuip: "Honey straight from the jar seizes up in cold drinks. This fixes that. Five minutes, no excuse.",
    unlockIngredientId: "honey-syrup",
    ingredients: [
      { name: "Raw Honey", amount: 1, unit: "cup" },
      { name: "Hot Water", amount: 0.5, unit: "cup" }
    ],
    instructions: "Combine 2 parts honey to 1 part hot water. Stir until fully incorporated. The hot water thins the honey and makes it pourable. Cool before using. A 2:1 ratio keeps the honey flavor dominant.",
    vesperTip: "Use a good quality raw honey — the floral notes carry through into the drink. Wildflower or clover for most cocktails. Buckwheat honey for something bolder in a Gold Rush.",
    usedIn: ["Gold Rush", "Brown Derby", "Bee's Knees", "Penicillin", "Hot Toddy", "Honey Bee", "Three Dots and a Dash"]
  },

  {
    id: "s004",
    name: "Agave Syrup",
    category: "sweet",
    difficulty: "easy",
    timeMinutes: 5,
    yieldOz: 12,
    shelfLifeDays: 30,
    storageNote: "Refrigerate after opening.",
    vesperQuip: "Tommy's Margarita exists because someone understood that agave belongs in a tequila drink. They were right.",
    unlockIngredientId: "agave-syrup",
    ingredients: [
      { name: "Light Agave Nectar", amount: 2, unit: "parts" },
      { name: "Warm Water", amount: 1, unit: "part" }
    ],
    instructions: "Mix 2 parts agave nectar with 1 part warm water. Stir until combined. That's the entire recipe. The water just makes it easier to pour and mix. Use light agave for most cocktails, amber for something with more character.",
    vesperTip: "Don't use dark agave unless a recipe specifically calls for it — it can overwhelm. Light agave lets the tequila lead.",
    usedIn: ["Tommy's Margarita", "Tequila Old Fashioned", "Oaxacan Old Fashioned", "Mezcal Old Fashioned", "Naked Tequila Sour"]
  },

  // ===== CRAFT SYRUPS =====
  {
    id: "s005",
    name: "Fresh Grenadine",
    category: "sweet",
    difficulty: "easy",
    timeMinutes: 15,
    yieldOz: 16,
    shelfLifeDays: 14,
    storageNote: "Refrigerate. Shorter shelf life than bottled — worth it every time.",
    vesperQuip: "Bottled grenadine is corn syrup with red dye. Fresh pomegranate grenadine is an entirely different ingredient. Do not confuse them.",
    unlockIngredientId: "grenadine",
    ingredients: [
      { name: "Fresh Pomegranate Juice", amount: 1, unit: "cup" },
      { name: "White Sugar", amount: 1, unit: "cup" },
      { name: "Orange Flower Water", amount: 1, unit: "tsp" },
      { name: "Pomegranate Molasses", amount: 1, unit: "tsp" }
    ],
    instructions: "Combine pomegranate juice and sugar in a saucepan over low heat. Stir until sugar dissolves — do not boil or you'll lose the fresh flavor. Remove from heat. Add orange flower water and pomegranate molasses. Cool completely. Bottle and refrigerate. The color will be a deep ruby red, nothing like the neon red stuff.",
    vesperTip: "POM Wonderful works perfectly if you can't find fresh pomegranates. The orange flower water is the secret — it adds a floral note that the bottled stuff completely lacks. Make a double batch.",
    usedIn: ["Tequila Sunrise", "Hurricane", "Planter's Punch", "Ward 8", "Jack Rose", "Clover Club", "Shirley Temple", "Grenadine-based tiki drinks"]
  },

  {
    id: "s006",
    name: "Ginger Syrup",
    category: "spiced",
    difficulty: "easy",
    timeMinutes: 20,
    yieldOz: 12,
    shelfLifeDays: 21,
    storageNote: "Refrigerate. Strain well or it will get more intense over time.",
    vesperQuip: "Fresh ginger syrup in a Moscow Mule instead of ginger beer alone is a completely different drink. Try it once and you'll understand.",
    unlockIngredientId: "ginger-syrup",
    ingredients: [
      { name: "Fresh Ginger", amount: 4, unit: "oz" },
      { name: "White Sugar", amount: 1, unit: "cup" },
      { name: "Water", amount: 1, unit: "cup" }
    ],
    instructions: "Peel and roughly chop fresh ginger. Combine with sugar and water in a saucepan. Bring to a simmer over medium heat, stirring until sugar dissolves. Simmer 5 minutes. Remove from heat, let steep 10 minutes for mild ginger, 20 minutes for bold. Strain through fine mesh strainer pressing ginger to extract all liquid. Cool and bottle.",
    vesperTip: "Don't peel the ginger perfectly — the skin adds character. The longer you steep the more intense it gets. For the Penicillin cocktail you want it bold. For a simple ginger syrup in lighter drinks, steep shorter.",
    usedIn: ["Penicillin", "Moscow Mule", "Dark and Stormy", "Ginger Rogers", "Bee Sting", "Midnight in Tokyo"]
  },

  {
    id: "s007",
    name: "Cinnamon Syrup",
    category: "spiced",
    difficulty: "easy",
    timeMinutes: 20,
    yieldOz: 12,
    shelfLifeDays: 30,
    storageNote: "Refrigerate. Strain completely — cinnamon sediment will settle otherwise.",
    vesperQuip: "A Smoked Maple Sour with house cinnamon syrup is the kind of drink people ask about. The cinnamon is why.",
    unlockIngredientId: "cinnamon-syrup",
    ingredients: [
      { name: "Cinnamon Sticks", amount: 4, unit: "whole" },
      { name: "White Sugar", amount: 1, unit: "cup" },
      { name: "Water", amount: 1, unit: "cup" }
    ],
    instructions: "Break cinnamon sticks in half and combine with sugar and water in a saucepan. Bring to a simmer over medium heat, stirring until sugar dissolves. Simmer 10 minutes. Remove from heat. Steep 15 minutes for mild, 30 minutes for bold. Strain through fine mesh. Cool and bottle.",
    vesperTip: "Ceylon cinnamon is more delicate and floral. Cassia cinnamon is bolder and spicier. Either works — use what you have. Don't use ground cinnamon, it clouds the syrup and is hard to strain.",
    usedIn: ["Harvest Sour", "Smoked Maple Sour", "Hot Toddy", "Various autumn cocktails", "Certain tiki drinks"]
  },

  {
    id: "s008",
    name: "Orgeat",
    category: "tropical",
    difficulty: "medium",
    timeMinutes: 45,
    yieldOz: 20,
    shelfLifeDays: 14,
    storageNote: "Refrigerate. Shake before use — separation is normal. Does not keep as long as bottled.",
    vesperQuip: "Bottled orgeat is fine. House orgeat is a revelation. The Mai Tai was invented around fresh orgeat. There's a reason for that.",
    unlockIngredientId: "orgeat",
    ingredients: [
      { name: "Raw Almonds", amount: 2, unit: "cups" },
      { name: "White Sugar", amount: 1.5, unit: "cups" },
      { name: "Water", amount: 1.5, unit: "cups" },
      { name: "Orange Flower Water", amount: 1, unit: "tsp" },
      { name: "Almond Extract", amount: 0.25, unit: "tsp" }
    ],
    instructions: "Blanch almonds: pour boiling water over almonds, let sit 1 minute, drain, slip skins off. Toast skinned almonds in dry pan 3-4 minutes until lightly golden. Let cool completely. Blend almonds with 1.5 cups water until you have a fine almond milk — about 2 minutes in a blender. Strain through cheesecloth or fine mesh, pressing to extract all liquid. Discard solids. Combine almond milk with sugar in saucepan over low heat, stir until dissolved — do not boil. Remove from heat. Add orange flower water and almond extract. Cool and bottle. Shake well before using.",
    vesperTip: "The orange flower water is non-negotiable — it's what gives orgeat its distinctive floral character. If you're making a Mai Tai this weekend, make the orgeat Friday. It gets better after a day in the fridge. For a shortcut: Torani or Monin orgeat is acceptable. BG Reynolds or Small Hand Foods is excellent if you want to buy rather than make.",
    usedIn: ["Mai Tai", "Scorpion", "Fog Cutter", "Army and Navy", "Royal Hawaiian", "Saturn", "Three Dots and a Dash", "Latitude 29 Formidable"]
  },

  {
    id: "s009",
    name: "Falernum",
    category: "spiced",
    difficulty: "hard",
    timeMinutes: 1440,
    yieldOz: 24,
    shelfLifeDays: 30,
    storageNote: "Refrigerate. Improves with age up to a week.",
    vesperQuip: "Falernum is the secret weapon of tiki. If you've ever had a Zombie and wondered what that spiced, lime-almond note was — that's falernum. Now you can make it.",
    unlockIngredientId: "falernum",
    ingredients: [
      { name: "Fresh Limes", amount: 10, unit: "whole" },
      { name: "Whole Cloves", amount: 40, unit: "whole" },
      { name: "Blanched Almonds", amount: 0.25, unit: "cup" },
      { name: "Fresh Ginger", amount: 2, unit: "oz" },
      { name: "White Rum", amount: 4, unit: "oz" },
      { name: "Simple Syrup", amount: 2, unit: "cups" },
      { name: "Almond Extract", amount: 0.25, unit: "tsp" }
    ],
    instructions: "Day 1 — Zest all 10 limes (no white pith). Toast cloves in dry pan 2 minutes. Combine lime zest, toasted cloves, roughly chopped almonds, and sliced ginger in a jar. Pour white rum over everything. Seal and let infuse at room temperature for 24 hours. Day 2 — Strain infused rum through fine mesh, pressing solids. Discard solids. Juice the 10 limes. Combine infused rum with lime juice and simple syrup. Add almond extract. Stir to combine. Bottle and refrigerate. Taste after 2 days — it gets better.",
    vesperTip: "The 24-hour wait is mandatory. Do not rush it. The cloves need time to mellow or they'll dominate. John D. Taylor's Velvet Falernum is a very acceptable commercial option if you want to skip the process — it's what most tiki bars use. BG Reynolds also makes an excellent version.",
    usedIn: ["Zombie", "Test Pilot", "Cobra's Fang", "Jet Pilot", "Navy Grog", "Falernum Fix", "Dead Reckoning", "Lion's Tail"]
  },

  {
    id: "s010",
    name: "Passion Fruit Syrup",
    category: "tropical",
    difficulty: "easy",
    timeMinutes: 15,
    yieldOz: 14,
    shelfLifeDays: 14,
    storageNote: "Refrigerate. Use within two weeks for best flavor.",
    vesperQuip: "Passion fruit syrup unlocks a significant portion of the tiki canon. It's worth making. It smells incredible while it cooks.",
    unlockIngredientId: "passion-fruit",
    ingredients: [
      { name: "Fresh Passion Fruit Pulp or Purée", amount: 1, unit: "cup" },
      { name: "White Sugar", amount: 1, unit: "cup" },
      { name: "Water", amount: 0.5, unit: "cup" }
    ],
    instructions: "If using fresh passion fruit, scoop pulp from 8-10 fruits. Combine purée with sugar and water in a saucepan over medium-low heat. Stir until sugar dissolves. Do not boil — simmer gently for 5 minutes. Strain to remove seeds if desired (the seeds are edible but some prefer a smooth syrup). Cool and bottle.",
    vesperTip: "Frozen passion fruit purée works extremely well — look for it in the frozen fruit section or Latin grocery stores. Goya brand is widely available and excellent. The seeds add visual texture if you keep them in. For tiki drinks, strain them out.",
    usedIn: ["Hurricane", "Sidewinder's Fang", "Saturn", "Port Light", "Tropical Itch", "Passion Fruit Rum Punch", "Missionary's Downfall"]
  },

  {
    id: "s011",
    name: "Hibiscus Syrup",
    category: "floral",
    difficulty: "easy",
    timeMinutes: 20,
    yieldOz: 14,
    shelfLifeDays: 21,
    storageNote: "Refrigerate. The color is stunning — deep crimson.",
    vesperQuip: "Hibiscus syrup turns a standard Margarita into something visually arresting. The flavor is tart, floral, and unlike anything else in your bar.",
    unlockIngredientId: "hibiscus-syrup",
    ingredients: [
      { name: "Dried Hibiscus Flowers", amount: 0.5, unit: "cup" },
      { name: "White Sugar", amount: 1, unit: "cup" },
      { name: "Water", amount: 1, unit: "cup" }
    ],
    instructions: "Combine sugar and water in a saucepan. Bring to a simmer, stirring until sugar dissolves. Add dried hibiscus flowers. Remove from heat immediately. Steep 15-20 minutes — longer for more intense flavor and color. Strain through fine mesh, pressing flowers to extract all liquid. Cool and bottle. The color will be a deep crimson-purple.",
    vesperTip: "Find dried hibiscus at Latin grocery stores (sold as 'jamaica') or online. Don't let it boil with the flowers — it makes the flavor bitter. The tartness of hibiscus balances sweetness in cocktails the way citrus does.",
    usedIn: ["Hibiscus Margarita", "Hibiscus Daiquiri", "Various tequila and rum cocktails", "Non-alcoholic drinks"]
  },

  {
    id: "s012",
    name: "Lavender Syrup",
    category: "floral",
    difficulty: "easy",
    timeMinutes: 20,
    yieldOz: 12,
    shelfLifeDays: 30,
    storageNote: "Refrigerate. Subtle flavor — use with a light hand.",
    vesperQuip: "Lavender syrup is delicate. It elevates a gin cocktail into something memorable. It also means you actually have lavender syrup in your house, which is inherently impressive.",
    unlockIngredientId: "lavender-syrup",
    ingredients: [
      { name: "Culinary Lavender", amount: 2, unit: "tbsp" },
      { name: "White Sugar", amount: 1, unit: "cup" },
      { name: "Water", amount: 1, unit: "cup" }
    ],
    instructions: "Combine sugar and water in saucepan over medium heat, stirring until dissolved. Add culinary lavender. Remove from heat. Steep 20 minutes — no more or it becomes soapy. Strain through fine mesh. Cool and bottle.",
    vesperTip: "Use culinary lavender specifically — not potpourri or garden lavender treated with pesticides. Steep time is critical: 20 minutes is the maximum before it goes from floral to soapy. Less is more with lavender.",
    usedIn: ["Lavender Lemon Drop", "Lavender Gin Fizz", "Bee's Knees variation", "Various gin cocktails"]
  },

  {
    id: "s013",
    name: "Raspberry Syrup",
    category: "sweet",
    difficulty: "easy",
    timeMinutes: 20,
    yieldOz: 14,
    shelfLifeDays: 10,
    storageNote: "Refrigerate. Shorter shelf life — fresh fruit means faster spoilage. Worth it.",
    vesperQuip: "Fresh raspberry syrup in a Clover Club. That's the sentence. Make the syrup.",
    unlockIngredientId: "raspberry-syrup",
    ingredients: [
      { name: "Fresh or Frozen Raspberries", amount: 2, unit: "cups" },
      { name: "White Sugar", amount: 1, unit: "cup" },
      { name: "Water", amount: 0.5, unit: "cup" }
    ],
    instructions: "Combine raspberries, sugar, and water in a saucepan over medium heat. Stir and gently mash raspberries as they heat. Simmer 5-7 minutes until berries have broken down completely. Do not boil hard. Remove from heat. Strain through fine mesh strainer, pressing to extract all juice. Discard solids. Cool and bottle.",
    vesperTip: "Frozen raspberries work just as well as fresh and are available year-round. A tablespoon of lemon juice added at the end brightens the flavor and extends shelf life slightly.",
    usedIn: ["Clover Club", "Bramble", "Raspberry Lemon Drop", "Raspberry Smash", "Raspberry Vodka Lemonade", "Various summer cocktails"]
  },

  {
    id: "s014",
    name: "Strawberry Syrup",
    category: "sweet",
    difficulty: "easy",
    timeMinutes: 20,
    yieldOz: 16,
    shelfLifeDays: 10,
    storageNote: "Refrigerate. Use within 10 days. Freeze for longer storage.",
    vesperQuip: "Fresh strawberry syrup in June is one of the best things you can put in a glass. Strawberry Daiquiri with this and fresh lime — completely different drink.",
    unlockIngredientId: "strawberry-syrup",
    ingredients: [
      { name: "Fresh Strawberries", amount: 2, unit: "cups" },
      { name: "White Sugar", amount: 1, unit: "cup" },
      { name: "Water", amount: 0.5, unit: "cup" },
      { name: "Fresh Lemon Juice", amount: 1, unit: "tbsp" }
    ],
    instructions: "Hull and halve strawberries. Combine with sugar and water in saucepan over medium heat. Stir and gently mash as they heat. Simmer 8-10 minutes until strawberries have broken down. Remove from heat. Add lemon juice. Strain through fine mesh, pressing to extract all juice. Cool and bottle.",
    vesperTip: "The lemon juice brightens the flavor and adds a little natural preservation. Taste as you strain — if it needs more acid, add a few more drops. At peak strawberry season, this is transcendent.",
    usedIn: ["Strawberry Daiquiri", "Strawberry Margarita", "Caipirinha de Morango", "Various summer cocktails"]
  },

  {
    id: "s015",
    name: "Mint Simple Syrup",
    category: "sweet",
    difficulty: "easy",
    timeMinutes: 15,
    yieldOz: 12,
    shelfLifeDays: 14,
    storageNote: "Refrigerate. Strain completely — mint left in syrup turns bitter after a day.",
    vesperQuip: "For Juleps you want fresh mint muddled. For a Southside or Mojito when you want to skip muddling, this does the work for you.",
    unlockIngredientId: "mint-syrup",
    ingredients: [
      { name: "Fresh Mint", amount: 2, unit: "cups" },
      { name: "White Sugar", amount: 1, unit: "cup" },
      { name: "Water", amount: 1, unit: "cup" }
    ],
    instructions: "Make a standard simple syrup: dissolve sugar in hot water. Once dissolved and slightly cooled (not boiling), add fresh mint leaves. Steep 15 minutes. Strain immediately and completely through fine mesh. Do not let mint sit in syrup or it will go bitter. Cool and bottle.",
    vesperTip: "Spearmint is more delicate and sweet. Peppermint is stronger and more intense. Use spearmint for cocktails. Steep time matters — 15 minutes is right. Press the mint when straining to get every drop.",
    usedIn: ["Southside", "Mojito variation", "Mint Gin Fizz", "Cucumber Cooler"]
  },

  {
    id: "s016",
    name: "Maple Syrup Bar Prep",
    category: "sweet",
    difficulty: "easy",
    timeMinutes: 5,
    yieldOz: 8,
    shelfLifeDays: 60,
    storageNote: "Refrigerate. Maple syrup keeps well — months in the fridge.",
    vesperQuip: "Grade B maple syrup has more character than Grade A. For cocktails, you want character. Buy the darker stuff.",
    unlockIngredientId: "maple-syrup",
    ingredients: [
      { name: "Dark Amber Maple Syrup", amount: 1, unit: "cup" },
      { name: "Warm Water", amount: 0.25, unit: "cup" }
    ],
    instructions: "Mix maple syrup with warm water until combined. The water makes it easier to pour and incorporate into cold cocktails. Use 1 part water to 4 parts maple for cocktail use. Store in a squeeze bottle for easy measurement.",
    vesperTip: "Pure maple syrup only — the fake stuff is just corn syrup with maple flavoring. Grade B (now called Grade A: Dark Color, Robust Taste in the US) has stronger flavor that holds up in cocktails. Grade A light gets lost.",
    usedIn: ["Smoked Maple Sour", "Maple Old Fashioned", "Bourbon Peach Tea", "Various autumn cocktails"]
  },

  {
    id: "s017",
    name: "Rock Candy Syrup",
    category: "sweet",
    difficulty: "easy",
    timeMinutes: 10,
    yieldOz: 16,
    shelfLifeDays: 60,
    storageNote: "Refrigerate. Very stable due to high sugar content.",
    vesperQuip: "Trader Vic used rock candy syrup in the original Mai Tai. This is what makes it taste like the original and not like every generic version you've had since.",
    unlockIngredientId: "rock-candy-syrup",
    ingredients: [
      { name: "Raw Sugar or Turbinado Sugar", amount: 2, unit: "cups" },
      { name: "Hot Water", amount: 1, unit: "cup" }
    ],
    instructions: "Combine 2 parts turbinado or raw sugar with 1 part hot water. Stir until completely dissolved — this takes longer than regular sugar. The result is a rich, slightly golden syrup with a clean sweetness and faint molasses note. Cool and bottle.",
    vesperTip: "This is just a 2:1 syrup made with raw sugar instead of refined white sugar. The difference in a Mai Tai is subtle but real — there's a cleaner, more complex sweetness. Worth having if you're making classic tiki drinks.",
    usedIn: ["Mai Tai Original", "Classic tiki drinks", "Various rum cocktails"]
  },

  {
    id: "s018",
    name: "Peach Syrup",
    category: "tropical",
    difficulty: "easy",
    timeMinutes: 20,
    yieldOz: 14,
    shelfLifeDays: 10,
    storageNote: "Refrigerate. Fresh peach syrup has a short life — use within 10 days.",
    vesperQuip: "Fresh peach syrup in August when peaches are perfect. That Bellini you're about to make is going to be something else.",
    unlockIngredientId: "peach-syrup",
    ingredients: [
      { name: "Fresh Ripe Peaches", amount: 4, unit: "whole" },
      { name: "White Sugar", amount: 1, unit: "cup" },
      { name: "Water", amount: 0.5, unit: "cup" },
      { name: "Fresh Lemon Juice", amount: 1, unit: "tbsp" }
    ],
    instructions: "Peel and pit peaches, roughly chop. Combine with sugar and water in saucepan over medium heat. Stir and mash as they heat. Simmer 10 minutes until peaches have broken down completely. Add lemon juice. Strain through fine mesh pressing to extract all juice. Cool and bottle.",
    vesperTip: "White peaches make a more delicate, floral syrup. Yellow peaches are more robust and sweet. Either is excellent. Don't use canned peaches — the syrup they're packed in changes everything. Frozen white peach purée is a solid substitute in the off-season.",
    usedIn: ["Bellini", "Peach Bourbon Smash", "Peach Buck", "Fuzzy Navel variation", "Various summer cocktails"]
  },

  {
    id: "s019",
    name: "Cardamom Syrup",
    category: "spiced",
    difficulty: "easy",
    timeMinutes: 20,
    yieldOz: 12,
    shelfLifeDays: 30,
    storageNote: "Refrigerate. Spiced syrups last well due to antimicrobial properties of spices.",
    vesperQuip: "Cardamom in a cocktail makes people ask what that flavor is. They can't place it. It's the mark of a bar with genuine depth.",
    unlockIngredientId: "cardamom-syrup",
    ingredients: [
      { name: "Green Cardamom Pods", amount: 20, unit: "whole" },
      { name: "White Sugar", amount: 1, unit: "cup" },
      { name: "Water", amount: 1, unit: "cup" }
    ],
    instructions: "Lightly crush cardamom pods with the flat of a knife — just enough to crack them open. Toast in a dry pan 2 minutes until fragrant. Combine with sugar and water in saucepan. Bring to a simmer, stirring until sugar dissolves. Simmer 10 minutes. Remove from heat, steep 15 more minutes. Strain through fine mesh. Cool and bottle.",
    vesperTip: "Green cardamom is floral and citrusy. Black cardamom is smoky and intense — use green unless a recipe specifies black. Crushing the pods releases the seeds which carry the flavor. Don't skip the toast — it deepens the flavor significantly.",
    usedIn: ["Cardamom Gin Sour", "Various Nordic cocktails", "Spiced rum drinks", "Coffee cocktails"]
  },

  {
    id: "s020",
    name: "Vanilla Syrup",
    category: "sweet",
    difficulty: "easy",
    timeMinutes: 15,
    yieldOz: 12,
    shelfLifeDays: 30,
    storageNote: "Refrigerate. The vanilla bean can stay in the bottle — it continues to infuse.",
    vesperQuip: "Real vanilla syrup in an Espresso Martini tastes like something worth drinking. Vanilla extract in simple syrup is not the same thing. Use the bean.",
    unlockIngredientId: "vanilla-syrup",
    ingredients: [
      { name: "Vanilla Beans", amount: 2, unit: "whole" },
      { name: "White Sugar", amount: 1, unit: "cup" },
      { name: "Water", amount: 1, unit: "cup" }
    ],
    instructions: "Split vanilla beans lengthwise and scrape out seeds. Combine beans, seeds, sugar, and water in a saucepan over medium heat. Stir until sugar dissolves. Simmer 5 minutes. Remove from heat. Steep 30 minutes. Strain. Leave one split bean in the bottle for continued infusion. Cool and bottle.",
    vesperTip: "Tahitian vanilla is more floral and fruity. Madagascar vanilla is classic and rich. Either works beautifully. The scraped seeds create tiny black specks in the syrup — leave them in, they add visual proof that this is the real thing.",
    usedIn: ["Vanilla Vodka cocktails", "Espresso Martini variations", "Various dessert cocktails", "Certain rum drinks"]
  },
];

// Syrup categories for UI organization
export const syrupCategories = [
  { id: "essential", label: "The Essentials", emoji: "⚗️", ids: ["s001", "s002", "s003", "s004"] },
  { id: "fruit", label: "Fresh Fruit", emoji: "🍓", ids: ["s005", "s010", "s013", "s014", "s018"] },
  { id: "floral", label: "Floral", emoji: "🌸", ids: ["s011", "s012", "s015"] },
  { id: "spiced", label: "Spiced", emoji: "🌿", ids: ["s006", "s007", "s009", "s019"] },
  { id: "tiki", label: "Tiki Essentials", emoji: "🌴", ids: ["s008", "s009", "s010", "s017"] },
  { id: "other", label: "Other", emoji: "🍯", ids: ["s016", "s020"] },
];
