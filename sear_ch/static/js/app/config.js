const MINIMAL_APP_CONFIG = Object.freeze({
  appName: "sear_ch",
  displayAppName: "sear_ch",
  metaDescription: "sear_ch is a self-hosted web app for AI-augmented private search.",
  robots: "noindex,nofollow,noarchive",
  preferencesKey: "sear_ch.preferences.v1",
  themeColorLight: "#faf8f1",
  themeColorDark: "#191919",
  defaultZipCode: "78701",
  defaultSearxngUrl: "http://127.0.0.1:8890/",
  zipAnchorCountryCode: "us",
  localDistanceMapMiles: 80,
  localDistanceNearbyMiles: 90,
  localDistanceRegionalMiles: 180,
  newsTopics: [
    { id: "search", label: "Returned News Search", usesSearchQuery: true },
  ],
});

const DEFAULT_APP_CONFIG = Object.freeze(
  typeof window.SEAR_CH_DEFAULT_CONFIG === "object" && window.SEAR_CH_DEFAULT_CONFIG
    ? window.SEAR_CH_DEFAULT_CONFIG
    : MINIMAL_APP_CONFIG,
);
const RUNTIME_APP_CONFIG = Object.freeze(
  typeof window.SEAR_CH_CONFIG === "object" && window.SEAR_CH_CONFIG
    ? window.SEAR_CH_CONFIG
    : DEFAULT_APP_CONFIG,
);

function coerceString(value, fallback, { transform = null } = {}) {
  const normalized = String(value ?? fallback).trim() || String(fallback).trim();
  return typeof transform === "function" ? transform(normalized) : normalized;
}

function coerceFiniteNumber(value, fallback) {
  const candidate = Number(value);
  return Number.isFinite(candidate) ? candidate : fallback;
}

