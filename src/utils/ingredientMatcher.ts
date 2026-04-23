import { InventoryItem } from '../types';
import { PANTRY_CATEGORIES } from '../data/pantryItems';

// ── Canonical type strings ────────────────────────────────────────────────────
// Every recipe ingredient ID maps to one of these. Every inventory bottle
// resolves to one or more of these. isSatisfied is then a Set lookup.

// ── Recipe ingredient ID → canonical type ────────────────────────────────────

const RECIPE_CANONICAL: Record<string, string> = {
  // Whiskey
  'bourbon':           'BOURBON',
  'rye-whiskey':       'RYE_WHISKEY',
  'scotch':            'SCOTCH',
  'islay-scotch':      'ISLAY_SCOTCH',
  'irish-whiskey':     'IRISH_WHISKEY',
  'whiskey':           'WHISKEY',
  'canadian-whisky':   'CANADIAN_WHISKY',
  'japanese-whisky':   'JAPANESE_WHISKY',
  'cinnamon-whisky':   'CINNAMON_LIQUEUR',

  // Brandy / Cognac
  'cognac':            'COGNAC',
  'brandy':            'BRANDY',
  'apple-brandy':      'APPLE_BRANDY',
  'apricot-brandy':    'APRICOT_BRANDY',
  'cherry-brandy':     'CHERRY_BRANDY',
  'pisco':             'PISCO',
  'cachaca':           'CACHACA',

  // Gin
  'gin':               'GIN',
  'sloe-gin':          'SLOE_GIN',

  // Vodka
  'vodka':             'VODKA',

  // Tequila / Mezcal
  'tequila':           'TEQUILA',
  'mezcal':            'MEZCAL',

  // Rum
  'rum-white':         'RUM_WHITE',
  'rum-dark':          'RUM_DARK',
  'rum-aged':          'RUM_AGED',
  'rum-overproof':     'RUM_OVERPROOF',

  // Other spirits
  'absinthe':          'ABSINTHE',
  'sake':              'SAKE',
  'high-proof-spirit': 'HIGH_PROOF_SPIRIT',
  'southern-comfort':  'SOUTHERN_COMFORT',
  'pimms':             'PIMMS',

  // Orange liqueurs
  'triple-sec':        'TRIPLE_SEC',
  'blue-curacao':      'BLUE_CURACAO',

  // Coffee / nut liqueurs
  'coffee-liqueur':    'COFFEE_LIQUEUR',
  'amaretto':          'AMARETTO',

  // Berry / fruit liqueurs
  'chambord':          'RASPBERRY_LIQUEUR',
  'blackberry-liqueur':'BLACKBERRY_LIQUEUR',
  'cherry-liqueur':    'CHERRY_LIQUEUR',
  'maraschino-liqueur':'MARASCHINO_LIQUEUR',
  'elderflower-liqueur':'ELDERFLOWER_LIQUEUR',
  'elderflower-cordial':'ELDERFLOWER_CORDIAL',
  'passoa':            'PASSOA',
  'midori':            'MIDORI',
  'banana-liqueur':    'BANANA_LIQUEUR',
  'peach-schnapps':    'PEACH_SCHNAPPS',
  'sour-apple-schnapps':'SOUR_APPLE_SCHNAPPS',
  'butterscotch-schnapps':'BUTTERSCOTCH_SCHNAPPS',
  'peppermint-schnapps':'PEPPERMINT_SCHNAPPS',
  'creme-de-menthe':   'CREME_DE_MENTHE',
  'creme-de-cassis':   'CREME_DE_CASSIS',
  'creme-de-cacao':    'CREME_DE_CACAO',
  'creme-de-cacao-white':'CREME_DE_CACAO_WHITE',
  'creme-de-violette': 'CREME_DE_VIOLETTE',
  'creme-de-mure':     'CREME_DE_MURE',
  'falernum':          'FALERNUM',
  'lillet-blanc':      'LILLET_BLANC',
  'sambuca':           'SAMBUCA',
  'galliano':          'GALLIANO',
  'licor-43':          'LICOR_43',
  'goldschlager':      'GOLDSCHLAGER',
  'fireball':          'CINNAMON_LIQUEUR',

  // Herbal liqueurs / amaro
  'green-chartreuse':  'GREEN_CHARTREUSE',
  'yellow-chartreuse': 'YELLOW_CHARTREUSE',
  'chartreuse':        'CHARTREUSE',
  'benedictine':       'BENEDICTINE',
  'drambuie':          'DRAMBUIE',
  'fernet-branca':     'FERNET_BRANCA',
  'jagermeister':      'JAGERMEISTER',
  'amaro-nonino':      'AMARO_NONINO',
  'amaro-averna':      'AMARO_AVERNA',

  // Irish cream
  'irish-cream':       'IRISH_CREAM',
  'baileys':           'IRISH_CREAM',

  // Aperitifs
  'select-aperitivo':  'SELECT_APERITIVO',
  'campari':           'CAMPARI',
  'aperol':            'APEROL',

  // Vermouth
  'sweet-vermouth':    'SWEET_VERMOUTH',
  'dry-vermouth':      'DRY_VERMOUTH',
  'lyres-vermouth':    'DRY_VERMOUTH',

  // Sparkling wine
  'champagne':         'CHAMPAGNE',
  'prosecco':          'PROSECCO',

  // Still wine / fortified
  'red-wine':          'RED_WINE',
  'dry-sherry':        'DRY_SHERRY',
  'amontillado-sherry':'AMONTILLADO_SHERRY',

  // Bitters
  'angostura-bitters': 'ANGOSTURA_BITTERS',
  'peychauds-bitters': 'PEYCHAUDS_BITTERS',
  'orange-bitters':    'ORANGE_BITTERS',
  'mole-bitters':      'MOLE_BITTERS',
  'lyres-bitter':      'BITTERS',

  // Citrus juices
  'lime-juice':        'LIME_JUICE',
  'lemon-juice':       'LEMON_JUICE',
  'orange-juice':      'ORANGE_JUICE',
  'blood-orange-juice':'BLOOD_ORANGE_JUICE',
  'grapefruit-juice':  'GRAPEFRUIT_JUICE',
  'yuzu-juice':        'YUZU_JUICE',

  // Other juices
  'pineapple-juice':   'PINEAPPLE_JUICE',
  'cranberry-juice':   'CRANBERRY_JUICE',
  'tomato-juice':      'TOMATO_JUICE',
  'apple-juice':       'APPLE_JUICE',
  'apple-cider':       'APPLE_CIDER',
  'apple-cider-vinegar':'APPLE_CIDER_VINEGAR',
  'cucumber-juice':    'CUCUMBER_JUICE',
  'lychee-juice':      'LYCHEE_JUICE',
  'passion-fruit-puree':'PASSION_FRUIT_PUREE',
  'passionfruit-puree':'PASSION_FRUIT_PUREE',
  'mango-juice':       'MANGO_JUICE',
  'mango-puree':       'MANGO_JUICE',
  'peach-puree':       'PEACH_PUREE',
  'peach-nectar':      'PEACH_PUREE',
  'watermelon-juice':  'WATERMELON_JUICE',
  'pomegranate-juice': 'POMEGRANATE_JUICE',
  'beet-juice':        'BEET_JUICE',
  'tart-cherry-juice': 'TART_CHERRY_JUICE',
  'pear-juice':        'PEAR_JUICE',
  'ginger-juice':      'GINGER_JUICE',
  'sparkling-grape-juice':'SPARKLING_WINE',
  'coconut-water':     'COCONUT_WATER',

  // Carbonated mixers
  'soda-water':        'SODA_WATER',
  'sparkling-water':   'SODA_WATER',
  'tonic-water':       'TONIC_WATER',
  'elderflower-tonic': 'ELDERFLOWER_TONIC',
  'fever-tree-tonic':  'TONIC_WATER',
  'ginger-beer':       'GINGER_BEER',
  'ginger-ale':        'GINGER_ALE',
  'cola':              'COLA',
  'coca-cola':         'COLA',
  'sprite':            'SPRITE',
  '7up':               'SPRITE',
  'dr-pepper':         'DR_PEPPER',
  'orange-fanta':      'ORANGE_SODA',
  'cream-soda':        'CREAM_SODA',
  'lemonade':          'LEMONADE',
  'mango-soda':        'MANGO_SODA',
  'cherry-soda':       'CHERRY_SODA',
  'blue-raspberry-soda':'BLUE_RASPBERRY_SODA',
  'grapefruit-soda':   'GRAPEFRUIT_SODA',
  'energy-drink':        'ENERGY_DRINK',
  'red-bull':            'RED_BULL',
  'red-bull-sugar-free': 'RED_BULL',
  'red-bull-peach':      'RED_BULL',
  'monster-energy':      'MONSTER',
  'monster':             'MONSTER',
  'monster-ultra-white': 'MONSTER',
  'celsius-energy':      'CELSIUS',
  'celsius':             'CELSIUS',
  'liquid-death':        'SPARKLING_WATER',

  // Beer
  'japanese-beer':     'BEER',
  'lager-beer':        'BEER',
  'stout-beer':        'STOUT',
  'guinness':          'STOUT',

  // Syrups
  'simple-syrup':      'SIMPLE_SYRUP',
  'honey-syrup':       'HONEY_SYRUP',
  'honey-ginger-syrup':'HONEY_SYRUP',
  'honey':             'HONEY',
  'agave-syrup':       'AGAVE_SYRUP',
  'grenadine':         'GRENADINE',
  'orgeat':            'ORGEAT',
  'raspberry-syrup':   'RASPBERRY_SYRUP',
  'coconut-syrup':     'COCONUT_SYRUP',
  'mango-syrup':       'MANGO_SYRUP',
  'vanilla-syrup':     'VANILLA_SYRUP',
  'peach-syrup':       'PEACH_SYRUP',
  'cherry-syrup':      'CHERRY_SYRUP',
  'lavender-syrup':    'LAVENDER_SYRUP',
  'cinnamon-syrup':    'CINNAMON_SYRUP',
  'cardamom-syrup':    'CARDAMOM_SYRUP',
  'rosemary-syrup':    'ROSEMARY_SYRUP',
  'thyme-syrup':       'THYME_SYRUP',
  'matcha-syrup':      'MATCHA_SYRUP',
  'hibiscus-syrup':    'HIBISCUS_SYRUP',
  'lemongrass-syrup':  'LEMONGRASS_SYRUP',
  'brown-sugar-syrup': 'SIMPLE_SYRUP',
  'caramel-syrup':     'CARAMEL_SYRUP',
  'espresso-syrup':    'ESPRESSO_SYRUP',
  'strawberry-syrup':  'STRAWBERRY_SYRUP',
  'blackberry-syrup':  'BLACKBERRY_SYRUP',
  'watermelon-syrup':  'WATERMELON_SYRUP',
  'blue-raspberry-syrup':'BLUE_RASPBERRY_SYRUP',
  'passionfruit-syrup':'PASSION_FRUIT_PUREE',
  'horchata-syrup':    'HORCHATA_SYRUP',
  'amaretto-syrup':    'AMARETTO',
  'cotton-candy-syrup':'COTTON_CANDY_SYRUP',
  'peppermint-syrup':  'CREME_DE_MENTHE',
  'marshmallow-syrup': 'MARSHMALLOW_SYRUP',
  'almond-syrup':      'ORGEAT',
  'chocolate-syrup':   'CHOCOLATE_SYRUP',

  // Sugar / sweetener
  'brown-sugar':       'SUGAR',
  'sugar':             'SUGAR',
  'sugar-cube':        'SUGAR',

  // Eggs / dairy
  'egg-white':         'EGG_WHITE',
  'egg':               'EGG',
  'eggnog':            'EGGNOG',
  'heavy-cream':       'HEAVY_CREAM',
  'coconut-cream':     'COCONUT_CREAM',
  'cream-of-coconut':  'COCONUT_CREAM',
  'hot-milk':          'HOT_MILK',
  'oat-milk':          'OAT_MILK',
  'kefir':             'KEFIR',
  'yogurt':            'YOGURT',
  'butter':            'BUTTER',
  'vanilla-ice-cream': 'VANILLA_ICE_CREAM',

  // Coffee / tea
  'espresso':          'ESPRESSO',
  'coffee':            'COFFEE',
  'cold-brew-coffee':  'COLD_BREW',
  'hot-coffee':        'COFFEE',
  'iced-tea':          'TEA',
  'cold-brew-tea':     'TEA',
  'hibiscus-tea':      'TEA',
  'oolong-tea':        'TEA',
  'sweet-tea':         'TEA',
  'hot-water':         'HOT_WATER',

  // Condiments / kitchen
  'hot-sauce':         'HOT_SAUCE',
  'horseradish':       'HORSERADISH',
  'worcestershire':    'WORCESTERSHIRE',
  'pickle-brine':      'PICKLE_BRINE',
  'celery-salt':       'CELERY_SALT',
  'chili-powder':      'CHILI_POWDER',
  'orange-marmalade':  'ORANGE_MARMALADE',
  'orange-flower-water':'ORANGE_FLOWER_WATER',
  'rose-water':        'ROSE_WATER',
  'tamarind-paste':    'TAMARIND',
  'butter-extract':    'BUTTER',
  'salt':              'SALT',
  'chili-lime-salt':   'SALT',

  // Non-alcoholic spirits
  'seedlip':           'SEEDLIP',
  'seedlip-garden':    'SEEDLIP',

  // Shrubs (specialty vinegar-based syrups)
  'mixed-berry-shrub': 'BERRY_SHRUB',
  'raspberry-shrub':   'BERRY_SHRUB',
  'strawberry-shrub':  'BERRY_SHRUB',

  // Fresh herbs / muddled ingredients (satisfied by pantry)
  'mint':              'MINT',
  'basil':             'BASIL',
  'thai-basil':        'BASIL',
  'cucumber':          'CUCUMBER',
  'rosemary':          'ROSEMARY',

  // Specialty aperitifs / fortified
  'suze':              'SUZE',
  'port':              'PORT',

  // Garnish — always satisfied, never blocks a recipe
  'lime':              'GARNISH',
  'lime-wedge':        'GARNISH',
  'lemon-peel':        'GARNISH',
  'orange-peel':       'GARNISH',
  'orange-slice':      'GARNISH',
  'maraschino-cherry': 'GARNISH',
  'fresh-raspberries': 'GARNISH',
  'raspberries':       'GARNISH',
  'strawberries':      'GARNISH',
  'strawberry':        'GARNISH',
  'mixed-berries':     'GARNISH',
  'blackberry':        'GARNISH',
  'blueberry':         'GARNISH',
  'jalapeno':          'GARNISH',
  'sage':              'GARNISH',
  'cinnamon-stick':    'GARNISH',
  'banana':            'GARNISH',
  'cloves':            'GARNISH',
};

