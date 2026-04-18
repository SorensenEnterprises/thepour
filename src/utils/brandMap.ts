/**
 * Maps custom bottle names (brand names or names containing spirit keywords)
 * to canonical ingredient IDs used in the recipe database.
 *
 * Called when computing inStockIds so that a scanned bottle like
 * "Hendrick's Gin" correctly matches recipes that call for ingredientId:"gin".
 */

type PatternEntry = { pattern: RegExp; ids: string[] };

const BRAND_PATTERNS: PatternEntry[] = [
  // ── Tequila ──────────────────────────────────────────────────────────────
  {
    pattern: /patr[oó]n|casamigos|don julio|herradura|clase azul|espolon|cazadores|hornitos|olmeca|1800\s*tequila|tres generaciones/i,
    ids: ['tequila'],
  },
  // ── Mezcal (maps to tequila — closest canonical ID) ────────────────────
  {
    pattern: /del maguey|wahaka|ilegal|banhez|putaparió|montelobos/i,
    ids: ['tequila'],
  },
  // ── Gin ──────────────────────────────────────────────────────────────────
  {
    pattern: /hendrick|tanqueray|beefeater|bombay sapphire|botanist|monkey\s*47|sipsmith|malfy|aviation\s*gin|brockmans|roku|nolet|empress|ford'?s gin/i,
    ids: ['gin'],
  },
  // ── Vodka ────────────────────────────────────────────────────────────────
  {
    pattern: /tito'?s|grey goose|ketel one|absolut|belvedere|smirnoff|cir[oó]c|stolichnaya|wheatley|chopin|crystal head|hangar\s*1|new amsterdam vodka/i,
    ids: ['vodka'],
  },
  // ── Bourbon ──────────────────────────────────────────────────────────────
  {
    pattern: /maker'?s mark|woodford reserve|knob creek|wild turkey|buffalo trace|four roses|old forester|blanton|weller|angel'?s envy|larceny|evan williams/i,
    ids: ['bourbon'],
  },
  // ── Rye Whiskey ──────────────────────────────────────────────────────────
  {
    pattern: /rittenhouse|old overholt|sazerac rye|pikesville|whistlepig|high west rye/i,
    ids: ['rye-whiskey'],
  },
  // ── Bulleit (bourbon vs rye — check label) ──────────────────────────────
  { pattern: /bulleit rye/i,            ids: ['rye-whiskey'] },
  { pattern: /bulleit(?!\s+rye)/i,      ids: ['bourbon'] },
  // ── Scotch ───────────────────────────────────────────────────────────────
  {
    pattern: /glenfiddich|glenlivet|macallan|laphroaig|ardbeg|highland park|dalmore|oban|balvenie|bowmore|glenmorangie|johnnie walker|dewar|famous grouse|chivas|j&b\b|monkey shoulder/i,
    ids: ['scotch', 'islay-scotch'],
  },
  // ── Islay Scotch (peat-heavy) ────────────────────────────────────────────
  {
    pattern: /laphroaig|ardbeg|lagavulin|bowmore|bruichladdich|kilchoman/i,
    ids: ['islay-scotch'],
  },
  // ── Tennessee / Canadian whiskey → bourbon (closest canonical match) ────
  {
    pattern: /jack daniel|crown royal|canadian club|seagram|windsor canadian/i,
    ids: ['bourbon'],
  },
  // ── Irish Whiskey → bourbon + rye (closest canonical matches) ────────────
  {
    pattern: /jameson|proper\s*(twelve|12)|bushmills|tullamore|redbreast|powers irish|green spot|yellow spot/i,
    ids: ['bourbon', 'rye-whiskey'],
  },
  // ── Rum ──────────────────────────────────────────────────────────────────
  {
    pattern: /bacardi\s*(superior|silver|white|carta blanca)?|malibu|plantation\s*(3|white)|mount gay\s*(silver|eclipse)?|appleton\s*(white|signature|reserve)?|flor de ca[ñn]a/i,
    ids: ['rum-white'],
  },
  {
    pattern: /captain morgan|kraken|gosling|mount gay xo|appleton estate|zacapa|diplomatico|myers|don q a[ñn]ejo/i,
    ids: ['rum-dark', 'rum-aged'],
  },
  // ── Liqueurs ─────────────────────────────────────────────────────────────
  { pattern: /kahl[uú]a/i,                         ids: ['coffee-liqueur'] },
  { pattern: /baileys|bay'?s irish cream/i,         ids: ['coffee-liqueur'] },
  { pattern: /cointreau|grand marnier|triple\s*sec/i, ids: ['triple-sec'] },
  { pattern: /\bcampari\b/i,                        ids: ['campari'] },
  { pattern: /\baperол|\baперол|\baperол/i,         ids: ['aperol'] },  // unicode variants
  { pattern: /aperol/i,                             ids: ['aperol'] },
  { pattern: /st[.\s]*germain/i,                    ids: ['dry-vermouth'] }, // elderflower — closest
  { pattern: /green chartreuse|yellow chartreuse/i, ids: ['green-chartreuse'] },
  { pattern: /luxardo maraschino|marasca/i,          ids: ['maraschino-liqueur'] },
  { pattern: /amaro nonino/i,                       ids: ['amaro-nonino'] },
  { pattern: /fernet[\s-]branca/i,                  ids: ['fernet-branca'] },
  { pattern: /crème de cassis|creme de cassis/i,    ids: ['creme-de-cassis'] },
  { pattern: /sweet vermouth|rosso vermouth|martini rosso|cinzano rosso/i, ids: ['sweet-vermouth'] },
  { pattern: /dry vermouth|extra dry vermouth|noilly prat/i, ids: ['dry-vermouth'] },
];

const KEYWORD_PATTERNS: PatternEntry[] = [
  { pattern: /\bgin\b/i,                          ids: ['gin'] },
  { pattern: /\bvodka\b/i,                        ids: ['vodka'] },
  { pattern: /\btequila\s+blanco\b/i,             ids: ['tequila'] },
  { pattern: /\btequila\b/i,                      ids: ['tequila'] },
  { pattern: /\bmezcal\b/i,                       ids: ['tequila'] },
  { pattern: /\bbourbon\b/i,                      ids: ['bourbon'] },
  { pattern: /\brye\s+whiskey\b|\brye\s+whisky\b/i, ids: ['rye-whiskey'] },
  { pattern: /\bscotch\b/i,                       ids: ['scotch'] },
  { pattern: /\bislay\b/i,                        ids: ['islay-scotch'] },
  { pattern: /\bwhiskey\b|\bwhisky\b/i,           ids: ['bourbon', 'rye-whiskey'] },
  { pattern: /white\s+rum|silver\s+rum|light\s+rum|rum\s+blanco/i, ids: ['rum-white'] },
  { pattern: /dark\s+rum|spiced\s+rum|a[ñn]ejo\s+rum/i, ids: ['rum-dark', 'rum-aged'] },
  { pattern: /\brum\b/i,                          ids: ['rum-white', 'rum-dark'] },
  { pattern: /\bcognac\b|\bbrandy\b/i,            ids: ['cognac', 'brandy'] },
  { pattern: /coffee\s+liqueur/i,                 ids: ['coffee-liqueur'] },
  { pattern: /triple\s+sec|orange\s+liqueur/i,    ids: ['triple-sec'] },
  { pattern: /sweet\s+vermouth/i,                 ids: ['sweet-vermouth'] },
  { pattern: /dry\s+vermouth/i,                   ids: ['dry-vermouth'] },
  { pattern: /\bcampari\b/i,                      ids: ['campari'] },
  { pattern: /\baperол|\baperол/i,                ids: ['aperol'] },
  { pattern: /aperol/i,                           ids: ['aperol'] },
  { pattern: /simple\s+syrup/i,                   ids: ['simple-syrup'] },
  { pattern: /agave\s+(syrup|nectar)/i,           ids: ['agave-syrup'] },
  { pattern: /grenadine/i,                        ids: ['grenadine'] },
  { pattern: /angostura/i,                        ids: ['angostura-bitters'] },
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