function normalizeKeywordList(value) {
  return Array.isArray(value)
    ? value
      .map((keyword) => coerceString(keyword, "", { transform: (entry) => entry.toLowerCase() }))
      .filter(Boolean)
    : [];
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeNewsTopics(value) {
  const rawTopics = Array.isArray(value) && value.length
    ? value
    : DEFAULT_APP_CONFIG.newsTopics;
  const topics = [];
  const seenIds = new Set();

  rawTopics.forEach((topic) => {
    const id = coerceString(topic?.id, "", { transform: (entry) => entry.toLowerCase() });
    const label = coerceString(topic?.label, "");
    if (!id || !label || seenIds.has(id)) {
      return;
    }

    seenIds.add(id);
    topics.push(Object.freeze({
      id,
      label,
      query: coerceString(topic?.query, ""),
      usesSearchQuery: Boolean(topic?.usesSearchQuery),
      keywords: Object.freeze(normalizeKeywordList(topic?.keywords)),
    }));
  });

  if (topics.length) {
    return Object.freeze(topics);
  }

  return Object.freeze([
    Object.freeze({
      id: "search",
      label: "Returned News Search",
      query: "",
      usesSearchQuery: true,
      keywords: Object.freeze([]),
    }),
  ]);
}

const APP_NAME = coerceString(RUNTIME_APP_CONFIG.appName, DEFAULT_APP_CONFIG.appName);
const DISPLAY_APP_NAME = coerceString(
  RUNTIME_APP_CONFIG.displayAppName,
  DEFAULT_APP_CONFIG.displayAppName,
);
const DEFAULT_META_DESCRIPTION = coerceString(
  RUNTIME_APP_CONFIG.metaDescription,
  DEFAULT_APP_CONFIG.metaDescription,
);
const PREFERENCES_KEY = coerceString(
  RUNTIME_APP_CONFIG.preferencesKey,
  DEFAULT_APP_CONFIG.preferencesKey,
);
const THEME_COLOR_LIGHT = coerceString(
  RUNTIME_APP_CONFIG.themeColorLight,
  DEFAULT_APP_CONFIG.themeColorLight,
);
const THEME_COLOR_DARK = coerceString(
  RUNTIME_APP_CONFIG.themeColorDark,
  DEFAULT_APP_CONFIG.themeColorDark,
);
const DEFAULT_ZIP_CODE = coerceString(
  RUNTIME_APP_CONFIG.defaultZipCode,
  DEFAULT_APP_CONFIG.defaultZipCode,
  { transform: (value) => value.replace(/\D/g, "").slice(0, 5) },
);
const ZIP_CODE_PATTERN = /^\d{5}$/;
const DEFAULT_SEARXNG_URL = coerceString(
  RUNTIME_APP_CONFIG.defaultSearxngUrl,
  DEFAULT_APP_CONFIG.defaultSearxngUrl,
);
const ZIP_ANCHOR_COUNTRY_CODE = coerceString(
  RUNTIME_APP_CONFIG.zipAnchorCountryCode,
  DEFAULT_APP_CONFIG.zipAnchorCountryCode,
  { transform: (value) => value.toLowerCase() },
);
const LOCAL_DISTANCE_MAP_MILES = coerceFiniteNumber(
  RUNTIME_APP_CONFIG.localDistanceMapMiles,
  DEFAULT_APP_CONFIG.localDistanceMapMiles,
);
const LOCAL_DISTANCE_NEARBY_MILES = coerceFiniteNumber(
  RUNTIME_APP_CONFIG.localDistanceNearbyMiles,
  DEFAULT_APP_CONFIG.localDistanceNearbyMiles,
);
const LOCAL_DISTANCE_REGIONAL_MILES = coerceFiniteNumber(
  RUNTIME_APP_CONFIG.localDistanceRegionalMiles,
  DEFAULT_APP_CONFIG.localDistanceRegionalMiles,
);
const NEWS_TOPICS = normalizeNewsTopics(RUNTIME_APP_CONFIG.newsTopics);
const DEFAULT_NEWS_TOPIC = NEWS_TOPICS[0]?.id || "search";
const VIEW_TO_CATEGORY = Object.freeze({
  general: "general",
  images: "images",
  news: "news",
  maps: "map",
});
const LOCAL_INTENT_TERMS = Object.freeze([
  "near me",
  "nearby",
  "closest",
  "nearest",
  "around me",
  "in my area",
  "in town",
  "local",
  "location",
  "locations",
  "directions",
  "hours",
  "open now",
  "open late",
  "open 24 hours",
  "24 hour",
  "24 hours",
  "walk in",
  "same day",
  "appointment",
  "weather",
  "forecast",
  "traffic",
  "store",
  "stores",
  "shop",
  "shops",
  "shopping",
  "retailer",
  "outlet",
  "mall",
  "market",
  "supermarket",
  "grocery",
  "groceries",
  "farmers market",
  "convenience store",
  "liquor store",
  "smoke shop",
  "vape shop",
  "dispensary",
  "pharmacy",
  "drugstore",
  "hardware",
  "home improvement",
  "garden center",
  "nursery",
  "furniture store",
  "appliance store",
  "electronics store",
  "computer repair",
  "phone repair",
  "game store",
  "toy store",
  "bookstore",
  "thrift store",
  "consignment",
  "clothing store",
  "shoe store",
  "jewelry store",
  "pet store",
  "feed store",
  "auto parts",
  "tire shop",
  "restaurant",
  "restaurants",
  "food",
  "takeout",
  "delivery",
  "drive thru",
  "cafe",
  "coffee",
  "diner",
  "bakery",
  "brunch",
  "breakfast",
  "lunch",
  "dinner",
  "pizza",
  "burger",
  "burgers",
  "tacos",
  "mexican",
  "chinese",
  "sushi",
  "thai",
  "indian",
  "barbecue",
  "bbq",
  "bar",
  "bars",
  "pub",
  "brewery",
  "winery",
  "ice cream",
  "hotel",
  "hotels",
  "motel",
  "motels",
  "lodging",
  "inn",
  "airport",
  "train station",
  "bus station",
  "transit",
  "taxi",
  "rideshare",
  "parking",
  "car rental",
  "hospital",
  "emergency room",
  "urgent care",
  "clinic",
  "doctor",
  "pediatrician",
  "dentist",
  "orthodontist",
  "vet",
  "veterinarian",
  "eye doctor",
  "optometrist",
  "chiropractor",
  "physical therapy",
  "therapist",
  "counseling",
  "mental health",
  "salon",
  "barber",
  "spa",
  "nails",
  "nail salon",
  "massage",
  "gym",
  "fitness",
  "yoga",
  "laundry",
  "dry cleaner",
  "tailor",
  "cleaners",
  "plumber",
  "electrician",
  "hvac",
  "roofer",
  "contractor",
  "handyman",
  "locksmith",
  "pest control",
  "lawn care",
  "landscaper",
  "tree service",
  "moving company",
  "movers",
  "storage",
  "self storage",
  "cleaning service",
  "house cleaning",
  "pool service",
  "appliance repair",
  "library",
  "post office",
  "dmv",
  "courthouse",
  "city hall",
  "police",
  "fire station",
  "school",
  "daycare",
  "preschool",
  "college",
  "university",
  "church",
  "mosque",
  "synagogue",
  "temple",
  "movie theater",
  "theater",
  "museum",
  "park",
  "playground",
  "trail",
  "hiking",
  "beach",
  "pool",
  "bowling",
  "arcade",
  "escape room",
  "zoo",
  "aquarium",
  "stadium",
  "arena",
  "venue",
  "event",
  "events",
  "bank",
  "credit union",
  "atm",
  "accountant",
  "attorney",
  "lawyer",
  "insurance",
  "realtor",
  "real estate",
  "apartment",
  "apartments",
  "rentals",
  "gas",
  "gas station",
  "station",
  "charging station",
  "ev charging",
  "car wash",
  "mechanic",
  "auto repair",
  "oil change",
  "body shop",
  "dealership",
  "towing",
]);
const LOCAL_INTENT_PATTERN = new RegExp(`\\b(${LOCAL_INTENT_TERMS.map(escapeRegExp).join("|")})\\b`, "i");

export const APP_CONFIG = Object.freeze({
  DEFAULT_APP_CONFIG,
  RUNTIME_APP_CONFIG,
  APP_NAME,
  DISPLAY_APP_NAME,
  DEFAULT_META_DESCRIPTION,
  PREFERENCES_KEY,
  THEME_COLOR_LIGHT,
  THEME_COLOR_DARK,
  DEFAULT_ZIP_CODE,
  ZIP_CODE_PATTERN,
  DEFAULT_SEARXNG_URL,
  ZIP_ANCHOR_COUNTRY_CODE,
  LOCAL_DISTANCE_MAP_MILES,
  LOCAL_DISTANCE_NEARBY_MILES,
  LOCAL_DISTANCE_REGIONAL_MILES,
  NEWS_TOPICS,
  DEFAULT_NEWS_TOPIC,
  VIEW_TO_CATEGORY,
  LOCAL_INTENT_PATTERN,
});