// ── Inventory bottle name → canonical type(s) ────────────────────────────────
// Rules are tested in order; ALL matching rules contribute their types.
// More specific patterns should come before more general ones.

const RESOLVER_RULES: Array<[RegExp, string[]]> = [
  // ── Whiskey (specific first) ─────────────────────────────────────────
  [/fireball|cinnamon.*whisk/i,                            ['CINNAMON_LIQUEUR', 'WHISKEY']],
  [/winter jack|apple.*whisk|whisk.*apple/i,              ['APPLE_BRANDY', 'WHISKEY']],
  [/blackberry.*whisk|whisk.*blackberry/i,                ['BLACKBERRY_LIQUEUR', 'WHISKEY']],
  [/tennessee whisk|jack daniel|george dickel/i,           ['BOURBON', 'WHISKEY']],
  [/bourbon|kentucky.*whisk|knob creek|maker.{0,5}mark|woodford|buffalo trace|wild turkey|four roses|heaven hill|evan williams|elijah craig|old bardstown|bulleit.*bour|1837.*bourbon|dragged bourbon|jim beam|michter/i, ['BOURBON', 'WHISKEY']],
  [/rye whisk|bulleit rye|sazerac rye|rittenhouse|pikesville/i, ['RYE_WHISKEY', 'WHISKEY']],
  [/islay|laphroaig|ardbeg|lagavulin|bowmore|bruichladdich|caol ila|bunnahabhain/i, ['ISLAY_SCOTCH', 'SCOTCH', 'WHISKEY']],
  [/scotch|single malt|blended scotch|glenfiddich|macallan|chivas|johnnie walker|dalmore|glenlivet|glenmorangie|balvenie|oban|talisker/i, ['SCOTCH', 'WHISKEY']],
  [/irish whisk|jameson|bushmills|tullamore|paddy|midleton|redbreast|powers/i, ['IRISH_WHISKEY', 'WHISKEY']],
  [/canadian whisk|crown royal|seagram/i,                 ['CANADIAN_WHISKY', 'WHISKEY']],
  [/japanese whisk|suntory|nikka|hibiki|yamazaki|hakushu/i,['JAPANESE_WHISKY', 'WHISKEY']],
  [/whisk(e?y|i)/i,                                       ['WHISKEY']],

  // ── Gin ──────────────────────────────────────────────────────────────
  [/sloe gin/i,                                           ['SLOE_GIN', 'GIN']],
  [/\bgin\b/i,                                            ['GIN']],

  // ── Vodka ────────────────────────────────────────────────────────────
  [/vodka/i,                                              ['VODKA']],

  // ── Tequila / Mezcal ─────────────────────────────────────────────────
  [/mezcal/i,                                             ['MEZCAL', 'TEQUILA']],
  [/tequila|agave spirit|hornitos|patron|olmeca|especial.*agave/i, ['TEQUILA']],

  // ── Rum ──────────────────────────────────────────────────────────────
  [/coconut rum|malibu/i,                                 ['COCONUT_RUM', 'RUM']],
  [/spiced rum|captain morgan|kraken|sailor jerry/i,      ['SPICED_RUM', 'RUM']],
  [/overproof rum|rum.*151|151.*rum/i,                    ['RUM_OVERPROOF', 'RUM']],
  [/rum.*coffee|coffee.*rum/i,                            ['COFFEE_LIQUEUR', 'RUM']],
  [/dark rum|black rum|blackwell|myers.*rum/i,            ['RUM_DARK', 'RUM_AGED', 'RUM']],
  [/aged rum|gold rum|amber rum|appleton|barbancourt|diplomatico|original dark rum/i, ['RUM_AGED', 'RUM_DARK', 'RUM']],
  [/white rum|silver rum|light rum|blanco rum|bacardi|brugal|havana/i, ['RUM_WHITE', 'RUM']],
  [/\brum\b/i,                                            ['RUM']],

  // ── Brandy / Cognac / Pisco / Cachaça ────────────────────────────────
  [/cognac|hennessy|remy.{0,6}martin|courvoisier|martell/i,['COGNAC', 'BRANDY']],
  [/calvados|apple brandy|applejack/i,                    ['APPLE_BRANDY', 'BRANDY']],
  [/apricot brandy/i,                                     ['APRICOT_BRANDY', 'BRANDY']],
  [/cherry brandy|heering/i,                              ['CHERRY_BRANDY', 'BRANDY']],
  [/jezynowka|blackberry brandy/i,                        ['BLACKBERRY_LIQUEUR', 'BRANDY']],
  [/pisco/i,                                              ['PISCO', 'BRANDY']],
  [/cachaca|cacha[cç]a|pitu|leblon/i,                     ['CACHACA']],
  [/christian brothers|american brandy/i,                 ['BRANDY']],
  [/\bbrandy\b/i,                                         ['BRANDY']],

  // ── Absinthe / Sake ───────────────────────────────────────────────────
  [/absinthe/i,                                           ['ABSINTHE']],
  [/sake|rice wine/i,                                     ['SAKE']],
  [/pimm.{0,3}s|pimms|no\.?\s*1 cup liqueur|cup liqueur/i,  ['PIMMS']],
  [/southern comfort/i,                                   ['SOUTHERN_COMFORT']],

  // ── Orange liqueurs ───────────────────────────────────────────────────
  [/cointreau|grand marnier|triple sec|combier/i,          ['TRIPLE_SEC', 'ORANGE_LIQUEUR']],
  [/blue curacao/i,                                        ['BLUE_CURACAO', 'TRIPLE_SEC', 'ORANGE_LIQUEUR']],
  [/orange curacao|curacao/i,                              ['TRIPLE_SEC', 'ORANGE_LIQUEUR']],

  // ── Coffee liqueurs ───────────────────────────────────────────────────
  [/coffee liqueur|kahlua|mr\.?\s*black|tia maria|patron xo|era negra/i, ['COFFEE_LIQUEUR']],

  // ── Amaretto ─────────────────────────────────────────────────────────
  [/amaretto|disaronno/i,                                  ['AMARETTO']],

  // ── Fruit / berry liqueurs ────────────────────────────────────────────
  [/chambord|black raspberry liqueur/i,                    ['RASPBERRY_LIQUEUR']],
  [/raspberry liqueur/i,                                   ['RASPBERRY_LIQUEUR']],
  [/creme de mure/i,                                       ['CREME_DE_MURE', 'BLACKBERRY_LIQUEUR']],
  [/blackberry liqueur/i,                                  ['BLACKBERRY_LIQUEUR']],
  [/maraschino liqueur|luxardo/i,                          ['MARASCHINO_LIQUEUR']],
  [/cherry liqueur|cherry heering/i,                       ['CHERRY_LIQUEUR']],
  [/st[-.]?\s*germain|elderflower liqueur/i,               ['ELDERFLOWER_LIQUEUR']],
  [/elderflower cordial/i,                                 ['ELDERFLOWER_CORDIAL']],
  [/passoa|passion fruit liqueur/i,                        ['PASSOA']],
  [/parcha|maracuya/i,                                     ['PASSOA', 'PASSION_FRUIT_PUREE']],
  [/midori|melon liqueur/i,                                ['MIDORI']],
  [/banana liqueur|creme de banane/i,                      ['BANANA_LIQUEUR']],
  [/peach schnapps|peach liqueur/i,                        ['PEACH_SCHNAPPS']],
  [/sour apple schnapps|apple pucker/i,                    ['SOUR_APPLE_SCHNAPPS']],
  [/butterscotch schnapps|buttershots/i,                   ['BUTTERSCOTCH_SCHNAPPS']],
  [/peppermint.*schnapps|schnapps.*peppermint|\bpeppermint\b/i, ['PEPPERMINT_SCHNAPPS', 'CREME_DE_MENTHE']],
  [/creme de menthe|mint liqueur/i,                        ['CREME_DE_MENTHE', 'PEPPERMINT_SCHNAPPS']],
  [/creme de cassis|blackcurrant liqueur/i,                ['CREME_DE_CASSIS']],
  [/white.*creme de cacao|creme de cacao.*white/i,         ['CREME_DE_CACAO_WHITE', 'CREME_DE_CACAO']],
  [/creme de cacao/i,                                      ['CREME_DE_CACAO']],
  [/creme de violette|violet liqueur/i,                    ['CREME_DE_VIOLETTE']],
  [/pomegranate liqueur/i,                                 ['GRENADINE']],

  // ── Chartreuse ────────────────────────────────────────────────────────
  [/green chartreuse/i,                                    ['GREEN_CHARTREUSE', 'CHARTREUSE']],
  [/yellow chartreuse/i,                                   ['YELLOW_CHARTREUSE', 'CHARTREUSE']],
  [/chartreuse/i,                                          ['CHARTREUSE']],

  // ── Herbal / amaro ────────────────────────────────────────────────────
  [/benedictine/i,                                         ['BENEDICTINE']],
  [/drambuie/i,                                            ['DRAMBUIE']],
  [/fernet/i,                                              ['FERNET_BRANCA', 'AMARO']],
  [/jagermeister|j[aä]ger\b/i,                             ['JAGERMEISTER', 'AMARO']],
  [/amaro nonino|nonino/i,                                 ['AMARO_NONINO', 'AMARO']],
  [/amaro averna|averna/i,                                 ['AMARO_AVERNA', 'AMARO']],
  [/\bamaro\b/i,                                           ['AMARO']],
  [/galliano/i,                                            ['GALLIANO']],
  [/licor.?43|forty.?three/i,                              ['LICOR_43']],
  [/goldschlager|cinnamon schnapps/i,                      ['GOLDSCHLAGER', 'CINNAMON_LIQUEUR']],
  [/falernum/i,                                            ['FALERNUM']],
  [/lillet/i,                                              ['LILLET_BLANC']],
  [/sambuca|ouzo/i,                                        ['SAMBUCA']],

  // ── Irish cream / cream liqueurs ─────────────────────────────────────
  [/irish cream|baileys|bailey.{0,3}s/i,                   ['IRISH_CREAM']],
  [/cask.*cream|cream.*cask|chocolate.*cream liqueur|cream liqueur/i, ['IRISH_CREAM', 'CREME_DE_CACAO']],

  // ── Aperitifs ─────────────────────────────────────────────────────────
  [/select aperitivo/i,                                    ['SELECT_APERITIVO', 'APERITIVO']],
  [/campari/i,                                             ['CAMPARI', 'APERITIVO']],
  [/aperol/i,                                              ['APEROL', 'APERITIVO']],

  // ── Vermouth ──────────────────────────────────────────────────────────
  [/sweet vermouth|vermouth rosso|red vermouth|vermouth rouge/i, ['SWEET_VERMOUTH', 'VERMOUTH']],
  [/dry vermouth|french vermouth|extra dry vermouth|vermouth bianco|lyres.*vermouth/i, ['DRY_VERMOUTH', 'VERMOUTH']],
  [/vermouth/i,                                            ['SWEET_VERMOUTH', 'VERMOUTH']],

  // ── Sparkling / Wine ──────────────────────────────────────────────────
  [/champagne/i,                                           ['CHAMPAGNE', 'SPARKLING_WINE']],
  [/prosecco|cava|cr[eé]mant|sparkling wine/i,             ['PROSECCO', 'SPARKLING_WINE']],
  [/red wine|cabernet|merlot|shiraz|syrah|pinot noir/i,    ['RED_WINE', 'WINE']],
  [/port|porto|ruby port/i,                                ['PORT', 'WINE']],
  [/madeira/i,                                             ['MADEIRA', 'WINE']],
  [/amontillado/i,                                         ['AMONTILLADO_SHERRY', 'DRY_SHERRY', 'WINE']],
  [/dry sherry|fino sherry|manzanilla|oloroso/i,           ['DRY_SHERRY', 'WINE']],
  [/\bsherry\b/i,                                          ['DRY_SHERRY', 'WINE']],
  [/fine ruby porto/i,                                     ['PORT', 'WINE']],

  // ── Bitters ───────────────────────────────────────────────────────────
  [/peychaud/i,                                            ['PEYCHAUDS_BITTERS', 'BITTERS']],
  [/orange bitters/i,                                      ['ORANGE_BITTERS', 'BITTERS']],
  [/mole bitters/i,                                        ['MOLE_BITTERS', 'BITTERS']],
  [/angostura|aromatic bitters/i,                          ['ANGOSTURA_BITTERS', 'BITTERS']],
  [/\bbitters\b/i,                                         ['BITTERS']],

  // ── Juices (bottled) ──────────────────────────────────────────────────
  [/100%.*lime juice|lime juice|lime cordial/i,            ['LIME_JUICE']],
  [/lemon juice/i,                                         ['LEMON_JUICE']],
  [/blood orange/i,                                        ['BLOOD_ORANGE_JUICE', 'ORANGE_JUICE']],
  [/orange juice/i,                                        ['ORANGE_JUICE']],
  [/grapefruit juice/i,                                    ['GRAPEFRUIT_JUICE']],
  [/pineapple juice/i,                                     ['PINEAPPLE_JUICE']],
  [/cranberry juice/i,                                     ['CRANBERRY_JUICE']],
  [/tomato juice/i,                                        ['TOMATO_JUICE']],
  [/apple juice/i,                                         ['APPLE_JUICE']],
  [/apple cider vinegar/i,                                 ['APPLE_CIDER_VINEGAR']],
  [/apple cider/i,                                         ['APPLE_CIDER']],
  [/passion.?fruit|passionfruit/i,                         ['PASSION_FRUIT_PUREE']],
  [/mango juice|mango puree|mango nectar/i,                ['MANGO_JUICE']],
  [/peach puree|peach nectar/i,                            ['PEACH_PUREE']],
  [/watermelon juice/i,                                    ['WATERMELON_JUICE']],
  [/pomegranate juice/i,                                   ['POMEGRANATE_JUICE']],
  [/ginger juice/i,                                        ['GINGER_JUICE']],
  [/lychee juice/i,                                        ['LYCHEE_JUICE']],
  [/yuzu/i,                                                ['YUZU_JUICE']],
  [/coconut water/i,                                       ['COCONUT_WATER']],

  // ── Mixers ────────────────────────────────────────────────────────────
  [/elderflower tonic/i,                                   ['ELDERFLOWER_TONIC', 'TONIC_WATER']],
  [/fever.?tree|premium.*tonic|indian tonic|tonic water|\btonic\b/i, ['TONIC_WATER']],
  [/ginger beer/i,                                         ['GINGER_BEER']],
  [/ginger ale/i,                                          ['GINGER_ALE']],
  [/club soda|soda water|seltzer|sparkling water|original seltzer/i, ['SODA_WATER', 'SPARKLING_WATER']],
  [/coca.?cola|\bcoke\b/i,                                 ['COLA']],
  [/\bcola\b/i,                                            ['COLA']],
  [/7.?up|seven.?up|\bsprite\b/i,                          ['SPRITE']],
  [/dr.?pepper/i,                                          ['DR_PEPPER']],
  [/orange fanta|orange soda/i,                            ['ORANGE_SODA']],
  [/cream soda/i,                                          ['CREAM_SODA']],
  [/red bull.*sugar.?free|red bull.*zero/i,                 ['RED_BULL', 'ENERGY_DRINK']],
  [/red bull.*peach/i,                                     ['RED_BULL', 'ENERGY_DRINK']],
  [/red bull.*yellow|red bull.*tropical/i,                 ['RED_BULL', 'ENERGY_DRINK']],
  [/red bull.*watermelon|red bull.*red edition/i,          ['RED_BULL', 'ENERGY_DRINK']],
  [/red bull.*blueberry|red bull.*blue edition/i,          ['RED_BULL', 'ENERGY_DRINK']],
  [/red bull.*dragon.?fruit|red bull.*green edition/i,     ['RED_BULL', 'ENERGY_DRINK']],
  [/red bull.*coconut|red bull.*white edition/i,           ['RED_BULL', 'ENERGY_DRINK']],
  [/red bull/i,                                            ['RED_BULL', 'ENERGY_DRINK']],
  [/monster.*ultra.*white|monster.*white.*ultra/i,         ['MONSTER', 'ENERGY_DRINK']],
  [/monster.*ultra|monster.*zero/i,                        ['MONSTER', 'ENERGY_DRINK']],
  [/monster.*pipeline|monster.*mango|monster.*juice/i,     ['MONSTER', 'ENERGY_DRINK']],
  [/monster energy|monster drink|\bmonster\b/i,            ['MONSTER', 'ENERGY_DRINK']],
  [/celsius.*heat|celsius.*stevia/i,                       ['CELSIUS', 'ENERGY_DRINK']],
  [/\bcelsius\b/i,                                         ['CELSIUS', 'ENERGY_DRINK']],
  [/liquid death/i,                                        ['SPARKLING_WATER', 'SODA_WATER']],
  [/rockstar energy|bang energy/i,                         ['ENERGY_DRINK']],
  [/lemonade/i,                                            ['LEMONADE']],
  [/mango soda/i,                                          ['MANGO_SODA']],
  [/cherry soda/i,                                         ['CHERRY_SODA']],
  [/blue raspberry soda/i,                                 ['BLUE_RASPBERRY_SODA']],
  [/grapefruit soda|paloma/i,                              ['GRAPEFRUIT_SODA']],
  [/stout|\bguinness\b/i,                                  ['STOUT', 'BEER']],
  [/\blager\b|pale ale|pilsner|sapporo|asahi|kirin|japanese beer/i, ['BEER']],
  [/\bbeer\b/i,                                            ['BEER']],

  // ── Syrups ────────────────────────────────────────────────────────────
  [/grenadine/i,                                           ['GRENADINE']],
  [/orgeat|almond syrup/i,                                 ['ORGEAT']],
  [/honey.*ginger.*syrup|ginger.*honey/i,                  ['HONEY_SYRUP', 'HONEY']],
  [/honey.*syrup/i,                                        ['HONEY_SYRUP', 'HONEY']],
  [/\bhoney\b/i,                                           ['HONEY', 'HONEY_SYRUP']],
  [/agave.*syrup|agave nectar|agave cordial/i,             ['AGAVE_SYRUP']],
  [/demerara syrup|rich syrup|2:1 syrup/i,                 ['SIMPLE_SYRUP', 'DEMERARA_SYRUP']],
  [/simple syrup|sugar syrup|1:1 syrup/i,                  ['SIMPLE_SYRUP']],
  [/brown sugar syrup/i,                                   ['SIMPLE_SYRUP']],
  [/raspberry syrup/i,                                     ['RASPBERRY_SYRUP']],
  [/coconut syrup/i,                                       ['COCONUT_SYRUP']],
  [/vanilla syrup/i,                                       ['VANILLA_SYRUP']],
  [/peach syrup/i,                                         ['PEACH_SYRUP']],
  [/cherry syrup/i,                                        ['CHERRY_SYRUP']],
  [/lavender syrup/i,                                      ['LAVENDER_SYRUP']],
  [/cinnamon syrup/i,                                      ['CINNAMON_SYRUP']],
  [/cardamom syrup/i,                                      ['CARDAMOM_SYRUP']],
  [/rosemary syrup/i,                                      ['ROSEMARY_SYRUP']],
  [/thyme syrup/i,                                         ['THYME_SYRUP']],
  [/matcha syrup/i,                                        ['MATCHA_SYRUP']],
  [/hibiscus syrup/i,                                      ['HIBISCUS_SYRUP']],
  [/lemongrass syrup/i,                                    ['LEMONGRASS_SYRUP']],
  [/caramel syrup/i,                                       ['CARAMEL_SYRUP']],
  [/espresso syrup/i,                                      ['ESPRESSO_SYRUP']],
  [/strawberry syrup/i,                                    ['STRAWBERRY_SYRUP']],
  [/blackberry syrup/i,                                    ['BLACKBERRY_SYRUP']],
  [/watermelon syrup/i,                                    ['WATERMELON_SYRUP']],
  [/blue raspberry syrup/i,                                ['BLUE_RASPBERRY_SYRUP']],
  [/passionfruit syrup|passion fruit syrup/i,              ['PASSION_FRUIT_PUREE']],
  [/horchata syrup/i,                                      ['HORCHATA_SYRUP']],
  [/cotton candy syrup/i,                                  ['COTTON_CANDY_SYRUP']],
  [/peppermint syrup/i,                                    ['CREME_DE_MENTHE']],
  [/marshmallow syrup/i,                                   ['MARSHMALLOW_SYRUP']],
  [/mango syrup/i,                                         ['MANGO_SYRUP']],
  [/chocolate syrup/i,                                     ['CHOCOLATE_SYRUP']],

  // ── Dairy / eggs ──────────────────────────────────────────────────────
  [/heavy cream|whipping cream|double cream/i,             ['HEAVY_CREAM']],
  [/coconut cream|cream of coconut|coco lopez/i,           ['COCONUT_CREAM']],
  [/oat milk/i,                                            ['OAT_MILK', 'HOT_MILK']],
  [/hot milk|whole milk/i,                                 ['HOT_MILK']],
  [/eggnog/i,                                              ['EGGNOG']],

  // ── Coffee / tea ──────────────────────────────────────────────────────
  [/cold brew.*coffee|coffee.*cold brew/i,                 ['COLD_BREW', 'COFFEE']],
  [/espresso/i,                                            ['ESPRESSO', 'COFFEE']],
  [/\bcoffee\b/i,                                          ['COFFEE']],
  [/sweet tea/i,                                           ['TEA']],
  [/iced tea/i,                                            ['TEA']],
  [/hibiscus tea/i,                                        ['TEA']],
  [/oolong tea/i,                                          ['TEA']],
  [/cold brew.*tea/i,                                      ['TEA']],

  // ── Condiments / kitchen ──────────────────────────────────────────────
  [/hot sauce|tabasco|cholula/i,                           ['HOT_SAUCE']],
  [/worcestershire/i,                                      ['WORCESTERSHIRE']],
  [/horseradish/i,                                         ['HORSERADISH']],
  [/pickle brine/i,                                        ['PICKLE_BRINE']],
  [/celery salt/i,                                         ['CELERY_SALT', 'SALT']],
  [/orange flower water/i,                                 ['ORANGE_FLOWER_WATER']],
  [/rose water/i,                                          ['ROSE_WATER']],
  [/orange marmalade/i,                                    ['ORANGE_MARMALADE']],
  [/tamarind/i,                                            ['TAMARIND']],
  [/\bsalt\b/i,                                            ['SALT']],

  // ── Non-alcoholic spirits ─────────────────────────────────────────────
  [/seedlip/i,                                             ['SEEDLIP']],
];

