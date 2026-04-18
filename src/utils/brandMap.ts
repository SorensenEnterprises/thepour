/**
 * Maps bottle names (brand names or spirit keywords) to canonical ingredient
 * IDs used in the recipe database. Called when computing inStockIds so a
 * scanned bottle like "Jameson Irish Whiskey" correctly matches recipes that
 * require ingredientId: 'irish-whiskey'.
 */

type PatternEntry = { pattern: RegExp; ids: string[] };

const BRAND_PATTERNS: PatternEntry[] = [
  // ── Bourbon ───────────────────────────────────────────────────────────────────
  {
    pattern: /maker'?s mark|woodford reserve|knob creek|wild turkey|buffalo trace|four roses|old forester|blanton|weller|angel'?s envy|larceny|evan williams|jim beam(?!\s+rye)|elijah craig|henry mckenna|old grand-?dad/i,
    ids: ['bourbon'],
  },
  { pattern: /bulleit rye/i,       ids: ['rye-whiskey'] },
  { pattern: /bulleit(?!\s+rye)/i, ids: ['bourbon'] },

  // ── Rye Whiskey ──────────────────────────────────────────────────────────────
  {
    pattern: /rittenhouse|old overholt|sazerac rye|pikesville|whistlepig|high west rye|jim beam rye|michter'?s rye|lot\s*40/i,
    ids: ['rye-whiskey'],
  },

  // ── Irish Whiskey ─────────────────────────────────────────────────────────────
  {
    pattern: /jameson|bushmills|tullamore d\.?e\.?w|redbreast|powers irish|green spot|yellow spot|proper\s*(twelve|12)|connemara|writers? tears|slane|teeling|method and madness/i,
    ids: ['irish-whiskey'],
  },

  // ── Scotch — Blended ─────────────────────────────────────────────────────────
  {
    pattern: /johnnie walker|dewar'?s|chivas regal|famous grouse|j&b\b|monkey shoulder|grant'?s scotch|ballantine|william lawson|teacher'?s/i,
    ids: ['scotch'],
  },

  // ── Scotch — Peated / Islay ───────────────────────────────────────────────────
  {
    pattern: /laphroaig|ardbeg|lagavulin|bowmore|bruichladdich|kilchoman|caol ila|port charlotte|bunnahabhain/i,
    ids: ['islay-scotch', 'scotch'],
  },

  // ── Scotch — Single Malt (non-peated) ────────────────────────────────────────
  {
    pattern: /glenfiddich|glenlivet|macallan|highland park|dalmore|oban|balvenie|glenmorangie|glen grant|glenfarclas|aberfeldy/i,
    ids: ['scotch'],
  },

  // ── Tennessee / Canadian (mapped to bourbon — closest canonical match) ────────
  {
    pattern: /jack daniel'?s|gentleman jack|crown royal|canadian club|seagram'?s|windsor canadian|alberta premium/i,
    ids: ['bourbon'],
  },

  // ── Japanese Whisky ──────────────────────────────────────────────────────────
  {
    pattern: /suntory toki|hibiki|yamazaki|hakushu|nikka|iwai|matsui|yoichi|miyagikyo/i,
    ids: ['japanese-whisky'],
  },

  // ── Blanco / Plata Tequila ───────────────────────────────────────────────────
  {
    pattern: /patr[oó]n silver|casamigos blanco|don julio blanco|herradura silver|clase azul (?:blanco|plata)|espolon blanco|cazadores blanco|olmeca blanco|1800\s*silver|tres generaciones plata|el jimador blanco|hornitos plata/i,
    ids: ['tequila'],
  },

  // ── Reposado Tequila ─────────────────────────────────────────────────────────
  {
    pattern: /patr[oó]n reposado|casamigos reposado|don julio reposado|herradura reposado|clase azul reposado|espolon reposado|hornitos reposado|olmeca reposado|1800\s*reposado/i,
    ids: ['tequila-reposado', 'tequila'],
  },

  // ── Añejo Tequila ────────────────────────────────────────────────────────────
  {
    pattern: /patr[oó]n a[ñn]ejo|casamigos a[ñn]ejo|don julio a[ñn]ejo|don julio 1942|herradura a[ñn]ejo|clase azul a[ñn]ejo|1800\s*a[ñn]ejo/i,
    ids: ['tequila-anejo', 'tequila'],
  },

  // ── Generic tequila brands (blanco implied) ──────────────────────────────────
  {
    pattern: /patr[oó]n(?!\s+(?:reposado|a[ñn]ejo|extra))|casamigos(?!\s+(?:reposado|a[ñn]ejo))|don julio(?!\s+(?:reposado|a[ñn]ejo|1942))|herradura(?!\s+(?:reposado|a[ñn]ejo))|espolon|cazadores|clase azul|hornitos|olmeca|1800\s*tequila|tres generaciones/i,
    ids: ['tequila'],
  },

  // ── Mezcal ───────────────────────────────────────────────────────────────────
  {
    pattern: /del maguey|wahaka|ilegal mezcal|banhez|montelobos|vago mezcal|putaparió|alipús|derrumbes|mac murdo|ojo de tigre|green bar mezcal/i,
    ids: ['mezcal'],
  },

  // ── London Dry Gin ────────────────────────────────────────────────────────────
  {
    pattern: /hendrick'?s|tanqueray(?!\s+old tom)|beefeater|bombay sapphire|sipsmith|botanist|malfy|aviation\s*gin|brockmans|roku gin|nolet|empress\s*1908|ford'?s gin|martin miller|gordon'?s gin|seagram'?s gin|burnett'?s gin/i,
    ids: ['gin'],
  },

  // ── Vodka ─────────────────────────────────────────────────────────────────────
  {
    pattern: /tito'?s|grey goose|ketel one|absolut|belvedere|smirnoff|cir[oó]c|stolichnaya|wheatley|chopin|crystal head|hangar\s*1|new amsterdam vodka|skyy|pinnacle vodka|three olives/i,
    ids: ['vodka'],
  },

  // ── White Rum ────────────────────────────────────────────────────────────────
  {
    pattern: /bacardi\s*(superior|silver|white|carta blanca|\s*(?!1[45]1)(?!8|dark))?(?=\b)|plantation\s*(3\s*stars?|white|original dark)?|mount gay\s*(silver|eclipse)?(?=\b)|appleton\s*(white|signature)?(?=\b)|flor de ca[ñn]a\s*(4|blanco)|brugal\s*extra\s*dry|don q\s*(cristal|claro)/i,
    ids: ['rum-white'],
  },

  // ── Dark Rum ─────────────────────────────────────────────────────────────────
  {
    pattern: /gosling'?s|myers'?s rum|mount gay xo|appleton estate|zacapa|diplomatico|don q a[ñn]ejo|plantation xo|barbancourt|pusser'?s rum|flor de ca[ñn]a\s*(7|12|18)|kraken\s*rum/i,
    ids: ['rum-dark'],
  },

  // ── Aged Rum ──────────────────────────────────────────────────────────────────
  {
    pattern: /appleton\s*(reserve|rare blend|signature 12|21)|plantation\s*(5|7|barbados 5|grand reunion)|zacapa\s*(23|centenario)|diplomatico\s*(reserva|exclusiva)/i,
    ids: ['rum-aged', 'rum-dark'],
  },

  // ── Spiced Rum ───────────────────────────────────────────────────────────────
  {
    pattern: /captain morgan|sailor jerry|kraken(?!\s+rum)|chairman'?s reserve spiced|admiral nelson|malibu(?!\s+coconut)/i,
    ids: ['rum-spiced', 'rum-dark'],
  },

  // ── Coconut Rum ──────────────────────────────────────────────────────────────
  {
    pattern: /malibu|parrot bay|cruzan coconut/i,
    ids: ['rum-white'],
  },

  // ── Liqueurs ──────────────────────────────────────────────────────────────────
  { pattern: /kahl[uú]a/i,                                   ids: ['coffee-liqueur'] },
  { pattern: /tia maria/i,                                    ids: ['coffee-liqueur'] },
  { pattern: /baileys|bay'?s irish cream/i,                  ids: ['irish-cream', 'coffee-liqueur'] },
  { pattern: /cointreau/i,                                    ids: ['triple-sec'] },
  { pattern: /grand marnier/i,                               ids: ['triple-sec'] },
  { pattern: /triple\s*sec/i,                                ids: ['triple-sec'] },
  { pattern: /\bcampari\b/i,                                 ids: ['campari'] },
  { pattern: /\baperол|\baperол|\baperол/i,                  ids: ['aperol'] },
  { pattern: /aperol/i,                                       ids: ['aperol'] },
  { pattern: /st[.\s]*germain/i,                             ids: ['elderflower-liqueur'] },
  { pattern: /green chartreuse/i,                            ids: ['green-chartreuse'] },
  { pattern: /yellow chartreuse/i,                           ids: ['yellow-chartreuse'] },
  { pattern: /luxardo maraschino|marasca/i,                  ids: ['maraschino-liqueur'] },
  { pattern: /amaro nonino/i,                                ids: ['amaro-nonino'] },
  { pattern: /fernet[\s-]branca/i,                           ids: ['fernet-branca'] },
  { pattern: /crème de cassis|creme de cassis|ribena/i,      ids: ['creme-de-cassis'] },
  { pattern: /disaronno|amaretto/i,                          ids: ['amaretto'] },
  { pattern: /chambord/i,                                    ids: ['chambord'] },
  { pattern: /midori/i,                                      ids: ['midori'] },
  { pattern: /licor\s*43/i,                                  ids: ['licor-43'] },
  { pattern: /falernum/i,                                    ids: ['falernum'] },
  { pattern: /cr[eè]me de violette/i,                        ids: ['creme-de-violette'] },
  { pattern: /cr[eè]me de menthe/i,                          ids: ['creme-de-menthe'] },
  { pattern: /b[eé]n[eé]dictine/i,                           ids: ['benedictine'] },
  { pattern: /drambuie/i,                                    ids: ['drambuie'] },
  { pattern: /jager(?:meister)?/i,                           ids: ['jagermeister'] },

  // ── Vermouth & Fortified ──────────────────────────────────────────────────────
  { pattern: /martini rosso|cinzano rosso|dolin rouge|carpano antica|noilly prat rouge/i, ids: ['sweet-vermouth'] },
  { pattern: /martini extra dry|noilly prat dry|dolin dry|carpano dry/i,                  ids: ['dry-vermouth'] },
  { pattern: /lillet blanc/i,                                ids: ['lillet-blanc'] },
  { pattern: /fino|manzanilla|tio pepe/i,                   ids: ['dry-sherry', 'amontillado-sherry'] },
  { pattern: /amontillado/i,                                 ids: ['amontillado-sherry'] },
];

const KEYWORD_PATTERNS: PatternEntry[] = [
  { pattern: /\bgin\b/i,                                    ids: ['gin'] },
  { pattern: /\bvodka\b/i,                                  ids: ['vodka'] },
  { pattern: /\bmezcal\b/i,                                 ids: ['mezcal'] },
  { pattern: /\btequila\s+blanco\b|\bblanco\s+tequila\b/i,  ids: ['tequila'] },
  { pattern: /\btequila\s+reposado\b/i,                     ids: ['tequila-reposado', 'tequila'] },
  { pattern: /\btequila\s+a[ñn]ejo\b/i,                    ids: ['tequila-anejo', 'tequila'] },
  { pattern: /\btequila\b/i,                                ids: ['tequila'] },
  { pattern: /\bbourbon\b/i,                                ids: ['bourbon'] },
  { pattern: /\brye\s+whiskey\b|\brye\s+whisky\b/i,         ids: ['rye-whiskey'] },
  { pattern: /\birish\s+whiskey\b|\birish\s+whisky\b/i,     ids: ['irish-whiskey'] },
  { pattern: /\bislay\b|\bpeated\s+scotch\b/i,              ids: ['islay-scotch', 'scotch'] },
  { pattern: /\bscotch\b/i,                                 ids: ['scotch'] },
  { pattern: /\bjapanese\s+whisk[ey]y\b/i,                  ids: ['japanese-whisky'] },
  { pattern: /\bwhiskey\b|\bwhisky\b/i,                     ids: ['bourbon', 'rye-whiskey', 'irish-whiskey'] },
  { pattern: /white\s+rum|silver\s+rum|light\s+rum|rum\s+blanco/i, ids: ['rum-white'] },
  { pattern: /dark\s+rum/i,                                 ids: ['rum-dark'] },
  { pattern: /spiced\s+rum/i,                               ids: ['rum-spiced', 'rum-dark'] },
  { pattern: /aged\s+rum/i,                                 ids: ['rum-aged', 'rum-dark'] },
  { pattern: /\brum\b/i,                                    ids: ['rum-white', 'rum-dark'] },
  { pattern: /\bcognac\b|\bbrandy\b/i,                      ids: ['cognac', 'brandy'] },
  { pattern: /coffee\s+liqueur/i,                           ids: ['coffee-liqueur'] },
  { pattern: /triple\s+sec|orange\s+liqueur/i,              ids: ['triple-sec'] },
  { pattern: /sweet\s+vermouth/i,                           ids: ['sweet-vermouth'] },
  { pattern: /dry\s+vermouth/i,                             ids: ['dry-vermouth'] },
  { pattern: /\bcampari\b/i,                                ids: ['campari'] },
  { pattern: /aperol/i,                                     ids: ['aperol'] },
  { pattern: /simple\s+syrup/i,                             ids: ['simple-syrup'] },
  { pattern: /agave\s+(syrup|nectar)/i,                     ids: ['agave-syrup'] },
  { pattern: /grenadine/i,                                  ids: ['grenadine'] },
  { pattern: /angostura/i,                                  ids: ['angostura-bitters'] },
];

export function getCanonicalIds(name: string): string[] {
  const result = new Set<string>();
  for (const { pattern, ids } of BRAND_PATTERNS) {
    if (pattern.test(name)) ids.forEach(id => result.add(id));
  }
  for (const { pattern, ids } of KEYWORD_PATTERNS) {
    if (pattern.test(name)) ids.forEach(id => result.add(id));
  }
  return Array.from(result);
}
