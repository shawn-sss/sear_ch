const DEFAULT_SEAR_CH_CONFIG = Object.freeze({
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
    { id: "top", label: "Top" },
    { id: "us", label: "U.S.", query: "united states", keywords: ["united states", "u.s.", "u.s", "american", "america", "white house", "congress", "washington", "federal"] },
    { id: "world", label: "World", query: "world", keywords: ["world", "global", "international", "overseas", "foreign", "around the world"] },
    { id: "local", label: "Local", query: "local" },
    { id: "business", label: "Business", query: "business", keywords: ["business", "finance", "economy", "economic", "market", "markets", "stock", "stocks", "company", "companies", "earnings", "trade"] },
    { id: "technology", label: "Technology", query: "technology", keywords: ["technology", "tech", "software", "hardware", "ai", "artificial intelligence", "startup", "startups", "cybersecurity", "gadget", "gadgets"] },
    { id: "entertainment", label: "Entertainment", query: "entertainment", keywords: ["entertainment", "movie", "movies", "film", "tv", "television", "music", "celebrity", "celebrities", "streaming", "hollywood"] },
    { id: "sports", label: "Sports", query: "sports", keywords: ["sports", "sport", "game", "games", "team", "teams", "league", "tournament", "playoff", "playoffs", "score", "scores", "season", "football", "basketball", "baseball", "soccer", "tennis", "golf"] },
    { id: "science", label: "Science", query: "science", keywords: ["science", "scientist", "scientists", "research", "study", "studies", "physics", "space", "climate", "astronomy", "biology", "chemistry"] },
    { id: "health", label: "Health", query: "health", keywords: ["health", "medical", "medicine", "healthcare", "hospital", "hospitals", "doctor", "doctors", "patient", "patients", "public health", "vaccine", "vaccines", "disease", "diseases", "wellness"] },
  ],
});

const existingConfig = typeof window.SEAR_CH_CONFIG === "object" && window.SEAR_CH_CONFIG
  ? window.SEAR_CH_CONFIG
  : {};

window.SEAR_CH_DEFAULT_CONFIG = DEFAULT_SEAR_CH_CONFIG;
window.SEAR_CH_CONFIG = Object.freeze({
  ...DEFAULT_SEAR_CH_CONFIG,
  ...existingConfig,
});