// ── What inventory canonical types satisfy each recipe canonical type ─────────
// Key = recipe canonical type. Value = inventory canonical types that satisfy it.

const SATISFYING_TYPES: Record<string, string[]> = {
  // Whiskey hierarchy
  'WHISKEY':        ['WHISKEY', 'BOURBON', 'RYE_WHISKEY', 'SCOTCH', 'ISLAY_SCOTCH', 'IRISH_WHISKEY', 'CANADIAN_WHISKY', 'JAPANESE_WHISKY', 'CINNAMON_LIQUEUR'],
  'BOURBON':        ['BOURBON'],
  'RYE_WHISKEY':    ['RYE_WHISKEY'],
  'SCOTCH':         ['SCOTCH', 'ISLAY_SCOTCH'],
  'ISLAY_SCOTCH':   ['ISLAY_SCOTCH', 'SCOTCH'],
  'IRISH_WHISKEY':  ['IRISH_WHISKEY'],
  'CANADIAN_WHISKY':['CANADIAN_WHISKY', 'WHISKEY'],
  'JAPANESE_WHISKY':['JAPANESE_WHISKY', 'WHISKEY'],
  'CINNAMON_LIQUEUR':['CINNAMON_LIQUEUR', 'GOLDSCHLAGER'],

  // Rum hierarchy
  'RUM':            ['RUM', 'RUM_WHITE', 'RUM_DARK', 'RUM_AGED', 'RUM_OVERPROOF', 'SPICED_RUM', 'COCONUT_RUM'],
  'RUM_WHITE':      ['RUM_WHITE', 'RUM'],
  'RUM_DARK':       ['RUM_DARK', 'RUM_AGED', 'RUM'],
  'RUM_AGED':       ['RUM_AGED', 'RUM_DARK', 'RUM'],
  'RUM_OVERPROOF':  ['RUM_OVERPROOF', 'RUM'],

  // Other base spirits
  'GIN':            ['GIN'],
  'SLOE_GIN':       ['SLOE_GIN', 'GIN'],
  'VODKA':          ['VODKA'],
  'TEQUILA':        ['TEQUILA', 'MEZCAL'],
  'MEZCAL':         ['MEZCAL', 'TEQUILA'],
  'ABSINTHE':       ['ABSINTHE'],
  'SAKE':           ['SAKE'],

  // Brandy family
  'BRANDY':         ['BRANDY', 'COGNAC', 'APPLE_BRANDY', 'APRICOT_BRANDY', 'CHERRY_BRANDY'],
  'COGNAC':         ['COGNAC', 'BRANDY'],
  'APPLE_BRANDY':   ['APPLE_BRANDY', 'BRANDY'],
  'APRICOT_BRANDY': ['APRICOT_BRANDY', 'BRANDY'],
  'CHERRY_BRANDY':  ['CHERRY_BRANDY', 'CHERRY_LIQUEUR', 'BRANDY'],
  'PISCO':          ['PISCO'],
  'CACHACA':        ['CACHACA'],

  // High proof (any spirit satisfies)
  'HIGH_PROOF_SPIRIT': ['HIGH_PROOF_SPIRIT', 'BOURBON', 'RYE_WHISKEY', 'SCOTCH', 'ISLAY_SCOTCH', 'IRISH_WHISKEY', 'VODKA', 'GIN', 'TEQUILA', 'MEZCAL', 'RUM_WHITE', 'RUM_DARK', 'RUM_AGED', 'RUM_OVERPROOF', 'ABSINTHE'],

  // Orange liqueurs (interchangeable)
  'TRIPLE_SEC':     ['TRIPLE_SEC', 'BLUE_CURACAO', 'ORANGE_LIQUEUR'],
  'BLUE_CURACAO':   ['BLUE_CURACAO', 'TRIPLE_SEC', 'ORANGE_LIQUEUR'],
  'ORANGE_LIQUEUR': ['ORANGE_LIQUEUR', 'TRIPLE_SEC', 'BLUE_CURACAO'],

  // Specific liqueurs
  'COFFEE_LIQUEUR': ['COFFEE_LIQUEUR'],
  'AMARETTO':       ['AMARETTO'],
  'RASPBERRY_LIQUEUR':['RASPBERRY_LIQUEUR'],
  'BLACKBERRY_LIQUEUR':['BLACKBERRY_LIQUEUR', 'CREME_DE_MURE'],
  'CHERRY_LIQUEUR': ['CHERRY_LIQUEUR', 'CHERRY_BRANDY'],
  'MARASCHINO_LIQUEUR':['MARASCHINO_LIQUEUR'],
  'ELDERFLOWER_LIQUEUR':['ELDERFLOWER_LIQUEUR'],
  'ELDERFLOWER_CORDIAL':['ELDERFLOWER_CORDIAL', 'ELDERFLOWER_LIQUEUR'],
  'PASSOA':         ['PASSOA'],
  'MIDORI':         ['MIDORI'],
  'BANANA_LIQUEUR': ['BANANA_LIQUEUR'],
  'PEACH_SCHNAPPS': ['PEACH_SCHNAPPS'],
  'SOUR_APPLE_SCHNAPPS':['SOUR_APPLE_SCHNAPPS'],
  'BUTTERSCOTCH_SCHNAPPS':['BUTTERSCOTCH_SCHNAPPS'],
  'PEPPERMINT_SCHNAPPS':['PEPPERMINT_SCHNAPPS', 'CREME_DE_MENTHE'],
  'CREME_DE_MENTHE':['CREME_DE_MENTHE', 'PEPPERMINT_SCHNAPPS'],
  'CREME_DE_CASSIS':['CREME_DE_CASSIS'],
  'CREME_DE_CACAO': ['CREME_DE_CACAO', 'CREME_DE_CACAO_WHITE'],
  'CREME_DE_CACAO_WHITE':['CREME_DE_CACAO_WHITE', 'CREME_DE_CACAO'],
  'CREME_DE_VIOLETTE':['CREME_DE_VIOLETTE'],
  'CREME_DE_MURE':  ['CREME_DE_MURE', 'BLACKBERRY_LIQUEUR'],
  'FALERNUM':       ['FALERNUM'],
  'LILLET_BLANC':   ['LILLET_BLANC'],
  'SAMBUCA':        ['SAMBUCA'],
  'GALLIANO':       ['GALLIANO'],
  'LICOR_43':       ['LICOR_43'],
  'GOLDSCHLAGER':   ['GOLDSCHLAGER', 'CINNAMON_LIQUEUR'],

  // Herbal / amaro
  'CHARTREUSE':     ['CHARTREUSE', 'GREEN_CHARTREUSE', 'YELLOW_CHARTREUSE'],
  'GREEN_CHARTREUSE':['GREEN_CHARTREUSE', 'CHARTREUSE'],
  'YELLOW_CHARTREUSE':['YELLOW_CHARTREUSE', 'CHARTREUSE'],
  'BENEDICTINE':    ['BENEDICTINE'],
  'DRAMBUIE':       ['DRAMBUIE'],
  'FERNET_BRANCA':  ['FERNET_BRANCA', 'AMARO'],
  'JAGERMEISTER':   ['JAGERMEISTER', 'AMARO'],
  'AMARO_NONINO':   ['AMARO_NONINO', 'AMARO'],
  'AMARO_AVERNA':   ['AMARO_AVERNA', 'AMARO'],
  'AMARO':          ['AMARO', 'FERNET_BRANCA', 'JAGERMEISTER', 'AMARO_NONINO', 'AMARO_AVERNA'],

  // Irish cream
  'IRISH_CREAM':    ['IRISH_CREAM'],

  // Aperitifs
  'APERITIVO':      ['APERITIVO', 'CAMPARI', 'APEROL', 'SELECT_APERITIVO'],
  'CAMPARI':        ['CAMPARI', 'APERITIVO', 'SELECT_APERITIVO'],
  'APEROL':         ['APEROL', 'APERITIVO'],
  'SELECT_APERITIVO':['SELECT_APERITIVO', 'CAMPARI', 'APERITIVO'],

  // Vermouth
  'VERMOUTH':       ['VERMOUTH', 'SWEET_VERMOUTH', 'DRY_VERMOUTH'],
  'SWEET_VERMOUTH': ['SWEET_VERMOUTH'],
  'DRY_VERMOUTH':   ['DRY_VERMOUTH'],

  // Sparkling
  'CHAMPAGNE':      ['CHAMPAGNE', 'PROSECCO', 'SPARKLING_WINE'],
  'PROSECCO':       ['PROSECCO', 'CHAMPAGNE', 'SPARKLING_WINE'],
  'SPARKLING_WINE': ['SPARKLING_WINE', 'CHAMPAGNE', 'PROSECCO'],

  // Bitters
  'BITTERS':        ['BITTERS', 'ANGOSTURA_BITTERS', 'PEYCHAUDS_BITTERS', 'ORANGE_BITTERS', 'MOLE_BITTERS'],
  'ANGOSTURA_BITTERS':['ANGOSTURA_BITTERS', 'BITTERS'],
  'PEYCHAUDS_BITTERS':['PEYCHAUDS_BITTERS', 'BITTERS'],
  'ORANGE_BITTERS': ['ORANGE_BITTERS', 'BITTERS'],
  'MOLE_BITTERS':   ['MOLE_BITTERS'],

  // Soda / water
  'SODA_WATER':     ['SODA_WATER', 'SPARKLING_WATER'],
  'SPARKLING_WATER':['SPARKLING_WATER', 'SODA_WATER'],
  'TONIC_WATER':    ['TONIC_WATER', 'ELDERFLOWER_TONIC'],
  'ELDERFLOWER_TONIC':['ELDERFLOWER_TONIC', 'TONIC_WATER'],
  'GINGER_BEER':    ['GINGER_BEER'],
  'GINGER_ALE':     ['GINGER_ALE', 'GINGER_BEER'],

  // Honey / syrups with substitution
  'HONEY_SYRUP':    ['HONEY_SYRUP', 'HONEY'],
  'HONEY':          ['HONEY', 'HONEY_SYRUP'],
  'SIMPLE_SYRUP':   ['SIMPLE_SYRUP', 'DEMERARA_SYRUP'],

  // Juices with equivalents
  'PASSION_FRUIT_PUREE':['PASSION_FRUIT_PUREE'],
  'MANGO_JUICE':    ['MANGO_JUICE'],
  'PEACH_PUREE':    ['PEACH_PUREE'],
  'COCONUT_CREAM':  ['COCONUT_CREAM'],
  'CREAM_OF_COCONUT':['CREAM_OF_COCONUT', 'COCONUT_CREAM'],

  // Sherry
  'DRY_SHERRY':     ['DRY_SHERRY', 'AMONTILLADO_SHERRY'],
  'AMONTILLADO_SHERRY':['AMONTILLADO_SHERRY', 'DRY_SHERRY'],

  // Salt
  'CELERY_SALT':    ['CELERY_SALT', 'SALT'],

  // Eggs / dairy
  'EGG':            ['EGG', 'EGG_WHITE'],
  'EGG_WHITE':      ['EGG_WHITE', 'EGG'],
  'HEAVY_CREAM':    ['HEAVY_CREAM'],
  'HOT_MILK':       ['HOT_MILK', 'OAT_MILK'],
  'OAT_MILK':       ['OAT_MILK', 'HOT_MILK'],

  // Coffee
  'COFFEE':         ['COFFEE', 'ESPRESSO', 'COLD_BREW'],
  'ESPRESSO':       ['ESPRESSO', 'COFFEE', 'COLD_BREW'],
  'COLD_BREW':      ['COLD_BREW', 'ESPRESSO', 'COFFEE'],

  // Fresh muddled (satisfied by pantry)
  'MINT':           ['MINT'],
  'BASIL':          ['BASIL'],
  'CUCUMBER':       ['CUCUMBER'],
  'ROSEMARY':       ['ROSEMARY'],
  'SUZE':           ['SUZE'],
  'PORT':           ['PORT'],

  // Beer
  'BEER':           ['BEER', 'STOUT'],
  'STOUT':          ['STOUT', 'BEER'],
  'RED_BULL':       ['RED_BULL', 'ENERGY_DRINK'],
  'MONSTER':        ['MONSTER', 'ENERGY_DRINK'],
  'CELSIUS':        ['CELSIUS', 'ENERGY_DRINK'],
  'ENERGY_DRINK':   ['ENERGY_DRINK', 'RED_BULL', 'MONSTER', 'CELSIUS'],
};

// ── Pantry item ID → canonical type(s) ───────────────────────────────────────

const PANTRY_CANONICAL: Record<string, string[]> = {
  'fresh-lime':        ['LIME_JUICE'],
  'fresh-lemon':       ['LEMON_JUICE'],
  'fresh-orange':      ['ORANGE_JUICE'],
  'fresh-grapefruit':  ['GRAPEFRUIT_JUICE'],
  'fresh-mint':        ['MINT'],
  'fresh-basil':       ['BASIL'],
  'fresh-cucumber':    ['CUCUMBER'],
  'fresh-rosemary':    ['ROSEMARY'],
  'eggs':              ['EGG_WHITE', 'EGG'],
  'heavy-cream':       ['HEAVY_CREAM'],
  'simple-syrup':      ['SIMPLE_SYRUP', 'DEMERARA_SYRUP'],
  'honey':             ['HONEY', 'HONEY_SYRUP'],
  'agave':             ['AGAVE_SYRUP'],
  'sugar':             ['SUGAR'],
  'demerara-syrup':    ['SIMPLE_SYRUP', 'DEMERARA_SYRUP'],
  'pineapple-juice':   ['PINEAPPLE_JUICE'],
  'cranberry-juice':   ['CRANBERRY_JUICE'],
  'passion-fruit':     ['PASSION_FRUIT_PUREE'],
  'coconut-cream':     ['COCONUT_CREAM', 'CREAM_OF_COCONUT'],
  'salt':              ['SALT', 'CELERY_SALT'],
  'ice':               ['ICE'],
  'sparkling-water':   ['SODA_WATER', 'SPARKLING_WATER'],
};

// ── Resolve a bottle name to its canonical type(s) ────────────────────────────

function resolveBottle(name: string): string[] {
  const types = new Set<string>();
  for (const [pattern, canonicalTypes] of RESOLVER_RULES) {
    if (pattern.test(name)) {
      canonicalTypes.forEach(t => types.add(t));
    }
  }
  return Array.from(types);
}

// ── Public interface ──────────────────────────────────────────────────────────

export interface InventoryMatcher {
  isSatisfied(ingredientId: string, ingredientName?: string): boolean;
}

export function isGarnish(ingredientId: string): boolean {
  return RECIPE_CANONICAL[ingredientId] === 'GARNISH';
}

export function getRecipeCanonicalType(ingredientId: string): string | undefined {
  return RECIPE_CANONICAL[ingredientId];
}

export function buildInventoryMatcher(
  items: InventoryItem[],
  checkedPantryIds: Set<string> = new Set(),
): InventoryMatcher {
  const inStock = items.filter(i => i.quantity !== 'out');

  // Precompute all canonical types available from inventory
  const inventoryTypes = new Set<string>();

  inStock.forEach(item => {
    // Use item's own ingredientId as a direct canonical lookup
    const directType = RECIPE_CANONICAL[item.ingredientId];
    if (directType && directType !== 'GARNISH') inventoryTypes.add(directType);

    // Also resolve from bottle name via pattern rules
    resolveBottle(item.name).forEach(t => inventoryTypes.add(t));
  });

  // Add canonical types from checked pantry items
  checkedPantryIds.forEach(pantryId => {
    const types = PANTRY_CANONICAL[pantryId];
    if (types) types.forEach(t => inventoryTypes.add(t));
    // Also walk pantryItems.ts satisfies arrays as a secondary source
  });

  // Also add types from pantryItems.ts satisfies strings for pantry items
  if (checkedPantryIds.size > 0) {
    PANTRY_CATEGORIES.forEach(cat => {
      cat.items.forEach(item => {
        if (!checkedPantryIds.has(item.id)) return;
        // Resolve each satisfies string through RESOLVER_RULES
        item.satisfies.forEach(s => {
          resolveBottle(s).forEach(t => inventoryTypes.add(t));
        });
      });
    });
  }

  return {
    isSatisfied(ingredientId: string, ingredientName?: string): boolean {
      const recipeType = RECIPE_CANONICAL[ingredientId];

      // Unknown ingredient ID — try resolving by name
      if (!recipeType) {
        if (!ingredientName) return false;
        const nameTypes = resolveBottle(ingredientName);
        return nameTypes.some(t => {
          const satisfying = SATISFYING_TYPES[t] ?? [t];
          return satisfying.some(st => inventoryTypes.has(st));
        });
      }

      // Garnishes are always satisfied
      if (recipeType === 'GARNISH') return true;

      // Check if inventory covers this canonical type (or a satisfying substitute)
      const satisfying = SATISFYING_TYPES[recipeType] ?? [recipeType];
      return satisfying.some(t => inventoryTypes.has(t));
    },
  };
}
