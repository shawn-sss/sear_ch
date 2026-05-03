import { fetchJson as requestJson } from "./app/api.js";
import { APP_CONFIG } from "./app/config.js";
import { DOM } from "./app/dom.js";
import { escapeHtml } from "./app/html.js";

const {
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
} = APP_CONFIG;

const {
  shell,
  hero,
  resultsShell,
  resultsLayout,
  resultsStage,
  resultsRoot,
  resultsSidebar,
  refinementRail,
  resultsSummary,
  resultsCorrection,
  newsTopicStrip,
  activeFilters,
  newsRail,
  newsCard,
  newsHeading,
  socialRail,
  socialCard,
  socialHeading,
  imageRail,
  imagesCard,
  imagesHeading,
  aiSourcesSection,
  aiSourcesCard,
  aiSourcesList,
  resultsSidebarStack,
  viewSidebarCard,
  infoCard,
  infoHeading,
  infoLink,
  infoMeta,
  infoDescription,
  infoMediaShell,
  placesCard,
  placesHeading,
  placesList,
  placesLink,
  sidebarMapShell,
  pagination,
  aboutDetail,
  aboutNetworkDetail,
  searxngLink,
  ollamaLink,
  topbarSecondaryNav,
  topbarSettingsNav,
  homeWordmark,
  resultsWordmark,
  heroSearchForm,
  heroSubtitle,
  searchServiceTitle,
  searchServiceMeta,
  aiServiceTitle,
  aiServiceMeta,
  searxngHealth,
  searxngEndpoint,
  searxngCapabilities,
  searxngProfile,
  searxngEngines,
  searxngAutocomplete,
  ollamaHealth,
  ollamaEndpoint,
  ollamaModels,
  ollamaActiveModel,
  ollamaGeneration,
  ollamaContext,
  accessServiceTitle,
  accessServiceMeta,
  aiModelOptions,
  resultsHeading,
  appNameTextElements,
  currentYearElements,
  panelBackdrop,
  imagePreviewBackdrop,
  imagePreviewPanel,
  imagePreviewStage,
  imagePreviewTitle,
  imagePreviewSite,
  imagePreviewDetails,
  imagePreviewUrl,
  imagePreviewSnippet,
  imagePreviewOpen,
  resultDetailsBackdrop,
  resultDetailsPanel,
  resultDetailsSourceIcon,
  resultDetailsSourceName,
  resultDetailsSourceMeta,
  resultDetailsTitle,
  resultDetailsUrl,
  resultDetailsSnippet,
  resultDetailsOpen,
  resultDetailsCopy,
  resultDetailsFacts,
  resultDetailsAbout,
  resultDetailsList,
  resultDetailsStatus,
  providerSelect,
  preferencesForm,
  settingsForm,
  luckyButton,
  zipShells,
  zipToggles,
  zipForms,
  zipEditors,
  zipInputs,
  zipValueDisplays,
  zipStatusElements,
  autocompletePanels,
  panelTriggers,
  resultsViewButtons,
  metaDescription,
  openGraphSiteNameMeta,
  openGraphTitleMeta,
  openGraphDescriptionMeta,
  twitterTitleMeta,
  twitterDescriptionMeta,
  themeColorMeta,
  applicationNameMeta,
  appleMobileWebAppTitleMeta,
  systemThemeMedia,
  searchForms,
  searchInputs,
  searchBoxes,
  searchClearButtons,
  autoLoadButtons,
  aiToggleButtons,
  chatToggleButtons,
  chatPopout,
  chatPanel,
  chatLog,
  chatForm,
  chatInput,
  chatSubmit,
  chatStatus,
  chatCloseButton,
  chatClearButton,
  chatFullscreenButton,
  chatMinimizeButton,
  chatMenuButton,
  chatMenuPanel,
  chatNewButton,
  chatRegenerateButton,
  chatCopyConversationButton,
  chatExportButton,
  chatStopButton,
  chatModelSelect,
  chatContextToggle,
  chatHistoryStorageToggle,
  chatSessionList,
  chatSessionTitle,
} = DOM;

const CHAT_STORAGE_KEY = `${PREFERENCES_KEY}.chat.v1`;
const CHAT_FEATURE_NAME = "AI Chat";
const CHAT_SESSION_LIMIT = 20;
const CHAT_SESSION_MESSAGE_LIMIT = 80;
const CHAT_API_MESSAGE_LIMIT = 16;
const CHAT_API_MESSAGE_CHAR_LIMIT = 2000;
const CHAT_INPUT_CHAR_LIMIT = 300;
const CHAT_CONTEXT_RESULT_LIMIT = 6;
const TOOLTIP_SELECTOR = "[data-tooltip]";
const TOOLTIP_SOURCE_SELECTOR = [
  "[title]",
  ".panel-close",
  ".nav-icon-button",
  ".search-tool",
  ".chat-icon-button",
  ".chat-send-button",
  ".chat-stop-button",
  ".zip-info-button",
].join(",");
const TOOLTIP_EDGE_GAP = 8;
const TOOLTIP_GAP = 9;
const loadedChatState = loadChatState();
const US_STATE_NAME_BY_CODE = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};
const US_STATE_CODE_BY_NAME = Object.fromEntries(
  Object.entries(US_STATE_NAME_BY_CODE).map(([code, name]) => [name.toLowerCase(), code]),
);
const MAP_AREA_PLACE_TYPES = new Set([
  "administrative",
  "borough",
  "city",
  "county",
  "country",
  "hamlet",
  "locality",
  "municipality",
  "neighborhood",
  "neighbourhood",
  "postcode",
  "quarter",
  "region",
  "state",
  "suburb",
  "town",
  "village",
]);
const MAP_SPECIFIC_ADDRESS_FIELDS = [
  "amenity",
  "brand",
  "building",
  "cuisine",
  "healthcare",
  "house_number",
  "leisure",
  "office",
  "operator",
  "road",
  "shop",
  "street",
  "tourism",
];
const ZIP_AREA_FALLBACKS = Object.freeze({
  78701: Object.freeze({
    locality: "Austin",
    region: "TX",
  }),
});
const LOCAL_INTENT_STRONG_PATTERN = /\b(near me|nearby|closest|directions|hours|open now|locations?|stores?)\b/i;
const LOCAL_INTENT_EXCLUSION_PATTERN = /\b(history|historical|origin|origins|wiki|wikipedia|definition|meaning|recipe|recipes|nutrition|calories|ingredients|stock|stocks|share price|ticker|investor|investors|earnings|revenue|annual report|founder|founded|headquarters|corporate|logo|slogan|careers|jobs|franchise|lawsuit)\b/i;
const MAP_ADDRESS_TITLE_SEGMENT_PATTERN = /\b(?:alley|ave|avenue|blvd|boulevard|circle|county|court|ct|dr|drive|hwy|highway|lane|ln|parkway|pkwy|place|pl|plaza|road|rd|route|square|sq|st|street|terrace|trail|trl|way)\b/i;
const AI_SOURCES_SIDEBAR_LIMIT = 3;
const AI_SOURCES_SIDEBAR_MIN_STACK_GAP_PX = 32;
const SERVICE_DURATION_BUBBLE_VISIBLE_MS = 10000;
const SERVICE_DURATION_BUBBLE_FADE_MS = 180;
const SERVICE_DURATION_BUBBLE_MS = SERVICE_DURATION_BUBBLE_VISIBLE_MS + SERVICE_DURATION_BUBBLE_FADE_MS;
const SERVICE_DURATION_LIVE_TICK_MS = 100;

const state = {
  health: null,
  query: "",
  literalSearch: false,
  generalWebSearchQuery: "",
  generalWebSearchBias: null,
  page: 1,
  activeView: "general",
  pendingView: "general",
  results: [],
  aiSummary: "",
  aiSummaryLoading: false,
  aiSummarySource: null,
  aiSummarySources: [],
  aiSourcesExpanded: false,
  aiSectionExpanded: false,
  newsAiSummary: "",
  newsAiSummaryLoading: false,
  newsAiSummaryKey: "",
  newsAiSummarySources: [],
  newsAiSummaryResultCount: 0,
  newsAiSummaryAbortController: null,
  infoResult: null,
  railNews: [],
  railSocial: [],
  railImages: [],
  mapResults: [],
  newsTopic: DEFAULT_NEWS_TOPIC,
  newsBaseQuery: "",
  querySuggestions: [],
  loading: false,
  preferences: loadPreferences(),
  searchServiceFailureCount: 0,
  aiServiceFailureCount: 0,
  searchServiceTemporarilyDisabled: false,
  aiTemporarilyDisabledBySystem: false,
  searchRequestId: 0,
  searchAbortController: null,
  autocompleteRequestId: 0,
  autocompleteTimer: null,
  autocompleteAbortController: null,
  autocompleteQuery: "",
  autocompleteSuggestions: [],
  autocompleteActiveInput: null,
  autocompleteIntentInput: null,
  autocompleteFocusSuppressInput: null,
  autocompleteFocusSuppressUntil: 0,
  autocompleteKeyboardFocusUntil: 0,
  zipAnchor: null,
  selectedMapResultId: "",
  pagination: {
    pageResultCount: 0,
    totalResults: 0,
    totalResultsKnown: false,
    hasNextPage: null,
    probing: false,
  },
  infiniteScroll: {
    nextPage: 2,
    hasMore: false,
    loading: false,
    exhausted: false,
    emptyAttempts: 0,
    reentryRequired: false,
    seenKeys: new Set(),
    abortController: null,
  },
  aiSummaryContext: {
    key: "",
    data: null,
  },
  aiSummaryAbortController: null,
  generalSidebarContext: {
    key: "",
    data: null,
  },
  chatSessions: loadedChatState.sessions,
  activeChatSessionId: loadedChatState.activeSessionId,
  chatMessages: loadedChatState.activeMessages,
  chatLoading: false,
  chatAbortController: null,
  chatFullscreen: false,
};

const serviceDurationTrackers = {
  search: {
    startedAt: 0,
    hideTimer: 0,
    tickTimer: 0,
    bubbleId: 0,
    outcome: "pending",
    releasePauseOnNextBubble: false,
    pauseReleaseBubbleId: 0,
  },
  ai: {
    startedAt: 0,
    hideTimer: 0,
    tickTimer: 0,
    bubbleId: 0,
    outcome: "pending",
    releasePauseOnNextBubble: false,
    pauseReleaseBubbleId: 0,
  },
};

const serviceRequestQueue = {
  clientId: createClientId("client"),
  nextSequence: 0,
  aiTail: Promise.resolve(),
  searchIdleWaiters: new Set(),
};

const AUTOCOMPLETE_SUGGESTION_LIMIT = 12;
const AUTOCOMPLETE_QUESTION_LIMIT = 3;
const AUTOCOMPLETE_RELATED_LIMIT = 4;
const AUTOCOMPLETE_FOCUS_SUPPRESS_MS = 600;
const GENERAL_IMAGE_RAIL_LIMIT = 3;
const MAP_TILE_SIZE = 256;
const MAP_VIEWPORT_WIDTH = 960;
const MAP_VIEWPORT_HEIGHT = 560;
const MAP_DEFAULT_ZOOM = 12;
const MAP_ROUTE_MAX_ZOOM = 19;
const PROMOTED_PLACES_LIMIT = 2;
const SEARCH_ICON_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 3a6.5 6.5 0 0 1 5.17 10.45l4.44 4.44-1.42 1.42-4.44-4.44A6.5 6.5 0 1 1 9.5 3Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"/></svg>';
const MAP_KICKER_ICON_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.25 4.4 9 2.9l6 2.7 3.75-1.5A.75.75 0 0 1 19.75 4.8v14.8a.75.75 0 0 1-.47.7L15 22.02l-6-2.7-3.75 1.5a.75.75 0 0 1-1-.7V5.1a.75.75 0 0 1 .47-.7ZM9.75 17.98l4.5 2.02V6.92L9.75 4.9v13.08Zm-1.5-13.24-2.5 1v13.28l2.5-1V4.74Zm7.5 15.02 2.5-1V5.48l-2.5 1v13.28Z"/></svg>';
let imageTopicFitFrame = 0;
let infiniteScrollFrame = 0;
let aiSectionLayoutSyncFrame = 0;
let aiSectionLayoutSyncTimers = [];
const SEARCH_RESULTS_PER_PAGE_LIMIT = 20;
const INFINITE_SCROLL_VIEWS = new Set(["general", "images", "news"]);
const INFINITE_SCROLL_BOTTOM_OFFSET_PX = 900;
const INFINITE_SCROLL_RETRY_DELAY_MS = 1000;
const INFINITE_SCROLL_RETRY_RESULT_TARGETS = Object.freeze([20, 50, 75, 100]);
const AI_SERVICE_RETRY_LIMIT = INFINITE_SCROLL_RETRY_RESULT_TARGETS.length;
const AI_SERVICE_RETRY_DELAY_MS = INFINITE_SCROLL_RETRY_DELAY_MS;
const AI_SECTION_LAYOUT_SETTLE_DELAYS_MS = Object.freeze([80, 240, 520]);
const AUTOCOMPLETE_EXAMPLE_QUERY = "chips";
const AUTOCOMPLETE_EXAMPLE_SUGGESTIONS = Object.freeze([
  "chips snack",
  "chips movie",
  "chips food",
  "chips spicy",
  "chips lay's",
  "chips show",
  "chips doritos",
  "spicy chips",
  "chips cast",
  "chips movie cast",
  "chips packet",
  "chips act",
]);
const AUTOCOMPLETE_EXAMPLE_QUESTIONS = Object.freeze([
  "What commercial says you can't eat just one?",
  "What are the 5 types of chips?",
  "What is the unhealthiest chip to eat?",
]);
const AUTOCOMPLETE_EXAMPLE_RELATED = Object.freeze([
  {
    title: "Potato chips",
    meta: "Food",
    className: "is-potato",
  },
  {
    title: "CHiPs",
    meta: "2017 film",
    className: "is-film",
  },
  {
    title: "Erik Estrada",
    meta: "American actor",
    className: "is-person",
  },
  {
    title: "CHiPs '99",
    meta: "1998 film",
    className: "is-retro",
  },
]);
const SOCIAL_HIGHLIGHT_SOURCES = Object.freeze([
  {
    id: "reddit",
    label: "Reddit",
    searchDomain: "reddit.com",
    domains: Object.freeze(["reddit.com"]),
  },
  {
    id: "youtube",
    label: "YouTube",
    searchDomain: "youtube.com",
    domains: Object.freeze(["youtube.com", "youtu.be"]),
  },
  {
    id: "amazon",
    label: "Amazon",
    searchDomain: "amazon.com",
    domains: Object.freeze(["amazon.com"]),
  },
]);
const AI_SUMMARY_DETAIL_LIMIT = 5;
const AI_SUMMARY_SOURCE_SNIPPET_LIMIT = 420;
const SUBJECT_SUPPORT_RESULT_LIMIT = 10;
const WIKIPEDIA_CONTEXT_DESCRIPTOR_LIMIT = 6;
const WIKIPEDIA_CONTEXT_QUERY_LIMIT = 6;
const WIKIPEDIA_CONTEXT_EVIDENCE_LIMIT = 16;
const AI_SUMMARY_KNOWLEDGE_HOSTS = Object.freeze([
  "wikipedia.org",
  "britannica.com",
  "wikidata.org",
]);
const AI_SUMMARY_DESCRIPTOR_STOPWORDS = new Set([
  "and",
  "about",
  "along",
  "around",
  "after",
  "also",
  "among",
  "any",
  "article",
  "articles",
  "before",
  "between",
  "by",
  "called",
  "digital",
  "family",
  "focus",
  "for",
  "from",
  "history",
  "home",
  "into",
  "known",
  "main",
  "name",
  "one",
  "near",
  "of",
  "official",
  "online",
  "over",
  "page",
  "pages",
  "result",
  "results",
  "search",
  "services",
  "site",
  "than",
  "the",
  "through",
  "to",
  "two",
  "under",
  "using",
  "website",
  "which",
  "with",
  "without",
]);
const SUBJECT_DESCRIPTOR_STOPWORDS = new Set([
  ...AI_SUMMARY_DESCRIPTOR_STOPWORDS,
  "article",
  "articles",
  "best",
  "classic",
  "dictionary",
  "easy",
  "encyclopedia",
  "facts",
  "guide",
  "guides",
  "ideas",
  "including",
  "latest",
  "live",
  "menu",
  "menus",
  "meaning",
  "office",
  "near",
  "open",
  "official",
  "online",
  "opportunities",
  "overview",
  "page",
  "pages",
  "photos",
  "pictures",
  "price",
  "prices",
  "program",
  "programs",
  "recipe",
  "recipes",
  "review",
  "reviews",
  "save",
  "search",
  "service",
  "services",
  "shop",
  "store",
  "stores",
  "success",
  "term",
  "terms",
  "top",
  "vision",
  "wiki",
  "wikipedia",
  "year",
  "years",
]);
const INFO_COMMERCIAL_TOKENS = new Set([
  "book",
  "booking",
  "buy",
  "career",
  "careers",
  "contact",
  "coupon",
  "coupons",
  "delivery",
  "franchise",
  "franchising",
  "gift",
  "gifts",
  "hours",
  "jobs",
  "location",
  "locations",
  "menu",
  "menus",
  "near",
  "official",
  "order",
  "ordering",
  "pickup",
  "reserve",
  "reservation",
  "reservations",
  "restaurant",
  "restaurants",
  "rewards",
  "shop",
  "store",
  "stores",
  "support",
  "ticket",
  "tickets",
]);
const WIKIPEDIA_DISAMBIGUATION_MARKERS = Object.freeze([
  "may refer to",
  "most often refers to",
  "commonly refers to",
  "can refer to",
  "same term",
  "topics referred to by",
  "topics referred to by the same term",
  "refer to:",
  "disambiguation",
]);
const AI_SUMMARY_PREFACE_TOKENS = Object.freeze([
  "okay,",
  "let's",
  "let us",
  "i need",
  "to answer",
  "based on",
  "i'm going",
  "the user",
]);
const AI_SUMMARY_BULLET_PATTERN = /^-\s+/;
const AI_SUMMARY_PROMPT = `Write a concise overview of the searched thing.

Rules:
- Output only the finished overview text.
- Keep it short and direct.
- Use plain text only.
- Use exactly this structure: one lead paragraph, then a heading that says Key Details, then a bullet list.
- Follow the meaning indicated by the selected source.
- If the query is ambiguous, do not switch to a different entity than the selected source describes.
- Write one short overview paragraph, usually 2 to 3 sentences.
- Keep the paragraph natural, factual, and specific to this subject.
- Under Key Details, return 3 to 5 bullet points and never more than 5.
- Each bullet must be one short sentence.
- Choose the most relevant factual details for this specific subject.
- Include dates, release info, current status, or lifecycle details only when they naturally fit the subject.
- Do not force a founding date, ending, discontinuation, or lifecycle framing when it does not fit the subject.
- Use plain readable text for numbers and fractions, such as 4 1/3. Do not use LaTeX, dollar-delimited math, or raw formulas.
- No planning notes, self-instructions, or preambles.
- Do not mention sources, context, searching, or how the answer was produced.
- If the query could mean more than one thing, follow the meaning that best matches the search results and briefly note any uncertainty.
- If an important fact is unavailable, say that briefly instead of guessing.
`;
const AI_QUESTION_PROMPT = `Answer the user's question using only the supplied search evidence.

Rules:
- Output only the direct answer.
- Keep it concise and factual.
- Prefer one short paragraph unless bullets are clearly better.
- Use the searched pages and snippets as evidence, not outside knowledge.
- Use plain readable text for numbers and fractions, such as 4 1/3. Do not use LaTeX, dollar-delimited math, or raw formulas.
- If the evidence is incomplete or conflicting, say what is uncertain.
- Do not mention sources, context, prompts, searching, or how the answer was produced.
`;
const AI_SUMMARY_FALLBACK_TEXT = "AI overview unavailable right now.";
const AI_ANSWER_FALLBACK_TEXT = "AI answer unavailable right now.";
const NEWS_AI_SUMMARY_FALLBACK_TEXT = "AI news brief unavailable right now.";
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const NEWS_AI_PERIODS = Object.freeze([
  Object.freeze({
    id: "past3",
    heading: "Past 3 Days",
    label: "Past 3 days",
    minAgeDays: 0,
    maxAgeDays: 3,
  }),
  Object.freeze({
    id: "otherMonth",
    heading: "Other Events",
    label: "Other events",
    minAgeDays: 3,
    maxAgeDays: 31,
    exclusiveMinAgeDays: true,
  }),
]);
const NEWS_AI_MAX_SNIPPET_CHARS = 220;
const NEWS_AI_SOURCE_HOST = "news.local";

const IMAGE_TOPIC_STOPWORDS = new Set([
  "and",
  "app",
  "article",
  "articles",
  "best",
  "buy",
  "com",
  "company",
  "definition",
  "for",
  "from",
  "game",
  "games",
  "gift",
  "guide",
  "how",
  "image",
  "images",
  "in",
  "its",
  "latest",
  "logo",
  "news",
  "official",
  "online",
  "photo",
  "photos",
  "pic",
  "pics",
  "price",
  "prices",
  "quote",
  "released",
  "review",
  "reviews",
  "shop",
  "stock",
  "story",
  "the",
  "their",
  "this",
  "today",
  "top",
  "update",
  "video",
  "videos",
  "what",
  "why",
  "with",
  "you",
  "youtube",
]);

const NEWS_QUERY_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "latest",
  "news",
  "of",
  "on",
  "or",
  "stories",
  "story",
  "the",
  "to",
  "with",
]);

let lastPanelTrigger = null;
let lastImagePreviewTrigger = null;
let activeImagePreviewIndex = -1;
let lastResultDetailsTrigger = null;
let lastChatTrigger = null;
let pendingPreferenceSave = null;
let pendingPreferenceForm = null;
let resultsFloatingPanelSyncFrame = 0;
let resultDetailsCloseTimer = 0;
let resultDetailsPanelSyncFrame = 0;
let chatCloseTimer = 0;
let appTooltip = null;
let activeTooltipTarget = null;
let tooltipFrame = 0;
let suppressedTooltipFocusTarget = null;

const RESULTS_FLOATING_PANEL_MIN_BOTTOM_PX = 12;
const RESULT_DETAILS_OPEN_CLASS = "is-open";
const RESULT_DETAILS_TRANSITION_MS = 260;
const RESULT_DETAILS_PANEL_MIN_TOP_PX = 12;
const RESULT_DETAILS_PANEL_MIN_BOTTOM_PX = RESULTS_FLOATING_PANEL_MIN_BOTTOM_PX;
const RESULT_DETAILS_PANEL_MIN_VISIBLE_HEIGHT_PX = 220;
const IMAGE_PREVIEW_PANEL_MIN_TOP_PX = 10;
const IMAGE_PREVIEW_PANEL_MIN_BOTTOM_PX = RESULTS_FLOATING_PANEL_MIN_BOTTOM_PX;
const IMAGE_PREVIEW_PANEL_MIN_VISIBLE_HEIGHT_PX = 380;
const CHAT_OPEN_CLASS = "is-open";
const CHAT_TRANSITION_MS = 220;

function getServiceKindForUrl(url) {
  const rawUrl = String(url || "");
  if (rawUrl.startsWith("/api/search")) {
    return "search";
  }
  if (rawUrl.startsWith("/api/assist") || rawUrl.startsWith("/api/chat")) {
    return "ai";
  }
  return "";
}

function createAbortError() {
  const abortError = new Error("Request aborted.");
  abortError.name = "AbortError";
  return abortError;
}

function throwIfServiceRequestAborted(signal) {
  if (signal?.aborted) {
    throw createAbortError();
  }
}

function createServiceRequestMeta(serviceKind) {
  if (!serviceKind) {
    return null;
  }

  serviceRequestQueue.nextSequence += 1;
  const sequence = serviceRequestQueue.nextSequence;
  return {
    serviceKind,
    sequence,
    requestId: `${serviceRequestQueue.clientId}-${serviceKind}-${sequence}`,
  };
}

function withServiceRequestHeaders(options = {}, meta = null) {
  if (!meta) {
    return options;
  }

  const nextOptions = { ...options };
  const headers = new Headers(nextOptions.headers || {});
  headers.set("X-Sear-Client-Id", serviceRequestQueue.clientId);
  headers.set("X-Sear-Request-Id", meta.requestId);
  headers.set("X-Sear-Request-Sequence", String(meta.sequence));
  headers.set("X-Sear-Service-Kind", meta.serviceKind);
  nextOptions.headers = headers;
  return nextOptions;
}

function waitForAbortablePromise(promise, signal) {
  throwIfServiceRequestAborted(signal);

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      signal?.removeEventListener?.("abort", onAbort);
    };
    const onAbort = () => {
      cleanup();
      reject(createAbortError());
    };

    signal?.addEventListener?.("abort", onAbort, { once: true });
    promise.then(
      (value) => {
        cleanup();
        resolve(value);
      },
      (error) => {
        cleanup();
        reject(error);
      },
    );
  });
}

function isSearchServiceQueueBusy() {
  return isSearchServiceActive();
}

function resolveSearchIdleWaiters() {
  if (isSearchServiceQueueBusy() || !serviceRequestQueue.searchIdleWaiters.size) {
    return;
  }

  const waiters = Array.from(serviceRequestQueue.searchIdleWaiters);
  serviceRequestQueue.searchIdleWaiters.clear();
  waiters.forEach((waiter) => {
    waiter.resolve();
  });
}

function waitForSearchServiceIdle(signal) {
  throwIfServiceRequestAborted(signal);
  if (!isSearchServiceQueueBusy()) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const waiter = {
      resolve: () => {
        cleanup();
        resolve();
      },
      reject: (error) => {
        cleanup();
        reject(error);
      },
    };
    const cleanup = () => {
      signal?.removeEventListener?.("abort", onAbort);
      serviceRequestQueue.searchIdleWaiters.delete(waiter);
    };
    const onAbort = () => {
      waiter.reject(createAbortError());
    };

    serviceRequestQueue.searchIdleWaiters.add(waiter);
    signal?.addEventListener?.("abort", onAbort, { once: true });
    resolveSearchIdleWaiters();
  });
}

async function runQueuedAiServiceRequest(task, signal) {
  const previousAiRequest = serviceRequestQueue.aiTail.catch(() => {});
  let releaseAiSlot = () => {};
  serviceRequestQueue.aiTail = new Promise((resolve) => {
    releaseAiSlot = resolve;
  });

  try {
    await waitForAbortablePromise(previousAiRequest, signal);
    await waitForSearchServiceIdle(signal);
    throwIfServiceRequestAborted(signal);
    return await task();
  } finally {
    releaseAiSlot();
  }
}

function syncServiceActivityButtons(serviceKind) {
  if (!serviceKind || serviceKind === "search") {
    syncAutoLoadButtons();
  }
  if (!serviceKind || serviceKind === "ai") {
    syncAiToggleButtons();
  }
}

function getServiceDurationButtons(serviceKind) {
  if (serviceKind === "search") {
    return autoLoadButtons;
  }
  if (serviceKind === "ai") {
    return aiToggleButtons;
  }
  return [];
}

function isServiceTemporarilyPaused(serviceKind) {
  if (serviceKind === "search") {
    return state.searchServiceTemporarilyDisabled;
  }
  if (serviceKind === "ai") {
    return state.aiTemporarilyDisabledBySystem;
  }
  return false;
}

function clearTemporaryServicePauseRelease(serviceKind) {
  const tracker = serviceDurationTrackers[serviceKind];
  if (!tracker) {
    return;
  }

  tracker.releasePauseOnNextBubble = false;
  tracker.pauseReleaseBubbleId = 0;
}

function armTemporaryServicePauseRelease(serviceKind) {
  const tracker = serviceDurationTrackers[serviceKind];
  if (!tracker) {
    return;
  }

  tracker.releasePauseOnNextBubble = true;
  tracker.pauseReleaseBubbleId = 0;
}

function clearServiceDurationBubble(serviceKind) {
  const tracker = serviceDurationTrackers[serviceKind];
  if (tracker?.hideTimer) {
    window.clearTimeout(tracker.hideTimer);
    tracker.hideTimer = 0;
  }
  if (tracker?.tickTimer) {
    window.clearInterval(tracker.tickTimer);
    tracker.tickTimer = 0;
  }

  getServiceDurationButtons(serviceKind).forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    button.classList.remove(
      "has-service-duration-bubble",
      "is-service-duration-running",
      "is-service-duration-complete",
      "service-duration-success",
      "service-duration-failure",
    );
    delete button.dataset.serviceDuration;
  });
}

function resetServiceDurationTracking(serviceKind) {
  const tracker = serviceDurationTrackers[serviceKind];
  if (!tracker) {
    return;
  }

  tracker.startedAt = 0;
  tracker.outcome = "pending";
  clearServiceDurationBubble(serviceKind);
}

function formatServiceDurationLabel(durationMs) {
  const seconds = Math.max(0, Number(durationMs || 0) / 1000);
  if (!Number.isFinite(seconds)) {
    return "0s";
  }

  if (seconds < 10) {
    const roundedTenths = Math.round(seconds * 10) / 10;
    return `${Number.isInteger(roundedTenths) ? roundedTenths.toFixed(0) : roundedTenths.toFixed(1)}s`;
  }

  return `${Math.round(seconds)}s`;
}

function updateServiceDurationBubbleLabel(serviceKind, durationMs) {
  const durationLabel = formatServiceDurationLabel(durationMs);
  getServiceDurationButtons(serviceKind).forEach((button) => {
    if (button instanceof HTMLButtonElement) {
      button.dataset.serviceDuration = durationLabel;
    }
  });
}

function markServiceDurationOutcome(serviceKind, outcome = "success") {
  const tracker = serviceDurationTrackers[serviceKind];
  if (!tracker) {
    return;
  }

  const normalizedOutcome = outcome === "failure"
    ? "failure"
    : (outcome === "aborted" ? "aborted" : "success");
  if (normalizedOutcome === "failure" || tracker.outcome === "pending") {
    tracker.outcome = normalizedOutcome;
  }
}

function startServiceDurationBubble(serviceKind) {
  const tracker = serviceDurationTrackers[serviceKind];
  if (!tracker) {
    return;
  }

  clearServiceDurationBubble(serviceKind);
  tracker.bubbleId += 1;
  tracker.outcome = "pending";
  updateServiceDurationBubbleLabel(serviceKind, 0);

  getServiceDurationButtons(serviceKind).forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    void button.offsetWidth;
    button.classList.add("has-service-duration-bubble", "is-service-duration-running");
  });

  tracker.tickTimer = window.setInterval(() => {
    if (!tracker.startedAt) {
      return;
    }
    updateServiceDurationBubbleLabel(serviceKind, performance.now() - tracker.startedAt);
  }, SERVICE_DURATION_LIVE_TICK_MS);
}

function showServiceDurationBubble(serviceKind, durationMs, outcome = "success") {
  const tracker = serviceDurationTrackers[serviceKind];
  if (!tracker) {
    return;
  }

  clearServiceDurationBubble(serviceKind);
  tracker.bubbleId += 1;
  const bubbleId = tracker.bubbleId;
  const normalizedOutcome = outcome === "failure"
    ? "failure"
    : (outcome === "success" ? "success" : "neutral");
  updateServiceDurationBubbleLabel(serviceKind, durationMs);
  if (isServiceTemporarilyPaused(serviceKind) || tracker.releasePauseOnNextBubble) {
    tracker.pauseReleaseBubbleId = bubbleId;
    tracker.releasePauseOnNextBubble = false;
  }

  getServiceDurationButtons(serviceKind).forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    void button.offsetWidth;
    button.classList.add("has-service-duration-bubble", "is-service-duration-complete");
    if (normalizedOutcome !== "neutral") {
      button.classList.add(`service-duration-${normalizedOutcome}`);
    }
  });

  tracker.hideTimer = window.setTimeout(() => {
    if (tracker.bubbleId !== bubbleId) {
      return;
    }
    const shouldReleasePause = tracker.pauseReleaseBubbleId === bubbleId;
    clearServiceDurationBubble(serviceKind);
    if (shouldReleasePause) {
      releaseTemporaryServicePause(serviceKind);
    }
  }, SERVICE_DURATION_BUBBLE_MS);
}

function trackServiceDuration(serviceKind, isActive) {
  const tracker = serviceDurationTrackers[serviceKind];
  if (!tracker) {
    return;
  }

  if (isActive) {
    if (!tracker.startedAt) {
      tracker.startedAt = performance.now();
      startServiceDurationBubble(serviceKind);
    }
    return;
  }

  if (!tracker.startedAt) {
    return;
  }

  const durationMs = performance.now() - tracker.startedAt;
  const outcome = tracker.outcome === "failure"
    ? "failure"
    : (tracker.outcome === "success" ? "success" : "neutral");
  tracker.startedAt = 0;
  showServiceDurationBubble(serviceKind, durationMs, outcome);
}

async function requestJsonWithAiRetries(url, options = {}) {
  let lastError = null;
  const retryLimit = Math.max(1, AI_SERVICE_RETRY_LIMIT);

  for (let attemptIndex = 0; attemptIndex < retryLimit; attemptIndex += 1) {
    if (options.signal?.aborted) {
      throw createAbortError();
    }

    if (attemptIndex > 0) {
      await wait(AI_SERVICE_RETRY_DELAY_MS);
      if (options.signal?.aborted) {
        throw createAbortError();
      }
    }

    try {
      const payload = await requestJson(url, options);
      state.aiServiceFailureCount = 0;
      return payload;
    } catch (error) {
      if (error?.name === "AbortError") {
        throw error;
      }

      lastError = error;
      state.aiServiceFailureCount = attemptIndex + 1;
      if (state.aiServiceFailureCount >= retryLimit) {
        temporarilyPauseAiService({
          currentSignal: options.signal || null,
        });
        throw error;
      }
    }
  }

  throw lastError || new Error("AI request failed.");
}

async function fetchJson(url, options = {}) {
  const serviceKind = getServiceKindForUrl(url);
  const serviceMeta = createServiceRequestMeta(serviceKind);
  const requestOptions = withServiceRequestHeaders(options, serviceMeta);
  syncServiceActivityButtons(serviceKind);

  try {
    if (serviceKind === "ai") {
      const payload = await runQueuedAiServiceRequest(
        () => requestJsonWithAiRetries(url, requestOptions),
        requestOptions.signal || null,
      );
      markServiceDurationOutcome(serviceKind, "success");
      return payload;
    }
    const payload = await requestJson(url, requestOptions);
    markServiceDurationOutcome(serviceKind, "success");
    return payload;
  } catch (error) {
    if (serviceKind) {
      markServiceDurationOutcome(serviceKind, error?.name === "AbortError" ? "aborted" : "failure");
    }
    if (serviceKind === "search" && error?.name !== "AbortError") {
      temporarilyPauseSearchService();
    }
    throw error;
  } finally {
    syncServiceActivityButtons(serviceKind);
  }
}

function applyAppShellConfig() {
  appNameTextElements.forEach((element) => {
    element.textContent = DISPLAY_APP_NAME;
  });

  if (heroSubtitle) {
    heroSubtitle.textContent = "";
  }
  if (applicationNameMeta) {
    applicationNameMeta.setAttribute("content", APP_NAME);
  }
  if (appleMobileWebAppTitleMeta) {
    appleMobileWebAppTitleMeta.setAttribute("content", APP_NAME);
  }
  if (topbarSecondaryNav) {
    topbarSecondaryNav.setAttribute("aria-label", `${APP_NAME} secondary`);
  }
  if (topbarSettingsNav) {
    topbarSettingsNav.setAttribute("aria-label", `${APP_NAME} controls`);
  }
  if (homeWordmark instanceof HTMLAnchorElement) {
    homeWordmark.setAttribute("aria-label", `${APP_NAME} home`);
  }
  if (resultsWordmark instanceof HTMLAnchorElement) {
    resultsWordmark.setAttribute("aria-label", `${APP_NAME} home`);
  }
  if (heroSearchForm instanceof HTMLFormElement) {
    heroSearchForm.setAttribute("aria-label", `Search the web with ${APP_NAME}`);
  }
  if (resultsHeading) {
    resultsHeading.textContent = `${APP_NAME} search results`;
  }
}

function normalizeThemePreference(value) {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : "system";
}

function normalizeAiPreference(value) {
  if (value === false || value === "false" || value === "0" || value === "off" || value === "disabled") {
    return false;
  }

  return true;
}

function normalizeAutoLoadPreference(value) {
  if (value === false || value === "false" || value === "0" || value === "off" || value === "disabled") {
    return false;
  }

  return true;
}

function normalizeAiOverviewExpandedPreference(value) {
  return value === true || value === "true" || value === "1" || value === "on" || value === "enabled";
}

function normalizeChatHistoryStoragePreference(value) {
  return value === "browser" || value === "save" || value === "saved" || value === "enabled"
    ? "browser"
    : "memory";
}

function shouldPersistChatHistory(preferences = {}) {
  return normalizeChatHistoryStoragePreference(preferences?.chatHistoryStorage) !== "memory";
}

function normalizeAiModelPreference(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function aiModelNamesMatch(requestedModel, availableModel) {
  const requested = normalizeAiModelPreference(requestedModel);
  const available = normalizeAiModelPreference(availableModel);
  if (!requested || !available) {
    return false;
  }
  if (requested === available) {
    return true;
  }

  const [requestedName, requestedTag = "latest"] = requested.split(":");
  const [availableName, availableTag = "latest"] = available.split(":");
  return requestedName === availableName && requestedTag === availableTag;
}

function normalizeResultsView(value) {
  if (value === "all") {
    return "general";
  }

  return value === "general" || value === "images" || value === "news" || value === "maps"
    ? value
    : "general";
}

function normalizeEnginesPreference(value) {
  const seen = new Set();

  return String(value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => {
      if (!entry || seen.has(entry)) {
        return false;
      }
      seen.add(entry);
      return true;
    })
    .join(",");
}

function normalizeTimeRangePreference(value) {
  return value === "day" || value === "month" || value === "year"
    ? value
    : "";
}

function normalizeAutocompleteProviderPreference(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "").slice(0, 40);
}

function normalizeNumberPreference(value, fallback, { min = -Infinity, max = Infinity, decimals = null } = {}) {
  const parsed = Number(value);
  const fallbackValue = Number(fallback);
  const safeFallback = Number.isFinite(fallbackValue) ? fallbackValue : 0;
  if (!Number.isFinite(parsed)) {
    return safeFallback;
  }
  const clamped = Math.min(max, Math.max(min, parsed));
  return Number.isInteger(decimals) ? Number(clamped.toFixed(decimals)) : clamped;
}

function normalizeAiTemperaturePreference(value, fallback = 0.2) {
  return normalizeNumberPreference(value, fallback, {
    min: 0,
    max: 2,
    decimals: 2,
  });
}

function normalizeAutocompleteMinCharsPreference(value, fallback = 3) {
  return Math.round(normalizeNumberPreference(value, fallback, {
    min: 1,
    max: 10,
  }));
}

function normalizeAutocompleteLimitPreference(value, fallback = 8) {
  return Math.round(normalizeNumberPreference(value, fallback, {
    min: 1,
    max: 20,
  }));
}

function normalizeAiNumPredictPreference(value, fallback = 240) {
  return Math.round(normalizeNumberPreference(value, fallback, {
    min: 32,
    max: 4096,
  }));
}

function normalizeAiSourceLimitPreference(value, fallback = 5) {
  return Math.round(normalizeNumberPreference(value, fallback, {
    min: 1,
    max: 10,
  }));
}

function formatTimeRangeLabel(value) {
  if (value === "day") {
    return "Past day";
  }
  if (value === "month") {
    return "Past month";
  }
  if (value === "year") {
    return "Past year";
  }
  return "Any time";
}

function mapCategoryToView(value) {
  if (value === "images") {
    return "images";
  }
  if (value === "news") {
    return "news";
  }
  if (value === "map" || value === "maps") {
    return "maps";
  }
  return "general";
}

function getCategoryForView(view = state.activeView) {
  return VIEW_TO_CATEGORY[normalizeResultsView(view)] || VIEW_TO_CATEGORY.general;
}

function hasMapCoordinates(result) {
  return Number.isFinite(Number(result?.latitude)) && Number.isFinite(Number(result?.longitude));
}

function looksLikeLocalIntent(query = state.query) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) {
    return false;
  }

  const hasLocalSignal = LOCAL_INTENT_PATTERN.test(normalizedQuery)
    || LOCAL_INTENT_STRONG_PATTERN.test(normalizedQuery);
  if (!hasLocalSignal) {
    return false;
  }

  return LOCAL_INTENT_STRONG_PATTERN.test(normalizedQuery)
    || !LOCAL_INTENT_EXCLUSION_PATTERN.test(normalizedQuery);
}

function normalizeZipCode(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 5);
}

function isValidZipCode(value) {
  return ZIP_CODE_PATTERN.test(String(value || ""));
}

function resolveZipCodePreference(value, fallback = DEFAULT_ZIP_CODE) {
  const normalizedValue = normalizeZipCode(value);
  if (isValidZipCode(normalizedValue)) {
    return normalizedValue;
  }

  const normalizedFallback = normalizeZipCode(fallback);
  return isValidZipCode(normalizedFallback) ? normalizedFallback : DEFAULT_ZIP_CODE;
}

function getZipCodeBias() {
  return resolveZipCodePreference(getEffectivePreferences().zipCode, DEFAULT_ZIP_CODE);
}

function getZipAnchorLabel() {
  return state.zipAnchor?.label || getZipCodeBias();
}

function getZipAreaFallback(zipCode = getZipCodeBias()) {
  return ZIP_AREA_FALLBACKS[resolveZipCodePreference(zipCode, DEFAULT_ZIP_CODE)] || null;
}

function getZipAnchorLocality(zipCode = state.zipAnchor?.zipCode || getZipCodeBias()) {
  const normalizedZipCode = resolveZipCodePreference(zipCode, DEFAULT_ZIP_CODE);
  const anchorMatchesZip = state.zipAnchor?.zipCode === normalizedZipCode;
  return String((anchorMatchesZip ? state.zipAnchor?.locality : "") || getZipAreaFallback(normalizedZipCode)?.locality || "").trim();
}

function getZipAnchorRegion(zipCode = state.zipAnchor?.zipCode || getZipCodeBias()) {
  const normalizedZipCode = resolveZipCodePreference(zipCode, DEFAULT_ZIP_CODE);
  const anchorMatchesZip = state.zipAnchor?.zipCode === normalizedZipCode;
  return String((anchorMatchesZip ? state.zipAnchor?.region : "") || getZipAreaFallback(normalizedZipCode)?.region || "").trim();
}

function getSavedAreaTerms() {
  const locality = getZipAnchorLocality();
  const region = getZipAnchorRegion();
  return [locality, region].filter(Boolean);
}

function getSavedAreaLabel() {
  const terms = getSavedAreaTerms();
  if (terms.length) {
    return `${terms.join(", ")} ${getZipCodeBias()}`.trim();
  }

  const zipCode = getZipAnchorLabel();
  return zipCode ? `ZIP ${zipCode}` : "";
}

function syncZipDisplays(value) {
  const nextValue = resolveZipCodePreference(value, getZipCodeBias());
  zipValueDisplays.forEach((display) => {
    display.textContent = nextValue;
  });
}

function syncZipInputs(value, { source = null } = {}) {
  const nextValue = resolveZipCodePreference(value, getZipCodeBias());
  zipInputs.forEach((input) => {
    if (source && input === source) {
      return;
    }
    if (input.value === nextValue) {
      return;
    }
    input.value = nextValue;
  });
  syncZipDisplays(nextValue);
}

function clearZipStatus({ form = null } = {}) {
  zipStatusElements.forEach((status) => {
    if (!(status instanceof HTMLElement)) {
      return;
    }
    if (form && !form.contains(status)) {
      return;
    }

    status.textContent = "";
    status.hidden = true;
    delete status.dataset.tone;
  });
}

function setZipStatus(message, { form = null, tone = "default" } = {}) {
  const targetStatus = form instanceof HTMLElement
    ? form.querySelector("[data-zip-status]")
    : null;
  if (!(targetStatus instanceof HTMLElement)) {
    return;
  }

  if (!message) {
    clearZipStatus({ form });
    return;
  }

  targetStatus.textContent = message;
  targetStatus.hidden = false;
  targetStatus.dataset.tone = tone;
}

function getPreferredZipShell() {
  const shellName = shell?.dataset.view === "results" ? "topbar" : "hero";
  return document.querySelector(`[data-zip-shell="${shellName}"]`);
}

function hasOpenZipEditor() {
  return zipEditors.some((editor) => editor instanceof HTMLElement && !editor.hidden);
}

function closeZipEditors({ restoreFocus = false } = {}) {
  let focusTarget = null;

  zipShells.forEach((zipShell) => {
    if (!(zipShell instanceof HTMLElement)) {
      return;
    }

    const editor = zipShell.querySelector("[data-zip-editor]");
    const toggle = zipShell.querySelector("[data-zip-toggle]");
    if (editor instanceof HTMLElement && !editor.hidden && toggle instanceof HTMLElement) {
      focusTarget = toggle;
    }

    if (editor instanceof HTMLElement) {
      editor.hidden = true;
      clearZipStatus({ form: editor });
    }

    if (toggle instanceof HTMLElement) {
      toggle.setAttribute("aria-expanded", "false");
    }

    zipShell.classList.remove("is-open");
  });

  if (restoreFocus && focusTarget instanceof HTMLElement) {
    focusTarget.focus();
  }
}

function openZipEditor({ zipShell = getPreferredZipShell(), focus = true, reveal = false } = {}) {
  if (!(zipShell instanceof HTMLElement)) {
    return;
  }

  const editor = zipShell.querySelector("[data-zip-editor]");
  const toggle = zipShell.querySelector("[data-zip-toggle]");
  const input = zipShell.querySelector("[data-zip-input]");
  if (!(editor instanceof HTMLElement) || !(toggle instanceof HTMLElement)) {
    return;
  }

  closeZipEditors();
  zipShell.classList.add("is-open");
  editor.hidden = false;
  toggle.setAttribute("aria-expanded", "true");
  clearZipStatus({ form: editor });

  if (reveal) {
    zipShell.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  if (focus && input instanceof HTMLInputElement) {
    window.requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
  }
}

function toggleZipEditor(zipShell, options = {}) {
  if (!(zipShell instanceof HTMLElement)) {
    return;
  }

  const editor = zipShell.querySelector("[data-zip-editor]");
  if (!(editor instanceof HTMLElement)) {
    return;
  }

  if (!editor.hidden) {
    closeZipEditors({ restoreFocus: true });
    return;
  }

  openZipEditor({
    zipShell,
    focus: options.focus ?? true,
    reveal: options.reveal ?? false,
  });
}

function shouldPromotePlaces() {
  return state.activeView === "general"
    && state.mapResults.length > 0
    && (looksLikeLocalIntent(state.query) || Boolean(getQueryAreaHint(state.query)));
}

function formatPlaceMeta(result) {
  return formatMapResultMeta(result, { includeDistance: false });
}

function getMapAddress(result) {
  return result && typeof result.address === "object" && result.address !== null
    ? result.address
    : {};
}

function getMapAddressValue(result, key) {
  const value = getMapAddress(result)[key];
  return String(value || "").trim();
}

function normalizeMapComparisonValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getUsStateCode(region) {
  const normalizedRegion = String(region || "").trim();
  if (!normalizedRegion) {
    return "";
  }

  const directCode = normalizedRegion
    .replace(/^US[-\s]+/i, "")
    .replace(/\./g, "")
    .trim()
    .toUpperCase();
  if (US_STATE_NAME_BY_CODE[directCode]) {
    return directCode;
  }

  return US_STATE_CODE_BY_NAME[normalizedRegion.toLowerCase()] || "";
}

function parseUsStateRegion(value) {
  const rawValue = String(value || "").trim();
  if (!rawValue) {
    return "";
  }

  const directCode = getUsStateCode(rawValue);
  if (directCode) {
    return directCode;
  }

  const isoMatch = rawValue.match(/\bUS[-\s]?([A-Z]{2})\b/i);
  if (isoMatch && US_STATE_NAME_BY_CODE[isoMatch[1].toUpperCase()]) {
    return isoMatch[1].toUpperCase();
  }

  const commaCodeMatch = rawValue.match(/,\s*([A-Z]{2})(?:\b|$)/i);
  if (commaCodeMatch && US_STATE_NAME_BY_CODE[commaCodeMatch[1].toUpperCase()]) {
    return commaCodeMatch[1].toUpperCase();
  }

  const normalizedValue = normalizeMapComparisonValue(rawValue);
  const stateNameEntry = Object.entries(US_STATE_CODE_BY_NAME).find(([stateName]) => (
    new RegExp(`\\b${escapeRegExp(normalizeMapComparisonValue(stateName))}\\b`).test(normalizedValue)
  ));
  return stateNameEntry ? stateNameEntry[1] : "";
}

function getMapAddressState(result) {
  const directRegion = (
    getMapAddressValue(result, "state")
    || getMapAddressValue(result, "region")
    || getMapAddressValue(result, "state_code")
    || getMapAddressValue(result, "ISO3166-2-lvl4")
  );
  const parsedRegion = parseUsStateRegion(directRegion);
  if (parsedRegion) {
    return parsedRegion;
  }
  return /\bcounty\b/i.test(directRegion) ? "" : directRegion;
}

function parseLocalityFromCityStateText(value) {
  const rawValue = String(value || "").trim();
  const match = rawValue.match(/^([A-Za-z][A-Za-z.\-']*(?:\s+[A-Za-z][A-Za-z.\-']*){0,4}),\s*([^,]+)$/);
  if (!match || !parseUsStateRegion(match[2])) {
    return "";
  }

  return match[1].trim();
}

function isMapTitleAddressSegment(segment, result) {
  const normalizedSegment = normalizeMapComparisonValue(segment);
  if (!normalizedSegment) {
    return false;
  }

  const address = getMapAddress(result);
  const addressValues = [
    address.house_number,
    address.road,
    address.street,
    address.suburb,
    address.neighbourhood,
    address.neighborhood,
    address.city_district,
    address.locality,
    address.city,
    address.town,
    address.village,
    address.municipality,
    address.county,
    address.state,
    address.region,
    address.postcode,
    address.country,
  ].map(normalizeMapComparisonValue).filter(Boolean);

  return /^\d/.test(normalizedSegment)
    || MAP_ADDRESS_TITLE_SEGMENT_PATTERN.test(segment)
    || Boolean(normalizeZipCode(segment))
    || Boolean(parseUsStateRegion(segment))
    || addressValues.includes(normalizedSegment);
}

function getMapTitleFromResultTitle(result) {
  const rawTitle = String(result?.title || "").trim();
  if (!rawTitle) {
    return "";
  }

  const titleParts = rawTitle.split(",").map((part) => part.trim()).filter(Boolean);
  if (titleParts.length <= 1) {
    return rawTitle;
  }

  const nameParts = [];
  for (const part of titleParts) {
    if (nameParts.length && isMapTitleAddressSegment(part, result)) {
      break;
    }
    nameParts.push(part);
  }

  return (nameParts.length ? nameParts : titleParts.slice(0, 1)).join(", ").trim();
}

function getMapPlaceType(result) {
  const rawType = String(result?.place_type || result?.address_label || "").trim();
  if (!rawType) {
    return "";
  }

  return rawType
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getMapDisplayTitle(result) {
  return String(
    getMapAddressValue(result, "name")
      || getMapTitleFromResultTitle(result)
      || "Mapped place",
  ).trim();
}

function formatMapAddress(result, { fallbackToTitle = true, includeCountry = true } = {}) {
  const houseNumber = getMapAddressValue(result, "house_number");
  const road = getMapAddressValue(result, "road");
  const street = [houseNumber, road].filter(Boolean).join(" ");
  const locality = (
    getMapAddressValue(result, "locality")
    || getMapAddressValue(result, "city")
    || getMapAddressValue(result, "town")
    || getMapAddressValue(result, "village")
    || getMapAddressValue(result, "municipality")
  );
  const region = (
    getMapAddressValue(result, "state")
    || getMapAddressValue(result, "region")
    || getMapAddressValue(result, "county")
  );
  const postcode = getMapAddressValue(result, "postcode");
  const country = includeCountry ? getMapAddressValue(result, "country") : "";
  const seen = new Set();
  const parts = [street, locality, region, postcode, country].filter((part) => {
    const normalized = part.toLowerCase();
    if (!normalized || seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });

  if (parts.length) {
    return parts.join(", ");
  }

  const content = String(result?.content || "").trim();
  if (content) {
    return content;
  }

  if (!fallbackToTitle) {
    return "";
  }

  const titleParts = String(result?.title || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return titleParts.slice(1).join(", ");
}

function getMapDistanceMiles(result) {
  if (!hasMapCoordinates(result)) {
    return null;
  }
  if (!state.zipAnchor || !Number.isFinite(state.zipAnchor.latitude) || !Number.isFinite(state.zipAnchor.longitude)) {
    return null;
  }

  return getDistanceMiles(
    Number(state.zipAnchor.latitude),
    Number(state.zipAnchor.longitude),
    Number(result.latitude),
    Number(result.longitude),
  );
}

function formatDistanceMiles(distanceMiles) {
  if (!Number.isFinite(distanceMiles)) {
    return "";
  }
  if (distanceMiles < 0.1) {
    return "under 0.1 mi";
  }
  if (distanceMiles < 10) {
    return `${distanceMiles.toFixed(1)} mi`;
  }
  return `${Math.round(distanceMiles)} mi`;
}

function formatMapDistance(result) {
  return formatDistanceMiles(getMapDistanceMiles(result));
}

function getMapRouteOriginLabel() {
  return getSavedAreaLabel() || `ZIP ${getZipCodeBias()}`;
}

function formatMapRouteSummary(result, { compact = false } = {}) {
  const distance = formatMapDistance(result);
  if (!distance) {
    return "";
  }

  const zipCode = state.zipAnchor?.zipCode || getZipCodeBias();
  const originLabel = compact
    ? (zipCode ? `ZIP ${zipCode}` : "")
    : getMapRouteOriginLabel();
  return originLabel
    ? `${distance} from ${originLabel}`
    : distance;
}

function buildMapRouteSummaryMarkup(result, className = "map-route-summary") {
  const distance = formatMapDistance(result);
  if (!distance) {
    return "";
  }

  const originLabel = getMapRouteOriginLabel();
  return `
    <span class="${escapeHtml(className)}">
      <span class="map-route-distance">${escapeHtml(distance)}</span>
      ${originLabel ? `<span class="map-route-origin">from ${escapeHtml(originLabel)}</span>` : ""}
    </span>
  `;
}

function formatCoordinatePair(result, { precision = 4 } = {}) {
  if (!hasMapCoordinates(result)) {
    return "";
  }

  return `${Number(result.latitude).toFixed(precision)}, ${Number(result.longitude).toFixed(precision)}`;
}

function formatMapResultMeta(result, { includeDistance = true } = {}) {
  const meta = [
    getMapPlaceType(result),
    includeDistance ? formatMapDistance(result) : "",
    result?.source || result?.engine || result?.domain,
  ].filter(Boolean);
  return meta.join(" · ");
}

function getMapResultKey(result, index = -1) {
  const stableKey = String(result?.id || result?.url || "").trim();
  if (stableKey) {
    return stableKey;
  }

  return [
    String(result?.title || "").trim(),
    String(result?.latitude || "").trim(),
    String(result?.longitude || "").trim(),
    index,
  ].join("|");
}

function getSelectedMapResult() {
  if (!state.results.length) {
    return null;
  }

  const selectedResult = state.selectedMapResultId
    ? state.results.find((result, index) => getMapResultKey(result, index) === state.selectedMapResultId)
    : null;
  return selectedResult
    || state.results.find((result) => hasMapCoordinates(result))
    || state.results[0]
    || null;
}

function syncSelectedMapResult() {
  const selectedResult = getSelectedMapResult();
  state.selectedMapResultId = selectedResult
    ? getMapResultKey(selectedResult, state.results.indexOf(selectedResult))
    : "";
  return selectedResult;
}

function getMapOpenUrl(result) {
  const url = String(result?.url || "").trim();
  if (url) {
    return url;
  }
  if (!hasMapCoordinates(result)) {
    return "";
  }

  const latitude = Number(result.latitude);
  const longitude = Number(result.longitude);
  return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(latitude)}&mlon=${encodeURIComponent(longitude)}#map=16/${encodeURIComponent(latitude)}/${encodeURIComponent(longitude)}`;
}

function getPlaceMetadataValue(result, keys = []) {
  const containers = [
    result,
    result?.metadata,
    result?.osm,
    result?.address,
  ].filter((value) => value && typeof value === "object");

  for (const container of containers) {
    for (const key of keys) {
      const value = String(container?.[key] || "").trim();
      if (value) {
        return value;
      }
    }
  }

  return "";
}

function normalizePlaceWebsiteUrl(value) {
  const rawValue = String(value || "").trim();
  if (!rawValue) {
    return "";
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue;
  }

  if (/^[a-z0-9.-]+\.[a-z]{2,}(?:[/?#].*)?$/i.test(rawValue)) {
    return `https://${rawValue}`;
  }

  return "";
}

function getPlaceWebsiteUrl(result) {
  const explicitWebsite = normalizePlaceWebsiteUrl(
    getPlaceMetadataValue(result, [
      "website",
      "homepage",
      "contact:website",
      "url:official",
    ]),
  );
  if (explicitWebsite) {
    return explicitWebsite;
  }

  return "";
}

function formatPlaceWebsiteLabel(url) {
  const host = getHostLabel(url);
  return host || String(url || "").replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

function getPlacePhoneNumber(result) {
  return getPlaceMetadataValue(result, [
    "phone",
    "telephone",
    "contact:phone",
    "contact:mobile",
  ]);
}

function formatPlaceInfoValue(value, fallback = "") {
  const normalizedValue = String(value || "").trim();
  return normalizedValue || fallback;
}

function buildMapDirectionsUrl(result) {
  if (!hasMapCoordinates(result)) {
    return "";
  }

  const destination = `${Number(result.latitude).toFixed(6)}%2C${Number(result.longitude).toFixed(6)}`;
  const hasAnchor = state.zipAnchor
    && Number.isFinite(state.zipAnchor.latitude)
    && Number.isFinite(state.zipAnchor.longitude);
  if (!hasAnchor) {
    return `https://www.openstreetmap.org/directions?to=${destination}`;
  }

  const origin = `${Number(state.zipAnchor.latitude).toFixed(6)}%2C${Number(state.zipAnchor.longitude).toFixed(6)}`;
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${origin}%3B${destination}`;
}

function clampMapLatitude(latitude) {
  return Math.max(-85.05112878, Math.min(85.05112878, Number(latitude)));
}

function projectMapPoint(latitude, longitude, zoom) {
  const scale = MAP_TILE_SIZE * (2 ** zoom);
  const clampedLatitude = clampMapLatitude(latitude);
  const latitudeRadians = (clampedLatitude * Math.PI) / 180;
  const sinLatitude = Math.sin(latitudeRadians);

  return {
    x: ((Number(longitude) + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * scale,
  };
}

function getMapViewportZoom(latitudeSpan, longitudeSpan, resultCount = 1) {
  const span = Math.max(Math.abs(latitudeSpan), Math.abs(longitudeSpan));
  let zoom = MAP_DEFAULT_ZOOM;

  if (span > 8) {
    zoom = 5;
  } else if (span > 4) {
    zoom = 6;
  } else if (span > 2) {
    zoom = 7;
  } else if (span > 1) {
    zoom = 8;
  } else if (span > 0.45) {
    zoom = 9;
  } else if (span > 0.18) {
    zoom = 10;
  } else if (span > 0.08) {
    zoom = 11;
  } else if (span > 0.03) {
    zoom = 12;
  } else {
    zoom = 13;
  }

  return resultCount <= 2 ? Math.min(zoom, MAP_DEFAULT_ZOOM) : zoom;
}

function getMapViewport(results = [], selectedResult = null) {
  const mapResults = (Array.isArray(results) ? results : [])
    .filter((result) => hasMapCoordinates(result))
    .slice(0, 14);
  const coordinates = mapResults.map((result) => ({
    latitude: Number(result.latitude),
    longitude: Number(result.longitude),
  }));

  if (
    state.zipAnchor
    && Number.isFinite(state.zipAnchor.latitude)
    && Number.isFinite(state.zipAnchor.longitude)
    && selectedResult
  ) {
    coordinates.push({
      latitude: Number(state.zipAnchor.latitude),
      longitude: Number(state.zipAnchor.longitude),
    });
  }

  if (!coordinates.length && hasMapCoordinates(selectedResult)) {
    coordinates.push({
      latitude: Number(selectedResult.latitude),
      longitude: Number(selectedResult.longitude),
    });
  }

  if (!coordinates.length) {
    return null;
  }

  const latitudes = coordinates.map((point) => point.latitude);
  const longitudes = coordinates.map((point) => point.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);
  const selectedLatitude = hasMapCoordinates(selectedResult) ? Number(selectedResult.latitude) : null;
  const selectedLongitude = hasMapCoordinates(selectedResult) ? Number(selectedResult.longitude) : null;
  const centerLatitude = selectedLatitude ?? ((minLatitude + maxLatitude) / 2);
  const centerLongitude = selectedLongitude ?? ((minLongitude + maxLongitude) / 2);
  const latitudeSpan = Math.max(maxLatitude - minLatitude, 0.02);
  const longitudeSpan = Math.max(maxLongitude - minLongitude, 0.02);
  const zoom = getMapViewportZoom(latitudeSpan, longitudeSpan, mapResults.length || 1);
  const centerPoint = projectMapPoint(centerLatitude, centerLongitude, zoom);

  return {
    centerLatitude,
    centerLongitude,
    zoom,
    startX: centerPoint.x - (MAP_VIEWPORT_WIDTH / 2),
    startY: centerPoint.y - (MAP_VIEWPORT_HEIGHT / 2),
  };
}

function getRouteViewport(destination) {
  const zipAnchor = getMapZipAnchorPoint();
  if (!zipAnchor || !hasMapCoordinates(destination)) {
    return getMapViewport([destination].filter(Boolean), destination);
  }

  const origin = {
    latitude: Number(zipAnchor.latitude),
    longitude: Number(zipAnchor.longitude),
  };
  const target = {
    latitude: Number(destination.latitude),
    longitude: Number(destination.longitude),
  };
  const centerLatitude = (origin.latitude + target.latitude) / 2;
  const centerLongitude = (origin.longitude + target.longitude) / 2;
  const fitsRoute = (viewport) => {
    const originPosition = getMapViewportPosition(origin, viewport);
    const targetPosition = getMapViewportPosition(target, viewport);
    if (!originPosition || !targetPosition) {
      return false;
    }

    const horizontalMargin = 4;
    const topMargin = 8;
    const bottomMargin = 5;
    return [originPosition, targetPosition].every((position) => (
      position.left >= horizontalMargin
      && position.left <= 100 - horizontalMargin
      && position.top >= topMargin
      && position.top <= 100 - bottomMargin
    ));
  };

  for (let zoom = MAP_ROUTE_MAX_ZOOM; zoom >= 3; zoom -= 1) {
    const originPoint = projectMapPoint(origin.latitude, origin.longitude, zoom);
    const targetPoint = projectMapPoint(target.latitude, target.longitude, zoom);
    const centerPoint = {
      x: (originPoint.x + targetPoint.x) / 2,
      y: (originPoint.y + targetPoint.y) / 2,
    };
    const viewport = {
      centerLatitude,
      centerLongitude,
      zoom,
      startX: centerPoint.x - (MAP_VIEWPORT_WIDTH / 2),
      startY: centerPoint.y - (MAP_VIEWPORT_HEIGHT / 2),
    };

    if (fitsRoute(viewport)) {
      return viewport;
    }
  }

  const fallbackPoint = projectMapPoint(centerLatitude, centerLongitude, 3);
  return {
    centerLatitude,
    centerLongitude,
    zoom: 3,
    startX: fallbackPoint.x - (MAP_VIEWPORT_WIDTH / 2),
    startY: fallbackPoint.y - (MAP_VIEWPORT_HEIGHT / 2),
  };
}

function getMapTileUrl(tileX, tileY, zoom) {
  const tileCount = 2 ** zoom;
  if (tileY < 0 || tileY >= tileCount) {
    return "";
  }
  const wrappedTileX = ((tileX % tileCount) + tileCount) % tileCount;
  return `https://tile.openstreetmap.org/${zoom}/${wrappedTileX}/${tileY}.png`;
}

function buildMapTilesMarkup(viewport) {
  if (!viewport) {
    return "";
  }

  const startTileX = Math.floor(viewport.startX / MAP_TILE_SIZE) - 1;
  const endTileX = Math.floor((viewport.startX + MAP_VIEWPORT_WIDTH) / MAP_TILE_SIZE) + 1;
  const startTileY = Math.floor(viewport.startY / MAP_TILE_SIZE) - 1;
  const endTileY = Math.floor((viewport.startY + MAP_VIEWPORT_HEIGHT) / MAP_TILE_SIZE) + 1;
  const tiles = [];

  for (let tileY = startTileY; tileY <= endTileY; tileY += 1) {
    for (let tileX = startTileX; tileX <= endTileX; tileX += 1) {
      const tileUrl = getMapTileUrl(tileX, tileY, viewport.zoom);
      if (!tileUrl) {
        continue;
      }

      const left = ((tileX * MAP_TILE_SIZE - viewport.startX) / MAP_VIEWPORT_WIDTH) * 100;
      const top = ((tileY * MAP_TILE_SIZE - viewport.startY) / MAP_VIEWPORT_HEIGHT) * 100;
      const width = (MAP_TILE_SIZE / MAP_VIEWPORT_WIDTH) * 100;
      const height = (MAP_TILE_SIZE / MAP_VIEWPORT_HEIGHT) * 100;
      tiles.push(`
        <img
          class="map-tile"
          src="${escapeHtml(tileUrl)}"
          alt=""
          loading="lazy"
          referrerpolicy="no-referrer"
          style="--tile-left: ${left.toFixed(3)}%; --tile-top: ${top.toFixed(3)}%; --tile-width: ${width.toFixed(3)}%; --tile-height: ${height.toFixed(3)}%;"
        >
      `);
    }
  }

  return tiles.join("");
}

function getMapZipAnchorPoint() {
  if (
    !state.zipAnchor
    || !Number.isFinite(state.zipAnchor.latitude)
    || !Number.isFinite(state.zipAnchor.longitude)
  ) {
    return null;
  }

  return {
    latitude: Number(state.zipAnchor.latitude),
    longitude: Number(state.zipAnchor.longitude),
    label: state.zipAnchor.label || `ZIP ${state.zipAnchor.zipCode || getZipCodeBias()}`,
    zipCode: state.zipAnchor.zipCode || getZipCodeBias(),
  };
}

function getMapViewportPosition(result, viewport) {
  if (!viewport || !hasMapCoordinates(result)) {
    return null;
  }

  const point = projectMapPoint(Number(result.latitude), Number(result.longitude), viewport.zoom);
  const left = ((point.x - viewport.startX) / MAP_VIEWPORT_WIDTH) * 100;
  const top = ((point.y - viewport.startY) / MAP_VIEWPORT_HEIGHT) * 100;
  return { left, top };
}

function buildMapPinsMarkup(results = [], viewport = null, selectedKey = "") {
  if (!viewport) {
    return "";
  }

  return (Array.isArray(results) ? results : [])
    .slice(0, 14)
    .map((result, index) => {
      const position = getMapViewportPosition(result, viewport);
      if (!position || position.left < -8 || position.left > 108 || position.top < -8 || position.top > 108) {
        return "";
      }

      const resultKey = getMapResultKey(result, index);
      const isSelected = resultKey === selectedKey;
      return `
        <button
          type="button"
          class="map-pin${isSelected ? " is-active" : ""}"
          data-map-select-index="${index}"
          aria-label="Select ${escapeHtml(getMapDisplayTitle(result))}"
          style="--pin-left: ${position.left.toFixed(3)}%; --pin-top: ${position.top.toFixed(3)}%;"
        >
          <span>${index + 1}</span>
        </button>
      `;
    })
    .join("");
}

function buildMapRouteOverlayMarkup(selectedResult, viewport = null) {
  const zipAnchor = getMapZipAnchorPoint();
  if (!viewport || !zipAnchor || !hasMapCoordinates(selectedResult)) {
    return "";
  }

  const anchorPosition = getMapViewportPosition(zipAnchor, viewport);
  const destinationPosition = getMapViewportPosition(selectedResult, viewport);
  if (!anchorPosition || !destinationPosition) {
    return "";
  }

  const distanceLabel = formatMapRouteSummary(selectedResult, { compact: true });
  const isVisible = (position) => (
    position.left >= -12
    && position.left <= 112
    && position.top >= -12
    && position.top <= 112
  );

  if (!isVisible(anchorPosition) && !isVisible(destinationPosition)) {
    return "";
  }

  return `
    <svg class="map-route-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <line
        class="map-route-line-shadow"
        x1="${anchorPosition.left.toFixed(3)}"
        y1="${anchorPosition.top.toFixed(3)}"
        x2="${destinationPosition.left.toFixed(3)}"
        y2="${destinationPosition.top.toFixed(3)}"
      ></line>
      <line
        class="map-route-line-main"
        x1="${anchorPosition.left.toFixed(3)}"
        y1="${anchorPosition.top.toFixed(3)}"
        x2="${destinationPosition.left.toFixed(3)}"
        y2="${destinationPosition.top.toFixed(3)}"
      ></line>
    </svg>
    <span
      class="map-anchor-marker"
      style="--anchor-left: ${anchorPosition.left.toFixed(3)}%; --anchor-top: ${anchorPosition.top.toFixed(3)}%;"
      title="${escapeHtml(zipAnchor.label)}"
    >ZIP</span>
    ${distanceLabel
      ? `<span class="map-route-label">${escapeHtml(distanceLabel)}</span>`
      : ""}
  `;
}

function buildRefinedQuery(query, addition) {
  const baseQuery = String(query || "").trim();
  const refinement = String(addition || "").trim();

  if (!baseQuery) {
    return refinement;
  }
  if (!refinement) {
    return baseQuery;
  }
  if (baseQuery.toLowerCase().includes(refinement.toLowerCase())) {
    return baseQuery;
  }

  return `${baseQuery} ${refinement}`.replace(/\s+/g, " ").trim();
}

function getQueryAreaHint(query = state.query) {
  const normalizedQuery = String(query || "").trim();
  if (!normalizedQuery) {
    return "";
  }

  const cityStateMatch = normalizedQuery.match(/([A-Za-z][A-Za-z.\-']+(?:\s+[A-Za-z][A-Za-z.\-']+){0,3},\s*[A-Za-z]{2})$/);
  if (cityStateMatch) {
    return cityStateMatch[1];
  }

  const zipMatch = normalizedQuery.match(/(\d{5}(?:-\d{4})?)$/);
  if (zipMatch) {
    return zipMatch[1];
  }

  return "";
}

function getPreferredAreaLabel(query = state.query) {
  const areaHint = getQueryAreaHint(query);
  if (areaHint) {
    const zipHint = normalizeZipCode(areaHint);
    if (
      zipHint
      && state.zipAnchor?.zipCode === zipHint
      && state.zipAnchor?.locality
    ) {
      return `${state.zipAnchor.locality} ${zipHint}`.trim();
    }
    return areaHint;
  }

  return getSavedAreaLabel();
}

function getExpandedRegionName(region) {
  const normalizedRegion = String(region || "").trim();
  const code = getUsStateCode(normalizedRegion);
  return US_STATE_NAME_BY_CODE[code] || normalizedRegion;
}

function formatCityStateLabel(locality, region) {
  const city = String(locality || "").trim();
  const expandedRegion = getExpandedRegionName(region);
  const stateName = String(expandedRegion || "").trim();
  if (city && stateName) {
    return `${city}, ${stateName}`;
  }
  return city || stateName;
}

function getZipAreaTitle(zipCode = state.zipAnchor?.zipCode || getZipCodeBias()) {
  return formatCityStateLabel(getZipAnchorLocality(zipCode), getZipAnchorRegion(zipCode));
}

function getMapStageAreaTitle(query = state.query) {
  const areaHint = getQueryAreaHint(query);
  const zipHint = normalizeZipCode(areaHint);
  if (zipHint) {
    if (state.zipAnchor?.zipCode === zipHint) {
      return getZipAreaTitle(zipHint) || getPreferredAreaLabel(query);
    }
    return getZipAreaTitle(zipHint) || getPreferredAreaLabel(query);
  }

  if (areaHint) {
    const parts = areaHint.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return formatCityStateLabel(parts.slice(0, -1).join(", "), parts[parts.length - 1]);
    }
    return areaHint;
  }

  return getZipAreaTitle() || getPreferredAreaLabel(query);
}

function queryIncludesZipCode(query, zipCode = getZipCodeBias()) {
  const normalizedZipCode = normalizeZipCode(zipCode);
  if (!query || !normalizedZipCode) {
    return false;
  }

  return new RegExp(`\\b${escapeRegExp(normalizedZipCode)}(?:-\\d{4})?\\b`).test(String(query));
}

function getLocalResultsBiasLabel(zipCode = getZipCodeBias()) {
  const normalizedZipCode = normalizeZipCode(zipCode);
  const areaTitle = getZipAreaTitle(normalizedZipCode);
  if (areaTitle && normalizedZipCode) {
    return `${areaTitle} ${normalizedZipCode}`.trim();
  }

  return normalizedZipCode ? `ZIP ${normalizedZipCode}` : "";
}

function buildGeneralWebSearchPlan(query, {
  hasLocalIntent = looksLikeLocalIntent(query),
  literalSearch = false,
} = {}) {
  const baseQuery = String(query || "").trim();
  const zipCode = getZipCodeBias();
  if (
    !baseQuery
    || !zipCode
    || literalSearch
    || !hasLocalIntent
    || getQueryAreaHint(baseQuery)
    || queryIncludesZipCode(baseQuery, zipCode)
  ) {
    return {
      query: baseQuery,
      bias: null,
    };
  }

  const biasedQuery = (/\bnear\s+me\b/i.test(baseQuery)
    ? baseQuery.replace(/\bnear\s+me\b/ig, `near ${zipCode}`)
    : `${baseQuery} ${zipCode}`
  ).replace(/\s+/g, " ").trim();
  if (!biasedQuery || biasedQuery.toLowerCase() === baseQuery.toLowerCase()) {
    return {
      query: baseQuery,
      bias: null,
    };
  }

  return {
    query: biasedQuery,
    bias: {
      zipCode,
      label: getLocalResultsBiasLabel(zipCode),
      query: biasedQuery,
    },
  };
}

function getLocationBiasedQuery(query, { force = false } = {}) {
  const baseQuery = String(query || "").trim();
  const zipCode = getZipCodeBias();
  const areaTerms = getSavedAreaTerms();

  if (!baseQuery || !zipCode) {
    return baseQuery;
  }
  if (!force && !looksLikeLocalIntent(baseQuery)) {
    return baseQuery;
  }
  if (getQueryAreaHint(baseQuery)) {
    return baseQuery;
  }

  const localityQuery = areaTerms
    .filter((term) => !baseQuery.toLowerCase().includes(term.toLowerCase()))
    .join(" ");
  const preferredSuffix = localityQuery || zipCode;
  return `${baseQuery} ${preferredSuffix}`.replace(/\s+/g, " ").trim();
}

function buildMapLoadingQuery(query) {
  const baseQuery = String(query || "").trim();
  const zipCode = getZipCodeBias();
  if (!baseQuery || !zipCode) {
    return baseQuery;
  }

  const zipPattern = new RegExp(`\\bnear\\s+(?:zip\\s+)?${escapeRegExp(zipCode)}\\b`, "i");
  return zipPattern.test(baseQuery)
    ? baseQuery
    : `${baseQuery} near ${zipCode}`.replace(/\s+/g, " ").trim();
}

function getSidebarNewsQueries(query) {
  const baseQuery = String(query || "").trim();
  const hasLocalIntent = looksLikeLocalIntent(baseQuery);
  const explicitArea = getQueryAreaHint(baseQuery);
  const areaTerms = getSavedAreaTerms();
  const areaQuery = areaTerms.join(" ").trim();

  if (!baseQuery) {
    return {
      primaryQuery: areaQuery
        ? `breaking news ${areaQuery}`.replace(/\s+/g, " ").trim()
        : `breaking news ${getZipCodeBias()}`.replace(/\s+/g, " ").trim(),
      fallbackQuery: "top stories united states",
    };
  }

  const primaryQuery = (hasLocalIntent || explicitArea)
    ? getNewsBiasedQuery(baseQuery, { useArea: true })
    : baseQuery;
  const queryLatestFallback = buildRefinedQuery(baseQuery, "latest");
  const locationFallback = areaQuery
    ? `breaking news ${areaQuery}`.replace(/\s+/g, " ").trim()
    : "top stories united states";
  const fallbackQuery = queryLatestFallback.toLowerCase() === primaryQuery.toLowerCase()
    ? locationFallback
    : queryLatestFallback;

  return {
    primaryQuery,
    fallbackQuery,
  };
}

function buildSidebarNewsResults(primaryResults = [], fallbackResults = [], limit = 4) {
  const dedupedPrimary = sortNewsResultsByRecency(primaryResults);
  const dedupedFallback = sortNewsResultsByRecency(fallbackResults);
  const merged = [];
  const seen = new Set();

  const pushItems = (items, max = Number.POSITIVE_INFINITY) => {
    let pushed = 0;
    items.forEach((result) => {
      if (!result || merged.length >= limit || pushed >= max) {
        return;
      }

      const key = String(result.id || result.url || result.title || "").trim().toLowerCase();
      if (!key || seen.has(key)) {
        return;
      }

      seen.add(key);
      merged.push(result);
      pushed += 1;
    });
  };

  if (dedupedPrimary.length >= 3) {
    pushItems(dedupedPrimary, 3);
    pushItems(dedupedFallback, 1);
  } else {
    pushItems(dedupedPrimary, limit);
    pushItems(dedupedFallback, limit);
  }

  pushItems(dedupedPrimary, limit);
  pushItems(dedupedFallback, limit);
  return sortNewsResultsByRecency(merged).slice(0, limit);
}

function createGeneralSidebarData({
  infoResult = null,
  railNews = [],
  railSocial = [],
  railImages = [],
  mapResults = [],
} = {}) {
  return {
    infoResult: infoResult || null,
    railNews: Array.isArray(railNews) ? [...railNews] : [],
    railSocial: Array.isArray(railSocial) ? [...railSocial] : [],
    railImages: Array.isArray(railImages) ? [...railImages] : [],
    mapResults: Array.isArray(mapResults) ? [...mapResults] : [],
  };
}

function applyGeneralSidebarData(data = null) {
  const normalized = createGeneralSidebarData(data || {});
  state.infoResult = normalized.infoResult;
  state.railNews = normalized.railNews;
  state.railSocial = normalized.railSocial;
  state.railImages = normalized.railImages;
  state.mapResults = normalized.mapResults;
}

function getGeneralSidebarContextKey(query = state.query, { literalSearch = state.literalSearch } = {}) {
  const effective = getEffectivePreferences();
  return [
    String(query || "").trim(),
    literalSearch ? "literal" : "normal",
    String(effective.provider || "").trim(),
    String(effective.safesearch || "").trim(),
    String(effective.language || "").trim(),
    String(getEffectiveTimeRangeForView("general") || "").trim(),
    normalizeEnginesPreference(getEffectiveEnginesForView("general") || ""),
    String(effective.aiTemperature),
    String(effective.aiNumPredict),
    String(effective.aiSourceLimit),
    getZipCodeBias(),
  ].join("||");
}

function rememberGeneralSidebarData(key, data) {
  state.generalSidebarContext = {
    key: String(key || ""),
    data: createGeneralSidebarData(data || {}),
  };
}

function getStoredGeneralSidebarData(key) {
  if (!key || state.generalSidebarContext.key !== key || !state.generalSidebarContext.data) {
    return null;
  }

  return createGeneralSidebarData(state.generalSidebarContext.data);
}

function createAiSummaryContextData({
  summary = "",
  source = null,
  sources = [],
} = {}) {
  return {
    summary: String(summary || ""),
    source: source && typeof source === "object" ? { ...source } : null,
    sources: Array.isArray(sources)
      ? sources
        .filter((item) => item && typeof item === "object")
        .map((item) => ({ ...item }))
      : [],
  };
}

function rememberAiSummaryData(key, data) {
  state.aiSummaryContext = {
    key: String(key || ""),
    data: createAiSummaryContextData(data || {}),
  };
}

function getStoredAiSummaryData(key) {
  if (!key || state.aiSummaryContext.key !== key || !state.aiSummaryContext.data) {
    return null;
  }

  return createAiSummaryContextData(state.aiSummaryContext.data);
}

function getResultAddress(result) {
  return result && typeof result.address === "object" && result.address !== null
    ? result.address
    : {};
}

function getResultPostcode(result) {
  return normalizeZipCode(getResultAddress(result).postcode || "");
}

function getResultCountryCode(result) {
  return String(getResultAddress(result).country_code || "").trim().toLowerCase();
}

function getResultLocality(result) {
  const address = getResultAddress(result);
  return String(
    address.locality
      || address.city
      || address.town
      || address.village
      || address.hamlet
      || address.municipality
      || parseLocalityFromCityStateText(result?.title)
      || "",
  ).trim();
}

function getResultRegion(result) {
  const address = getResultAddress(result);
  return String(address.state || address.region || address.county || "").trim();
}

function getResultStateRegion(result) {
  const directRegion = getMapAddressState(result);
  if (directRegion) {
    return directRegion;
  }

  return [
    result?.title,
    result?.address_label,
    result?.content,
  ].map(parseUsStateRegion).find(Boolean) || "";
}

function getMapAreaNameCandidates(result, { includeTitle = true, includeAddressLabel = true } = {}) {
  const locality = getResultLocality(result);
  const region = getResultStateRegion(result);
  const expandedRegion = getExpandedRegionName(region);
  const stateCode = getUsStateCode(region);
  const postcode = getResultPostcode(result);
  const country = getMapAddressValue(result, "country");
  const candidates = [
    locality,
    postcode,
    locality && postcode ? `${locality} ${postcode}` : "",
    locality && region ? `${locality} ${region}` : "",
    locality && expandedRegion ? `${locality} ${expandedRegion}` : "",
    locality && stateCode ? `${locality} ${stateCode}` : "",
    locality && country ? `${locality} ${country}` : "",
    includeTitle ? getMapDisplayTitle(result) : "",
    includeAddressLabel ? result?.address_label : "",
  ];

  return new Set(candidates.map(normalizeMapComparisonValue).filter(Boolean));
}

function hasSpecificMapPlaceSignal(result) {
  const addressName = getMapAddressValue(result, "name");
  if (
    addressName
    && !getMapAreaNameCandidates(result, {
      includeTitle: false,
      includeAddressLabel: false,
    }).has(normalizeMapComparisonValue(addressName))
  ) {
    return true;
  }

  return MAP_SPECIFIC_ADDRESS_FIELDS.some((field) => Boolean(getMapAddressValue(result, field)));
}

function isMapAreaOnlyResult(result) {
  if (!result || hasSpecificMapPlaceSignal(result)) {
    return false;
  }

  const normalizedTypeValue = normalizeMapComparisonValue(
    `${result?.place_type || ""} ${result?.address_label || ""}`,
  );
  const typeLooksLikeArea = normalizedTypeValue
    .split(" ")
    .some((token) => MAP_AREA_PLACE_TYPES.has(token));
  const normalizedTitle = normalizeMapComparisonValue(getMapDisplayTitle(result));
  const titleLooksLikeArea = getMapAreaNameCandidates(result, {
    includeTitle: false,
    includeAddressLabel: false,
  }).has(normalizedTitle);

  return typeLooksLikeArea || titleLooksLikeArea;
}

function shouldDropMapAreaOnlyResult(result, query = state.query) {
  if (!isMapAreaOnlyResult(result)) {
    return false;
  }

  const normalizedQuery = normalizeMapComparisonValue(query);
  if (!normalizedQuery) {
    return false;
  }

  const areaCandidates = getMapAreaNameCandidates(result);
  if (areaCandidates.has(normalizedQuery)) {
    return false;
  }

  const strippedQuery = normalizedQuery
    .replace(/^(?:map|maps|directions|route|places?)\s+(?:of|for|to|in)?\s*/, "")
    .trim();
  return !areaCandidates.has(strippedQuery);
}

function scoreZipAnchorCandidate(result, zipCode) {
  if (!hasMapCoordinates(result)) {
    return -1;
  }

  const postcode = getResultPostcode(result);
  const countryCode = getResultCountryCode(result);
  const locality = getResultLocality(result);
  const title = String(result?.title || "").trim();
  const url = String(result?.url || "");
  let score = 0;

  if (postcode === zipCode) {
    score += 300;
  }
  if (countryCode === ZIP_ANCHOR_COUNTRY_CODE) {
    score += 180;
  }
  if (locality) {
    score += 35;
  }
  if (title === zipCode) {
    score += 25;
  }
  if (url.includes("openstreetmap.org/?mlat=")) {
    score += 15;
  }

  return score;
}

function getDistanceMiles(firstLatitude, firstLongitude, secondLatitude, secondLongitude) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const deltaLatitude = toRadians(secondLatitude - firstLatitude);
  const deltaLongitude = toRadians(secondLongitude - firstLongitude);
  const latitudeA = toRadians(firstLatitude);
  const latitudeB = toRadians(secondLatitude);
  const haversine = Math.sin(deltaLatitude / 2) ** 2
    + Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(deltaLongitude / 2) ** 2;
  const distance = 2 * earthRadiusMiles * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return Number.isFinite(distance) ? distance : null;
}

async function resolveZipAnchor(zipCode = getZipCodeBias(), { signal } = {}) {
  const normalizedZipCode = resolveZipCodePreference(zipCode, DEFAULT_ZIP_CODE);
  if (state.zipAnchor?.zipCode === normalizedZipCode) {
    return state.zipAnchor;
  }

  try {
    const payload = await fetchJson(
      buildSearchUrl(normalizedZipCode, 1, "maps"),
      signal ? { signal } : {},
    );
    const mapResults = Array.isArray(payload.results) ? payload.results : [];
    const scoredCandidates = mapResults
      .map((result) => ({
        result,
        score: scoreZipAnchorCandidate(result, normalizedZipCode),
      }))
      .filter((entry) => entry.score >= 0)
      .sort((first, second) => second.score - first.score);
    const anchorResult = scoredCandidates[0]?.result || mapResults.find((result) => hasMapCoordinates(result)) || null;
    const areaFallback = getZipAreaFallback(normalizedZipCode);
    const locality = getResultLocality(anchorResult) || areaFallback?.locality || "";
    const region = getResultStateRegion(anchorResult) || getResultRegion(anchorResult) || areaFallback?.region || "";

    state.zipAnchor = anchorResult
      ? {
          zipCode: normalizedZipCode,
          label: locality ? `${locality} ${normalizedZipCode}` : normalizedZipCode,
          latitude: Number(anchorResult.latitude),
          longitude: Number(anchorResult.longitude),
          locality,
          region,
          countryCode: getResultCountryCode(anchorResult),
        }
      : {
          zipCode: normalizedZipCode,
          label: normalizedZipCode,
          latitude: null,
          longitude: null,
          locality: areaFallback?.locality || "",
          region: areaFallback?.region || "",
          countryCode: "",
        };
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }
    const areaFallback = getZipAreaFallback(normalizedZipCode);
    state.zipAnchor = {
      zipCode: normalizedZipCode,
      label: normalizedZipCode,
      latitude: null,
      longitude: null,
      locality: areaFallback?.locality || "",
      region: areaFallback?.region || "",
      countryCode: "",
    };
  }

  return state.zipAnchor;
}

function rankMapResultsByZip(results, {
  preferNearby = false,
  useZipAnchor = true,
  maxDistanceMiles = null,
} = {}) {
  const baseResults = Array.isArray(results) ? results : [];
  if (!useZipAnchor) {
    const filteredResults = baseResults.filter((result) => !shouldDropMapAreaOnlyResult(result));
    return filteredResults.length ? filteredResults : baseResults;
  }

  const anchor = state.zipAnchor;
  if (!anchor || !Number.isFinite(anchor.latitude) || !Number.isFinite(anchor.longitude)) {
    const filteredResults = baseResults.filter((result) => !shouldDropMapAreaOnlyResult(result));
    return filteredResults.length ? filteredResults : baseResults;
  }

  const rankedResults = baseResults
    .map((result, index) => {
      const latitude = Number(result.latitude);
      const longitude = Number(result.longitude);
      const distanceMiles = Number.isFinite(latitude) && Number.isFinite(longitude)
        ? getDistanceMiles(anchor.latitude, anchor.longitude, latitude, longitude)
        : null;

      return {
        result,
        index,
        distanceMiles,
      };
    })
    .sort((first, second) => {
      if (first.distanceMiles === null && second.distanceMiles === null) {
        return first.index - second.index;
      }
      if (first.distanceMiles === null) {
        return 1;
      }
      if (second.distanceMiles === null) {
        return -1;
      }
      return first.distanceMiles - second.distanceMiles || first.index - second.index;
    });
  const filteredRankedResults = rankedResults.filter((entry) => !shouldDropMapAreaOnlyResult(entry.result));
  const candidateRankedResults = filteredRankedResults.length ? filteredRankedResults : rankedResults;

  if (maxDistanceMiles !== null) {
    const strictResults = candidateRankedResults.filter((entry) => entry.distanceMiles !== null && entry.distanceMiles <= maxDistanceMiles);
    if (strictResults.length) {
      return strictResults.map((entry) => entry.result);
    }

    return [];
  }

  if (!preferNearby) {
    return candidateRankedResults.map((entry) => entry.result);
  }

  const nearbyResults = candidateRankedResults.filter((entry) => entry.distanceMiles !== null && entry.distanceMiles <= LOCAL_DISTANCE_NEARBY_MILES);
  if (nearbyResults.length >= 2) {
    return nearbyResults.map((entry) => entry.result);
  }

  const regionalResults = candidateRankedResults.filter((entry) => entry.distanceMiles !== null && entry.distanceMiles <= LOCAL_DISTANCE_REGIONAL_MILES);
  if (regionalResults.length) {
    return regionalResults.map((entry) => entry.result);
  }

  return candidateRankedResults.map((entry) => entry.result);
}

function populateProviderOptions(selectElement) {
  if (!(selectElement instanceof HTMLSelectElement)) {
    return;
  }

  const providers = Array.isArray(state.health?.providers) ? state.health.providers : [];
  selectElement.innerHTML = providers.length
    ? providers
      .map(
        (provider) => `<option value="${escapeHtml(provider.id)}">${escapeHtml(provider.label)}</option>`,
      )
      .join("")
    : '<option value="searxng">SearXNG</option>';
}

function normalizeLatexExpression(value) {
  return String(value || "")
    .replace(/(\d+)\s*\\[dt]?frac\{([^{}\n]+)\}\{([^{}\n]+)\}/g, "$1 $2/$3")
    .replace(/\\[dt]?frac\{([^{}\n]+)\}\{([^{}\n]+)\}/g, "$1/$2")
    .replace(/\\text\{([^{}\n]*)\}/g, "$1")
    .replace(/\\(?:times|cdot)\b/g, "x")
    .replace(/\\div\b/g, "/")
    .replace(/\\approx\b/g, "about")
    .replace(/\\leq\b/g, "<=")
    .replace(/\\geq\b/g, ">=")
    .replace(/\\neq\b/g, "!=")
    .replace(/\\pm\b/g, "+/-")
    .replace(/\\%/g, "%")
    .replace(/\\[,;:! ]/g, " ")
    .replace(/[{}]/g, "")
    .replace(/\\/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeFriendlyDisplayText(value) {
  return String(value || "")
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, expression) => normalizeLatexExpression(expression))
    .replace(/\$([^$\n]+)\$/g, (_, expression) => normalizeLatexExpression(expression))
    .replace(/(\d+)\s*\\[dt]?frac\{([^{}\n]+)\}\{([^{}\n]+)\}/g, "$1 $2/$3")
    .replace(/\\[dt]?frac\{([^{}\n]+)\}\{([^{}\n]+)\}/g, "$1/$2")
    .replace(/\\text\{([^{}\n]*)\}/g, "$1")
    .replace(/\\(?:times|cdot)\b/g, "x")
    .replace(/\\div\b/g, "/")
    .replace(/\\approx\b/g, "about")
    .replace(/\\leq\b/g, "<=")
    .replace(/\\geq\b/g, ">=")
    .replace(/\\neq\b/g, "!=")
    .replace(/\\pm\b/g, "+/-")
    .replace(/\\%/g, "%")
    .replace(/\\[,;:! ]/g, " ")
    .replace(/[ \t]+([,.;:!?])/g, "$1")
    .replace(/[ \t]{2,}/g, " ");
}

function normalizeSummaryText(value) {
  const normalizedLines = normalizeFriendlyDisplayText(value)
    .replace(/([.!?])\s+Key Details\b/gi, "$1\n\nKey Details")
    .replaceAll("\r", "")
    .split("\n")
    .map((line) => {
      const compact = line.trim().replace(/\s+/g, " ");
      if (!compact) {
        return "";
      }
      if (AI_SUMMARY_BULLET_PATTERN.test(compact)) {
        return `- ${compact.replace(AI_SUMMARY_BULLET_PATTERN, "").trim()}`;
      }
      return compact;
    });

  const compactLines = [];
  for (const line of normalizedLines) {
    if (!line) {
      if (compactLines.length && compactLines[compactLines.length - 1] !== "") {
        compactLines.push("");
      }
      continue;
    }
    compactLines.push(line);
  }

  while (compactLines.length && compactLines[compactLines.length - 1] === "") {
    compactLines.pop();
  }

  const compact = compactLines.join("\n");

  if (!compact) {
    return "";
  }

  return compact;
}

function looksLikeSummaryPreface(value) {
  const compact = String(value || "").trim().toLowerCase();
  if (!compact) {
    return false;
  }

  return AI_SUMMARY_PREFACE_TOKENS.some((token) => compact.startsWith(token));
}

function normalizeSummaryTextWithPrefaceFilter(value) {
  const compact = String(value || "").replaceAll("\r", "").trim();
  if (!compact) {
    return "";
  }

  const filteredParagraphs = compact
    .split(/\n\s*\n+/)
    .map((paragraph) => {
      const lines = paragraph.split("\n").map((line) => line.trim()).filter(Boolean);
      let startIndex = 0;
      while (startIndex < lines.length && looksLikeSummaryPreface(lines[startIndex])) {
        startIndex += 1;
      }
      return lines.slice(startIndex).join("\n");
    })
    .filter(Boolean);

  if (!filteredParagraphs.length) {
    return "";
  }

  const filtered = filteredParagraphs.join("\n\n");
  return normalizeSummaryText(filtered);
}

function normalizeSummaryDetailItem(value) {
  const compact = normalizeFriendlyDisplayText(value).trim().replace(/\s+/g, " ");
  if (!compact) {
    return "";
  }

  return /[.!?]$/.test(compact) ? compact : `${compact}.`;
}

function parseAiSummary(summary) {
  const normalized = normalizeSummaryText(summary);
  if (!normalized) {
    return {
      leadParagraph: "",
      detailItems: [],
    };
  }

  const leadLines = [];
  const detailItems = [];
  let inDetails = false;

  normalized.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }

    if (/^key details\b/i.test(trimmed)) {
      inDetails = true;
      return;
    }

    if (AI_SUMMARY_BULLET_PATTERN.test(trimmed)) {
      inDetails = true;
      const normalizedDetail = normalizeSummaryDetailItem(
        trimmed.replace(AI_SUMMARY_BULLET_PATTERN, "").trim(),
      );
      if (normalizedDetail) {
        detailItems.push(normalizedDetail);
      }
      return;
    }

    if (inDetails) {
      const normalizedDetail = normalizeSummaryDetailItem(trimmed);
      if (normalizedDetail) {
        detailItems.push(normalizedDetail);
      }
      return;
    }

    leadLines.push(trimmed);
  });

  return {
    leadParagraph: leadLines.join(" ").trim(),
    detailItems: detailItems.slice(0, AI_SUMMARY_DETAIL_LIMIT),
  };
}

function renderSummaryDetailItem(item) {
  const compact = String(item || "").trim();
  if (!compact) {
    return "";
  }

  const separatorIndex = compact.indexOf(":");
  if (separatorIndex > 0) {
    const label = compact.slice(0, separatorIndex).trim();
    const value = compact.slice(separatorIndex + 1).trim();
    if (label && value) {
      return `
        <li class="spotlight-details-item">
          <span class="spotlight-details-dot" aria-hidden="true"></span>
          <span class="spotlight-details-text"><span class="spotlight-details-label">${escapeHtml(label)}:</span> ${escapeHtml(value)}</span>
        </li>
      `;
    }
  }

  return `
    <li class="spotlight-details-item">
      <span class="spotlight-details-dot" aria-hidden="true"></span>
      <span class="spotlight-details-text">${escapeHtml(compact)}</span>
    </li>
  `;
}

function getAiSummarySourceLabel(result) {
  return String(result?.domain || getHostLabel(result?.url) || getResultSiteName(result) || "").trim();
}

function getAiSummaryModelLabel() {
  return getSelectedAiModel() || normalizeAiModelPreference(state.health?.ollama?.default_model || "");
}

function getAiSummarySourceName(result) {
  const domain = String(result?.domain || getHostLabel(result?.url) || "").trim().toLowerCase();
  if (domain.includes("wikipedia.org")) {
    return "Wikipedia";
  }
  if (domain.includes("britannica.com")) {
    return "Britannica";
  }
  if (domain.includes("wikidata.org")) {
    return "Wikidata";
  }

  const explicitSource = String(result?.source || "").trim();
  if (explicitSource) {
    return explicitSource;
  }

  const host = getResultHost(result);
  if (!host) {
    return "";
  }

  const hostParts = host.split(".");
  const primarySegment = hostParts.length > 2 && hostParts[0].length <= 3
    ? hostParts[1]
    : hostParts[0];
  return formatResultLabel(primarySegment) || getResultSiteName(result);
}

function buildAiKickerMarkup(label) {
  return `
    <p class="spotlight-kicker spotlight-ai-kicker">
      <svg class="spotlight-ai-kicker-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.25 13.72 8.5 19 10.22 13.72 11.94 12 17.25 10.28 11.94 5 10.22 10.28 8.5 12 3.25Z"></path>
        <path d="M18.5 14.5 19.18 16.32 21 17 19.18 17.68 18.5 19.5 17.82 17.68 16 17 17.82 16.32 18.5 14.5Z"></path>
        <path d="M5.8 15.2 6.3 16.5 7.6 17 6.3 17.5 5.8 18.8 5.3 17.5 4 17 5.3 16.5 5.8 15.2Z"></path>
      </svg>
      <span>${escapeHtml(label)}</span>
    </p>
  `;
}

function buildAiSummaryModelBadge() {
  const modelLabel = getAiSummaryModelLabel();
  if (!modelLabel) {
    return "";
  }

  return `<span class="spotlight-ai-model-badge" title="${escapeHtml(`Model: ${modelLabel}`)}">${escapeHtml(modelLabel)}</span>`;
}

function buildAiSectionToggleMarkup() {
  const expanded = Boolean(state.aiSectionExpanded);
  if (expanded) {
    return "";
  }

  return `
    <button
      type="button"
      class="ai-section-toggle"
      data-ai-section-toggle
      aria-expanded="false"
    >
      <span>Show more</span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.4 9.4 12 14l4.6-4.6"></path>
      </svg>
    </button>
  `;
}

function buildAiSectionLoadingToggleMarkup() {
  return `
    <button
      type="button"
      class="ai-section-toggle ai-section-toggle-loading"
      aria-label="AI overview is loading"
      aria-disabled="true"
      disabled
    >
      <span class="ai-section-loading-spinner" aria-hidden="true"></span>
    </button>
  `;
}

function buildGenerationStepMarkup(items = [], className = "") {
  const normalizedItems = (Array.isArray(items) ? items : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  if (!normalizedItems.length) {
    return "";
  }

  const classes = ["generation-step-list", className].filter(Boolean).join(" ");
  return `
    <div class="${escapeHtml(classes)}" aria-hidden="true">
      ${normalizedItems.map((item, index) => `
        <span class="generation-step generation-step-${index + 1}">
          <span class="generation-step-dot"></span>
          <span>${escapeHtml(item)}</span>
        </span>
      `).join("")}
    </div>
  `;
}

function getAiModeForQuery(query = state.query) {
  return isQuestionSearchQuery(query) ? "qa" : "summary";
}

function getAiCardCopy(query = state.query) {
  const mode = getAiModeForQuery(query);
  return mode === "qa"
    ? {
      mode,
      kicker: "AI answer",
      titlePrefix: "Answering",
      loading: "Answering with search context…",
      fallback: AI_ANSWER_FALLBACK_TEXT,
      prompt: AI_QUESTION_PROMPT,
    }
    : {
      mode,
      kicker: "AI overview",
      titlePrefix: "About",
      loading: "Generating AI overview…",
      fallback: AI_SUMMARY_FALLBACK_TEXT,
      prompt: AI_SUMMARY_PROMPT,
    };
}

function getAiSummaryDisplayHeading(source, query = state.query) {
  const typedQuery = String(query || "").trim();
  if (typedQuery) {
    if (typedQuery.startsWith("\"") && typedQuery.endsWith("\"")) {
      const unwrappedQuery = typedQuery.slice(1, -1).trim();
      if (unwrappedQuery) {
        return unwrappedQuery;
      }
    }

    return typedQuery;
  }

  return getInfoCardHeading(source) || "Result";
}

function buildAiSummaryLoadingMarkup(source, query) {
  const heading = getAiSummaryDisplayHeading(source, query);
  const copy = getAiCardCopy(query);
  const sourceCount = Math.max(1, state.aiSummarySources.length || (source ? 1 : 0));
  const sourceLabel = sourceCount === 1 ? "1 source" : `${sourceCount} sources`;
  return `
    <li class="result-row result-row-ai" data-ai-overview-row>
      <article class="spotlight-card spotlight-card-ai result-item-skeleton ai-summary-loading ai-section-collapsible" aria-live="polite" aria-busy="true">
        <div class="spotlight-copy">
          <div class="spotlight-ai-head">
            <div class="spotlight-ai-headings">
              ${buildAiKickerMarkup(copy.kicker)}
              <p class="spotlight-title">${escapeHtml(copy.titlePrefix)} “${escapeHtml(heading)}”</p>
            </div>
            ${buildAiSummaryModelBadge()}
          </div>
          <div class="spotlight-summary-copy ai-summary-loading-copy">
            <p class="spotlight-meta">${escapeHtml(copy.loading)}</p>
            ${buildGenerationStepMarkup([sourceLabel, "Reading pages", copy.mode === "qa" ? "Drafting answer" : "Drafting overview"], "ai-generation-step-list")}
            <span class="skeleton-line skeleton-line-body-wide"></span>
            <span class="skeleton-line skeleton-line-body"></span>
            <span class="skeleton-line skeleton-line-body-short"></span>
            <div class="spotlight-details spotlight-details-ai ai-summary-loading-details">
              <span class="skeleton-line ai-summary-details-title-skeleton"></span>
              <ul class="spotlight-details-list spotlight-details-list-ai">
                ${Array.from({ length: 2 }, () => `
                  <li class="spotlight-details-item">
                    <span class="skeleton-circle ai-summary-detail-dot-skeleton"></span>
                    <span class="ai-summary-detail-copy-skeleton">
                      <span class="skeleton-line skeleton-line-body-wide"></span>
                      <span class="skeleton-line skeleton-line-body-short"></span>
                    </span>
                  </li>
                `).join("")}
              </ul>
            </div>
          </div>
        </div>
        ${buildAiSectionLoadingToggleMarkup()}
      </article>
    </li>
  `;
}

function shouldRenderAiLoadingSurfaces() {
  return state.activeView === "general" && isAiEnabled();
}

function buildAiSummarySearchSkeletonMarkup() {
  return `
    <li class="result-row result-row-ai" data-ai-overview-row>
      <article class="spotlight-card spotlight-card-ai result-item-skeleton ai-summary-loading ai-section-collapsible" aria-hidden="true" aria-busy="true">
        <div class="spotlight-copy">
          <div class="spotlight-ai-head">
            <div class="spotlight-ai-headings">
              <span class="skeleton-line skeleton-line-news-related-meta"></span>
              <span class="skeleton-line skeleton-line-result-title"></span>
            </div>
            <span class="skeleton-line skeleton-line-sidebar-meta"></span>
          </div>
          <div class="spotlight-summary-copy ai-summary-loading-copy">
            <span class="skeleton-line skeleton-line-body-wide"></span>
            <span class="skeleton-line skeleton-line-body"></span>
            <span class="skeleton-line skeleton-line-body-short"></span>
            <div class="spotlight-details spotlight-details-ai ai-summary-loading-details">
              <span class="skeleton-line ai-summary-details-title-skeleton"></span>
              <ul class="spotlight-details-list spotlight-details-list-ai">
                ${Array.from({ length: 2 }, () => `
                  <li class="spotlight-details-item">
                    <span class="skeleton-circle ai-summary-detail-dot-skeleton"></span>
                    <span class="ai-summary-detail-copy-skeleton">
                      <span class="skeleton-line skeleton-line-body-wide"></span>
                      <span class="skeleton-line skeleton-line-body-short"></span>
                    </span>
                  </li>
                `).join("")}
              </ul>
            </div>
          </div>
        </div>
        ${buildAiSectionLoadingToggleMarkup()}
      </article>
    </li>
  `;
}

function normalizeSummarySourceText(value) {
  const compact = String(value || "").trim().replace(/\s+/g, " ");
  if (!compact) {
    return "";
  }
  return compact.length <= AI_SUMMARY_SOURCE_SNIPPET_LIMIT
    ? compact
    : `${compact.slice(0, AI_SUMMARY_SOURCE_SNIPPET_LIMIT).trimEnd()}…`;
}

function isKnowledgeResult(result) {
  const domain = String(result?.domain || getHostLabel(result?.url) || "").toLowerCase();
  return AI_SUMMARY_KNOWLEDGE_HOSTS.some((host) => domain.includes(host));
}

function isWikipediaResult(result) {
  const domain = String(result?.domain || getHostLabel(result?.url) || "").toLowerCase();
  return domain.includes("wikipedia.org");
}

function isWikipediaDisambiguationResult(result) {
  if (!isWikipediaResult(result)) {
    return false;
  }

  const title = String(result?.title || "").toLowerCase();
  const heading = getInfoCardHeading(result).toLowerCase();
  const content = String(result?.content || "").toLowerCase();
  if (title.includes("(disambiguation)") || heading.includes("(disambiguation)")) {
    return true;
  }

  return WIKIPEDIA_DISAMBIGUATION_MARKERS.some((marker) => content.includes(marker));
}

function getResultContextText(result) {
  return [
    result?.title,
    result?.content,
    result?.source,
    result?.domain,
    result?.url,
  ].filter(Boolean).join(" ").toLowerCase();
}

function normalizeSupportToken(token) {
  const normalized = String(token || "").trim().toLowerCase();
  if (!normalized) {
    return "";
  }
  if (normalized.length > 4 && normalized.endsWith("ies")) {
    return `${normalized.slice(0, -3)}y`;
  }
  if (normalized.length > 3 && normalized.endsWith("s") && !normalized.endsWith("ss")) {
    return normalized.slice(0, -1);
  }
  return normalized;
}

function getNormalizedQueryTokenSet(query = state.query) {
  const subjectQuery = getSearchSubjectQuery(query) || query;
  return new Set(
    getQueryTokens(subjectQuery)
      .map((token) => normalizeSupportToken(token))
      .filter(Boolean),
  );
}

function getAiSummaryDescriptorTokens(result, query = state.query) {
  const queryTokenSet = getNormalizedQueryTokenSet(query);
  const headingTokenSet = new Set(
    getWordTokens(getInfoCardHeading(result))
      .map((token) => normalizeSupportToken(token))
      .filter(Boolean),
  );
  const descriptors = [];
  const seen = new Set();

  getWordTokens(`${result?.title || ""} ${result?.content || ""}`).forEach((token) => {
    const normalized = normalizeSupportToken(token);
    if (
      normalized.length < 4
      || queryTokenSet.has(normalized)
      || headingTokenSet.has(normalized)
      || AI_SUMMARY_DESCRIPTOR_STOPWORDS.has(normalized)
      || INFO_COMMERCIAL_TOKENS.has(normalized)
      || seen.has(normalized)
    ) {
      return;
    }

    seen.add(normalized);
    descriptors.push(normalized);
  });

  return descriptors;
}

function getWikipediaQualifierTokens(result, query = state.query) {
  const queryTokenSet = getNormalizedQueryTokenSet(query);
  const qualifierTokens = [];
  const seen = new Set();
  const rawTitle = String(result?.title || getInfoCardHeading(result) || "");
  const qualifierParts = [];

  rawTitle.replace(/\(([^)]+)\)/g, (_, value) => {
    qualifierParts.push(String(value || ""));
    return _;
  });

  const heading = getInfoCardHeading(result);
  const separatorMatch = heading.match(/[:,-]\s*([A-Za-z][A-Za-z0-9\s-]{2,})$/);
  if (separatorMatch?.[1]) {
    qualifierParts.push(separatorMatch[1]);
  }

  qualifierParts
    .map((part) => getWordTokens(part))
    .flat()
    .forEach((token) => {
      const normalized = normalizeSupportToken(token);
      if (
        normalized.length < 3
        || queryTokenSet.has(normalized)
        || SUBJECT_DESCRIPTOR_STOPWORDS.has(normalized)
        || INFO_COMMERCIAL_TOKENS.has(normalized)
        || seen.has(normalized)
      ) {
        return;
      }

      seen.add(normalized);
      qualifierTokens.push(normalized);
    });

  return qualifierTokens;
}

function getSubjectDescriptorTokens(primaryResults = [], query = state.query, limit = 3) {
  const queryTokenSet = getNormalizedQueryTokenSet(query);
  const tokenStats = new Map();
  const seenDomainCounts = new Map();

  const rememberToken = (token, score, resultKey, titleHit = false) => {
    const normalized = normalizeSupportToken(token);
    if (
      normalized.length < 3
      || queryTokenSet.has(normalized)
      || SUBJECT_DESCRIPTOR_STOPWORDS.has(normalized)
      || INFO_COMMERCIAL_TOKENS.has(normalized)
    ) {
      return;
    }

    const existing = tokenStats.get(normalized) || {
      token: normalized,
      score: 0,
      results: new Set(),
      titleHits: 0,
    };

    existing.score += score;
    existing.results.add(resultKey);
    if (titleHit) {
      existing.titleHits += 1;
    }
    tokenStats.set(normalized, existing);
  };

  (Array.isArray(primaryResults) ? primaryResults : [])
    .filter(Boolean)
    .slice(0, WIKIPEDIA_CONTEXT_EVIDENCE_LIMIT)
    .forEach((result, index) => {
      const resultKey = getResultIdentityKey(result) || `result-${index}`;
      const rankWeight = Math.max(1, SUBJECT_SUPPORT_RESULT_LIMIT - Math.max(index, 0));
      const rootDomain = getResultRootDomain(result) || getResultHost(result) || `result-${index}`;
      const domainSeenCount = seenDomainCounts.get(rootDomain) || 0;
      seenDomainCounts.set(rootDomain, domainSeenCount + 1);
      const domainWeight = domainSeenCount === 0
        ? 1
        : (domainSeenCount === 1 ? 0.56 : 0.32);
      const titleTokens = new Set(
        getWordTokens(getInfoCardHeading(result))
          .map((token) => normalizeSupportToken(token))
          .filter(Boolean),
      );
      const contentTokens = new Set(
        getWordTokens(result?.content || "")
          .map((token) => normalizeSupportToken(token))
          .filter(Boolean),
      );

      titleTokens.forEach((token) => {
        rememberToken(token, 28 * rankWeight * domainWeight, resultKey, true);
      });

      contentTokens.forEach((token) => {
        rememberToken(token, 12 * rankWeight * domainWeight, resultKey, false);
      });
    });

  const rankedTokens = Array.from(tokenStats.values())
    .filter((entry) => entry.titleHits > 0 || entry.results.size >= 2)
    .sort((first, second) => (
      second.results.size - first.results.size
      || second.titleHits - first.titleHits
      || second.score - first.score
      || first.token.localeCompare(second.token)
    ));

  const recurringTokens = rankedTokens.filter((entry) => entry.results.size >= 2 || entry.titleHits >= 2);
  const preferredTokens = recurringTokens.length
    ? recurringTokens
    : rankedTokens.filter((entry) => entry.score >= 110 && entry.titleHits >= 1);

  return preferredTokens
    .slice(0, limit)
    .map((entry) => entry.token);
}

function buildWikipediaContextQuery(primaryResults = [], query = state.query) {
  const baseQuery = String(query || "").trim();
  if (!baseQuery) {
    return "";
  }

  return baseQuery;
}

function buildWikipediaContextEvidenceResults(primaryResults = [], supportingResults = []) {
  const seen = new Set();
  const merged = [];
  const primaryPool = (Array.isArray(primaryResults) ? primaryResults : []).filter(Boolean);
  const supportingPool = (Array.isArray(supportingResults) ? supportingResults : []).filter(Boolean);
  const pushResult = (result) => {
    const key = getResultIdentityKey(result)
      || normalizeSuggestionKey(`${result?.title || ""} ${result?.url || ""} ${result?.content || ""}`);
    if (!key || seen.has(key)) {
      return;
    }

    seen.add(key);
    merged.push(result);
  };

  const balancedPrimaryLimit = Math.min(8, primaryPool.length);
  const balancedSupportingLimit = Math.min(8, supportingPool.length);

  primaryPool.slice(0, balancedPrimaryLimit).forEach(pushResult);
  supportingPool.slice(0, balancedSupportingLimit).forEach(pushResult);
  primaryPool.slice(balancedPrimaryLimit).forEach(pushResult);
  supportingPool.slice(balancedSupportingLimit).forEach(pushResult);

  return merged.slice(0, WIKIPEDIA_CONTEXT_EVIDENCE_LIMIT);
}

function isUsefulWikipediaContextPhraseToken(token, queryTokenSet = new Set()) {
  const normalized = normalizeSupportToken(token);
  return Boolean(
    normalized
    && normalized.length >= 3
    && !queryTokenSet.has(normalized)
    && !SUBJECT_DESCRIPTOR_STOPWORDS.has(normalized)
    && !INFO_COMMERCIAL_TOKENS.has(normalized)
  );
}

function getWikipediaContextPhraseQueries(query = state.query, evidenceResults = [], limit = 3) {
  const rawQueryTokens = getQueryTokens(query);
  if (rawQueryTokens.length !== 1) {
    return [];
  }

  const rawQueryToken = rawQueryTokens[0].toLowerCase();
  const normalizedQueryToken = normalizeSupportToken(rawQueryToken);
  if (!normalizedQueryToken) {
    return [];
  }

  const queryTokenSet = new Set([normalizedQueryToken]);
  const phraseStats = new Map();
  const seenDomainCounts = new Map();

  const rememberPhrase = (phrase, score, resultKey, titleHit = false) => {
    const normalizedPhrase = String(phrase || "").trim().replace(/\s+/g, " ");
    if (!normalizedPhrase) {
      return;
    }

    const existing = phraseStats.get(normalizedPhrase) || {
      phrase: normalizedPhrase,
      score: 0,
      results: new Set(),
      titleHits: 0,
    };

    existing.score += score;
    existing.results.add(resultKey);
    if (titleHit) {
      existing.titleHits += 1;
    }
    phraseStats.set(normalizedPhrase, existing);
  };

  const processTokens = (tokens, resultKey, score, queryToken, titleHit = false) => {
    tokens.forEach((token, index) => {
      if (normalizeSupportToken(token) !== normalizedQueryToken) {
        return;
      }

      const previousToken = tokens[index - 1];
      if (isUsefulWikipediaContextPhraseToken(previousToken, queryTokenSet)) {
        rememberPhrase(`${normalizeSupportToken(previousToken)} ${queryToken}`, score * 1.16, resultKey, titleHit);
      }

      const nextToken = tokens[index + 1];
      if (isUsefulWikipediaContextPhraseToken(nextToken, queryTokenSet)) {
        rememberPhrase(`${queryToken} ${normalizeSupportToken(nextToken)}`, score * 0.88, resultKey, titleHit);
      }
    });
  };

  (Array.isArray(evidenceResults) ? evidenceResults : [])
    .filter(Boolean)
    .slice(0, WIKIPEDIA_CONTEXT_EVIDENCE_LIMIT)
    .forEach((result, index) => {
      const resultKey = getResultIdentityKey(result) || `phrase-result-${index}`;
      const rankWeight = Math.max(1, SUBJECT_SUPPORT_RESULT_LIMIT - Math.max(index, 0));
      const rootDomain = getResultRootDomain(result) || getResultHost(result) || `phrase-result-${index}`;
      const domainSeenCount = seenDomainCounts.get(rootDomain) || 0;
      seenDomainCounts.set(rootDomain, domainSeenCount + 1);
      const domainWeight = domainSeenCount === 0
        ? 1
        : (domainSeenCount === 1 ? 0.56 : 0.32);

      processTokens(
        getWordTokens(getInfoCardHeading(result)),
        resultKey,
        30 * rankWeight * domainWeight,
        rawQueryToken,
        true,
      );
      processTokens(
        getWordTokens(result?.content || ""),
        resultKey,
        13 * rankWeight * domainWeight,
        rawQueryToken,
        false,
      );
    });

  return Array.from(phraseStats.values())
    .filter((entry) => entry.results.size >= 2 || entry.titleHits >= 1)
    .sort((first, second) => (
      second.results.size - first.results.size
      || second.titleHits - first.titleHits
      || second.score - first.score
      || first.phrase.localeCompare(second.phrase)
    ))
    .slice(0, limit)
    .map((entry) => entry.phrase);
}

function buildWikipediaContextQueries(query = state.query, evidenceResults = []) {
  const baseQuery = String(query || "").trim().replace(/\s+/g, " ");
  if (!baseQuery) {
    return [];
  }

  const queryTokenCount = getQueryTokens(baseQuery).length;
  const phraseQueries = getWikipediaContextPhraseQueries(
    baseQuery,
    evidenceResults,
    Math.min(3, WIKIPEDIA_CONTEXT_QUERY_LIMIT),
  );
  const descriptors = getSubjectDescriptorTokens(
    evidenceResults,
    baseQuery,
    WIKIPEDIA_CONTEXT_DESCRIPTOR_LIMIT,
  );
  const queries = [];
  const seen = new Set([normalizeSuggestionKey(baseQuery)]);

  const rememberQuery = (value) => {
    const normalizedValue = String(value || "").trim().replace(/\s+/g, " ");
    const key = normalizeSuggestionKey(normalizedValue);
    if (!normalizedValue || !key || seen.has(key)) {
      return;
    }

    seen.add(key);
    queries.push(normalizedValue);
  };

  phraseQueries.forEach((phraseQuery) => {
    rememberQuery(phraseQuery);
  });

  descriptors.forEach((descriptor) => {
    if (!descriptor) {
      return;
    }

    if (queryTokenCount <= 1) {
      rememberQuery(`${descriptor} ${baseQuery}`);
    }
    rememberQuery(`${baseQuery} ${descriptor}`);
  });

  if (descriptors.length >= 2) {
    const [firstDescriptor, secondDescriptor] = descriptors;
    if (queryTokenCount <= 1) {
      rememberQuery(`${firstDescriptor} ${baseQuery} ${secondDescriptor}`);
    }
    rememberQuery(`${baseQuery} ${firstDescriptor} ${secondDescriptor}`);
  }

  return queries.slice(0, WIKIPEDIA_CONTEXT_QUERY_LIMIT);
}

function isHighConfidencePrimarySummaryResult(result, index = -1, query = state.query) {
  if (!result?.title || index !== 0 || isWikipediaDisambiguationResult(result)) {
    return false;
  }

  const subjectQuery = getSearchSubjectQuery(query) || query;
  const tokens = getQueryTokens(subjectQuery);
  if (!tokens.length || !isKnowledgeResult(result)) {
    return false;
  }

  const heading = getInfoCardHeading(result);
  const normalizedQuery = normalizeSuggestionKey(subjectQuery);
  const normalizedHeading = normalizeSuggestionKey(heading);
  const compactQuery = getCompactQueryValue(subjectQuery);
  const compactHeading = getCompactQueryValue(heading);
  const titleMatchCount = countMatchingQueryTokens(result.title, tokens);
  const strongPrefixMatch = Boolean(normalizedQuery && (
    normalizedHeading === normalizedQuery
    || normalizedHeading.startsWith(`${normalizedQuery} `)
    || normalizedHeading.startsWith(`${normalizedQuery}(`)
    || normalizedHeading.startsWith(`${normalizedQuery}:`)
    || normalizedHeading.startsWith(`${normalizedQuery}-`)
    || compactHeading === compactQuery
    || compactHeading.startsWith(compactQuery)
  ));

  return strongPrefixMatch || titleMatchCount === tokens.length;
}

function getAiSummaryAnchorResult() {
  const infoCandidate = getInfoResultCandidate();
  if (infoCandidate) {
    return infoCandidate;
  }

  const primaryResults = Array.isArray(state.results) ? state.results.filter(Boolean) : [];
  const firstPrimaryResult = primaryResults[0] || null;
  if (isHighConfidencePrimarySummaryResult(firstPrimaryResult, 0)) {
    return firstPrimaryResult;
  }

  const subjectQuery = getSearchSubjectQuery(state.query);
  const tokens = getQueryTokens(subjectQuery);
  const rankedCandidates = [
    ...primaryResults.map((result, index) => ({
      result,
      index,
      score: scoreInfoResultCandidate(result, tokens, subjectQuery) + Math.max(0, 170 - (index * 24)),
    })),
  ].sort((first, second) => second.score - first.score || first.index - second.index);

  return rankedCandidates[0]?.result || firstPrimaryResult || state.infoResult || null;
}

function resolveAiSummarySelection({ mode = getAiModeForQuery() } = {}) {
  const resolvedSource = getInfoResultCandidate() || getAiSummaryAnchorResult();
  const title = String(resolvedSource?.title || "").trim();
  const url = String(resolvedSource?.url || "").trim();
  if (!title || !url) {
    return {
      source: null,
      sources: [],
    };
  }

  const sourcePool = [
    resolvedSource,
    ...(Array.isArray(state.results) ? state.results : []),
  ];
  const seen = new Set();
  const sources = [];

  sourcePool.forEach((source) => {
    const sourceTitle = String(source?.title || "").trim();
    const sourceUrl = String(source?.url || "").trim();
    const key = normalizeSuggestionKey(sourceUrl || sourceTitle);
    if (!sourceTitle || !sourceUrl || !key || seen.has(key)) {
      return;
    }

    seen.add(key);
    sources.push({
      title: sourceTitle,
      url: sourceUrl,
      domain: source.domain || getHostLabel(sourceUrl),
      source: source.source || "",
      engine: source.engine || "",
      category: source.category || "",
      image_url: source.image_url || "",
      thumbnail_url: source.thumbnail_url || "",
      img_src: source.img_src || "",
      parsed_url: source.parsed_url || "",
      content: normalizeSummarySourceText(source.content || ""),
    });
  });

  return {
    source: resolvedSource,
    sources: sources.slice(0, 4),
  };
}

function getHostLabel(url) {
  try {
    return new URL(String(url || "")).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function normalizeSuggestionKey(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeQuestionSubjectCandidate(value) {
  return String(value || "")
    .trim()
    .replace(/\?+$/g, "")
    .replace(/\s+/g, " ")
    .replace(/^(?:a|an|the)\s+/i, "")
    .trim();
}

function getQuestionSubjectQuery(query) {
  const normalizedQuery = String(query || "").trim().replace(/\s+/g, " ");
  if (!normalizedQuery) {
    return "";
  }

  const questionPatterns = [
    /^(?:what|who|where)\s+(?:is|are|was|were)\s+(.+)$/i,
    /^(?:what's|who's|where's)\s+(.+)$/i,
    /^(?:tell\s+me\s+about|define|explain)\s+(.+)$/i,
    /^what\s+does\s+(.+?)\s+mean\??$/i,
  ];

  for (const pattern of questionPatterns) {
    const match = normalizedQuery.match(pattern);
    const candidate = normalizeQuestionSubjectCandidate(match?.[1] || "");
    if (candidate && candidate.length >= 2) {
      return candidate;
    }
  }

  return normalizedQuery.replace(/\?+$/g, "").trim();
}

function isQuestionSearchQuery(query) {
  const normalizedQuery = String(query || "").trim();
  if (!normalizedQuery) {
    return false;
  }

  return /\?$/.test(normalizedQuery) || getQuestionSubjectQuery(normalizedQuery) !== normalizedQuery.replace(/\?+$/g, "").trim();
}

function getSearchSubjectQuery(query) {
  const normalizedQuery = String(query || "").trim().replace(/\s+/g, " ");
  if (!normalizedQuery) {
    return "";
  }

  if (isQuestionSearchQuery(normalizedQuery)) {
    return getQuestionSubjectQuery(normalizedQuery) || normalizedQuery.replace(/\?+$/g, "").trim();
  }

  return normalizedQuery;
}

function buildLiteralSearchQuery(query) {
  const trimmedQuery = String(query || "").trim();
  if (!trimmedQuery) {
    return "";
  }

  if (trimmedQuery.startsWith('"') && trimmedQuery.endsWith('"')) {
    return trimmedQuery;
  }

  return `"${trimmedQuery.replace(/"/g, "")}"`;
}

function buildRequestedSearchQuery(query, { literalSearch = false } = {}) {
  const trimmedQuery = String(query || "").trim();
  if (!trimmedQuery) {
    return "";
  }

  return literalSearch ? buildLiteralSearchQuery(trimmedQuery) : getSearchSubjectQuery(trimmedQuery);
}

function parsePublishedDateValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const normalizedValue = value > 1_000_000_000_000 ? value : value * 1000;
    const date = new Date(normalizedValue);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const rawValue = String(value || "").trim();
  if (!rawValue) {
    return null;
  }

  if (/^\d+$/.test(rawValue)) {
    return parsePublishedDateValue(Number(rawValue));
  }

  const normalizedRelativeValue = rawValue.toLowerCase().replace(/\s+/g, " ").trim();
  if (normalizedRelativeValue === "now" || normalizedRelativeValue === "just now") {
    return new Date();
  }
  if (normalizedRelativeValue === "today") {
    return new Date();
  }
  if (normalizedRelativeValue === "yesterday") {
    return new Date(Date.now() - 24 * 60 * 60 * 1000);
  }

  const relativeMatch = normalizedRelativeValue.match(/^(\d+|an?|one)\s+(sec(?:ond)?|min(?:ute)?|hr|hour|day|week|mo|month|yr|year)s?\s+ago$/);
  if (relativeMatch) {
    const amount = /^(a|an|one)$/.test(relativeMatch[1]) ? 1 : Number(relativeMatch[1]);
    const unit = relativeMatch[2];
    const unitMs = {
      sec: 1000,
      second: 1000,
      min: 60 * 1000,
      minute: 60 * 1000,
      hr: 60 * 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      mo: 30 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      yr: 365 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    }[unit] || 0;
    if (Number.isFinite(amount) && unitMs > 0) {
      return new Date(Date.now() - amount * unitMs);
    }
  }

  const date = new Date(rawValue);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isRelativePublishedDateLabel(value) {
  const normalizedValue = String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  return (
    normalizedValue === "now"
    || normalizedValue === "just now"
    || normalizedValue === "today"
    || normalizedValue === "yesterday"
    || /^(\d+|an?|one)\s+(sec(?:ond)?|min(?:ute)?|hr|hour|day|week|mo|month|yr|year)s?\s+ago$/.test(normalizedValue)
  );
}

function formatPublishedDate(value) {
  const fallback = String(value || "").trim();
  if (fallback && isRelativePublishedDateLabel(fallback)) {
    return fallback;
  }

  const parsedDate = parsePublishedDateValue(value);
  if (!parsedDate) {
    return fallback || "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatNewsAiDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getNewsAiDateRangeLabel(period, now = new Date()) {
  const startDate = new Date(now.getTime() - period.maxAgeDays * MS_PER_DAY);
  const endDate = new Date(now.getTime() - period.minAgeDays * MS_PER_DAY);
  return `${formatNewsAiDate(startDate)} to ${formatNewsAiDate(endDate)}`;
}

function getNewsResultAgeDays(result, now = new Date()) {
  const publishedDate = parsePublishedDateValue(result?.published_date);
  if (!publishedDate) {
    return null;
  }

  const ageDays = (now.getTime() - publishedDate.getTime()) / MS_PER_DAY;
  return Number.isFinite(ageDays) ? ageDays : null;
}

function isNewsResultInPeriod(result, period, now = new Date()) {
  const ageDays = getNewsResultAgeDays(result, now);
  if (ageDays === null) {
    return false;
  }

  const isAfterMinAge = period.exclusiveMinAgeDays
    ? ageDays > period.minAgeDays
    : ageDays >= period.minAgeDays;
  return isAfterMinAge && ageDays <= period.maxAgeDays;
}

function trimNewsAiSnippet(value, limit = NEWS_AI_MAX_SNIPPET_CHARS) {
  const compact = String(value || "").trim().replace(/\s+/g, " ");
  if (!compact || compact.length <= limit) {
    return compact;
  }

  return `${compact.slice(0, limit).trimEnd()}...`;
}

function getDistinctQuerySuggestions(suggestions = [], query = state.query) {
  const normalizedQuery = normalizeSuggestionKey(query);
  const filtered = [];
  const seen = new Set(normalizedQuery ? [normalizedQuery] : []);

  (Array.isArray(suggestions) ? suggestions : []).forEach((suggestion) => {
    const value = String(suggestion || "").trim().replace(/\s+/g, " ");
    const key = normalizeSuggestionKey(value);
    if (!value || !key || seen.has(key)) {
      return;
    }

    filtered.push(value);
    seen.add(key);
  });

  return filtered;
}

function loadPreferences() {
  try {
    const raw = window.localStorage.getItem(PREFERENCES_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function savePreferences() {
  try {
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(state.preferences));
  } catch {}
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, Math.max(0, Number(ms) || 0));
  });
}

function createClientId(prefix = "id") {
  if (window.crypto?.randomUUID) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeChatTimestamp(value, fallback = new Date().toISOString()) {
  const date = new Date(String(value || ""));
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function getChatMessageTimestamp(value) {
  const date = new Date(String(value || ""));
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const now = new Date();
  const sameDay = getLocalDateKey(date) === getLocalDateKey(now);
  const sameYear = date.getFullYear() === now.getFullYear();
  const label = new Intl.DateTimeFormat(undefined, {
    ...(sameDay ? {} : { month: "short", day: "numeric", ...(sameYear ? {} : { year: "numeric" }) }),
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  return {
    iso: date.toISOString(),
    label,
  };
}

function normalizeChatMessage(message) {
  if (!message || typeof message !== "object") {
    return null;
  }

  const role = String(message.role || "").trim().toLowerCase();
  if (role !== "user" && role !== "assistant") {
    return null;
  }

  const content = normalizeChatMessageText(message.content);
  if (!content) {
    return null;
  }

  return {
    id: String(message.id || "").trim() || createClientId("msg"),
    role,
    content,
    tone: String(message.tone || "").trim(),
    model: normalizeAiModelPreference(message.model || ""),
    createdAt: normalizeChatTimestamp(message.createdAt),
  };
}

function getChatTitleFromMessages(messages = []) {
  const firstUserMessage = messages.find((message) => message?.role === "user" && message.content);
  const title = normalizeChatMessageText(firstUserMessage?.content || "").replace(/\s+/g, " ");
  if (!title) {
    return "New chat";
  }

  return title.length > 54 ? `${title.slice(0, 51).trim()}...` : title;
}

function normalizeChatSession(session = {}) {
  const now = new Date().toISOString();
  const messages = (Array.isArray(session.messages) ? session.messages : [])
    .map(normalizeChatMessage)
    .filter(Boolean)
    .slice(-CHAT_SESSION_MESSAGE_LIMIT);
  const createdAt = normalizeChatTimestamp(session.createdAt, now);
  const updatedAt = normalizeChatTimestamp(session.updatedAt || createdAt, createdAt);
  const title = normalizeChatMessageText(session.title || "");

  return {
    id: String(session.id || "").trim() || createClientId("chat"),
    title: title || getChatTitleFromMessages(messages),
    createdAt,
    updatedAt,
    model: normalizeAiModelPreference(session.model || ""),
    useSearchContext: session.useSearchContext !== false,
    messages,
  };
}

function createChatSession({
  title = "New chat",
  model = "",
  useSearchContext = true,
  messages = [],
} = {}) {
  const now = new Date().toISOString();
  return normalizeChatSession({
    id: createClientId("chat"),
    title,
    model,
    useSearchContext,
    messages,
    createdAt: now,
    updatedAt: now,
  });
}

function removeStoredChatState() {
  try {
    window.localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch {}
}

function loadChatState() {
  try {
    if (!shouldPersistChatHistory(loadPreferences())) {
      removeStoredChatState();
      const fallbackSession = createChatSession();
      return {
        sessions: [fallbackSession],
        activeSessionId: fallbackSession.id,
        activeMessages: fallbackSession.messages,
      };
    }

    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const sessions = (Array.isArray(parsed?.sessions) ? parsed.sessions : [])
      .map(normalizeChatSession)
      .filter(Boolean)
      .slice(0, CHAT_SESSION_LIMIT);
    if (!sessions.length) {
      const fallbackSession = createChatSession();
      return {
        sessions: [fallbackSession],
        activeSessionId: fallbackSession.id,
        activeMessages: fallbackSession.messages,
      };
    }

    const requestedActiveId = String(parsed?.activeSessionId || "").trim();
    const activeSession = sessions.find((session) => session.id === requestedActiveId) || sessions[0];
    return {
      sessions,
      activeSessionId: activeSession.id,
      activeMessages: activeSession.messages,
    };
  } catch {
    const fallbackSession = createChatSession();
    return {
      sessions: [fallbackSession],
      activeSessionId: fallbackSession.id,
      activeMessages: fallbackSession.messages,
    };
  }
}

function saveChatState() {
  if (!shouldPersistChatHistory(getEffectivePreferences())) {
    removeStoredChatState();
    return;
  }

  try {
    window.localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify({
        activeSessionId: state.activeChatSessionId,
        sessions: state.chatSessions.slice(0, CHAT_SESSION_LIMIT),
      }),
    );
  } catch {}
}

function clearLocalAppData() {
  const shouldClear = window.confirm(
    "Clear sear_ch preferences and AI Chat history saved in this browser? Browser history and external service logs are not changed.",
  );
  if (!shouldClear) {
    return;
  }

  try {
    window.localStorage.removeItem(PREFERENCES_KEY);
    window.localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch {}

  window.location.reload();
}

function updateSearchPreferences(partialPreferences = {}) {
  const {
    aiEnabled: _aiEnabled,
    autoLoadResults: _autoLoadResults,
    ...searchPreferences
  } = partialPreferences;
  state.preferences = {
    ...state.preferences,
    ...searchPreferences,
  };
  state.zipAnchor = null;
  savePreferences();
  populatePreferenceForm();
  syncAutoLoadButtons();
  syncAiToggleButtons();
  renderFilters();

  if (state.query) {
    runSearch({
      query: state.query,
      page: 1,
      view: state.activeView,
      newsTopic: state.newsTopic,
      newsBaseQuery: state.newsBaseQuery,
      literalSearch: state.literalSearch,
    });
  } else {
    syncUrl();
  }
}

function getDefaults() {
  const searchDefaults = state.health?.search_defaults || {};
  const searchProfiles = state.health?.search_profiles || {};
  const aiDefaults = state.health?.ai_defaults || {};
  const defaultCategory = String(searchDefaults.categories || "general");
  return {
    theme: "system",
    defaultView: mapCategoryToView(defaultCategory),
    provider: state.health?.default_provider || "searxng",
    safesearch: String(searchDefaults.safesearch ?? 0),
    aiEnabled: true,
    aiModel: normalizeAiModelPreference(state.health?.ollama?.default_model || ""),
    language: searchDefaults.language === "all" ? "" : (searchDefaults.language || ""),
    timeRange: normalizeTimeRangePreference(searchDefaults.time_range || ""),
    engines: normalizeEnginesPreference(searchDefaults.engines || ""),
    newsTimeRange: normalizeTimeRangePreference(searchProfiles.news?.time_range || ""),
    newsEngines: normalizeEnginesPreference(searchProfiles.news?.engines || ""),
    imageEngines: normalizeEnginesPreference(searchProfiles.images?.engines || ""),
    mapEngines: normalizeEnginesPreference(searchProfiles.map?.engines || ""),
    autocompleteProvider: normalizeAutocompleteProviderPreference(state.health?.autocomplete?.provider || ""),
    autocompleteMinChars: normalizeAutocompleteMinCharsPreference(state.health?.autocomplete?.min_chars ?? 3, 3),
    autocompleteLimit: normalizeAutocompleteLimitPreference(state.health?.autocomplete?.limit ?? 8, 8),
    aiTemperature: normalizeAiTemperaturePreference(aiDefaults.temperature ?? 0.2, 0.2),
    aiNumPredict: normalizeAiNumPredictPreference(aiDefaults.num_predict ?? 240, 240),
    aiSourceLimit: normalizeAiSourceLimitPreference(aiDefaults.max_sources ?? 5, 5),
    aiOverviewExpanded: false,
    chatHistoryStorage: "memory",
    zipCode: DEFAULT_ZIP_CODE,
    autoLoadResults: true,
  };
}

function getEffectivePreferences() {
  const defaults = getDefaults();
  return {
    theme: normalizeThemePreference(state.preferences.theme || defaults.theme),
    defaultView: normalizeResultsView(state.preferences.defaultView || defaults.defaultView),
    provider: state.preferences.provider || defaults.provider,
    safesearch: state.preferences.safesearch || defaults.safesearch,
    aiEnabled: normalizeAiPreference(state.preferences.aiEnabled ?? defaults.aiEnabled),
    aiModel: normalizeAiModelPreference(state.preferences.aiModel || defaults.aiModel),
    language: state.preferences.language ?? defaults.language,
    timeRange: normalizeTimeRangePreference(state.preferences.timeRange ?? defaults.timeRange),
    engines: normalizeEnginesPreference(state.preferences.engines ?? defaults.engines),
    newsTimeRange: normalizeTimeRangePreference(state.preferences.newsTimeRange ?? defaults.newsTimeRange),
    newsEngines: normalizeEnginesPreference(state.preferences.newsEngines ?? defaults.newsEngines),
    imageEngines: normalizeEnginesPreference(state.preferences.imageEngines ?? defaults.imageEngines),
    mapEngines: normalizeEnginesPreference(state.preferences.mapEngines ?? defaults.mapEngines),
    autocompleteProvider: normalizeAutocompleteProviderPreference(state.preferences.autocompleteProvider ?? defaults.autocompleteProvider),
    autocompleteMinChars: normalizeAutocompleteMinCharsPreference(state.preferences.autocompleteMinChars ?? defaults.autocompleteMinChars, defaults.autocompleteMinChars),
    autocompleteLimit: normalizeAutocompleteLimitPreference(state.preferences.autocompleteLimit ?? defaults.autocompleteLimit, defaults.autocompleteLimit),
    aiTemperature: normalizeAiTemperaturePreference(state.preferences.aiTemperature ?? defaults.aiTemperature, defaults.aiTemperature),
    aiNumPredict: normalizeAiNumPredictPreference(state.preferences.aiNumPredict ?? defaults.aiNumPredict, defaults.aiNumPredict),
    aiSourceLimit: normalizeAiSourceLimitPreference(state.preferences.aiSourceLimit ?? defaults.aiSourceLimit, defaults.aiSourceLimit),
    aiOverviewExpanded: normalizeAiOverviewExpandedPreference(state.preferences.aiOverviewExpanded ?? defaults.aiOverviewExpanded),
    chatHistoryStorage: normalizeChatHistoryStoragePreference(state.preferences.chatHistoryStorage ?? defaults.chatHistoryStorage),
    zipCode: resolveZipCodePreference(state.preferences.zipCode ?? state.preferences.location, defaults.zipCode),
    autoLoadResults: normalizeAutoLoadPreference(state.preferences.autoLoadResults ?? defaults.autoLoadResults),
  };
}

function normalizePreferenceSnapshot(preferences = {}) {
  const defaults = getDefaults();
  return {
    theme: normalizeThemePreference(preferences.theme || defaults.theme),
    defaultView: normalizeResultsView(preferences.defaultView || defaults.defaultView),
    provider: String(preferences.provider || defaults.provider),
    safesearch: String(preferences.safesearch ?? defaults.safesearch),
    aiEnabled: normalizeAiPreference(preferences.aiEnabled ?? defaults.aiEnabled),
    aiModel: normalizeAiModelPreference(String(preferences.aiModel || defaults.aiModel || "")),
    language: String(preferences.language || "").trim(),
    timeRange: normalizeTimeRangePreference(String(preferences.timeRange ?? defaults.timeRange ?? "")),
    engines: normalizeEnginesPreference(String(preferences.engines ?? defaults.engines ?? "")),
    newsTimeRange: normalizeTimeRangePreference(String(preferences.newsTimeRange ?? defaults.newsTimeRange ?? "")),
    newsEngines: normalizeEnginesPreference(String(preferences.newsEngines ?? defaults.newsEngines ?? "")),
    imageEngines: normalizeEnginesPreference(String(preferences.imageEngines ?? defaults.imageEngines ?? "")),
    mapEngines: normalizeEnginesPreference(String(preferences.mapEngines ?? defaults.mapEngines ?? "")),
    autocompleteProvider: normalizeAutocompleteProviderPreference(preferences.autocompleteProvider ?? defaults.autocompleteProvider),
    autocompleteMinChars: normalizeAutocompleteMinCharsPreference(preferences.autocompleteMinChars ?? defaults.autocompleteMinChars, defaults.autocompleteMinChars),
    autocompleteLimit: normalizeAutocompleteLimitPreference(preferences.autocompleteLimit ?? defaults.autocompleteLimit, defaults.autocompleteLimit),
    aiTemperature: normalizeAiTemperaturePreference(preferences.aiTemperature ?? defaults.aiTemperature, defaults.aiTemperature),
    aiNumPredict: normalizeAiNumPredictPreference(preferences.aiNumPredict ?? defaults.aiNumPredict, defaults.aiNumPredict),
    aiSourceLimit: normalizeAiSourceLimitPreference(preferences.aiSourceLimit ?? defaults.aiSourceLimit, defaults.aiSourceLimit),
    aiOverviewExpanded: normalizeAiOverviewExpandedPreference(preferences.aiOverviewExpanded ?? defaults.aiOverviewExpanded),
    chatHistoryStorage: normalizeChatHistoryStoragePreference(preferences.chatHistoryStorage ?? defaults.chatHistoryStorage),
    zipCode: normalizeZipCode(String(preferences.zipCode || DEFAULT_ZIP_CODE)),
    autoLoadResults: normalizeAutoLoadPreference(preferences.autoLoadResults ?? defaults.autoLoadResults),
  };
}

const PREFERENCE_FIELD_NAMES = [
  "theme",
  "defaultView",
  "provider",
  "safesearch",
  "aiEnabled",
  "aiModel",
  "language",
  "timeRange",
  "engines",
  "newsTimeRange",
  "newsEngines",
  "imageEngines",
  "mapEngines",
  "autocompleteProvider",
  "autocompleteMinChars",
  "autocompleteLimit",
  "aiTemperature",
  "aiNumPredict",
  "aiSourceLimit",
  "aiOverviewExpanded",
  "chatHistoryStorage",
  "zipCode",
  "autoLoadResults",
];

function formHasPreferenceField(form, name) {
  return form instanceof HTMLFormElement && form.elements.namedItem(name) !== null;
}

function getPreferenceFormFieldNames(form) {
  if (!(form instanceof HTMLFormElement)) {
    return [];
  }

  return PREFERENCE_FIELD_NAMES.filter((name) => formHasPreferenceField(form, name));
}

function getSubmittedPreferences(form) {
  const formData = new FormData(form);
  const nextPreferences = { ...getEffectivePreferences() };

  getPreferenceFormFieldNames(form).forEach((name) => {
    const value = formData.get(name);
    nextPreferences[name] = value === null ? "" : String(value);
  });

  return normalizePreferenceSnapshot(nextPreferences);
}

function preferencesAreEqual(left, right) {
  return JSON.stringify(normalizePreferenceSnapshot(left)) === JSON.stringify(normalizePreferenceSnapshot(right));
}

function getEnginesPreferenceKeyForView(view = state.activeView) {
  const normalizedView = normalizeResultsView(view);
  if (normalizedView === "news") {
    return "newsEngines";
  }
  if (normalizedView === "images") {
    return "imageEngines";
  }
  if (normalizedView === "maps") {
    return "mapEngines";
  }
  return "engines";
}

function getTimeRangePreferenceKeyForView(view = state.activeView) {
  return normalizeResultsView(view) === "news" ? "newsTimeRange" : "timeRange";
}

function getEffectiveEnginesForView(view = state.activeView) {
  const effective = getEffectivePreferences();
  return normalizeEnginesPreference(effective[getEnginesPreferenceKeyForView(view)] || "");
}

function getDefaultEnginesForView(view = state.activeView) {
  const defaults = getDefaults();
  return normalizeEnginesPreference(defaults[getEnginesPreferenceKeyForView(view)] || "");
}

function getEffectiveTimeRangeForView(view = state.activeView) {
  const effective = getEffectivePreferences();
  const key = getTimeRangePreferenceKeyForView(view);
  return normalizeTimeRangePreference(effective[key] || "");
}

function getDefaultTimeRangeForView(view = state.activeView) {
  const defaults = getDefaults();
  const key = getTimeRangePreferenceKeyForView(view);
  return normalizeTimeRangePreference(defaults[key] || "");
}

function buildAiRequestPreferencePayload() {
  const effective = getEffectivePreferences();
  return {
    temperature: effective.aiTemperature,
    num_predict: effective.aiNumPredict,
    source_limit: effective.aiSourceLimit,
  };
}

function isAiEnabledByPreference() {
  return getEffectivePreferences().aiEnabled;
}

function resolveUsableAiModel(preferredModel = "") {
  const installedModels = getInstalledAiModels();
  if (!installedModels.length) {
    return "";
  }

  const preferred = normalizeAiModelPreference(preferredModel || getEffectivePreferences().aiModel);
  const preferredMatch = preferred
    ? installedModels.find((model) => aiModelNamesMatch(preferred, model))
    : "";
  if (preferredMatch) {
    return preferredMatch;
  }

  const defaultModel = normalizeAiModelPreference(state.health?.ollama?.default_model || "");
  const defaultMatch = defaultModel
    ? installedModels.find((model) => aiModelNamesMatch(defaultModel, model))
    : "";
  if (defaultMatch) {
    return defaultMatch;
  }

  return !preferred && installedModels.length === 1 ? installedModels[0] : "";
}

function hasUsableAiModel() {
  return Boolean(resolveUsableAiModel());
}

function getAiUnavailableReason() {
  if (!state.health?.ollama) {
    return "";
  }

  const detail = String(state.health.ollama.detail || "").trim();
  if (!hasUsableAiModel()) {
    return detail || "No local Ollama model is available.";
  }
  if (state.health.ollama.status === "offline") {
    return detail || "Unable to reach Ollama.";
  }

  return "";
}

function isAiEnabled() {
  return isAiEnabledByPreference()
    && !state.aiTemporarilyDisabledBySystem
    && hasUsableAiModel();
}

function isSearchServiceActive() {
  return state.loading || state.infiniteScroll.loading;
}

function isAiServiceActive() {
  return state.aiSummaryLoading || state.newsAiSummaryLoading || state.chatLoading;
}

function syncAiToggleButtons() {
  const isEnabledByPreference = isAiEnabledByPreference();
  const isTemporarilyPaused = state.aiTemporarilyDisabledBySystem;
  const unavailableReason = isEnabledByPreference ? getAiUnavailableReason() : "";
  const isEnabled = isAiEnabled();
  const isGenerating = isEnabled && isAiServiceActive();
  const label = !isEnabledByPreference
    ? "AI service is off by preference"
    : unavailableReason
    ? unavailableReason
    : isTemporarilyPaused
    ? "AI service is temporarily paused"
    : isGenerating
    ? "AI service is in use"
    : isEnabled
    ? "AI service is on"
    : "AI service is off";
  const visualState = isEnabled ? (isGenerating ? "loading" : "on") : "off";
  trackServiceDuration("ai", isGenerating);
  aiToggleButtons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    button.setAttribute("aria-pressed", String(isEnabled));
    button.dataset.state = visualState;
    button.setAttribute("aria-label", label);
    button.title = label;
  });
}

function requestAiSummaryForCurrentResults() {
  if (
    !isAiEnabled()
    || !state.query
    || state.loading
    || state.activeView !== "general"
    || !state.results.length
  ) {
    return;
  }

  fetchAiSummary({
    requestId: state.searchRequestId,
    signal: state.searchAbortController?.signal || null,
    contextKey: getGeneralSidebarContextKey(state.query, {
      literalSearch: state.literalSearch,
    }),
  });
}

function setAiEnabledPreference(enabled, { abortCurrent = true } = {}) {
  const nextValue = Boolean(enabled);
  clearTemporaryServicePauseRelease("ai");
  state.aiTemporarilyDisabledBySystem = false;
  state.aiServiceFailureCount = 0;
  state.preferences = {
    ...state.preferences,
    aiEnabled: nextValue,
  };
  savePreferences();
  populatePreferenceForm();

  if (!nextValue) {
    if (abortCurrent) {
      state.aiSummaryAbortController?.abort();
      state.newsAiSummaryAbortController?.abort();
      state.chatAbortController?.abort();
    }
    setAiSummaryState();
    clearNewsAiSummaryState({ abortCurrent: false });
    renderAiSummaryUpdate();
    if (state.activeView === "news") {
      renderNewsResults();
    }
    syncAiToggleButtons();
    return;
  }

  syncAiToggleButtons();
  requestAiSummaryForCurrentResults();
  if (state.activeView === "news") {
    renderNewsResults();
    requestNewsAiSummaryForCurrentResults();
  }
}

function toggleAiEnabledPreference() {
  if (state.aiTemporarilyDisabledBySystem && isAiEnabledByPreference()) {
    syncAiToggleButtons();
    return;
  }

  setAiEnabledPreference(!isAiEnabledByPreference());
}

function getSelectedAiModel() {
  return resolveUsableAiModel(getEffectivePreferences().aiModel);
}

function isAutoLoadResultsEnabled() {
  return (
    getEffectivePreferences().autoLoadResults
    && !state.searchServiceTemporarilyDisabled
  );
}

function syncAutoLoadButtons() {
  const isEnabledByPreference = getEffectivePreferences().autoLoadResults;
  const isTemporarilyPaused = state.searchServiceTemporarilyDisabled;
  const isEnabled = isAutoLoadResultsEnabled();
  const isSearching = isEnabled && isSearchServiceActive();
  const label = !isEnabledByPreference
    ? "Search service is off by preference"
    : isTemporarilyPaused
    ? "Search service is temporarily paused"
    : isSearching
    ? "Search service is in use"
    : isEnabled
    ? "Search service is on"
    : "Search service is off";
  const visualState = isEnabled ? (isSearching ? "loading" : "on") : "off";
  trackServiceDuration("search", isSearching);
  autoLoadButtons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    button.setAttribute("aria-pressed", String(isEnabled));
    button.dataset.state = visualState;
    button.setAttribute("aria-label", label);
    button.title = label;
  });
  resolveSearchIdleWaiters();
}

function setAutoLoadResultsPreference(enabled, { abortCurrent = true } = {}) {
  const nextValue = Boolean(enabled);

  if (nextValue) {
    clearTemporaryServicePauseRelease("search");
    clearTemporaryServicePauseRelease("ai");
    state.searchServiceTemporarilyDisabled = false;
    state.searchServiceFailureCount = 0;
    state.aiTemporarilyDisabledBySystem = false;
    state.aiServiceFailureCount = 0;
    state.infiniteScroll.reentryRequired = false;
    syncAiToggleButtons();
  }
  state.preferences = {
    ...state.preferences,
    autoLoadResults: nextValue,
  };
  savePreferences();
  populatePreferenceForm();
  syncAutoLoadButtons();

  if (!nextValue) {
    if (abortCurrent) {
      state.infiniteScroll.abortController?.abort();
    }
    state.infiniteScroll.loading = false;
    renderPagination();
    return;
  }

  state.infiniteScroll.emptyAttempts = 0;
  if (
    state.query
    && state.results.length
    && isInfiniteScrollView(state.activeView)
    && !state.loading
  ) {
    state.infiniteScroll.hasMore = true;
    state.infiniteScroll.exhausted = false;
    renderPagination();
    requestInfiniteScrollCheck();
  }
}

function toggleAutoLoadResultsPreference() {
  if (state.searchServiceTemporarilyDisabled && getEffectivePreferences().autoLoadResults) {
    syncAutoLoadButtons();
    return;
  }

  setAutoLoadResultsPreference(!getEffectivePreferences().autoLoadResults);
}

function getResolvedTheme(themePreference = getEffectivePreferences().theme) {
  if (themePreference === "light" || themePreference === "dark") {
    return themePreference;
  }

  return systemThemeMedia?.matches ? "dark" : "light";
}

function applyThemePreference(themePreference = getEffectivePreferences().theme) {
  const root = document.documentElement;
  const normalizedTheme = normalizeThemePreference(themePreference);
  const resolvedTheme = getResolvedTheme(normalizedTheme);

  if (normalizedTheme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.dataset.theme = normalizedTheme;
  }

  root.style.colorScheme = resolvedTheme;
  if (themeColorMeta) {
    themeColorMeta.setAttribute(
      "content",
      resolvedTheme === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT,
    );
  }
}

function buildSearchParams(
  query,
  page = 1,
  view = state.activeView,
  { literalSearch = false, engines = "", previewImages = false, previewImageLimit = 0 } = {},
) {
  const effective = getEffectivePreferences();
  const requestedEngines = normalizeEnginesPreference(engines || "");
  const effectiveTimeRange = getEffectiveTimeRangeForView(view);
  const defaultTimeRange = getDefaultTimeRangeForView(view);
  const effectiveEngines = getEffectiveEnginesForView(view);
  const defaultEngines = getDefaultEnginesForView(view);
  const params = new URLSearchParams({
    q: buildRequestedSearchQuery(query, { literalSearch }),
    page: String(page),
    provider: effective.provider,
    categories: getCategoryForView(view),
    safesearch: effective.safesearch,
  });

  if (effective.language) {
    params.set("language", effective.language);
  }
  if (effectiveTimeRange && effectiveTimeRange !== defaultTimeRange) {
    params.set("time_range", effectiveTimeRange);
  }
  if (requestedEngines) {
    params.set("engines", requestedEngines);
  } else if (effectiveEngines && effectiveEngines !== defaultEngines) {
    params.set("engines", effectiveEngines);
  }
  if (previewImages) {
    params.set("preview_images", "1");
    if (Number.isInteger(previewImageLimit) && previewImageLimit > 0) {
      params.set("preview_image_limit", String(previewImageLimit));
    }
  }

  return params;
}

function buildSearchUrl(query, page = 1, view = state.activeView, options = {}) {
  return `/api/search?${buildSearchParams(query, page, view, options).toString()}`;
}

function getGeneralWebRequestQuery(query = state.query) {
  return state.generalWebSearchQuery || String(query || "").trim();
}

async function fetchImageSearchPayloads(query, page = 1, { signal, literalSearch = false } = {}) {
  const searchQueries = buildImageSearchQueries(query);
  if (!searchQueries.length) {
    return [];
  }

  return Promise.all(searchQueries.map((searchQuery) => (
    fetchJson(
      buildSearchUrl(searchQuery, page, "images", { literalSearch }),
      signal ? { signal } : {},
    )
      .catch((error) => (
        error?.name === "AbortError" ? Promise.reject(error) : { results: [], suggestions: [] }
      ))
  )));
}

function buildSocialHighlightQuery(query, sourceConfig) {
  return [String(query || "").trim(), `site:${sourceConfig.searchDomain}`]
    .filter(Boolean)
    .join(" ");
}

async function fetchSocialHighlightPayloads(query, { signal } = {}) {
  const trimmedQuery = String(query || "").trim();
  if (!trimmedQuery) {
    return [];
  }

  return Promise.all(SOCIAL_HIGHLIGHT_SOURCES.map(async (sourceConfig) => {
    try {
      const payload = await fetchJson(
        buildSearchUrl(buildSocialHighlightQuery(trimmedQuery, sourceConfig), 1, "general", {
          previewImages: true,
          previewImageLimit: 4,
        }),
        signal ? { signal } : {},
      );
      return {
        source: sourceConfig,
        payload,
      };
    } catch (error) {
      if (error?.name === "AbortError") {
        throw error;
      }

      return {
        source: sourceConfig,
        payload: { results: [] },
      };
    }
  }));
}

async function fetchGeneralSidebarData({
  query,
  primaryResults = [],
  mapsQuery = "",
  hasLocalIntent = false,
  shouldFetchRelatedPlaces = false,
  shouldUseZipAnchor = false,
  sidebarPrimaryNewsQuery = "",
  sidebarFallbackNewsQuery = "",
  requestId = state.searchRequestId,
  signal = null,
} = {}) {
  const trimmedQuery = String(query || "").trim();
  if (!trimmedQuery) {
    return createGeneralSidebarData({
      infoResult: pickInfoResult(primaryResults, []),
    });
  }

  const imagePayloadsPromise = fetchImageSearchPayloads(trimmedQuery, 1, { signal }).catch((error) => (
    error?.name === "AbortError" ? Promise.reject(error) : []
  ));
  const socialPayloadsPromise = !state.literalSearch
    ? fetchSocialHighlightPayloads(trimmedQuery, { signal }).catch((error) => (
      error?.name === "AbortError" ? Promise.reject(error) : []
    ))
    : Promise.resolve([]);
  const mapPayloadPromise = shouldFetchRelatedPlaces
    ? fetchJson(
      buildSearchUrl(mapsQuery || trimmedQuery, 1, "maps"),
      signal ? { signal } : {},
    ).catch((error) => (
      error?.name === "AbortError" ? Promise.reject(error) : { results: [] }
    ))
    : Promise.resolve({ results: [] });
  const primaryNewsPromise = sidebarPrimaryNewsQuery
    ? fetchJson(
      buildSearchUrl(sidebarPrimaryNewsQuery, 1, "news"),
      signal ? { signal } : {},
    ).catch((error) => (
      error?.name === "AbortError" ? Promise.reject(error) : { results: [] }
    ))
    : Promise.resolve({ results: [] });
  const infoPayloadPromise = fetchJson(
    buildSearchUrl(buildWikipediaContextQuery(primaryResults, trimmedQuery), 1, "general", {
      engines: "wikipedia",
    }),
    signal ? { signal } : {},
  ).catch((error) => (
    error?.name === "AbortError" ? Promise.reject(error) : { results: [] }
  ));

  const [
    imagePayloads,
    socialPayloads,
    mapPayload,
    primaryNewsPayload,
    resolvedInfoPayload,
  ] = await Promise.all([
    imagePayloadsPromise,
    socialPayloadsPromise,
    mapPayloadPromise,
    primaryNewsPromise,
    infoPayloadPromise,
  ]);

  if (requestId !== state.searchRequestId || state.activeView !== "general" || signal?.aborted) {
    return null;
  }

  let fallbackNewsPayload = { results: [] };
  const primaryNewsResults = Array.isArray(primaryNewsPayload.results) ? primaryNewsPayload.results : [];
  if (sidebarFallbackNewsQuery && primaryNewsResults.length < 3) {
    fallbackNewsPayload = await fetchJson(
      buildSearchUrl(sidebarFallbackNewsQuery, 1, "news"),
      signal ? { signal } : {},
    ).catch((error) => (
      error?.name === "AbortError" ? Promise.reject(error) : { results: [] }
    ));
  }

  if (requestId !== state.searchRequestId || state.activeView !== "general" || signal?.aborted) {
    return null;
  }

  const relatedNews = buildSidebarNewsResults(
    primaryNewsResults,
    Array.isArray(fallbackNewsPayload.results) ? fallbackNewsPayload.results : [],
  );
  const relatedSocial = buildSocialSidebarResults(
    socialPayloads,
    trimmedQuery,
    primaryResults,
  );
  const relatedImages = mergeImageSearchPayloads(imagePayloads, trimmedQuery).results.slice(0, GENERAL_IMAGE_RAIL_LIMIT);
  const relatedPlaces = rankMapResultsByZip(Array.isArray(mapPayload.results) ? mapPayload.results : [], {
    preferNearby: hasLocalIntent,
    useZipAnchor: shouldUseZipAnchor,
  }).slice(0, 6);
  const wikipediaContextResults = buildWikipediaContextEvidenceResults(
    primaryResults,
    [
      ...relatedImages,
      ...relatedNews,
      ...relatedSocial.map((item) => item?.result).filter(Boolean),
    ],
  );
  const wikipediaCandidateResults = Array.isArray(resolvedInfoPayload.results) ? resolvedInfoPayload.results : [];
  let wikipediaInfoResult = pickWikipediaInfoResult(
    wikipediaCandidateResults,
    wikipediaContextResults,
    trimmedQuery,
  );

  if (!wikipediaInfoResult || isWikipediaDisambiguationResult(wikipediaInfoResult)) {
    const contextQueries = buildWikipediaContextQueries(trimmedQuery, wikipediaContextResults);
    if (contextQueries.length) {
      const supplementalInfoPayloads = await Promise.all(contextQueries.map((contextQuery) => (
        fetchJson(
          buildSearchUrl(contextQuery, 1, "general", {
            engines: "wikipedia",
          }),
          signal ? { signal } : {},
        ).catch((error) => (
          error?.name === "AbortError" ? Promise.reject(error) : { results: [] }
        ))
      )));

      if (requestId !== state.searchRequestId || state.activeView !== "general" || signal?.aborted) {
        return null;
      }

      wikipediaInfoResult = pickWikipediaInfoResult(
        [
          ...wikipediaCandidateResults,
          ...supplementalInfoPayloads.flatMap((payload) => (
            Array.isArray(payload?.results) ? payload.results : []
          )),
        ],
        wikipediaContextResults,
        trimmedQuery,
      ) || wikipediaInfoResult;
    }
  }

  return createGeneralSidebarData({
    infoResult: wikipediaInfoResult || pickInfoResult(primaryResults, []),
    railNews: relatedNews,
    railSocial: relatedSocial,
    railImages: relatedImages,
    mapResults: relatedPlaces,
  });
}

function syncQueryInputs(query, { source = null } = {}) {
  const nextValue = String(query ?? "");
  searchInputs.forEach((input) => {
    if (source && input === source) {
      return;
    }
    if (input.value === nextValue) {
      return;
    }
    input.value = nextValue;
  });
  updateSearchClearButtons();
}

function getVisibleSearchInput() {
  return searchInputs.find((input) => (
    input instanceof HTMLInputElement
    && !input.disabled
    && !input.closest("[hidden]")
    && input.getClientRects().length > 0
  )) ?? searchInputs.find((input) => input instanceof HTMLInputElement && !input.disabled) ?? null;
}

function markAutocompleteFocusQuiet(input) {
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  state.autocompleteFocusSuppressInput = input;
  state.autocompleteFocusSuppressUntil = Date.now() + AUTOCOMPLETE_FOCUS_SUPPRESS_MS;
}

function clearAutocompleteFocusQuiet(input = null) {
  if (input && state.autocompleteFocusSuppressInput !== input) {
    return;
  }

  state.autocompleteFocusSuppressInput = null;
  state.autocompleteFocusSuppressUntil = 0;
}

function shouldKeepAutocompleteQuietForFocus(input) {
  const shouldSuppress = (
    input instanceof HTMLInputElement
    && state.autocompleteFocusSuppressInput === input
    && Date.now() <= state.autocompleteFocusSuppressUntil
  );

  clearAutocompleteFocusQuiet(input);
  return shouldSuppress;
}

function markAutocompleteKeyboardFocusIntent() {
  state.autocompleteKeyboardFocusUntil = Date.now() + AUTOCOMPLETE_FOCUS_SUPPRESS_MS;
}

function consumeAutocompleteKeyboardFocusIntent() {
  const shouldArm = Date.now() <= state.autocompleteKeyboardFocusUntil;
  state.autocompleteKeyboardFocusUntil = 0;
  return shouldArm;
}

function isAutocompleteArmedForInput(input) {
  return input instanceof HTMLInputElement && state.autocompleteIntentInput === input;
}

function disarmAutocomplete(input = null) {
  if (input && state.autocompleteIntentInput !== input) {
    return;
  }

  state.autocompleteIntentInput = null;
}

function armAutocompleteForInput(input, { requestIfReady = true } = {}) {
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  clearAutocompleteFocusQuiet(input);
  state.autocompleteIntentInput = input;
  state.autocompleteActiveInput = input;
  updateSearchClearButtons();

  if (requestIfReady && input.value.trim().length >= getAutocompleteMinChars()) {
    requestAutocomplete(input);
  }
}

function focusSearchInput(input, {
  suppressAutocomplete = true,
  requestAutocompleteOnFocus = !suppressAutocomplete,
} = {}) {
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  if (suppressAutocomplete) {
    disarmAutocomplete(input);
    markAutocompleteFocusQuiet(input);
    hideAutocompletePanels({ clear: true });
  } else {
    armAutocompleteForInput(input, { requestIfReady: false });
  }

  window.requestAnimationFrame(() => {
    try {
      input.focus({ preventScroll: true });
    } catch {
      input.focus();
    }

    const caretPosition = input.value.length;
    input.setSelectionRange?.(caretPosition, caretPosition);
    if (requestAutocompleteOnFocus && input.value.trim().length >= getAutocompleteMinChars()) {
      requestAutocomplete(input);
    }
  });
}

function focusVisibleSearchInput(options = {}) {
  focusSearchInput(getVisibleSearchInput(), options);
}

function shouldAutofocusSearchOnLoad() {
  const activeElement = document.activeElement;
  return !activeElement
    || activeElement === document.body
    || activeElement === document.documentElement
    || searchInputs.includes(activeElement);
}

function focusSearchOnPageLoad() {
  window.requestAnimationFrame(() => {
    if (!shouldAutofocusSearchOnLoad()) {
      return;
    }

    focusVisibleSearchInput({
      suppressAutocomplete: false,
      requestAutocompleteOnFocus: false,
    });
  });
}

function smoothScrollToTopForSearch() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
  if (scrollTop <= 1) {
    return;
  }

  window.requestAnimationFrame(() => {
    const latestScrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    if (latestScrollTop <= 1) {
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });
}

function updateDocumentMetadata() {
  const title = state.query ? `${state.query} - ${APP_NAME}` : APP_NAME;
  const description = state.health?.tagline || DEFAULT_META_DESCRIPTION;

  document.title = title;
  metaDescription?.setAttribute("content", description);
  openGraphSiteNameMeta?.setAttribute("content", APP_NAME);
  openGraphTitleMeta?.setAttribute("content", title);
  openGraphDescriptionMeta?.setAttribute("content", description);
  twitterTitleMeta?.setAttribute("content", title);
  twitterDescriptionMeta?.setAttribute("content", description);
}

function updateCurrentYearText(now = new Date()) {
  const year = now.getFullYear();
  if (!Number.isFinite(year)) {
    return;
  }
  currentYearElements.forEach((element) => {
    element.textContent = String(year);
  });
}

updateCurrentYearText();

function clampTooltipCoordinate(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

function getOrCreateAppTooltip() {
  if (appTooltip instanceof HTMLElement) {
    return appTooltip;
  }

  appTooltip = document.createElement("div");
  appTooltip.id = "app-tooltip";
  appTooltip.className = "app-tooltip";
  appTooltip.setAttribute("role", "tooltip");
  appTooltip.hidden = true;
  document.body.appendChild(appTooltip);
  return appTooltip;
}

function shouldUseAriaTooltip(element) {
  return element instanceof HTMLElement && element.matches(
    ".panel-close, .nav-icon-button, .search-tool, .chat-icon-button, .chat-send-button, .chat-stop-button, .zip-info-button",
  );
}

function syncTooltipTarget(element) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  const title = String(element.getAttribute("title") || "").trim();
  if (title) {
    element.dataset.tooltip = title;
    element.dataset.tooltipSource = "title";
    element.removeAttribute("title");
    return;
  }

  if (!shouldUseAriaTooltip(element)) {
    return;
  }

  const ariaLabel = String(element.getAttribute("aria-label") || "").trim();
  if (!ariaLabel) {
    delete element.dataset.tooltip;
    delete element.dataset.tooltipSource;
    return;
  }

  if (!element.dataset.tooltip || element.dataset.tooltipSource === "aria") {
    element.dataset.tooltip = ariaLabel;
    element.dataset.tooltipSource = "aria";
  }
}

function syncTooltipTargets(root = document) {
  if (root instanceof HTMLElement) {
    syncTooltipTarget(root);
  }

  if (typeof root.querySelectorAll !== "function") {
    return;
  }

  root.querySelectorAll(TOOLTIP_SOURCE_SELECTOR).forEach(syncTooltipTarget);
}

function getTooltipEventTarget(target) {
  if (!(target instanceof Element)) {
    return null;
  }
  return target.closest(TOOLTIP_SELECTOR);
}

function isTooltipTargetUnavailable(element) {
  return !element
    || element.closest("[hidden]")
    || element.matches(":disabled, [aria-disabled='true']");
}

function positionAppTooltip() {
  tooltipFrame = 0;
  if (!(activeTooltipTarget instanceof HTMLElement) || !(appTooltip instanceof HTMLElement) || appTooltip.hidden) {
    return;
  }

  const text = String(activeTooltipTarget.dataset.tooltip || "").trim();
  if (!text || isTooltipTargetUnavailable(activeTooltipTarget)) {
    hideAppTooltip();
    return;
  }

  const rect = activeTooltipTarget.getBoundingClientRect();
  const tooltipRect = appTooltip.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth || 0;
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight || 0;
  const center = rect.left + rect.width / 2;
  const maxLeft = Math.max(TOOLTIP_EDGE_GAP, viewportWidth - tooltipRect.width - TOOLTIP_EDGE_GAP);
  const left = clampTooltipCoordinate(center - tooltipRect.width / 2, TOOLTIP_EDGE_GAP, maxLeft);
  const hasRoomAbove = rect.top >= tooltipRect.height + TOOLTIP_GAP + TOOLTIP_EDGE_GAP;
  const hasRoomBelow = viewportHeight - rect.bottom >= tooltipRect.height + TOOLTIP_GAP + TOOLTIP_EDGE_GAP;
  const placement = hasRoomAbove || !hasRoomBelow ? "top" : "bottom";
  const preferredTop = placement === "top"
    ? rect.top - tooltipRect.height - TOOLTIP_GAP
    : rect.bottom + TOOLTIP_GAP;
  const maxTop = Math.max(TOOLTIP_EDGE_GAP, viewportHeight - tooltipRect.height - TOOLTIP_EDGE_GAP);
  const top = clampTooltipCoordinate(preferredTop, TOOLTIP_EDGE_GAP, maxTop);
  const arrowLeft = clampTooltipCoordinate(center - left, 12, Math.max(12, tooltipRect.width - 12));

  appTooltip.dataset.placement = placement;
  appTooltip.style.left = `${left}px`;
  appTooltip.style.top = `${top}px`;
  appTooltip.style.setProperty("--tooltip-arrow-left", `${arrowLeft}px`);
  appTooltip.classList.add("is-visible");
}

function requestAppTooltipPosition() {
  if (tooltipFrame || !(activeTooltipTarget instanceof HTMLElement)) {
    return;
  }
  tooltipFrame = window.requestAnimationFrame(positionAppTooltip);
}

function showAppTooltip(target) {
  if (!(target instanceof HTMLElement) || isTooltipTargetUnavailable(target)) {
    return;
  }

  syncTooltipTarget(target);
  const text = String(target.dataset.tooltip || "").trim();
  if (!text) {
    return;
  }

  const tooltip = getOrCreateAppTooltip();
  activeTooltipTarget = target;
  tooltip.textContent = text;
  tooltip.hidden = false;
  tooltip.classList.remove("is-visible");
  requestAppTooltipPosition();
}

function hideAppTooltip() {
  activeTooltipTarget = null;
  if (tooltipFrame) {
    window.cancelAnimationFrame(tooltipFrame);
    tooltipFrame = 0;
  }
  if (appTooltip instanceof HTMLElement) {
    appTooltip.classList.remove("is-visible");
    appTooltip.hidden = true;
  }
}

function focusElementWithoutTooltip(element) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  suppressedTooltipFocusTarget = element;
  hideAppTooltip();
  element.focus();
  window.requestAnimationFrame(() => {
    if (suppressedTooltipFocusTarget === element) {
      suppressedTooltipFocusTarget = null;
    }
  });
}

function initializeTooltips() {
  syncTooltipTargets(document);

  const tooltipObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.target instanceof HTMLElement) {
        syncTooltipTarget(mutation.target);
        if (mutation.target === activeTooltipTarget) {
          if (isTooltipTargetUnavailable(mutation.target) || !String(mutation.target.dataset.tooltip || "").trim()) {
            hideAppTooltip();
          } else {
            showAppTooltip(mutation.target);
          }
        }
        return;
      }

      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          syncTooltipTargets(node);
        }
      });
    });
  });

  tooltipObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["aria-label", "hidden", "title"],
    childList: true,
    subtree: true,
  });

  document.addEventListener("pointerover", (event) => {
    const target = getTooltipEventTarget(event.target);
    if (target instanceof HTMLElement && target !== activeTooltipTarget) {
      showAppTooltip(target);
    }
  });

  document.addEventListener("pointerout", (event) => {
    if (!(activeTooltipTarget instanceof HTMLElement)) {
      return;
    }
    const relatedTarget = event.relatedTarget;
    if (relatedTarget instanceof Node && activeTooltipTarget.contains(relatedTarget)) {
      return;
    }
    hideAppTooltip();
  });

  document.addEventListener("focusin", (event) => {
    const target = getTooltipEventTarget(event.target);
    if (target === suppressedTooltipFocusTarget) {
      hideAppTooltip();
      return;
    }
    if (target instanceof HTMLElement) {
      showAppTooltip(target);
    }
  });

  document.addEventListener("focusout", (event) => {
    if (event.target === activeTooltipTarget) {
      hideAppTooltip();
    }
  });

  window.addEventListener("resize", requestAppTooltipPosition);
  window.addEventListener("scroll", requestAppTooltipPosition, { passive: true, capture: true });
}

function compactEndpointLabel(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }
  try {
    const url = new URL(text);
    const path = url.pathname && url.pathname !== "/" ? url.pathname.replace(/\/$/, "") : "";
    return `${url.host}${path}`;
  } catch {
    return text.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  }
}

function describeProviderStatus(provider, providerBaseUrl) {
  const detail = String(provider?.detail || "").trim();
  const endpoint = compactEndpointLabel(providerBaseUrl);
  if (provider?.status === "ok") {
    return `${endpoint} · Web search ready`;
  }
  if (detail) {
    return `${endpoint} · ${detail}`;
  }
  return `${endpoint} · Search status unavailable`;
}

function describeAiStatus(ollama, selectedModel = "") {
  const baseUrl = String(ollama?.base_url || "Unavailable").trim();
  const detail = String(ollama?.detail || "").trim();
  const model = normalizeAiModelPreference(selectedModel || ollama?.default_model || "");
  const endpoint = compactEndpointLabel(baseUrl);

  if (ollama?.status === "ok") {
    return model
      ? `${endpoint} · Using ${model}`
      : `${endpoint} · Reachable, no default model`;
  }
  if (detail) {
    return `${endpoint} · ${detail}`;
  }
  return `${endpoint} · AI status unavailable`;
}

function setStatusText(element, value, fallback = "Unavailable") {
  if (!element) {
    return;
  }

  element.textContent = String(value || "").trim() || fallback;
}

function formatHealthStatus(status, detail = "") {
  const normalizedStatus = String(status || "").trim().toLowerCase();
  const label = normalizedStatus === "ok"
    ? "Ready"
    : normalizedStatus === "degraded"
      ? "Needs attention"
      : normalizedStatus === "offline"
        ? "Offline"
        : "Unknown";
  const cleanDetail = String(detail || "").trim();
  return cleanDetail ? `${label} - ${cleanDetail}` : label;
}

function formatSafeSearchLabel(value) {
  const normalizedValue = Number(value);
  if (normalizedValue === 2) {
    return "strict";
  }
  if (normalizedValue === 1) {
    return "moderate";
  }
  return "off";
}

function formatCommaList(value, fallback = "None reported") {
  const values = Array.isArray(value)
    ? value
    : String(value || "").split(",");
  const items = values
    .map((item) => String(item || "").trim())
    .filter(Boolean);

  return items.length ? items.join(", ") : fallback;
}

function formatSearchProfileStatus(defaults = {}) {
  const category = String(defaults.categories || "general").trim() || "general";
  const language = String(defaults.language || "auto").trim() || "auto";
  const languageLabel = language === "auto" ? "automatic language" : `${language} language`;
  const timeRange = formatTimeRangeLabel(defaults.time_range || "");
  const safeSearch = formatSafeSearchLabel(defaults.safesearch);
  return `${category} · ${timeRange} · ${languageLabel} · safe search ${safeSearch}`;
}

function formatAutocompleteStatus(autocomplete = {}) {
  const provider = String(autocomplete.provider || "SearXNG default").trim();
  const minChars = Number(autocomplete.min_chars ?? 3);
  const limit = Number(autocomplete.limit ?? 8);
  const minCharsLabel = Number.isFinite(minChars) ? minChars : 3;
  const limitLabel = Number.isFinite(limit) ? limit : 8;
  return `${provider} · after ${minCharsLabel} characters · up to ${limitLabel} suggestions`;
}

function formatOllamaModelInventory(ollama = {}) {
  const models = Array.isArray(ollama.models)
    ? ollama.models.map((model) => String(model || "").trim()).filter(Boolean)
    : [];

  if (!models.length) {
    return "No local models reported.";
  }

  const visibleModels = models.slice(0, 5).join(", ");
  const overflow = models.length > 5 ? `, +${models.length - 5} more` : "";
  return `${models.length} installed: ${visibleModels}${overflow}`;
}

function formatActiveOllamaModel(ollama = {}, selectedModel = "") {
  const model = normalizeAiModelPreference(selectedModel || ollama.default_model || "");
  const models = Array.isArray(ollama.models)
    ? ollama.models.map((entry) => String(entry || "").trim().toLowerCase()).filter(Boolean)
    : [];

  if (!model) {
    return "No default model selected.";
  }
  if (!models.length) {
    return `${model} · waiting for Ollama to report installed models`;
  }
  return models.includes(model.toLowerCase())
    ? `${model} · installed locally`
    : `${model} · not reported by Ollama`;
}

function formatOllamaGenerationDefaults(defaults = {}) {
  const temperature = Number(defaults.temperature ?? 0.2);
  const numPredict = Number(defaults.num_predict ?? 240);
  const temperatureLabel = Number.isFinite(temperature) ? temperature : 0.2;
  const numPredictLabel = Number.isFinite(numPredict) ? Math.round(numPredict) : 240;
  return `temperature ${temperatureLabel} · prediction limit ${numPredictLabel}`;
}

function updateServiceStatusDetails(provider, providerBaseUrl, ollama, selectedAiModel) {
  const searchDefaults = state.health?.search_defaults || {};
  const autocomplete = state.health?.autocomplete || {};
  const aiDefaults = state.health?.ai_defaults || {};

  setStatusText(searxngHealth, formatHealthStatus(provider?.status, provider?.detail));
  setStatusText(searxngEndpoint, providerBaseUrl || "Not configured");
  setStatusText(searxngCapabilities, formatCommaList(provider?.capabilities, "Search"));
  setStatusText(searxngProfile, formatSearchProfileStatus(searchDefaults));
  setStatusText(searxngEngines, formatCommaList(searchDefaults.engines, "SearXNG default engines"));
  setStatusText(searxngAutocomplete, formatAutocompleteStatus(autocomplete));

  setStatusText(ollamaHealth, formatHealthStatus(ollama?.status, ollama?.detail));
  setStatusText(ollamaEndpoint, ollama?.base_url || "Not configured");
  setStatusText(ollamaModels, formatOllamaModelInventory(ollama));
  setStatusText(ollamaActiveModel, formatActiveOllamaModel(ollama, selectedAiModel));
  setStatusText(ollamaGeneration, formatOllamaGenerationDefaults(aiDefaults));
  setStatusText(ollamaContext, `uses up to ${Number(aiDefaults.max_sources ?? 5) || 5} search sources`);
}

function getDeploymentUrls(deployment) {
  const rawUrls = Array.isArray(deployment?.access_urls) ? deployment.access_urls : [];
  const normalizedUrls = rawUrls
    .map((entry) => ({
      label: String(entry?.label || "Access").trim() || "Access",
      url: String(entry?.url || "").trim(),
    }))
    .filter((entry) => /^https?:\/\//i.test(entry.url));

  const localUrl = String(deployment?.local_url || "").trim();
  const networkUrl = String(deployment?.network_url || "").trim();
  if (localUrl && !normalizedUrls.some((entry) => entry.url === localUrl)) {
    normalizedUrls.unshift({ label: "Local", url: localUrl });
  }
  if (networkUrl && !normalizedUrls.some((entry) => entry.url === networkUrl)) {
    normalizedUrls.push({ label: "Network", url: networkUrl });
  }
  return normalizedUrls;
}

function describeAccessMode(deployment) {
  const summary = String(deployment?.summary || "").trim();
  if (summary) {
    return summary;
  }
  const accessUrls = getDeploymentUrls(deployment);
  if (deployment?.shared_on_network) {
    const networkUrl = accessUrls.find((entry) => entry.label === "Network")?.url || "";
    return networkUrl
      ? `Shared on your local network at ${networkUrl}.`
      : "Shared on your local network.";
  }
  const localUrl = accessUrls.find((entry) => entry.label === "Local")?.url || "";
  return localUrl
    ? `Running only on this device at ${localUrl}.`
    : "Running only on this device.";
}

function describeAccessCardStatus(deployment) {
  const summary = String(deployment?.summary || "").trim();
  const accessUrls = getDeploymentUrls(deployment);
  if (deployment?.shared_on_network) {
    const networkUrl = accessUrls.find((entry) => entry.label === "Network")?.url || "";
    return networkUrl
      ? `${compactEndpointLabel(networkUrl)} · Shared on local network`
      : summary || "Shared on local network";
  }
  const localUrl = accessUrls.find((entry) => entry.label === "Local")?.url || "";
  return localUrl
    ? `${compactEndpointLabel(localUrl)} · This device only`
    : summary || "This device only";
}

function describeAccessDestinations(deployment) {
  const accessUrls = getDeploymentUrls(deployment);
  if (!accessUrls.length) {
    return describeAccessMode(deployment);
  }
  if (accessUrls.length === 1) {
    return `${describeAccessMode(deployment)} Open it at ${accessUrls[0].url}.`;
  }

  const labeledUrls = accessUrls.map((entry) => `${entry.label}: ${entry.url}`);
  return `${describeAccessMode(deployment)} Open it at ${labeledUrls.join(" · ")}.`;
}

function setServiceCardMeta(element, value) {
  if (!element) {
    return;
  }

  const text = String(value || "").trim();
  element.replaceChildren();
  element.removeAttribute("aria-label");
  if (!text) {
    return;
  }

  const [endpoint, ...detailParts] = text.split(" · ");
  if (!detailParts.length) {
    element.textContent = text;
    return;
  }

  const endpointNode = document.createElement("span");
  endpointNode.className = "service-card-endpoint";
  endpointNode.textContent = endpoint;

  const detailNode = document.createElement("span");
  detailNode.className = "service-card-detail";
  const detail = detailParts.join(" · ");
  detailNode.textContent = detail;
  element.setAttribute("aria-label", `${endpoint}. ${detail}`);

  element.append(endpointNode, " ", detailNode);
}

function getAutocompletePanelForInput(input) {
  const form = input?.closest?.("[data-search-form]");
  return form?.querySelector?.("[data-autocomplete-panel]") || null;
}

function getAutocompleteInputForPanel(panel) {
  const form = panel?.closest?.("[data-search-form]");
  const input = form?.querySelector?.('input[name="q"]');
  return input instanceof HTMLInputElement ? input : null;
}

function updateSearchClearButtons() {
  searchClearButtons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const form = button.closest("[data-search-form]");
    const input = form?.querySelector?.('input[name="q"]');
    const hasSearchText = input instanceof HTMLInputElement && Boolean(input.value.trim());
    button.hidden = !hasSearchText;
    const tools = button.closest(".search-tools");
    if (tools instanceof HTMLElement) {
      tools.hidden = !hasSearchText;
    }
  });
}

function setAutocompleteExpanded(input, expanded) {
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  input.setAttribute("aria-expanded", expanded ? "true" : "false");
}

function hideAutocompletePanels({ clear = false } = {}) {
  autocompletePanels.forEach((panel) => {
    if (!(panel instanceof HTMLElement)) {
      return;
    }

    panel.hidden = true;
    if (clear) {
      panel.innerHTML = "";
    }

    const form = panel.closest("[data-search-form]");
    form?.classList.remove("has-autocomplete-open");
    setAutocompleteExpanded(getAutocompleteInputForPanel(panel), false);
  });
}

function cancelAutocompleteRequest() {
  if (state.autocompleteTimer) {
    window.clearTimeout(state.autocompleteTimer);
    state.autocompleteTimer = null;
  }

  state.autocompleteRequestId += 1;
  state.autocompleteAbortController?.abort();
  state.autocompleteAbortController = null;
}

function clearSuggestions({ clearIntent = true } = {}) {
  cancelAutocompleteRequest();
  state.autocompleteQuery = "";
  state.autocompleteSuggestions = [];
  state.autocompleteActiveInput = null;
  if (clearIntent) {
    state.autocompleteIntentInput = null;
  }
  hideAutocompletePanels({ clear: true });
  updateSearchClearButtons();
}

function getAutocompleteFallbackSuggestions(query) {
  const normalizedQuery = String(query || "").trim().replace(/\s+/g, " ");
  if (!normalizedQuery) {
    return [];
  }

  if (normalizeSuggestionKey(normalizedQuery) === AUTOCOMPLETE_EXAMPLE_QUERY) {
    return [...AUTOCOMPLETE_EXAMPLE_SUGGESTIONS];
  }

  const suffixes = [
    "news",
    "images",
    "meaning",
    "near me",
    "reddit",
    "reviews",
    "wiki",
    "videos",
    "map",
    "2026",
    "history",
    "price",
  ];

  return suffixes.map((suffix) => buildRefinedQuery(normalizedQuery, suffix));
}

function getAutocompleteDisplaySuggestions(query, suggestions = []) {
  const normalizedQuery = normalizeSuggestionKey(query);
  if (!normalizedQuery) {
    return [];
  }

  if (normalizedQuery === AUTOCOMPLETE_EXAMPLE_QUERY) {
    return [...AUTOCOMPLETE_EXAMPLE_SUGGESTIONS];
  }

  return getDistinctQuerySuggestions([
    ...(Array.isArray(suggestions) ? suggestions : []),
    ...getAutocompleteFallbackSuggestions(query),
  ], query).slice(0, AUTOCOMPLETE_SUGGESTION_LIMIT);
}

function getAutocompleteQuestions(query, suggestions = []) {
  const normalizedQuery = normalizeSuggestionKey(query);
  if (!normalizedQuery) {
    return [];
  }

  if (normalizedQuery === AUTOCOMPLETE_EXAMPLE_QUERY) {
    return [...AUTOCOMPLETE_EXAMPLE_QUESTIONS];
  }

  const suggestionQuestions = getDistinctQuerySuggestions(suggestions, "")
    .filter((suggestion) => /\?$/.test(suggestion))
    .slice(0, AUTOCOMPLETE_QUESTION_LIMIT);
  if (suggestionQuestions.length >= AUTOCOMPLETE_QUESTION_LIMIT) {
    return suggestionQuestions;
  }

  return getDistinctQuerySuggestions([
    ...suggestionQuestions,
    `What is ${query}?`,
    `Why is ${query} popular?`,
    `Where can I find ${query}?`,
  ], "").slice(0, AUTOCOMPLETE_QUESTION_LIMIT);
}

function getAutocompleteRelatedItems(query, suggestions = []) {
  const normalizedQuery = normalizeSuggestionKey(query);
  if (!normalizedQuery) {
    return [];
  }

  if (normalizedQuery === AUTOCOMPLETE_EXAMPLE_QUERY) {
    return AUTOCOMPLETE_EXAMPLE_RELATED.map((item) => ({ ...item }));
  }

  const labels = getDistinctQuerySuggestions([
    query,
    ...getDistinctQuerySuggestions(suggestions, query),
    `${query} images`,
    `${query} news`,
    `${query} map`,
  ], "").slice(0, AUTOCOMPLETE_RELATED_LIMIT);
  const classes = ["is-generic-a", "is-generic-b", "is-generic-c", "is-generic-d"];

  return labels.map((label, index) => ({
    title: label,
    meta: index === 0 ? "Search topic" : "Related search",
    className: classes[index % classes.length],
  }));
}

function formatAutocompleteSuggestionText(query, suggestion) {
  const queryTokens = new Set(getQueryTokens(query));
  const rawSuggestion = String(suggestion || "");

  if (!queryTokens.size) {
    return escapeHtml(rawSuggestion);
  }

  const lowerSuggestion = rawSuggestion.toLowerCase();
  const lowerQuery = String(query || "").trim().toLowerCase();
  if (lowerQuery && lowerSuggestion.startsWith(lowerQuery)) {
    const prefix = rawSuggestion.slice(0, lowerQuery.length);
    const suffix = rawSuggestion.slice(lowerQuery.length);
    if (!suffix) {
      return escapeHtml(prefix);
    }

    const leadingSpace = suffix.match(/^\s+/)?.[0] || "";
    const suffixText = suffix.slice(leadingSpace.length);
    return `${escapeHtml(prefix)}${escapeHtml(leadingSpace)}<strong>${escapeHtml(suffixText)}</strong>`;
  }

  return rawSuggestion
    .split(/(\s+)/)
    .map((part) => {
      if (!part.trim()) {
        return escapeHtml(part);
      }

      const token = part.toLowerCase().replace(/[^a-z0-9]+/g, "");
      return queryTokens.has(token)
        ? escapeHtml(part)
        : `<strong>${escapeHtml(part)}</strong>`;
    })
    .join("");
}

function buildAutocompletePanelMarkup(query, suggestions = []) {
  const displaySuggestions = getAutocompleteDisplaySuggestions(query, suggestions);
  const questions = getAutocompleteQuestions(query, suggestions);
  const relatedItems = getAutocompleteRelatedItems(query, suggestions);

  const suggestionMarkup = displaySuggestions
    .map((suggestion) => `
      <button
        type="button"
        class="autocomplete-suggestion"
        data-autocomplete-query="${escapeHtml(suggestion)}"
        role="option"
      >
        <span class="autocomplete-row-icon">${SEARCH_ICON_SVG}</span>
        <span class="autocomplete-suggestion-text">${formatAutocompleteSuggestionText(query, suggestion)}</span>
      </button>
    `)
    .join("");

  const questionMarkup = questions
    .map((question) => `
      <button
        type="button"
        class="autocomplete-question"
        data-autocomplete-query="${escapeHtml(question)}"
      >
        <span class="autocomplete-question-icon">${SEARCH_ICON_SVG}</span>
        <span>${escapeHtml(question)}</span>
      </button>
    `)
    .join("");

  const relatedMarkup = relatedItems
    .map((item) => `
      <button
        type="button"
        class="autocomplete-related-card"
        data-autocomplete-query="${escapeHtml(item.title)}"
      >
        <span class="autocomplete-related-thumb ${escapeHtml(item.className || "")}" aria-hidden="true"></span>
        <span class="autocomplete-related-title">${escapeHtml(item.title)}</span>
        <span class="autocomplete-related-meta">${escapeHtml(item.meta || "Related search")}</span>
      </button>
    `)
    .join("");

  return `
    <div class="autocomplete-panel-grid">
      <div class="autocomplete-suggestion-column" role="listbox" aria-label="Search predictions">
        ${suggestionMarkup}
      </div>
      <aside class="autocomplete-discovery" aria-label="Related searches">
        <section class="autocomplete-section autocomplete-section-questions">
          <h2>People also ask</h2>
          <div class="autocomplete-question-list">
            ${questionMarkup}
          </div>
        </section>
        <section class="autocomplete-section autocomplete-section-related">
          <h2>People also search for</h2>
          <div class="autocomplete-related-grid">
            ${relatedMarkup}
          </div>
        </section>
      </aside>
    </div>
  `;
}

function renderSuggestions(suggestions, { query = "", input = state.autocompleteActiveInput } = {}) {
  const activeInput = input instanceof HTMLInputElement ? input : getVisibleSearchInput();
  const activeQuery = String(query || activeInput?.value || "").trim();
  const panel = activeInput ? getAutocompletePanelForInput(activeInput) : null;

  state.autocompleteQuery = activeQuery;
  state.autocompleteSuggestions = Array.isArray(suggestions) ? suggestions : [];
  state.autocompleteActiveInput = activeInput || null;
  updateSearchClearButtons();

  if (
    !(activeInput instanceof HTMLInputElement)
    || !(panel instanceof HTMLElement)
    || !activeQuery
    || !isAutocompleteArmedForInput(activeInput)
  ) {
    hideAutocompletePanels({ clear: true });
    return;
  }

  const displaySuggestions = getAutocompleteDisplaySuggestions(activeQuery, suggestions);
  if (!displaySuggestions.length) {
    hideAutocompletePanels({ clear: true });
    return;
  }

  autocompletePanels.forEach((otherPanel) => {
    if (otherPanel !== panel && otherPanel instanceof HTMLElement) {
      otherPanel.hidden = true;
      otherPanel.closest("[data-search-form]")?.classList.remove("has-autocomplete-open");
      setAutocompleteExpanded(getAutocompleteInputForPanel(otherPanel), false);
    }
  });

  panel.innerHTML = buildAutocompletePanelMarkup(activeQuery, suggestions);
  panel.hidden = false;
  panel.closest("[data-search-form]")?.classList.add("has-autocomplete-open");
  setAutocompleteExpanded(activeInput, true);
}

function runAutocompleteSearch(query, input = state.autocompleteActiveInput) {
  const submittedQuery = String(query || "").trim();
  if (!submittedQuery) {
    return;
  }

  const form = input?.closest?.("[data-search-form]");
  const isHomeForm = form?.getAttribute("data-search-form") === "home";
  const nextView = state.query
    ? state.activeView
    : (isHomeForm ? state.pendingView : getEffectivePreferences().defaultView);
  const nextNewsTopic = nextView === "news" ? DEFAULT_NEWS_TOPIC : state.newsTopic;

  syncQueryInputs(submittedQuery);
  hideAutocompletePanels({ clear: true });
  disarmAutocomplete(input instanceof HTMLInputElement ? input : null);
  runSearch({
    query: submittedQuery,
    page: 1,
    view: nextView,
    newsTopic: nextNewsTopic,
    newsBaseQuery: submittedQuery,
    literalSearch: false,
  });
}

function setView(view) {
  if (!shell) {
    return;
  }

  const didChangeView = shell.dataset.view !== view;
  shell.dataset.view = view;
  if (hero) {
    hero.hidden = view !== "home";
  }
  if (resultsShell) {
    resultsShell.hidden = view !== "results";
  }

  if (didChangeView) {
    focusVisibleSearchInput();
  }
}

function setPendingHomeView(view) {
  state.pendingView = normalizeResultsView(view);
}

function setActiveResultsView(view) {
  state.activeView = normalizeResultsView(view);
  if (state.activeView !== "images") {
    closeImagePreview({ restoreFocus: false });
  }
  setPendingHomeView(state.activeView);
  syncAutoLoadButtons();
  syncAiToggleButtons();

  if (resultsShell) {
    resultsShell.dataset.view = state.activeView;
  }
  if (resultsLayout) {
    resultsLayout.dataset.view = state.activeView;
  }

  resultsViewButtons.forEach((button) => {
    const isActive = button.getAttribute("data-results-view") === state.activeView;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    if (isActive) {
      button.setAttribute("aria-current", "true");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  renderNewsTopicNavigation();
}

function normalizeNewsTopic(value) {
  const normalizedValue = String(value || "").trim().toLowerCase();
  return NEWS_TOPICS.some((topic) => topic.id === normalizedValue)
    ? normalizedValue
    : DEFAULT_NEWS_TOPIC;
}

function getNewsTopicOption(topicId = state.newsTopic) {
  return NEWS_TOPICS.find((topic) => topic.id === normalizeNewsTopic(topicId)) || NEWS_TOPICS[0];
}

function getNewsTopicLabel(topicId = state.newsTopic) {
  return getNewsTopicOption(topicId)?.label || "Top";
}

function newsTopicUsesSearchQuery(topicId = state.newsTopic) {
  return Boolean(getNewsTopicOption(topicId)?.usesSearchQuery);
}

function getNewsBaseQuery(fallback = state.query) {
  return String(state.newsBaseQuery || fallback || "").trim();
}

function getNewsTopicDisplayQuery(topicId = state.newsTopic, baseQuery = getNewsBaseQuery()) {
  const normalizedTopic = normalizeNewsTopic(topicId);
  if (newsTopicUsesSearchQuery(normalizedTopic)) {
    return String(baseQuery || "").trim();
  }

  return buildDefaultNewsTopicQuery(normalizedTopic);
}

function isGeneratedNewsTopicQuery(
  query = state.query,
  topicId = state.newsTopic,
  baseQuery = state.newsBaseQuery,
) {
  return normalizeSuggestionKey(query) === normalizeSuggestionKey(
    getNewsTopicDisplayQuery(topicId, baseQuery),
  );
}

function isGeneratedNewsTopicState() {
  return state.activeView === "news"
    && !newsTopicUsesSearchQuery(state.newsTopic)
    && isGeneratedNewsTopicQuery(state.query, state.newsTopic, state.newsBaseQuery);
}

function getNewsTopicKeywords(topicId = state.newsTopic) {
  const keywords = getNewsTopicOption(topicId)?.keywords;
  return Array.isArray(keywords) ? keywords : [];
}

function getVisibleNewsTopicOptions() {
  return NEWS_TOPICS.filter((topic) => !topic.usesSearchQuery);
}

function buildNewsSearchTopicButtonMarkup() {
  const searchTopic = NEWS_TOPICS.find((topic) => topic.usesSearchQuery);
  const baseQuery = getNewsBaseQuery(state.query);
  if (!searchTopic || !baseQuery) {
    return "";
  }

  const isActive = searchTopic.id === normalizeNewsTopic(state.newsTopic);
  return `
    <button
      type="button"
      class="news-topic-chip news-topic-chip-search${isActive ? " is-active" : ""}"
      data-news-topic="${escapeHtml(searchTopic.id)}"
      aria-pressed="${String(isActive)}"
    >Search &quot;${escapeHtml(baseQuery)}&quot;</button>
  `;
}

function buildNewsTopicButtonsMarkup() {
  return [
    buildNewsSearchTopicButtonMarkup(),
    ...getVisibleNewsTopicOptions().map((topic) => {
      const isActive = topic.id === normalizeNewsTopic(state.newsTopic);
      return `
        <button
          type="button"
          class="news-topic-chip${isActive ? " is-active" : ""}"
          data-news-topic="${escapeHtml(topic.id)}"
          aria-pressed="${String(isActive)}"
        >${escapeHtml(topic.label)}</button>
      `;
    }),
  ].join("");
}

function renderNewsTopicNavigation() {
  if (newsTopicStrip instanceof HTMLElement) {
    const topicMarkup = buildNewsTopicButtonsMarkup();
    if (state.activeView === "news" && state.query && topicMarkup) {
      newsTopicStrip.hidden = false;
      newsTopicStrip.innerHTML = topicMarkup;
    } else {
      newsTopicStrip.hidden = true;
      newsTopicStrip.innerHTML = "";
    }
  }
}

function buildDefaultNewsTopicQuery(topicId = state.newsTopic) {
  const normalizedTopic = normalizeNewsTopic(topicId);
  const areaLabel = getSavedAreaLabel();
  const topic = getNewsTopicOption(normalizedTopic);

  if (newsTopicUsesSearchQuery(normalizedTopic)) {
    return "";
  }

  if (normalizedTopic === "local") {
    return areaLabel
      ? `Local News ${areaLabel}`.replace(/\s+/g, " ").trim()
      : `Local News ${getZipCodeBias()}`.replace(/\s+/g, " ").trim();
  }

  if (normalizedTopic === "top") {
    return "Top News";
  }

  const topicQuery = String(topic?.query || "").trim();
  const topicLabel = normalizedTopic === "us" && topicQuery
    ? "United States"
    : getNewsTopicLabel(normalizedTopic);
  return buildRefinedQuery(topicLabel, "News");
}

function getNewsBiasedQuery(query, { useArea = false } = {}) {
  const baseQuery = String(query || "").trim();
  if (!baseQuery || getQueryAreaHint(baseQuery) || !useArea) {
    return baseQuery;
  }

  const areaTerms = getSavedAreaTerms()
    .filter((term) => !baseQuery.toLowerCase().includes(term.toLowerCase()));
  if (areaTerms.length) {
    return `${baseQuery} ${areaTerms.join(" ")}`.replace(/\s+/g, " ").trim();
  }

  return `${baseQuery} ${getZipCodeBias()}`.replace(/\s+/g, " ").trim();
}

function buildNewsTopicQuery(query = state.query, topicId = state.newsTopic) {
  const normalizedTopic = normalizeNewsTopic(topicId);
  const baseQuery = String(query || "").trim();
  if (!baseQuery || !newsTopicUsesSearchQuery(normalizedTopic)) {
    return buildDefaultNewsTopicQuery(normalizedTopic);
  }

  return baseQuery;
}

function getNewsTopicPresentation(topicId = state.newsTopic, query = state.query) {
  const normalizedTopic = normalizeNewsTopic(topicId);
  const topicLabel = getNewsTopicLabel(normalizedTopic);
  const displayQuery = String(query || "").trim();
  const topicSearchQuery = buildDefaultNewsTopicQuery(normalizedTopic);
  const locationLabel = normalizedTopic === "local" ? getPreferredAreaLabel() : "";

  if (newsTopicUsesSearchQuery(normalizedTopic)) {
    return {
      contextLabel: topicLabel,
      title: displayQuery || "News",
      subtitle: displayQuery
        ? `Latest major coverage related to "${displayQuery}".`
        : "Latest coverage from the returned news search.",
      loadingText: displayQuery ? `Searching for "${displayQuery}"...` : "Searching news...",
      emptyText: displayQuery ? `No news results came back for "${displayQuery}".` : "No news results came back.",
      singularLabel: "story",
      pluralLabel: "stories",
      qualifier: displayQuery ? `for "${displayQuery}"` : "",
    };
  }

  if (normalizedTopic === "top") {
    return {
      contextLabel: "Top stories",
      title: "Top News",
      subtitle: "The biggest headlines across all major categories right now.",
      loadingText: `Searching for "${topicSearchQuery}"...`,
      emptyText: "No top news results came back right now.",
      singularLabel: "top story",
      pluralLabel: "top stories",
      qualifier: "",
    };
  }

  if (normalizedTopic === "local") {
    return {
      contextLabel: locationLabel ? `Local · ${locationLabel}` : "Local",
      title: "Local News",
      subtitle: locationLabel
        ? `Top local headlines closest to ${locationLabel}.`
        : "Top local headlines right now.",
      loadingText: `Searching for "${topicSearchQuery}"...`,
      emptyText: locationLabel
        ? `No local news results came back near ${locationLabel}.`
        : "No local news results came back.",
      singularLabel: locationLabel ? `local story near ${locationLabel}` : "local story",
      pluralLabel: locationLabel ? `local stories near ${locationLabel}` : "local stories",
      qualifier: "",
    };
  }

  return {
    contextLabel: topicLabel,
    title: topicLabel,
    subtitle: `Top ${topicLabel} headlines right now.`,
    loadingText: `Searching for "${topicSearchQuery}"...`,
    emptyText: `No ${topicLabel.toLowerCase()} news results came back right now.`,
    singularLabel: `${topicLabel} story`,
    pluralLabel: `${topicLabel} stories`,
    qualifier: "",
  };
}

function buildNewsSummaryText(count, topicId = state.newsTopic, query = state.query) {
  const presentation = getNewsTopicPresentation(topicId, query);
  const label = count === 1 ? presentation.singularLabel : presentation.pluralLabel;
  const qualifier = presentation.qualifier ? ` ${presentation.qualifier}` : "";
  return `Showing ${count} ${label}${qualifier}.`;
}

function buildNewsResultHaystack(result) {
  return [
    result?.title,
    result?.content,
    result?.url,
    result?.metadata,
    result?.source,
    result?.domain,
    result?.engine,
  ].filter(Boolean).join(" ").toLowerCase();
}

function getNewsQueryTokens(query = getNewsBaseQuery()) {
  return getQueryTokens(query)
    .filter((token) => token && !NEWS_QUERY_STOPWORDS.has(token));
}

function getRequiredNewsQueryMatches(tokens = getNewsQueryTokens()) {
  if (!tokens.length) {
    return 0;
  }

  if (tokens.length <= 2) {
    return tokens.length;
  }

  return Math.max(2, Math.ceil(tokens.length * 0.6));
}

function scoreNewsResultForQuery(result, query = getNewsBaseQuery()) {
  const normalizedQuery = normalizeSuggestionKey(query);
  const tokens = getNewsQueryTokens(normalizedQuery);
  const requiredMatches = getRequiredNewsQueryMatches(tokens);
  const title = String(result?.title || "").toLowerCase();
  const content = String(result?.content || "").toLowerCase();
  const source = String(result?.source || "").toLowerCase();
  const domain = String(result?.domain || "").toLowerCase();
  const url = String(result?.url || "").toLowerCase();
  const haystack = [title, content, source, domain, url].filter(Boolean).join(" ");
  const normalizedTitle = normalizeSuggestionKey(title);
  const normalizedHaystack = normalizeSuggestionKey(haystack);
  const compactQuery = getCompactQueryValue(normalizedQuery);
  const titleCompact = getCompactQueryValue(title);
  const haystackCompact = getCompactQueryValue(haystack);
  const phraseMatch = Boolean(normalizedQuery && (
    normalizedTitle.includes(normalizedQuery)
    || normalizedHaystack.includes(normalizedQuery)
  ));
  const compactMatch = Boolean(compactQuery && (
    titleCompact.includes(compactQuery)
    || haystackCompact.includes(compactQuery)
  ));
  const matchCount = countMatchingQueryTokens(haystack, tokens);
  const titleMatchCount = countMatchingQueryTokens(title, tokens);

  let score = 0;
  if (normalizedTitle.includes(normalizedQuery) && normalizedQuery) {
    score += 260;
  } else if (phraseMatch) {
    score += 205;
  }
  if (compactMatch) {
    score += 180;
  }

  score += titleMatchCount * 72;
  score += matchCount * 38;

  if (tokens.length === 1 && matchCount > 0) {
    score += 40;
  }
  if (tokens.length > 1 && titleMatchCount >= requiredMatches) {
    score += 140;
  }
  if (tokens.length > 1 && matchCount >= requiredMatches) {
    score += 110;
  }
  if (tokens.length > 1 && titleMatchCount === 0 && matchCount < requiredMatches && !phraseMatch && !compactMatch) {
    score -= 240;
  }
  if (tokens.length > 1 && matchCount === 1 && !phraseMatch && !compactMatch) {
    score -= 170;
  }

  return {
    score,
    tokens,
    requiredMatches,
    matchCount,
    titleMatchCount,
    phraseMatch,
    compactMatch,
  };
}

function getLocalNewsResultScore(result) {
  const haystack = buildNewsResultHaystack(result);
  if (!haystack) {
    return -1;
  }

  const zipCode = getZipCodeBias();
  const areaTerms = getSavedAreaTerms()
    .map((term) => term.toLowerCase())
    .filter(Boolean);

  let score = 0;
  if (zipCode && haystack.includes(zipCode)) {
    score += 220;
  }

  areaTerms.forEach((term, index) => {
    if (!term || !haystack.includes(term)) {
      return;
    }

    score += index === 0 ? 160 : 90;
  });

  if (areaTerms.length > 1 && areaTerms.every((term) => haystack.includes(term))) {
    score += 140;
  }

  return score;
}

function scoreNewsResultForTopic(result, topicId = state.newsTopic) {
  const normalizedTopic = normalizeNewsTopic(topicId);
  if (newsTopicUsesSearchQuery(normalizedTopic) || normalizedTopic === "top") {
    return 1;
  }
  if (normalizedTopic === "local") {
    return getLocalNewsResultScore(result);
  }

  const title = String(result?.title || "").toLowerCase();
  const haystack = buildNewsResultHaystack(result);
  const keywords = getNewsTopicKeywords(normalizedTopic);
  if (!keywords.length || !haystack) {
    return 0;
  }

  let score = 0;
  keywords.forEach((keyword) => {
    if (!keyword) {
      return;
    }

    if (title.includes(keyword)) {
      score += keyword.includes(" ") ? 110 : 70;
      return;
    }

    if (haystack.includes(keyword)) {
      score += keyword.includes(" ") ? 54 : 30;
    }
  });

  return score;
}

function filterNewsResultsForTopic(results = [], topicId = state.newsTopic, query = getNewsBaseQuery()) {
  const normalizedTopic = normalizeNewsTopic(topicId);
  if (newsTopicUsesSearchQuery(normalizedTopic)) {
    const ranked = (Array.isArray(results) ? results : [])
      .map((result, index) => ({
        result,
        index,
        ...scoreNewsResultForQuery(result, query),
      }))
      .filter((entry) => entry.score > 0)
      .sort((first, second) => (
        second.score - first.score
        || Number(second.phraseMatch) - Number(first.phraseMatch)
        || Number(second.compactMatch) - Number(first.compactMatch)
        || second.titleMatchCount - first.titleMatchCount
        || second.matchCount - first.matchCount
        || first.index - second.index
      ));

    const queryTokens = ranked[0]?.tokens || getNewsQueryTokens(query);
    if (queryTokens.length < 2) {
      return ranked.map((entry) => entry.result);
    }

    const requiredMatches = getRequiredNewsQueryMatches(queryTokens);
    const strictMatches = ranked.filter((entry) => (
      entry.phraseMatch
      || entry.compactMatch
      || entry.titleMatchCount >= requiredMatches
      || entry.matchCount >= requiredMatches
      || entry.score >= 180
    ));

    return (strictMatches.length ? strictMatches : ranked)
      .map((entry) => entry.result);
  }

  if (normalizedTopic === "top") {
    return Array.isArray(results) ? results : [];
  }

  const ranked = (Array.isArray(results) ? results : [])
    .map((result, index) => ({
      result,
      index,
      score: scoreNewsResultForTopic(result, normalizedTopic),
    }))
    .filter((entry) => entry.score > 0)
    .sort((first, second) => second.score - first.score || first.index - second.index);

  return ranked.map((entry) => entry.result);
}

function syncUrl() {
  const params = new URLSearchParams();
  const effective = getEffectivePreferences();
  const defaults = getDefaults();
  const shouldPersistNewsTopic = state.newsTopic !== DEFAULT_NEWS_TOPIC && (
    state.activeView === "news"
    || isGeneratedNewsTopicQuery(state.query, state.newsTopic, state.newsBaseQuery)
  );

  if (state.query) {
    params.set("q", state.query);
  }
  if (state.literalSearch) {
    params.set("literal", "1");
  }
  if (state.activeView !== defaults.defaultView) {
    params.set("view", state.activeView);
  }
  if (shouldPersistNewsTopic) {
    params.set("newsTopic", state.newsTopic);
  }
  if (state.newsBaseQuery && state.newsBaseQuery !== state.query) {
    params.set("newsBaseQuery", state.newsBaseQuery);
  }
  if (effective.provider !== defaults.provider) {
    params.set("provider", effective.provider);
  }
  if (effective.safesearch !== defaults.safesearch) {
    params.set("safesearch", effective.safesearch);
  }
  if (effective.language !== defaults.language && effective.language) {
    params.set("language", effective.language);
  }
  const effectiveTimeRange = getEffectiveTimeRangeForView(state.activeView);
  const defaultTimeRange = getDefaultTimeRangeForView(state.activeView);
  const effectiveEngines = getEffectiveEnginesForView(state.activeView);
  const defaultEngines = getDefaultEnginesForView(state.activeView);
  if (effectiveTimeRange && effectiveTimeRange !== defaultTimeRange) {
    params.set("time_range", effectiveTimeRange);
  }
  if (effectiveEngines && effectiveEngines !== defaultEngines) {
    params.set("engines", effectiveEngines);
  }

  const queryString = params.toString();
  window.history.replaceState({}, "", queryString ? `?${queryString}` : "/");
}

function renderFilters() {
  if (!activeFilters) {
    return;
  }

  const effective = getEffectivePreferences();
  const defaults = getDefaults();
  const activeTimeRange = getEffectiveTimeRangeForView(state.activeView);
  const defaultTimeRange = getDefaultTimeRangeForView(state.activeView);
  const activeEngines = getEffectiveEnginesForView(state.activeView);
  const defaultEngines = getDefaultEnginesForView(state.activeView);
  const chips = [];
  const clearableFilterCount = [
    effective.language && effective.language !== defaults.language,
    activeTimeRange && activeTimeRange !== defaultTimeRange,
    activeEngines && activeEngines !== defaultEngines,
    effective.safesearch !== defaults.safesearch,
  ].filter(Boolean).length;

  if (effective.language && effective.language !== defaults.language) {
    chips.push({
      label: "Language",
      value: effective.language,
      action: "clear-language",
    });
  }
  if (activeTimeRange && activeTimeRange !== defaultTimeRange) {
    chips.push({
      label: "Time",
      value: formatTimeRangeLabel(activeTimeRange),
      action: "clear-time-range",
    });
  }
  if (activeEngines && activeEngines !== defaultEngines) {
    const engineCount = activeEngines.split(",").filter(Boolean).length;
    chips.push({
      label: "Engines",
      value: engineCount === 1 ? activeEngines : `${engineCount} selected`,
      action: "clear-engines",
    });
  }
  if (effective.safesearch !== defaults.safesearch) {
    chips.push({
      label: "Safe search",
      value: effective.safesearch === "2" ? "Strict" : (effective.safesearch === "0" ? "Off" : "Moderate"),
      action: "clear-safesearch",
    });
  }
  if (state.activeView === "general" && state.generalWebSearchBias?.label) {
    chips.push({
      label: "Local results",
      value: state.generalWebSearchBias.label,
      action: "zip",
      clearAction: "local-literal",
      active: true,
    });
  }
  if (clearableFilterCount > 1) {
    chips.push({
      label: "Clear search limits",
      value: "",
      action: "clear-search-limits",
      tone: "reset",
    });
  }

  if (!chips.length) {
    activeFilters.innerHTML = "";
    activeFilters.hidden = true;
    if (resultsShell) {
      resultsShell.dataset.filterChips = "false";
    }
    return;
  }

  activeFilters.hidden = false;
  if (resultsShell) {
    resultsShell.dataset.filterChips = "true";
  }

  activeFilters.innerHTML = chips
    .map(({ label, value, action = "", tone = "", clearable = true, clearAction = "", active = false }) => {
      if (!action) {
        const staticClass = ["filter-pill", active ? "is-active" : ""].filter(Boolean).join(" ");
        return `<span class="${staticClass}">${escapeHtml(label)}: ${escapeHtml(value)}</span>`;
      }

      const pillClass = tone === "reset"
        ? "filter-pill-reset"
        : (clearable ? "filter-pill-clearable" : "");
      const buttonClass = ["filter-pill", "filter-pill-button", pillClass, active ? "is-active" : ""].filter(Boolean).join(" ");
      const dismissMarkup = tone === "reset" || !clearable
        ? ""
        : `<span class="filter-pill-dismiss" aria-hidden="true"${clearAction ? ` data-filter-clear-action="${escapeHtml(clearAction)}"` : ""}>×</span>`;
      return `<button type="button" class="${buttonClass}" data-filter-action="${escapeHtml(action)}">${escapeHtml(label)}${value ? `: ${escapeHtml(value)}` : ""}${dismissMarkup}</button>`;
    })
    .join("");
}

function buildRefinementItems() {
  if (!state.query || state.loading || state.activeView === "maps") {
    return [];
  }
  if (state.activeView === "news" && !newsTopicUsesSearchQuery(state.newsTopic)) {
    return [];
  }

  const items = [];
  const seen = new Set();
  const currentQuery = String(state.query || "").trim().replace(/\s+/g, " ");
  const defaultView = state.activeView === "news" ? "news" : "general";
  const currentKey = `${defaultView}|${normalizeSuggestionKey(currentQuery)}`;
  const hasPlaces = state.mapResults.length > 0;
  const localIntent = looksLikeLocalIntent(state.query) || hasPlaces;
  const baseSuggestions = getDistinctQuerySuggestions(
    state.querySuggestions,
    currentQuery,
  );

  const addItem = (query, { view = defaultView } = {}) => {
    const normalizedQuery = String(query || "").trim();
    const normalizedView = normalizeResultsView(view);
    if (!normalizedQuery) {
      return;
    }

    const key = `${normalizedView}|${normalizedQuery.toLowerCase()}`;
    if (key === currentKey || seen.has(key)) {
      return;
    }

    seen.add(key);
    items.push({
      query: normalizedQuery,
      view: normalizedView,
    });
  };

  baseSuggestions.forEach((suggestion) => addItem(suggestion, { view: defaultView }));

  const defaultItems = state.activeView === "news"
    ? [
      { query: buildRefinedQuery(state.query, "latest"), view: "news" },
      { query: buildRefinedQuery(state.query, "stock"), view: "news" },
      { query: buildRefinedQuery(state.query, "earnings"), view: "news" },
      { query: buildRefinedQuery(state.query, "stores"), view: "general" },
      { query: buildRefinedQuery(state.query, "customer service"), view: "general" },
      { query: buildRefinedQuery(state.query, "locations"), view: "general" },
    ]
    : state.activeView === "images"
      ? [
        { query: buildRefinedQuery(state.query, "near me") },
        { query: buildRefinedQuery(state.query, "open") },
        { query: buildRefinedQuery(state.query, "hours") },
        { query: buildRefinedQuery(state.query, "app") },
        { query: buildRefinedQuery(state.query, "customer service") },
        { query: buildRefinedQuery(state.query, "locations") },
      ]
      : [
        { query: buildRefinedQuery(state.query, localIntent ? "near me" : "near me") },
        { query: buildRefinedQuery(state.query, "open") },
        { query: buildRefinedQuery(state.query, "trade in value") },
        { query: buildRefinedQuery(state.query, "customer service") },
        { query: buildRefinedQuery(state.query, "hours") },
        { query: buildRefinedQuery(state.query, "locations") },
      ];

  defaultItems.forEach((item) => addItem(item.query, { view: item.view || defaultView }));

  return items.slice(0, 6);
}

function buildMapRefinementItems() {
  if (!state.query || state.loading || state.activeView !== "maps") {
    return [];
  }

  const items = [];
  const seen = new Set();
  const currentQuery = String(state.query || "").trim().replace(/\s+/g, " ");
  const currentKey = `maps|${normalizeSuggestionKey(currentQuery)}`;
  const baseSuggestions = getDistinctQuerySuggestions(
    state.querySuggestions,
    currentQuery,
  );

  const addItem = (query) => {
    const normalizedQuery = String(query || "").trim();
    if (!normalizedQuery) {
      return;
    }

    const key = `maps|${normalizeSuggestionKey(normalizedQuery)}`;
    if (key === currentKey || seen.has(key)) {
      return;
    }

    seen.add(key);
    items.push({
      query: normalizedQuery,
      view: "maps",
    });
  };

  baseSuggestions.forEach(addItem);
  [
    buildRefinedQuery(state.query, "near me"),
    buildRefinedQuery(state.query, "open now"),
    buildRefinedQuery(state.query, "hours"),
    buildRefinedQuery(state.query, "reviews"),
    buildRefinedQuery(state.query, "closest"),
    buildRefinedQuery(state.query, "24 hours"),
  ].forEach(addItem);

  return items.slice(0, 6);
}

function buildRefinementLabelMarkup(query) {
  const currentQuery = String(state.query || "").trim().replace(/\s+/g, " ");
  const normalizedCurrent = normalizeSuggestionKey(currentQuery);
  const normalizedQuery = normalizeSuggestionKey(query);

  if (normalizedCurrent && normalizedQuery.startsWith(normalizedCurrent)) {
    const prefix = query.slice(0, currentQuery.length).trim();
    const suffix = query.slice(prefix.length).trim();
    if (prefix && suffix) {
      return `
        <span class="refinement-card-prefix">${escapeHtml(prefix)}</span>
        <strong class="refinement-card-emphasis">${escapeHtml(suffix)}</strong>
      `;
    }
  }

  return `<span class="refinement-card-prefix">${escapeHtml(query)}</span>`;
}

function buildRefinementRailContentMarkup(items = []) {
  const normalizedItems = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!normalizedItems.length) {
    return "";
  }

  return `
    <div class="refinement-rail-head">
      <h2>People also search for</h2>
    </div>
    <div class="refinement-grid">
      ${normalizedItems.map((item) => (
        `<button
          type="button"
          class="refinement-card"
          data-refinement-query="${escapeHtml(item.query)}"
          data-refinement-view="${escapeHtml(item.view)}"
        >
          <span class="refinement-card-copy">${buildRefinementLabelMarkup(item.query)}</span>
          <span class="refinement-card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M10 4.75a5.25 5.25 0 1 0 3.22 9.4l4.31 4.32a.75.75 0 1 0 1.06-1.06l-4.32-4.31A5.25 5.25 0 0 0 10 4.75Zm0 1.5A3.75 3.75 0 1 1 6.25 10 3.75 3.75 0 0 1 10 6.25Z"/>
            </svg>
          </span>
        </button>`
      )).join("")}
    </div>
  `;
}

function buildRefinementRailMarkup(items = [], className = "") {
  const content = buildRefinementRailContentMarkup(items);
  if (!content) {
    return "";
  }

  const classes = ["refinement-rail", className].filter(Boolean).join(" ");
  return `
    <section class="${escapeHtml(classes)}" aria-label="People also search for">
      ${content}
    </section>
  `;
}

function ensurePaginationPrecedesRefinementRail() {
  if (!(pagination instanceof HTMLElement) || !(refinementRail instanceof HTMLElement)) {
    return;
  }

  const parent = refinementRail.parentElement;
  if (!(parent instanceof HTMLElement)) {
    return;
  }

  if (pagination.parentElement !== parent || pagination.nextElementSibling !== refinementRail) {
    parent.insertBefore(pagination, refinementRail);
  }
}

function ensureRefinementRailIsLastInMainColumn() {
  if (!refinementRail?.parentElement) {
    return;
  }

  if (refinementRail.parentElement.lastElementChild !== refinementRail) {
    refinementRail.parentElement.appendChild(refinementRail);
  }
  ensurePaginationPrecedesRefinementRail();
}

function renderRefinements() {
  if (!refinementRail) {
    return;
  }

  ensureRefinementRailIsLastInMainColumn();
  const items = buildRefinementItems();
  refinementRail.hidden = items.length === 0;
  refinementRail.innerHTML = items.length
    ? buildRefinementRailContentMarkup(items)
    : "";
}

function runRefinementSearchFromButton(button) {
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  runSearch({
    query: button.getAttribute("data-refinement-query") || state.query,
    page: 1,
    view: button.getAttribute("data-refinement-view") || state.activeView,
    literalSearch: false,
  });
}

function setResultsState(mode) {
  if (resultsRoot) {
    resultsRoot.dataset.state = mode;
    resultsRoot.setAttribute("aria-busy", mode === "loading" ? "true" : "false");
  }

  if (resultsShell) {
    resultsShell.dataset.state = mode;
  }
}

function renderEmpty(message) {
  if (!resultsRoot) {
    return;
  }

  clearSecondaryResults();
  renderNewsTopicNavigation();
  renderRefinements();
  setResultsState("empty");
  resultsRoot.innerHTML = `
    <li class="result-row">
      <article class="notice-card">${escapeHtml(message)}</article>
    </li>
  `;
}

function renderError(message) {
  if (!resultsRoot) {
    return;
  }

  clearSecondaryResults();
  renderNewsTopicNavigation();
  renderRefinements();
  setResultsState("error");
  resultsRoot.innerHTML = `
    <li class="result-row">
      <article class="notice-card notice-card-error">${escapeHtml(message)}</article>
    </li>
  `;
}

function getLoadingPresentation(query = state.query, view = state.activeView) {
  const displayQuery = String(query || state.query || "").trim();
  const quotedQuery = displayQuery ? ` for "${displayQuery}"` : "";
  const areaLabel = getPreferredAreaLabel(displayQuery);

  if (view === "news") {
    const newsPresentation = getNewsTopicPresentation(state.newsTopic, displayQuery);
    return {
      title: newsPresentation.loadingText.replace(/\.\.\.$/, ""),
      detail: "Gathering headline groups, related stories, and the AI news brief.",
      steps: ["Headlines", "Timeline", "Brief"],
    };
  }

  if (view === "images") {
    return {
      title: `Searching images${quotedQuery}`,
      detail: "Building the topic strip, image grid, and preview-ready cards.",
      steps: ["Topics", "Images", "Previews"],
    };
  }

  if (view === "maps") {
    return {
      title: `Searching maps${quotedQuery}`,
      detail: `Preparing place matches, route context, and the map canvas${areaLabel ? ` near ${areaLabel}` : ""}.`,
      steps: ["Places", "Routes", "Map"],
    };
  }

  if (looksLikeLocalIntent(displayQuery) || Boolean(getQueryAreaHint(displayQuery))) {
    return {
      title: `Searching nearby results${quotedQuery}`,
      detail: `Preparing place cards, map preview, and web results${areaLabel ? ` near ${areaLabel}` : ""}.`,
      steps: ["Places", "Map", "Web"],
    };
  }

  return {
    title: `Searching${quotedQuery}`,
    detail: "Preparing web results, source previews, related news, and images.",
    steps: ["Web", "Sources", "Media"],
  };
}

function buildLoadingNoticeCardMarkup(query) {
  const presentation = getLoadingPresentation(query);
  return `
    <article class="notice-card notice-card-loading loading-notice-card" role="status" aria-live="polite" aria-atomic="true" aria-busy="true">
      <span class="loading-notice-pulse" aria-hidden="true"></span>
      <span class="loading-notice-copy">
        <span class="loading-notice-title">${escapeHtml(presentation.title)}</span>
        <span class="loading-notice-detail">${escapeHtml(presentation.detail)}</span>
      </span>
      ${buildGenerationStepMarkup(presentation.steps, "loading-notice-steps")}
    </article>
  `;
}

function renderTopLoadingNotice(query) {
  if (!(resultsCorrection instanceof HTMLElement)) {
    return;
  }

  resultsCorrection.dataset.mode = "loading";
  resultsCorrection.innerHTML = buildLoadingNoticeCardMarkup(query);
  resultsCorrection.hidden = false;
}

function buildStandardResultSkeletonMarkup(index = 0) {
  return `
    <li class="result-row">
      <article class="result-item standard-result-item result-item-skeleton loading-standard-result" aria-hidden="true" style="--delay: ${index};">
        <div class="standard-result-site">
          <span class="standard-result-icon loading-standard-result-icon">
            <span class="skeleton-circle"></span>
          </span>
          <span class="standard-result-site-copy loading-standard-result-site-copy">
            <span class="skeleton-line skeleton-line-site-name"></span>
            <span class="skeleton-line skeleton-line-site-meta"></span>
          </span>
          <span class="loading-dot-button" aria-hidden="true"></span>
        </div>
        <div class="loading-standard-result-copy">
          <span class="skeleton-line skeleton-line-result-title"></span>
          <span class="skeleton-line skeleton-line-result-title skeleton-line-result-title-short"></span>
          <div class="skeleton-copy">
            <span class="skeleton-line skeleton-line-body"></span>
            <span class="skeleton-line skeleton-line-body skeleton-line-body-wide"></span>
            <span class="skeleton-line skeleton-line-body skeleton-line-body-short"></span>
          </div>
        </div>
      </article>
    </li>
  `;
}

function buildNewsStoryClusterSkeletonMarkup(index = 0, { featured = false } = {}) {
  return `
    <article class="news-story-cluster news-story-cluster-skeleton${featured ? " is-featured" : ""} result-item-skeleton" aria-hidden="true" style="--delay: ${index};">
      <div class="news-story-main">
        <div class="news-story-media news-story-media-skeleton"></div>
        <div class="news-story-copy news-story-copy-skeleton">
          <span class="skeleton-line skeleton-line-news-meta"></span>
          <span class="skeleton-line skeleton-line-news-title"></span>
          <span class="skeleton-line skeleton-line-news-title skeleton-line-news-title-short"></span>
          <div class="skeleton-copy">
            <span class="skeleton-line skeleton-line-body"></span>
            <span class="skeleton-line skeleton-line-body skeleton-line-body-wide"></span>
            <span class="skeleton-line skeleton-line-body skeleton-line-body-short"></span>
          </div>
          <div class="news-story-footer news-story-footer-skeleton">
            <span class="skeleton-line skeleton-line-news-url"></span>
            <span class="loading-pill-button" aria-hidden="true"></span>
          </div>
        </div>
      </div>
      <div class="news-story-related-list">
        ${Array.from({ length: 3 }, (_, relatedIndex) => `
          <div class="news-story-related news-story-related-skeleton" aria-hidden="true">
            <span class="skeleton-line skeleton-line-news-related-meta"></span>
            <span class="skeleton-line skeleton-line-news-related-title"></span>
            <span class="skeleton-line skeleton-line-news-related-title skeleton-line-news-related-title-short"></span>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function buildNewsStageSkeletonMarkup() {
  return `
    <section class="news-stage-layout">
      <div class="news-stage-main">
        <section class="news-stage-shell news-stage-shell-skeleton" aria-hidden="true">
          <div class="news-stage-head">
            <div class="news-stage-copy">
              <div class="news-stage-context-row">
                <span class="skeleton-line skeleton-line-stage-kicker"></span>
                <span class="news-stage-context-separator" aria-hidden="true"></span>
                <span class="skeleton-line skeleton-line-stage-context"></span>
              </div>
              <span class="skeleton-line skeleton-line-stage-title"></span>
              <span class="skeleton-line skeleton-line-stage-subtitle"></span>
            </div>
          </div>
          ${buildNewsStoryClusterSkeletonMarkup(0, { featured: true })}
        </section>
      </div>
    </section>
  `;
}

function buildImageStageSkeletonMarkup() {
  return `
    <section class="image-stage-shell image-stage-shell-skeleton" aria-hidden="true">
      <div class="image-stage-head">
        <span class="skeleton-line skeleton-line-stage-kicker"></span>
      </div>
      <div class="image-topic-strip image-topic-strip-skeleton">
        ${Array.from({ length: 8 }, (_, index) => `
          <span class="image-topic-chip image-topic-chip-skeleton result-item-skeleton" aria-hidden="true" style="--delay: ${index};">
            <span class="image-topic-thumb image-topic-thumb-skeleton"></span>
            <span class="skeleton-line skeleton-line-topic-label"></span>
          </span>
        `).join("")}
      </div>
    </section>
  `;
}

function buildImageResultSkeletonMarkup(index = 0) {
  return `
    <li class="result-row image-result-row">
      <article class="image-result-card image-result-card-skeleton result-item-skeleton" aria-hidden="true" style="--delay: ${index};">
        <div class="image-result-media image-result-media-skeleton"></div>
        <div class="image-result-copy">
          <span class="skeleton-line skeleton-line-image-meta"></span>
          <span class="skeleton-line skeleton-line-image-title"></span>
          <span class="skeleton-line skeleton-line-image-title skeleton-line-image-title-short"></span>
        </div>
      </article>
    </li>
  `;
}

function buildImageInfiniteScrollPlaceholderMarkup(count = SEARCH_RESULTS_PER_PAGE_LIMIT) {
  return Array.from({ length: count }, (_, index) => `
    <li class="result-row image-result-row" data-infinite-scroll-placeholder>
      <article class="image-result-card image-result-card-skeleton result-item-skeleton" aria-hidden="true" style="--delay: ${index};">
        <div class="image-result-media image-result-media-skeleton"></div>
        <div class="image-result-copy">
          <span class="skeleton-line skeleton-line-image-meta"></span>
          <span class="skeleton-line skeleton-line-image-title"></span>
          <span class="skeleton-line skeleton-line-image-title skeleton-line-image-title-short"></span>
        </div>
      </article>
    </li>
  `).join("");
}

function buildMapSkeletonCanvasMarkup() {
  const pins = [
    { left: 31, top: 36, active: true },
    { left: 68, top: 42 },
    { left: 52, top: 70 },
  ];

  return `
    <div class="map-tile-layer map-tile-layer-skeleton" aria-hidden="true"></div>
    <div class="map-skeleton-road-layer" aria-hidden="true">
      <span class="map-skeleton-road map-skeleton-road-primary"></span>
      <span class="map-skeleton-road map-skeleton-road-secondary map-skeleton-road-secondary-a"></span>
      <span class="map-skeleton-road map-skeleton-road-secondary map-skeleton-road-secondary-b"></span>
      <span class="map-skeleton-road map-skeleton-road-secondary map-skeleton-road-secondary-c"></span>
      <span class="map-skeleton-road map-skeleton-road-cross map-skeleton-road-cross-a"></span>
      <span class="map-skeleton-road map-skeleton-road-cross map-skeleton-road-cross-b"></span>
    </div>
    <div class="map-route-layer map-route-layer-skeleton" aria-hidden="true">
      <svg class="map-route-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path class="map-route-line-shadow map-route-line-shadow-skeleton" d="M17 75 C30 65 42 58 54 53 S76 42 87 27"></path>
        <path class="map-route-line-main map-route-line-main-skeleton" d="M17 75 C30 65 42 58 54 53 S76 42 87 27"></path>
      </svg>
      <span class="map-anchor-marker map-anchor-marker-skeleton" style="--anchor-left: 17%; --anchor-top: 75%;"></span>
      <span class="map-route-label map-route-label-skeleton"></span>
    </div>
    <div class="map-pin-layer" aria-hidden="true">
      ${pins.map((pin) => `
        <span class="map-pin map-pin-static map-pin-skeleton${pin.active ? " is-active" : ""}" style="--pin-left: ${pin.left}%; --pin-top: ${pin.top}%;">
          <span></span>
        </span>
      `).join("")}
    </div>
    <span class="map-selected-chip map-selected-chip-skeleton" aria-hidden="true">
      <span class="skeleton-line map-selected-chip-line"></span>
    </span>
  `;
}

function showInfiniteScrollPlaceholders(view = state.activeView) {
  if (view !== "images" || !resultsRoot) {
    return;
  }

  clearInfiniteScrollPlaceholders();
  resultsRoot.insertAdjacentHTML(
    "beforeend",
    buildImageInfiniteScrollPlaceholderMarkup(SEARCH_RESULTS_PER_PAGE_LIMIT),
  );
}

function clearInfiniteScrollPlaceholders() {
  resultsRoot?.querySelectorAll("[data-infinite-scroll-placeholder]").forEach((placeholder) => {
    placeholder.remove();
  });
}

function buildPlacesStageSkeletonMarkup() {
  return `
    <article class="places-stage-card places-stage-card-skeleton result-item-skeleton" aria-hidden="true">
      <div class="places-stage-head">
        <div>
          <p class="places-section-kicker places-stage-kicker">
            <span class="skeleton-line skeleton-line-stage-kicker"></span>
          </p>
          <span class="skeleton-line skeleton-line-place-stage-context"></span>
        </div>
      </div>
      <div class="places-stage-grid">
        <div class="places-stage-list">
          ${Array.from({ length: PROMOTED_PLACES_LIMIT }, (_, index) => `
            <div class="place-stage-item place-stage-item-skeleton${index === 0 ? " is-active" : ""}" aria-hidden="true">
              <span class="place-stage-rank">
                <span class="skeleton-circle skeleton-circle-rank"></span>
              </span>
              <span class="place-stage-body">
                <span class="skeleton-line skeleton-line-place-title"></span>
                <span class="skeleton-line skeleton-line-place-meta"></span>
                <span class="skeleton-line skeleton-line-place-route"></span>
                <span class="skeleton-line skeleton-line-place-snippet"></span>
                <span class="skeleton-line skeleton-line-place-snippet skeleton-line-place-snippet-short"></span>
              </span>
            </div>
          `).join("")}
          <div class="place-stage-map-link place-stage-map-link-skeleton" aria-hidden="true">
            <span class="place-stage-map-link-icon place-stage-map-link-icon-skeleton"></span>
            <span class="place-stage-map-link-copy">
              <span class="skeleton-line skeleton-line-place-map-link-title"></span>
              <span class="skeleton-line skeleton-line-place-map-link-meta"></span>
            </span>
          </div>
        </div>
        <div class="places-stage-map">
          <div class="places-stage-map-shell places-stage-map-shell-skeleton">
            ${buildMapSkeletonCanvasMarkup()}
          </div>
        </div>
      </div>
    </article>
  `;
}

function buildPlaceInfoSidebarSkeletonMarkup() {
  return `
    <div class="place-info-head">
      <p class="places-section-kicker place-info-kicker">
        <span class="skeleton-line skeleton-line-stage-kicker"></span>
      </p>
    </div>
    <div class="place-info-body place-info-body-skeleton result-item-skeleton" aria-hidden="true">
      <div class="place-info-title-row">
        <span class="place-info-fallback place-info-fallback-skeleton"></span>
        <div class="place-info-title-copy place-info-title-copy-skeleton">
          <span class="skeleton-line skeleton-line-place-info-title"></span>
          <span class="skeleton-line skeleton-line-place-info-type"></span>
        </div>
      </div>
      <div class="place-info-summary-skeleton">
        <span class="skeleton-line skeleton-line-place-snippet"></span>
        <span class="skeleton-line skeleton-line-place-snippet skeleton-line-place-snippet-short"></span>
      </div>
      <span class="skeleton-line skeleton-line-place-address"></span>
      <span class="skeleton-line skeleton-line-place-route"></span>
      <div class="place-info-contact place-info-contact-skeleton">
        <span class="place-info-contact-row place-info-contact-row-skeleton">
          <span class="skeleton-line skeleton-line-place-contact-label"></span>
          <span class="skeleton-line skeleton-line-place-contact-value"></span>
        </span>
        <span class="place-info-contact-row place-info-contact-row-skeleton">
          <span class="skeleton-line skeleton-line-place-contact-label"></span>
          <span class="skeleton-line skeleton-line-place-contact-value skeleton-line-place-contact-value-short"></span>
        </span>
      </div>
      <div class="place-info-actions place-info-actions-skeleton">
        <span class="loading-pill-button"></span>
        <span class="loading-pill-button loading-pill-button-short"></span>
      </div>
      <div class="place-info-facts place-info-facts-skeleton">
        ${Array.from({ length: 4 }, () => `
          <span class="place-info-fact place-info-fact-skeleton">
            <span class="skeleton-line skeleton-line-place-fact-label"></span>
            <span class="skeleton-line skeleton-line-place-fact-value"></span>
          </span>
        `).join("")}
      </div>
    </div>
  `;
}

const SIDEBAR_KICKER_SKELETON_MARKUP = '<span class="skeleton-line skeleton-line-sidebar-meta"></span>';
const SIDEBAR_TITLE_SKELETON_MARKUP = '<span class="skeleton-line skeleton-line-sidebar-title"></span>';

function getSidebarCardKicker(card) {
  return card instanceof HTMLElement
    ? card.querySelector(".sidebar-card-kicker")
    : null;
}

function renderSidebarCardLoadingHeader(card, heading) {
  if (card instanceof HTMLElement) {
    card.setAttribute("aria-busy", "true");
  }

  const kicker = getSidebarCardKicker(card);
  if (kicker instanceof HTMLElement) {
    kicker.innerHTML = SIDEBAR_KICKER_SKELETON_MARKUP;
  }

  if (heading instanceof HTMLElement) {
    heading.innerHTML = SIDEBAR_TITLE_SKELETON_MARKUP;
  }
}

function resetSidebarCardHeader(card, heading, kickerText, headingText) {
  if (card instanceof HTMLElement) {
    card.removeAttribute("aria-busy");
  }

  const kicker = getSidebarCardKicker(card);
  if (kicker instanceof HTMLElement) {
    kicker.textContent = kickerText;
  }

  if (heading instanceof HTMLElement) {
    heading.textContent = headingText;
  }
}

function buildMapStageSkeletonMarkup() {
  return `
    <section class="map-explorer map-explorer-skeleton" aria-hidden="true">
      <aside class="map-explorer-sidebar">
        <div class="map-sidebar-head">
          <span class="skeleton-line skeleton-line-stage-kicker"></span>
          <span class="skeleton-line skeleton-line-map-title"></span>
          <span class="skeleton-line skeleton-line-map-result-meta"></span>
        </div>
        <div class="map-explorer-list">
          ${Array.from({ length: 5 }, (_, index) => `
            <article class="map-explorer-place map-explorer-place-skeleton result-item-skeleton" style="--delay: ${index};">
              <span class="map-place-rank">
                <span class="skeleton-circle skeleton-circle-rank"></span>
              </span>
              <span class="map-place-copy">
                <span class="skeleton-line skeleton-line-map-result-title"></span>
                <span class="skeleton-line skeleton-line-map-result-meta"></span>
                <span class="skeleton-line skeleton-line-place-snippet"></span>
              </span>
            </article>
          `).join("")}
        </div>
      </aside>
      <div class="map-explorer-map">
        ${buildMapSkeletonCanvasMarkup()}
        <div class="map-selected-route-card map-selected-route-card-skeleton">
          <span class="skeleton-line skeleton-line-stage-kicker"></span>
          <span class="skeleton-line skeleton-line-map-result-title"></span>
          <span class="skeleton-line skeleton-line-map-result-meta"></span>
        </div>
        <p class="map-attribution map-attribution-skeleton">
          <span class="skeleton-line map-attribution-line"></span>
        </p>
      </div>
    </section>
  `;
}

function renderPlacesLoadingSidebar() {
  if (!resultsSidebar || !placesCard) {
    return false;
  }

  resultsSidebar.hidden = false;
  placesCard.hidden = false;
  placesCard.classList.add("place-info-card", "place-info-card-skeleton");
  placesCard.setAttribute("aria-busy", "true");
  placesCard.innerHTML = buildPlaceInfoSidebarSkeletonMarkup();
  return true;
}

function renderGeneralLoadingSidebar({ hasPromotedPlaces = false } = {}) {
  if (!resultsSidebar) {
    return;
  }

  resultsSidebar.hidden = false;

  if (socialCard && socialHeading && socialRail) {
    socialCard.hidden = false;
    renderSidebarCardLoadingHeader(socialCard, socialHeading);
    socialRail.innerHTML = `
      <div class="social-rail-skeleton" aria-hidden="true">
        ${Array.from({ length: SOCIAL_HIGHLIGHT_SOURCES.length }, (_, index) => `
          <div class="social-rail-item social-rail-item-skeleton result-item-skeleton" style="--delay: ${index};">
            <div class="social-rail-copy social-rail-copy-skeleton">
              <span class="skeleton-line skeleton-line-news-title"></span>
              <span class="skeleton-line skeleton-line-body"></span>
              <span class="skeleton-line skeleton-line-body skeleton-line-body-short"></span>
              <div class="social-rail-source-row social-rail-source-row-skeleton">
                <span class="skeleton-circle social-rail-source-icon-skeleton"></span>
                <span class="skeleton-line skeleton-line-sidebar-meta"></span>
              </div>
            </div>
            <div class="social-rail-media social-rail-media-skeleton"></div>
          </div>
        `).join("")}
      </div>
    `;
  }

  if (infoCard && infoHeading && infoDescription && infoMediaShell) {
    infoCard.hidden = false;
    renderSidebarCardLoadingHeader(infoCard, infoHeading);
    if (infoMeta) {
      infoMeta.hidden = false;
      infoMeta.innerHTML = '<span class="skeleton-line skeleton-line-sidebar-meta"></span>';
    }
    infoDescription.innerHTML = `
      <span class="sidebar-card-skeleton-copy">
        <span class="skeleton-line skeleton-line-body"></span>
        <span class="skeleton-line skeleton-line-body skeleton-line-body-wide"></span>
        <span class="skeleton-line skeleton-line-body skeleton-line-body-short"></span>
      </span>
    `;
    infoMediaShell.hidden = false;
    infoMediaShell.innerHTML = '<div class="sidebar-card-skeleton-media sidebar-card-skeleton-media-large" aria-hidden="true"></div>';
    if (infoLink instanceof HTMLAnchorElement) {
      infoLink.hidden = true;
      infoLink.removeAttribute("href");
    }
  }

  if (newsCard && newsHeading && newsRail) {
    newsCard.hidden = false;
    renderSidebarCardLoadingHeader(newsCard, newsHeading);
    newsRail.innerHTML = `
      <div class="sidebar-card-skeleton-content" aria-hidden="true">
        <div class="sidebar-card-skeleton-media"></div>
        <div class="sidebar-card-skeleton-copy">
          <span class="skeleton-line skeleton-line-news-meta"></span>
          <span class="skeleton-line skeleton-line-news-title"></span>
          <span class="skeleton-line skeleton-line-news-title skeleton-line-news-title-short"></span>
        </div>
        <div class="sidebar-card-skeleton-list">
          ${Array.from({ length: 3 }, () => `
            <div class="sidebar-card-skeleton-list-item">
              <span class="skeleton-line skeleton-line-news-related-title"></span>
              <span class="skeleton-line skeleton-line-news-related-meta"></span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  if (imagesCard && imagesHeading && imageRail) {
    imagesCard.hidden = false;
    renderSidebarCardLoadingHeader(imagesCard, imagesHeading);
    imageRail.innerHTML = `
      <div class="sidebar-card-skeleton-thumb-grid" aria-hidden="true">
        ${Array.from({ length: GENERAL_IMAGE_RAIL_LIMIT }, (_, index) => `
          <div class="sidebar-card-skeleton-thumb result-item-skeleton" style="--delay: ${index};">
            <div class="sidebar-card-skeleton-thumb-media"></div>
            <div class="sidebar-card-skeleton-thumb-copy">
              <span class="skeleton-line skeleton-line-image-title"></span>
              <span class="skeleton-line skeleton-line-image-meta"></span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  updateResultsLayoutState({
    hasSidebar: true,
    hasPromotedPlaces,
  });
}

function renderLoading(query) {
  if (!resultsRoot) {
    return;
  }

  clearSecondaryResults();
  renderNewsTopicNavigation();
  renderRefinements();
  setResultsState("loading");
  renderTopLoadingNotice(query);

  if (state.activeView === "news") {
    if (resultsStage) {
      resultsStage.hidden = false;
      resultsStage.innerHTML = buildNewsStageSkeletonMarkup();
    }
    renderNewsAiSidebar({ skeleton: true });

    resultsRoot.innerHTML = `
      ${Array.from({ length: 3 }, (_, index) => `
        <li class="result-row news-story-row">
          ${buildNewsStoryClusterSkeletonMarkup(index + 1)}
        </li>
      `).join("")}
    `;
    return;
  }

  if (state.activeView === "images") {
    if (resultsStage) {
      resultsStage.hidden = false;
      resultsStage.innerHTML = buildImageStageSkeletonMarkup();
    }

    resultsRoot.innerHTML = `
      ${Array.from({ length: 12 }, (_, index) => buildImageResultSkeletonMarkup(index)).join("")}
    `;
    return;
  }

  if (state.activeView === "maps") {
    if (resultsStage) {
      resultsStage.hidden = false;
      resultsStage.innerHTML = buildMapStageSkeletonMarkup();
    }

    resultsRoot.innerHTML = "";
    return;
  }

  const expectsPlacesStage = looksLikeLocalIntent(state.query) || Boolean(getQueryAreaHint(state.query));
  if (expectsPlacesStage && resultsStage) {
    resultsStage.hidden = false;
    resultsStage.innerHTML = buildPlacesStageSkeletonMarkup();
    renderPlacesLoadingSidebar();
    renderAiSourcesLoadingSidebar();
    renderGeneralLoadingSidebar({ hasPromotedPlaces: true });
    updateResultsLayoutState({
      hasSidebar: true,
      hasPromotedPlaces: true,
    });
  } else {
    renderAiSourcesLoadingSidebar();
    renderGeneralLoadingSidebar();
  }

  resultsRoot.innerHTML = `
    ${shouldRenderAiLoadingSurfaces() ? buildAiSummarySearchSkeletonMarkup() : ""}
    ${Array.from({ length: 4 }, (_, index) => buildStandardResultSkeletonMarkup(index)).join("")}
  `;
  syncAiSectionLayout();
}

function updateResultsLayoutState({ hasSidebar = false, hasPromotedPlaces = false } = {}) {
  if (!resultsLayout) {
    return;
  }

  resultsLayout.dataset.sidebar = hasSidebar ? "true" : "false";
  resultsLayout.dataset.places = hasPromotedPlaces ? "true" : "false";
  syncResultsRightRailTop();
  syncResultsFloatingPanelBounds();
}

function clearViewSidebarCard() {
  if (!viewSidebarCard) {
    return;
  }

  viewSidebarCard.hidden = true;
  viewSidebarCard.innerHTML = "";
}

function renderViewSidebarMarkup(markup = "") {
  const normalizedMarkup = String(markup || "").trim();
  if (!resultsSidebar || !viewSidebarCard || !normalizedMarkup) {
    return false;
  }

  viewSidebarCard.innerHTML = normalizedMarkup;
  viewSidebarCard.hidden = false;
  resultsSidebar.hidden = false;
  updateResultsLayoutState({
    hasSidebar: true,
    hasPromotedPlaces: false,
  });
  return true;
}

function attachImagePreviewToSidebar() {
  if (!(resultsSidebarStack instanceof HTMLElement) || !(imagePreviewBackdrop instanceof HTMLElement)) {
    return false;
  }

  if (imagePreviewBackdrop.parentElement !== resultsSidebarStack) {
    resultsSidebarStack.insertBefore(imagePreviewBackdrop, resultsSidebarStack.firstElementChild);
  }

  return true;
}

function showImagePreviewSidebar() {
  if (state.activeView !== "images" || !attachImagePreviewToSidebar() || !resultsSidebar) {
    return;
  }

  resultsSidebar.hidden = false;
  updateResultsLayoutState({
    hasSidebar: true,
    hasPromotedPlaces: false,
  });
}

function hideImagePreviewSidebar() {
  if (state.activeView !== "images" || !resultsSidebar) {
    return;
  }

  resultsSidebar.hidden = true;
  updateResultsLayoutState({
    hasSidebar: false,
    hasPromotedPlaces: false,
  });
}

function clearSecondaryResults() {
  updateResultsLayoutState();
  clearViewSidebarCard();

  if (resultsStage) {
    resultsStage.hidden = true;
    resultsStage.innerHTML = "";
  }

  if (resultsSidebar) {
    resultsSidebar.hidden = true;
  }

  if (placesCard) {
    placesCard.hidden = true;
    placesCard.classList.remove("place-info-card", "place-info-card-skeleton");
    placesCard.removeAttribute("aria-busy");
    placesCard.style.removeProperty("--place-info-section-height");
    placesCard.style.removeProperty("--place-info-section-top-offset");
  }

  resetSidebarCardHeader(placesCard, placesHeading, "Places", "Place matches");

  if (placesList) {
    placesList.innerHTML = "";
  }

  if (sidebarMapShell) {
    sidebarMapShell.hidden = true;
    sidebarMapShell.innerHTML = "";
  }

  if (placesLink instanceof HTMLAnchorElement) {
    placesLink.hidden = true;
    placesLink.removeAttribute("href");
  }

  if (newsCard) {
    newsCard.hidden = true;
  }

  if (socialCard) {
    socialCard.hidden = true;
  }

  resetSidebarCardHeader(socialCard, socialHeading, "Popular On", "Reddit, YouTube, Amazon");

  if (socialRail) {
    socialRail.innerHTML = "";
  }

  if (infoCard) {
    infoCard.hidden = true;
    infoCard.classList.remove("info-card-place");
    infoCard.querySelector("[data-info-place-extra]")?.remove();
  }

  resetSidebarCardHeader(infoCard, infoHeading, "Info", "Overview");

  if (infoMeta) {
    infoMeta.textContent = "";
    infoMeta.hidden = true;
  }

  if (infoDescription) {
    infoDescription.textContent = "";
  }

  if (infoMediaShell) {
    infoMediaShell.hidden = true;
    infoMediaShell.innerHTML = "";
  }

  if (infoLink instanceof HTMLAnchorElement) {
    infoLink.hidden = true;
    infoLink.removeAttribute("href");
  }

  resetSidebarCardHeader(newsCard, newsHeading, "Top News", "Headlines");

  if (newsRail) {
    newsRail.innerHTML = "";
  }

  if (imagesCard) {
    imagesCard.hidden = true;
  }

  resetSidebarCardHeader(imagesCard, imagesHeading, "Related", "Images");

  if (imageRail) {
    imageRail.innerHTML = "";
  }

  if (aiSourcesCard) {
    aiSourcesCard.hidden = true;
    aiSourcesCard.removeAttribute("aria-busy");
    aiSourcesCard.classList.remove("ai-section-collapsible", "is-expanded", "ai-sources-card-skeleton");
  }

  if (aiSourcesList) {
    aiSourcesList.innerHTML = "";
  }

  if (aiSourcesSection) {
    aiSourcesSection.hidden = true;
    aiSourcesSection.style.removeProperty("--ai-section-height");
    aiSourcesSection.style.removeProperty("--ai-section-top-offset");
  }

  if (resultsSidebarStack instanceof HTMLElement) {
    resultsSidebarStack.style.removeProperty("--results-sidebar-stack-offset");
  }
}

function renderPlacesSidebar() {
  if (!resultsSidebar || !placesCard) {
    return false;
  }

  if (state.activeView !== "general" || !shouldPromotePlaces()) {
    return false;
  }

  const places = state.mapResults.slice(0, PROMOTED_PLACES_LIMIT);
  const result = getSelectedPromotedPlace(places);
  if (!result) {
    return false;
  }

  const title = getMapDisplayTitle(result);
  const address = formatMapAddress(result, { fallbackToTitle: false });
  const placeType = getMapPlaceType(result);
  const routeSummary = formatMapRouteSummary(result);
  const coordinates = formatCoordinatePair(result, { precision: 5 });
  const mapUrl = getMapOpenUrl(result);
  const directionsUrl = buildMapDirectionsUrl(result);
  const websiteUrl = getPlaceWebsiteUrl(result);
  const phone = getPlacePhoneNumber(result);
  const sourceLabel = String(result?.source || result?.engine || result?.domain || getHostLabel(mapUrl) || "").trim();
  const description = String(result?.content || "").trim();
  const summaryText = description && description !== address
    ? description
    : (address || routeSummary || "Select a place in Places Summary to view more location details.");
  const facts = [
    { label: "Type", value: placeType },
    { label: "Distance", value: formatMapDistance(result) },
    { label: "Source", value: sourceLabel },
    { label: "Coordinates", value: coordinates },
  ].filter((item) => item.value);
  const contactRows = [
    websiteUrl
      ? {
          label: "Website",
          value: formatPlaceWebsiteLabel(websiteUrl),
          href: websiteUrl,
        }
      : null,
    phone
      ? {
          label: "Phone",
          value: phone,
          href: `tel:${phone.replace(/[^\d+]/g, "")}`,
        }
      : null,
  ].filter(Boolean);

  placesCard.hidden = false;
  placesCard.classList.remove("place-info-card-skeleton");
  placesCard.removeAttribute("aria-busy");
  placesCard.classList.add("place-info-card");
  placesCard.innerHTML = `
    <div class="place-info-head">
      <p class="places-section-kicker place-info-kicker">
        ${MAP_KICKER_ICON_SVG}
        <span>Place Info</span>
      </p>
    </div>
    <div class="place-info-body">
      <div class="place-info-title-row">
        <span class="place-info-fallback" aria-hidden="true">${escapeHtml(title.slice(0, 1).toUpperCase())}</span>
        <div class="place-info-title-copy">
          <h2>${escapeHtml(title)}</h2>
          ${placeType ? `<p>${escapeHtml(placeType)}</p>` : ""}
        </div>
      </div>
      <p class="place-info-summary">${escapeHtml(summaryText)}</p>
      ${address && address !== summaryText
        ? `<p class="place-info-address">${escapeHtml(address)}</p>`
        : ""}
      ${routeSummary
        ? `<p class="place-info-route">${escapeHtml(routeSummary)}</p>`
        : ""}
      ${contactRows.length
        ? `<div class="place-info-contact">
            ${contactRows.map((item) => `
              <a class="place-info-contact-row" href="${escapeHtml(item.href)}" target="${item.label === "Phone" ? "_self" : "_blank"}" rel="noopener noreferrer">
                <span>${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.value)}</strong>
              </a>
            `).join("")}
          </div>`
        : ""}
      ${(mapUrl || directionsUrl)
        ? `<div class="place-info-actions">
            ${mapUrl
              ? `<a class="map-selected-place-action map-selected-place-action-primary" href="${escapeHtml(mapUrl)}" target="_blank" rel="noopener noreferrer">Open map</a>`
              : ""}
            ${directionsUrl
              ? `<a class="map-selected-place-action" href="${escapeHtml(directionsUrl)}" target="_blank" rel="noopener noreferrer">Directions</a>`
              : ""}
          </div>`
        : ""}
      ${facts.length
        ? `<div class="place-info-facts">
            ${facts.map((fact) => `
              <div class="place-info-fact">
                <p>${escapeHtml(fact.label)}</p>
                <strong>${escapeHtml(formatPlaceInfoValue(fact.value))}</strong>
              </div>
            `).join("")}
          </div>`
        : ""}
    </div>
  `;

  return true;
}

function getQueryTokens(query = state.query) {
  return String(query || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function countMatchingQueryTokens(value, tokens = getQueryTokens()) {
  if (!tokens.length) {
    return 0;
  }

  const haystack = String(value || "").toLowerCase();
  return tokens.reduce((count, token) => (
    haystack.includes(token) ? count + 1 : count
  ), 0);
}

function getCompactQueryValue(query = state.query) {
  return String(query || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function buildImageSearchQueries(query = state.query) {
  const normalizedQuery = String(query || "").trim().replace(/\s+/g, " ");
  if (!normalizedQuery) {
    return [];
  }

  const queries = [normalizedQuery];
  const tokens = getQueryTokens(normalizedQuery);
  const compactQuery = getCompactQueryValue(normalizedQuery);
  if (normalizedQuery.includes(" ")
    && tokens.length === 2
    && tokens.every((token) => token.length >= 3)
    && compactQuery
    && compactQuery !== normalizedQuery.toLowerCase()
  ) {
    queries.push(compactQuery);
  }

  return Array.from(new Set(queries));
}

function getImageResultKey(result) {
  return normalizeSuggestionKey(
    result?.url
    || result?.image_url
    || result?.thumbnail_url
    || result?.title
    || "",
  );
}

function resultMatchesSourceDomains(result, sourceConfig) {
  const host = getResultHost(result);
  return sourceConfig?.domains?.some((domain) => host.includes(domain)) || false;
}

function scoreSocialResultCandidate(result, sourceConfig, query = state.query, index = -1) {
  if (!result?.title || !result?.url) {
    return -1;
  }

  const tokens = getQueryTokens(query);
  const compactQuery = getCompactQueryValue(query);
  const title = String(result.title || "").toLowerCase();
  const content = String(result.content || "").toLowerCase();
  const source = String(result.source || "").toLowerCase();
  const domain = String(result.domain || getHostLabel(result.url) || "").toLowerCase();
  const url = String(result.url || "").toLowerCase();
  const haystack = [title, content, source, domain, url].filter(Boolean).join(" ");
  const compactHaystack = haystack.replace(/[^a-z0-9]+/g, "");
  const titleMatchCount = countMatchingQueryTokens(title, tokens);
  const matchCount = countMatchingQueryTokens(haystack, tokens);
  const hasPreview = Boolean(getResultPreviewImage(result));
  let score = Math.max(0, 18 - Math.max(index, 0));

  if (!resultMatchesSourceDomains(result, sourceConfig)) {
    score -= 240;
  } else {
    score += 260;
  }

  score += titleMatchCount * 70;
  score += matchCount * 28;

  if (compactQuery && compactHaystack.includes(compactQuery)) {
    score += 120;
  }

  if (hasPreview) {
    score += 34;
  }

  if (sourceConfig?.id === "youtube") {
    if (url.includes("/watch") || url.includes("youtu.be/")) {
      score += 90;
    }
    if (url.includes("/playlist")) {
      score += 32;
    }
    if (url.includes("/channel/") || url.includes("/@")) {
      score -= 38;
    }
  }

  if (sourceConfig?.id === "reddit") {
    if (url.includes("/comments/")) {
      score += 90;
    }
    if (url.includes("/r/")) {
      score += 24;
    }
  }

  if (sourceConfig?.id === "amazon") {
    if (/\/dp\/|\/gp\/product\//.test(url)) {
      score += 90;
    }
    if (url.includes("/s?")) {
      score -= 24;
    }
  }

  if (result.category === "general") {
    score += 18;
  }

  return score;
}

function pickSocialHighlightResult(results = [], sourceConfig, query = state.query) {
  const candidatePool = (Array.isArray(results) ? results : []).filter(Boolean);
  if (!candidatePool.length) {
    return null;
  }

  const ranked = candidatePool
    .map((result, index) => ({
      result,
      index,
      score: scoreSocialResultCandidate(result, sourceConfig, query, index),
    }))
    .sort((first, second) => second.score - first.score || first.index - second.index);

  return ranked[0]?.score > 80 ? ranked[0].result : null;
}

function buildSocialSidebarResults(payloadEntries = [], query = state.query, primaryResults = []) {
  return SOCIAL_HIGHLIGHT_SOURCES
    .map((sourceConfig) => {
      const entry = (Array.isArray(payloadEntries) ? payloadEntries : []).find((item) => item?.source?.id === sourceConfig.id);
      const candidateResult = pickSocialHighlightResult(
        [
          ...(Array.isArray(entry?.payload?.results) ? entry.payload.results : []),
          ...(Array.isArray(primaryResults) ? primaryResults : []),
        ],
        sourceConfig,
        query,
      );

      if (!candidateResult) {
        return null;
      }

      return {
        id: sourceConfig.id,
        label: sourceConfig.label,
        result: candidateResult,
      };
    })
    .filter(Boolean);
}

function scoreImageResultCandidate(result, query = state.query, index = -1) {
  const tokens = getQueryTokens(query);
  const compactQuery = getCompactQueryValue(query);
  const title = String(result?.title || "").toLowerCase();
  const content = String(result?.content || "").toLowerCase();
  const source = String(result?.source || "").toLowerCase();
  const domain = String(result?.domain || "").toLowerCase();
  const url = String(result?.url || "").toLowerCase();
  const preview = getResultPreviewImage(result);
  const haystack = [title, content, source, domain, url].filter(Boolean).join(" ");
  const compactHaystack = haystack.replace(/[^a-z0-9]+/g, "");
  const titleCompact = title.replace(/[^a-z0-9]+/g, "");
  const matchCount = countMatchingQueryTokens(haystack, tokens);
  const titleMatchCount = countMatchingQueryTokens(title, tokens);
  const compactMatch = Boolean(compactQuery && (
    compactHaystack.includes(compactQuery)
    || titleCompact.includes(compactQuery)
  ));

  let score = Math.max(0, 28 - Math.max(index, 0));
  if (preview) {
    score += 22;
  } else {
    score -= 45;
  }
  if (compactMatch) {
    score += 220;
  }

  score += matchCount * 38;
  score += titleMatchCount * 44;

  if (tokens.length > 1 && matchCount === tokens.length) {
    score += 135;
  }
  if (tokens.length > 1 && titleMatchCount === tokens.length) {
    score += 120;
  }
  if (tokens.length > 1 && matchCount === 1 && !compactMatch) {
    score -= 140;
  }

  return {
    score,
    matchCount,
    titleMatchCount,
    compactMatch,
    preview,
  };
}

function rankImageResults(results = [], query = state.query) {
  const tokens = getQueryTokens(query);
  const ranked = (Array.isArray(results) ? results : [])
    .map((result, index) => ({
      result,
      index,
      ...scoreImageResultCandidate(result, query, index),
    }))
    .filter((entry) => Boolean(entry.preview))
    .sort((first, second) => (
      second.score - first.score
      || Number(second.compactMatch) - Number(first.compactMatch)
      || second.titleMatchCount - first.titleMatchCount
      || second.matchCount - first.matchCount
      || first.index - second.index
    ));

  const strictMatches = ranked.filter((entry) => {
    if (tokens.length < 2) {
      return entry.score > 0;
    }

    return entry.compactMatch
      || entry.titleMatchCount === tokens.length
      || entry.matchCount === tokens.length
      || entry.score >= 150;
  });

  const strictKeys = new Set(strictMatches.map((entry) => getImageResultKey(entry.result)));
  const ordered = strictMatches.length >= Math.min(10, ranked.length)
    ? strictMatches
    : [
      ...strictMatches,
      ...ranked.filter((entry) => !strictKeys.has(getImageResultKey(entry.result))),
    ];

  const seen = new Set();
  const deduped = [];
  ordered.forEach((entry) => {
    const key = getImageResultKey(entry.result);
    if (!key || seen.has(key)) {
      return;
    }

    seen.add(key);
    deduped.push(entry.result);
  });

  return deduped;
}

function mergeImageSearchPayloads(payloads = [], query = state.query, page = 1) {
  const responses = (Array.isArray(payloads) ? payloads : []).filter(Boolean);
  const primaryPayload = responses[0] || null;
  const mergedSuggestions = getDistinctQuerySuggestions(
    responses.flatMap((payload) => (Array.isArray(payload?.suggestions) ? payload.suggestions : [])),
    query,
  );
  const mergedResults = rankImageResults(
    responses.flatMap((payload) => (Array.isArray(payload?.results) ? payload.results : [])),
    query,
  ).slice(0, SEARCH_RESULTS_PER_PAGE_LIMIT);

  return {
    query,
    provider: primaryPayload?.provider || getEffectivePreferences().provider,
    page: primaryPayload?.page || page,
    total_results: mergedResults.length,
    page_result_count: mergedResults.length,
    total_results_known: false,
    has_more_pages: null,
    filters: primaryPayload?.filters || {
      categories: getCategoryForView("images"),
      language: getEffectivePreferences().language || null,
      safesearch: getEffectivePreferences().safesearch,
      time_range: getEffectiveTimeRangeForView("images") || null,
      engines: getEffectiveEnginesForView("images") || null,
    },
    results: mergedResults,
    suggestions: mergedSuggestions,
  };
}

function getWordTokens(value) {
  return String(value || "").match(/[A-Za-z0-9]+/g) || [];
}

function formatImageTopicLabel(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => {
      const trimmedToken = String(token || "").trim();
      if (!trimmedToken) {
        return "";
      }
      if (trimmedToken.length <= 2 || /\d/.test(trimmedToken)) {
        return trimmedToken.toUpperCase();
      }
      return trimmedToken.charAt(0).toUpperCase() + trimmedToken.slice(1).toLowerCase();
    })
    .filter(Boolean)
    .join(" ");
}

function isUsefulImageTopicToken(token, queryTokenSet, excludedTokenSet) {
  const normalizedToken = String(token || "").trim().toLowerCase();
  if (!normalizedToken) {
    return false;
  }
  if (queryTokenSet.has(normalizedToken) || excludedTokenSet.has(normalizedToken)) {
    return false;
  }
  if (IMAGE_TOPIC_STOPWORDS.has(normalizedToken)) {
    return false;
  }
  if (/^\d+$/.test(normalizedToken)) {
    return false;
  }
  if (normalizedToken.length < 3 && !/\d/.test(normalizedToken)) {
    return false;
  }

  return true;
}

function getImageRelatedTopics(limit = 40) {
  const queryTokenSet = new Set(getQueryTokens());
  const topicMap = new Map();

  const rememberTopic = (label, result, index, { isPhrase = false } = {}) => {
    const normalizedLabel = normalizeSuggestionKey(label);
    if (!normalizedLabel) {
      return;
    }

    const preview = getResultPreviewImage(result);
    const nextQuery = buildRefinedQuery(state.query, label);
    const score = (isPhrase ? 20 : 12)
      + Math.max(0, 14 - index)
      + (preview ? 8 : 0)
      + (/\d/.test(label) ? 6 : 0);
    const existingTopic = topicMap.get(normalizedLabel);

    if (existingTopic) {
      existingTopic.score += score;
      if (!existingTopic.preview && preview) {
        existingTopic.preview = preview;
      }
      return;
    }

    topicMap.set(normalizedLabel, {
      key: normalizedLabel,
      label: formatImageTopicLabel(label),
      query: nextQuery,
      preview,
      score,
    });
  };

  state.results.slice(0, 72).forEach((result, index) => {
    const titleTokens = getWordTokens(result?.title);
    if (!titleTokens.length) {
      return;
    }

    const sourceTokens = new Set([
      ...getWordTokens(result?.source).map((token) => token.toLowerCase()),
      ...getWordTokens(result?.domain).map((token) => token.toLowerCase()),
    ]);

    titleTokens.forEach((token, tokenIndex) => {
      if (!isUsefulImageTopicToken(token, queryTokenSet, sourceTokens)) {
        return;
      }

      rememberTopic(token, result, index);

      const nextToken = titleTokens[tokenIndex + 1];
      if (!nextToken || !isUsefulImageTopicToken(nextToken, queryTokenSet, sourceTokens)) {
        return;
      }

      const phrase = `${token} ${nextToken}`;
      if (phrase.length > 22) {
        return;
      }

      rememberTopic(phrase, result, index, { isPhrase: true });
    });
  });

  const selectedTopics = [];
  const sortedTopics = Array.from(topicMap.values())
    .filter((topic) => topic.label && normalizeSuggestionKey(topic.query) !== normalizeSuggestionKey(state.query))
    .sort((first, second) => second.score - first.score || first.label.localeCompare(second.label));

  sortedTopics.forEach((topic) => {
    const isDuplicate = selectedTopics.some((entry) => (
      entry.key === topic.key
      || entry.key.includes(topic.key)
      || topic.key.includes(entry.key)
    ));
    if (isDuplicate || selectedTopics.length >= limit) {
      return;
    }

    selectedTopics.push(topic);
  });

  return selectedTopics;
}

function activateImageTopicPreview(chip) {
  const image = chip.querySelector("[data-image-topic-src]");
  if (!(image instanceof HTMLImageElement)) {
    return;
  }

  const preview = image.getAttribute("data-image-topic-src") || "";
  if (!preview || image.getAttribute("src")) {
    return;
  }

  image.setAttribute("src", preview);
  image.removeAttribute("data-image-topic-src");
}

function fitImageTopicStrip() {
  imageTopicFitFrame = 0;
  if (state.activeView !== "images" || !(resultsStage instanceof HTMLElement)) {
    return;
  }

  const strip = resultsStage.querySelector("[data-image-topic-strip]");
  if (!(strip instanceof HTMLElement)) {
    return;
  }

  const stageShell = strip.closest(".image-stage-shell");
  const chips = Array.from(strip.querySelectorAll("[data-image-topic-chip]"))
    .filter((chip) => chip instanceof HTMLElement);
  if (!chips.length) {
    stageShell?.classList.remove("is-fitting");
    return;
  }

  chips.forEach((chip) => {
    chip.hidden = false;
  });

  const stripRect = strip.getBoundingClientRect();
  if (stripRect.width <= 0) {
    stageShell?.classList.remove("is-fitting");
    return;
  }

  const stripStyle = window.getComputedStyle(strip);
  const topicGap = Number.parseFloat(stripStyle.columnGap || stripStyle.gap || "0") || 0;
  const availableWidth = stripRect.width;
  const chipWidths = chips.map((chip) => chip.getBoundingClientRect().width);
  const selectedIndexes = [];
  let usedWidth = 0;
  let overflowIndex = chips.length;

  chipWidths.some((width, index) => {
    const nextWidth = usedWidth + (selectedIndexes.length ? topicGap : 0) + width;
    if (nextWidth <= availableWidth + 0.5) {
      selectedIndexes.push(index);
      usedWidth = nextWidth;
      return false;
    }

    overflowIndex = index;
    return true;
  });

  const averageVisibleWidth = selectedIndexes.length
    ? selectedIndexes.reduce((total, index) => total + chipWidths[index], 0) / selectedIndexes.length
    : (chipWidths[0] || 0);
  const selectedIndexSet = new Set(selectedIndexes);
  const canEstimateAnotherChip = (startIndex) => {
    if (!selectedIndexes.length) {
      return false;
    }

    const remainingWidth = availableWidth - usedWidth - topicGap;
    if (remainingWidth <= 0) {
      return false;
    }

    const smallestRemainingWidth = chipWidths
      .slice(startIndex)
      .reduce((smallest, width, offset) => {
        const candidateIndex = startIndex + offset;
        return selectedIndexSet.has(candidateIndex) ? smallest : Math.min(smallest, width);
      }, Number.POSITIVE_INFINITY);

    return Number.isFinite(smallestRemainingWidth)
      && remainingWidth + 0.5 >= Math.min(averageVisibleWidth, smallestRemainingWidth);
  };

  for (let index = overflowIndex + 1; index < chips.length && canEstimateAnotherChip(index); index += 1) {
    if (selectedIndexSet.has(index)) {
      continue;
    }

    const nextWidth = usedWidth + (selectedIndexes.length ? topicGap : 0) + chipWidths[index];
    if (nextWidth > availableWidth + 0.5) {
      continue;
    }

    selectedIndexes.push(index);
    selectedIndexSet.add(index);
    usedWidth = nextWidth;
  }

  if (!selectedIndexes.length) {
    selectedIndexes.push(0);
    selectedIndexSet.add(0);
  }

  chips.forEach((chip, index) => {
    const shouldShow = selectedIndexSet.has(index);
    chip.hidden = !shouldShow;
    if (shouldShow) {
      activateImageTopicPreview(chip);
    }
  });
  stageShell?.classList.remove("is-fitting");
}

function requestImageTopicStripFit() {
  if (imageTopicFitFrame) {
    window.cancelAnimationFrame(imageTopicFitFrame);
  }
  imageTopicFitFrame = window.requestAnimationFrame(fitImageTopicStrip);
}

function buildImageTopicStageMarkup(topics = []) {
  if (!topics.length) {
    return "";
  }

  return `
    <section class="image-stage-shell is-fitting">
      <div class="image-stage-head">
        <p class="image-stage-kicker">Related</p>
      </div>
      <div class="image-topic-strip" data-image-topic-strip aria-label="Related image topics">
        ${topics.map((topic) => `
          <button
            type="button"
            class="image-topic-chip"
            data-image-topic-query="${escapeHtml(topic.query)}"
            data-image-topic-chip
          >
            <span class="image-topic-thumb">
              ${topic.preview
                ? `<img data-image-topic-src="${escapeHtml(topic.preview)}" alt="" loading="lazy" decoding="async">`
                : '<span class="image-topic-thumb-fallback" aria-hidden="true"></span>'}
            </span>
            <span class="image-topic-label">${escapeHtml(topic.label)}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getInfoHeadingExtraTokens(result, query = state.query) {
  const queryTokenSet = new Set(getQueryTokens(query));
  return Array.from(new Set(
    getWordTokens(getInfoCardHeading(result))
      .map((token) => String(token || "").trim().toLowerCase())
      .filter((token) => (
        token.length >= 3
        && !queryTokenSet.has(token)
        && !SUBJECT_DESCRIPTOR_STOPWORDS.has(token)
      )),
  ));
}

function isDefinitionStyleInfoResult(result, query = state.query) {
  const heading = String(getInfoCardHeading(result) || "").trim().toLowerCase();
  const content = String(result?.content || "").trim().toLowerCase();
  if (!heading || !content) {
    return false;
  }

  const escapedHeading = escapeRegExp(heading);
  return new RegExp(`\\b(?:an?\\s+|the\\s+)?${escapedHeading}\\s+(?:is|are|was|were|refers\\s+to)\\b`).test(content);
}

function countInfoCommercialSignals(result, query = state.query) {
  const queryTokenSet = new Set(getQueryTokens(query));
  const textTokens = new Set(
    getWordTokens([
      getInfoCardHeading(result),
      result?.title,
      result?.content,
      result?.domain,
      result?.source,
      getHostLabel(result?.url),
    ].filter(Boolean).join(" "))
      .map((token) => String(token || "").trim().toLowerCase())
      .filter((token) => token && !queryTokenSet.has(token)),
  );
  let count = 0;

  INFO_COMMERCIAL_TOKENS.forEach((token) => {
    if (textTokens.has(token)) {
      count += 1;
    }
  });

  const url = String(result?.url || "").toLowerCase();
  if (/\/(?:book|booking|buy|career(?:s)?|contact|coupon(?:s)?|delivery|franchise|gift(?:s)?|hours|jobs|locations?|menu(?:s)?|order(?:ing)?|pickup|reserve|reservations?|rewards?|shop|stores?|support|tickets?)(?:[/?#-]|$)/.test(url)) {
    count += 2;
  }

  return count;
}

function isQueryPrefixedBrandResult(result, query = state.query) {
  const compactQuery = getCompactQueryValue(query);
  if (!compactQuery || compactQuery.length < 3) {
    return false;
  }

  const rootDomain = getResultRootDomain(result);
  const registrantStem = String(rootDomain || "")
    .split(".")[0]
    .replace(/[^a-z0-9]+/g, "");
  if (!registrantStem || registrantStem === compactQuery || !registrantStem.startsWith(compactQuery)) {
    return false;
  }

  return getInfoHeadingExtraTokens(result, query).length > 0;
}

function scoreInfoResultCandidate(result, tokens = getQueryTokens(), query = state.query) {
  if (!result?.title || !result?.url) {
    return -1;
  }

  const heading = getInfoCardHeading(result);
  const title = String(result.title || "");
  const content = String(result.content || "");
  const domain = String(result.domain || getHostLabel(result.url) || "").toLowerCase();
  const normalizedQuery = normalizeSuggestionKey(query);
  const normalizedHeading = normalizeSuggestionKey(heading);
  const queryValue = String(query || "").trim().toLowerCase();
  const compactHeading = getCompactQueryValue(heading);
  const queryNoSpace = query.replace(/\s+/g, "");
  const headingExtraTokens = getInfoHeadingExtraTokens(result, query);
  const commercialSignalCount = countInfoCommercialSignals(result, query);
  const definitionStyle = isDefinitionStyleInfoResult(result, query);
  const prefixedBrandResult = isQueryPrefixedBrandResult(result, query);
  let score = 0;

  if (domain.includes("wikipedia.org")) {
    score += 520;
  } else if (domain.includes("britannica.com")) {
    score += 440;
  } else if (domain.includes("wikidata.org")) {
    score += 360;
  }

  if (domain.includes("facebook.com") || domain.includes("instagram.com") || domain.includes("linkedin.com")) {
    score -= 180;
  }
  if (isWikipediaDisambiguationResult(result)) {
    score -= 460;
  }

  const titleMatches = countMatchingQueryTokens(title, tokens);
  const contentMatches = countMatchingQueryTokens(content, tokens);
  const domainMatches = countMatchingQueryTokens(domain, tokens);
  score += titleMatches * 80;
  score += contentMatches * 26;
  score += domainMatches * 40;
  score += getWikipediaQualifierTokens(result, query).length * 70;

  if (
    normalizedQuery
    && (
      normalizedHeading === normalizedQuery
      || (queryNoSpace && compactHeading === queryNoSpace)
    )
  ) {
    score += 240;
  }
  if (queryValue && title.toLowerCase() === queryValue) {
    score += 180;
  }
  if (queryValue && title.toLowerCase().startsWith(queryValue)) {
    score += 120;
  }
  if (queryNoSpace && domain.replace(/[^a-z0-9]+/g, "").includes(queryNoSpace)) {
    score += prefixedBrandResult ? 20 : 90;
  }
  if (content.length >= 140) {
    score += 110;
  } else if (content.length >= 70) {
    score += 55;
  }
  if (getResultPreviewImage(result)) {
    score += 24;
  }
  if (result.category === "general") {
    score += 25;
  }
  if (definitionStyle) {
    score += 160;
  }
  if (tokens.length === 1 && headingExtraTokens.length) {
    score -= headingExtraTokens.length * 42;
  }
  if (commercialSignalCount) {
    score -= commercialSignalCount * (tokens.length === 1 ? 78 : 42);
  }
  if (tokens.length === 1 && prefixedBrandResult) {
    score -= 180;
  }

  return score;
}

function getResultIdentityKey(result) {
  return normalizeSuggestionKey(
    result?.url
    || result?.title
    || "",
  );
}

function scoreKnowledgeCandidateAgainstPrimaryResult(candidate, primaryResult, index = -1) {
  if (!candidate?.title || !candidate?.url || !primaryResult?.title || !primaryResult?.url) {
    return 0;
  }

  const candidateHeading = getInfoCardHeading(candidate);
  const primaryHeading = getInfoCardHeading(primaryResult);
  const normalizedCandidateHeading = normalizeSuggestionKey(candidateHeading);
  const normalizedPrimaryHeading = normalizeSuggestionKey(primaryHeading);
  const compactCandidateHeading = getCompactQueryValue(candidateHeading);
  const compactPrimaryHeading = getCompactQueryValue(primaryHeading);
  const primaryContext = getResultContextText(primaryResult);
  const descriptorTokens = getAiSummaryDescriptorTokens(candidate, candidateHeading).slice(0, 5);
  const qualifierTokens = getWikipediaQualifierTokens(candidate, primaryHeading);
  const isDisambiguation = isWikipediaDisambiguationResult(candidate);
  const rankWeight = Math.max(1, 6 - Math.max(index, 0));
  let score = 0;

  if (
    normalizedCandidateHeading === normalizedPrimaryHeading
    || compactCandidateHeading === compactPrimaryHeading
  ) {
    score += (isDisambiguation ? 24 : 140) * rankWeight;
  } else if (
    normalizedCandidateHeading.startsWith(`${normalizedPrimaryHeading} `)
    || normalizedCandidateHeading.startsWith(`${normalizedPrimaryHeading}(`)
    || normalizedCandidateHeading.startsWith(`${normalizedPrimaryHeading}:`)
    || normalizedCandidateHeading.startsWith(`${normalizedPrimaryHeading}-`)
    || normalizedPrimaryHeading.startsWith(`${normalizedCandidateHeading} `)
    || normalizedPrimaryHeading.startsWith(`${normalizedCandidateHeading}(`)
    || normalizedPrimaryHeading.startsWith(`${normalizedCandidateHeading}:`)
    || normalizedPrimaryHeading.startsWith(`${normalizedCandidateHeading}-`)
    || (compactCandidateHeading && compactPrimaryHeading && (
      compactCandidateHeading.startsWith(compactPrimaryHeading)
      || compactPrimaryHeading.startsWith(compactCandidateHeading)
    ))
  ) {
    score += (isDisambiguation ? 18 : 90) * rankWeight;
  }

  if (normalizedCandidateHeading && primaryContext.includes(normalizedCandidateHeading)) {
    score += (isDisambiguation ? 12 : 70) * rankWeight;
  }

  qualifierTokens.forEach((token, tokenIndex) => {
    if (!token) {
      return;
    }

    if (normalizedPrimaryHeading.includes(token)) {
      score += (tokenIndex === 0 ? 56 : 34) * rankWeight;
      return;
    }

    if (primaryContext.includes(token)) {
      score += (tokenIndex === 0 ? 44 : 24) * rankWeight;
    }
  });

  descriptorTokens.forEach((token, tokenIndex) => {
    if (!token) {
      return;
    }

    if (normalizedPrimaryHeading.includes(token)) {
      score += (tokenIndex === 0 ? 34 : 22) * rankWeight * (isDisambiguation ? 0.35 : 1);
      return;
    }

    if (primaryContext.includes(token)) {
      score += (tokenIndex === 0 ? 20 : 12) * rankWeight * (isDisambiguation ? 0.35 : 1);
    }
  });

  if (isDisambiguation) {
    score -= 220;
  } else if (qualifierTokens.length) {
    score += 18 * rankWeight;
  }

  return score;
}

function rankKnowledgeResults(primaryResults = [], supplementalResults = [], { wikipediaOnly = false } = {}) {
  const normalizedPrimaryResults = Array.isArray(primaryResults) ? primaryResults.filter(Boolean) : [];
  const normalizedSupplementalResults = Array.isArray(supplementalResults) ? supplementalResults.filter(Boolean) : [];
  const seen = new Set();
  const entries = [];

  normalizedPrimaryResults.forEach((result, index) => {
    if (!isKnowledgeResult(result)) {
      return;
    }
    if (wikipediaOnly && !isWikipediaResult(result)) {
      return;
    }

    const key = getResultIdentityKey(result);
    if (!key || seen.has(key)) {
      return;
    }

    seen.add(key);
    const supportScore = normalizedPrimaryResults
      .slice(0, 6)
      .reduce((total, primaryResult, primaryIndex) => (
        total + scoreKnowledgeCandidateAgainstPrimaryResult(result, primaryResult, primaryIndex)
      ), 0);
    const score = scoreInfoResultCandidate(result)
      + supportScore
      + (isWikipediaResult(result) ? 220 : (isKnowledgeResult(result) ? 90 : 0))
      + Math.max(0, 120 - (index * 20));

    entries.push({
      result,
      score,
      supportScore,
      sourceType: "primary",
      primaryIndex: index,
    });
  });

  normalizedSupplementalResults.forEach((result, index) => {
    if (!isKnowledgeResult(result)) {
      return;
    }
    if (wikipediaOnly && !isWikipediaResult(result)) {
      return;
    }

    const key = getResultIdentityKey(result);
    if (!key || seen.has(key)) {
      return;
    }

    seen.add(key);
    const supportScore = normalizedPrimaryResults
      .slice(0, 6)
      .reduce((total, primaryResult, primaryIndex) => (
        total + scoreKnowledgeCandidateAgainstPrimaryResult(result, primaryResult, primaryIndex)
      ), 0);
    const score = scoreInfoResultCandidate(result)
      + supportScore
      + (isWikipediaResult(result) ? 240 : (isKnowledgeResult(result) ? 100 : 0))
      + Math.max(0, 60 - (index * 8));

    entries.push({
      result,
      score,
      supportScore,
      sourceType: "supplemental",
      primaryIndex: Number.POSITIVE_INFINITY,
    });
  });

  return entries.sort((first, second) => (
    second.supportScore - first.supportScore
    || Number(!isWikipediaDisambiguationResult(second.result)) - Number(!isWikipediaDisambiguationResult(first.result))
    || Number(isWikipediaResult(second.result)) - Number(isWikipediaResult(first.result))
    || second.score - first.score
    || first.primaryIndex - second.primaryIndex
  ));
}

function pickKnowledgeResult(
  primaryResults = [],
  supplementalResults = [],
  {
    wikipediaOnly = false,
    minSupport = 1,
  } = {},
) {
  const rankedCandidates = rankKnowledgeResults(
    primaryResults,
    supplementalResults,
    { wikipediaOnly },
  );
  const topCandidate = rankedCandidates[0];
  if (!topCandidate) {
    return null;
  }

  if (topCandidate.supportScore < minSupport && topCandidate.sourceType !== "primary") {
    return null;
  }

  return topCandidate.result;
}

function getInfoResultCandidate() {
  if (state.infoResult) {
    return state.infoResult;
  }

  const subjectQuery = getSearchSubjectQuery(state.query);
  const tokens = getQueryTokens(subjectQuery);
  const candidatePool = Array.isArray(state.results) ? state.results.filter(Boolean) : [];
  if (!state.query || !candidatePool.length) {
    return null;
  }

  const ranked = candidatePool
    .map((result, index) => ({
      result,
      index,
      score: scoreInfoResultCandidate(result, tokens, subjectQuery),
    }))
    .sort((first, second) => second.score - first.score || first.index - second.index);

  return ranked[0]?.score >= 40 ? ranked[0].result : candidatePool[0] || null;
}

function pickInfoResult(primaryResults = [], supplementalResults = []) {
  const wikipediaKnowledgeResult = pickKnowledgeResult(
    primaryResults,
    supplementalResults,
    {
      wikipediaOnly: true,
      minSupport: 1,
    },
  );
  if (wikipediaKnowledgeResult) {
    return wikipediaKnowledgeResult;
  }

  const generalKnowledgeResult = pickKnowledgeResult(
    primaryResults,
    supplementalResults,
    { minSupport: 1 },
  );
  if (generalKnowledgeResult) {
    return generalKnowledgeResult;
  }

  const candidatePool = [
    ...(Array.isArray(supplementalResults) ? supplementalResults : []),
    ...(Array.isArray(primaryResults) ? primaryResults : []),
  ].filter(Boolean);
  if (!candidatePool.length) {
    return null;
  }

  const subjectQuery = getSearchSubjectQuery(state.query);
  const tokens = getQueryTokens(subjectQuery);
  const ranked = candidatePool
    .map((result, index) => ({
      result,
      index,
      score: scoreInfoResultCandidate(result, tokens, subjectQuery),
    }))
    .sort((first, second) => second.score - first.score || first.index - second.index);

  return ranked[0]?.result || candidatePool[0] || null;
}

function scoreWikipediaInfoResult(result, query = state.query) {
  if (!isWikipediaResult(result)) {
    return Number.NEGATIVE_INFINITY;
  }

  const heading = getInfoCardHeading(result);
  const title = String(result?.title || "");
  const content = String(result?.content || "");
  const normalizedQuery = normalizeSuggestionKey(query);
  const normalizedHeading = normalizeSuggestionKey(heading);
  const compactQuery = getCompactQueryValue(query);
  const compactHeading = getCompactQueryValue(heading);
  const tokens = getQueryTokens(query);
  const extraQualifierCount = getWikipediaQualifierTokens(result, query).length;
  let score = 0;

  if (isWikipediaDisambiguationResult(result)) {
    score -= 900;
  } else {
    score += 220;
  }

  if (
    normalizedQuery
    && (
      normalizedHeading === normalizedQuery
      || compactHeading === compactQuery
    )
  ) {
    score += 420;
  } else if (
    normalizedQuery
    && (
      normalizedHeading.startsWith(`${normalizedQuery} `)
      || normalizedHeading.startsWith(`${normalizedQuery}(`)
      || normalizedHeading.startsWith(`${normalizedQuery}:`)
      || normalizedHeading.startsWith(`${normalizedQuery}-`)
      || (compactQuery && compactHeading.startsWith(compactQuery))
    )
  ) {
    score += 220;
  }

  score += countMatchingQueryTokens(heading, tokens) * 90;
  score += countMatchingQueryTokens(title, tokens) * 48;
  score += countMatchingQueryTokens(content, tokens) * 18;
  score -= extraQualifierCount * 140;
  score -= Math.max(0, getWordTokens(heading).length - Math.max(tokens.length, 1)) * 18;

  return score;
}

function getSubjectSupportTokens(value, excludedTokenSet = new Set()) {
  return Array.from(new Set(
    getWordTokens(value)
      .map((token) => normalizeSupportToken(token))
      .filter((token) => (
        token.length >= 3
        && !excludedTokenSet.has(token)
        && !SUBJECT_DESCRIPTOR_STOPWORDS.has(token)
        && !INFO_COMMERCIAL_TOKENS.has(token)
      )),
  ));
}

function getWikipediaSubjectSupportTerms(result, query = state.query) {
  const queryTokenSet = getNormalizedQueryTokenSet(query);
  const headingTokens = getSubjectSupportTokens(getInfoCardHeading(result), queryTokenSet);
  const headingTokenSet = new Set(headingTokens);
  const descriptorTokens = Array.from(new Set([
    ...getWikipediaQualifierTokens(result, query).slice(0, 4),
    ...getAiSummaryDescriptorTokens(result, query).slice(0, 6),
  ].filter((token) => !headingTokenSet.has(token))));

  return {
    headingTokens,
    descriptorTokens,
  };
}

function scoreWikipediaSubjectSupportAgainstPrimaryResult(
  result,
  primaryResult,
  index = -1,
  totalPrimaryResults = SUBJECT_SUPPORT_RESULT_LIMIT,
  query = state.query,
) {
  if (!result?.title || !result?.url || !primaryResult?.title || !primaryResult?.url) {
    return 0;
  }

  const consideredResultCount = Math.max(1, totalPrimaryResults);
  const rankWeight = Math.max(1, consideredResultCount - Math.max(index, 0));
  const primaryTitle = normalizeSuggestionKey(getInfoCardHeading(primaryResult));
  const primaryDescription = normalizeSuggestionKey(primaryResult.content || "");
  const candidateHeading = normalizeSuggestionKey(getInfoCardHeading(result));
  const compactPrimaryTitle = getCompactQueryValue(primaryTitle);
  const compactCandidateHeading = getCompactQueryValue(candidateHeading);
  const {
    headingTokens,
    descriptorTokens,
  } = getWikipediaSubjectSupportTerms(result, query);
  let score = 0;

  if (
    candidateHeading
    && (
      primaryTitle === candidateHeading
      || primaryTitle.startsWith(`${candidateHeading} `)
      || primaryTitle.startsWith(`${candidateHeading}(`)
      || primaryTitle.startsWith(`${candidateHeading}:`)
      || primaryTitle.startsWith(`${candidateHeading}-`)
      || (compactCandidateHeading && compactPrimaryTitle.includes(compactCandidateHeading))
    )
  ) {
    score += 110 * rankWeight;
  }

  score += countMatchingQueryTokens(primaryTitle, headingTokens) * 42 * rankWeight;
  score += countMatchingQueryTokens(primaryDescription, headingTokens) * 18 * rankWeight;
  score += countMatchingQueryTokens(primaryTitle, descriptorTokens) * 34 * rankWeight;
  score += countMatchingQueryTokens(primaryDescription, descriptorTokens) * 16 * rankWeight;

  if (isWikipediaDisambiguationResult(result)) {
    score -= 180 * rankWeight;
  }

  return score;
}

function scoreWikipediaSubjectSupport(result, primaryResults = [], query = state.query) {
  const consideredPrimaryResults = (Array.isArray(primaryResults) ? primaryResults : [])
    .filter(Boolean)
    .slice(0, SUBJECT_SUPPORT_RESULT_LIMIT);

  if (!consideredPrimaryResults.length) {
    return 0;
  }

  return consideredPrimaryResults.reduce((total, primaryResult, index) => (
    total + scoreWikipediaSubjectSupportAgainstPrimaryResult(
      result,
      primaryResult,
      index,
      consideredPrimaryResults.length,
      query,
    )
  ), 0);
}

function pickWikipediaInfoResult(results = [], primaryResults = [], query = state.query) {
  const rankedCandidates = (Array.isArray(results) ? results : [])
    .filter(Boolean)
    .filter((result) => isWikipediaResult(result))
    .map((result, index) => ({
      result,
      index,
      subjectSupportScore: scoreWikipediaSubjectSupport(result, primaryResults, query),
      score: scoreWikipediaInfoResult(result, query),
    }))
    .sort((first, second) => (
      second.subjectSupportScore - first.subjectSupportScore
      || second.score - first.score
      || first.index - second.index
    ));

  const preferredCandidate = rankedCandidates.find(({ result }) => !isWikipediaDisambiguationResult(result));
  return preferredCandidate?.result || rankedCandidates[0]?.result || null;
}

function getInfoCardHeading(result) {
  const rawTitle = String(result?.title || "").trim();
  if (!rawTitle) {
    return String(state.query || "Overview").trim() || "Overview";
  }

  const separators = [" | ", " - ", " – ", " — ", " · "];
  for (const separator of separators) {
    if (!rawTitle.includes(separator)) {
      continue;
    }

    const [firstPart] = rawTitle.split(separator);
    const heading = String(firstPart || "").trim();
    if (heading && heading.length >= 2) {
      return heading;
    }
  }

  return rawTitle;
}

function getInfoCardDescription(result) {
  const snippet = String(result?.content || "").trim();
  if (snippet) {
    return snippet;
  }

  const heading = getInfoCardHeading(result);
  return heading && state.query
    ? `Open ${heading} to explore more results for "${state.query}".`
    : "Open this result to explore more.";
}

function getResultRootDomain(result) {
  const host = String(result?.domain || getHostLabel(result?.url) || "").trim().toLowerCase();
  if (!host) {
    return "";
  }

  const segments = host.split(".").filter(Boolean);
  if (segments.length <= 2) {
    return host;
  }

  const countryCodeSuffixes = new Set(["uk", "jp", "au", "br", "ca", "cn", "de", "fr", "in", "it", "mx"]);
  const lastSegment = segments[segments.length - 1];
  const secondLastSegment = segments[segments.length - 2];
  if (lastSegment.length === 2 && countryCodeSuffixes.has(lastSegment) && secondLastSegment.length <= 3 && segments.length >= 3) {
    return segments.slice(-3).join(".");
  }

  return segments.slice(-2).join(".");
}

function resultsShareImageContext(primaryResult, secondaryResult) {
  const primaryRootDomain = getResultRootDomain(primaryResult);
  const secondaryRootDomain = getResultRootDomain(secondaryResult);
  if (!primaryRootDomain || !secondaryRootDomain) {
    return false;
  }

  if (primaryRootDomain === secondaryRootDomain) {
    return true;
  }

  const relatedKnowledgeHosts = ["wikipedia.org", "wikimedia.org"];
  return relatedKnowledgeHosts.includes(primaryRootDomain) && relatedKnowledgeHosts.includes(secondaryRootDomain);
}

function scoreRailImageForResult(imageResult, targetResult, index = -1) {
  const preview = getResultPreviewImage(imageResult);
  if (!preview || !targetResult) {
    return {
      preview: "",
      score: Number.NEGATIVE_INFINITY,
      headingMatchCount: 0,
      descriptorMatchCount: 0,
      compactHeadingMatch: false,
      relatedSource: false,
    };
  }

  const targetHeading = getInfoCardHeading(targetResult);
  const headingTokens = getQueryTokens(targetHeading);
  const descriptorTokens = Array.from(new Set([
    ...getAiSummaryDescriptorTokens(targetResult, targetHeading).slice(0, 4),
    ...getWikipediaQualifierTokens(targetResult, targetHeading).slice(0, 3),
  ]));
  const title = String(imageResult?.title || "").toLowerCase();
  const context = getResultContextText(imageResult);
  const titleCompact = title.replace(/[^a-z0-9]+/g, "");
  const contextCompact = context.replace(/[^a-z0-9]+/g, "");
  const headingCompact = getCompactQueryValue(targetHeading);
  const headingMatchCount = countMatchingQueryTokens(title, headingTokens);
  const contextHeadingMatchCount = countMatchingQueryTokens(context, headingTokens);
  const descriptorMatchCount = countMatchingQueryTokens(context, descriptorTokens);
  const relatedSource = resultsShareImageContext(imageResult, targetResult);
  const exactHeadingMatch = normalizeSuggestionKey(getInfoCardHeading(imageResult)) === normalizeSuggestionKey(targetHeading);
  const compactHeadingMatch = Boolean(headingCompact && (
    titleCompact === headingCompact
    || titleCompact.startsWith(headingCompact)
    || contextCompact.includes(headingCompact)
  ));

  let score = Math.max(0, 24 - Math.max(index, 0) * 2);
  score += headingMatchCount * 58;
  score += contextHeadingMatchCount * 22;
  score += descriptorMatchCount * 52;

  if (relatedSource) {
    score += 180;
  }
  if (exactHeadingMatch) {
    score += 170;
  } else if (compactHeadingMatch) {
    score += 110;
  }
  if (headingTokens.length > 1 && headingMatchCount >= headingTokens.length) {
    score += 120;
  }
  if (headingTokens.length === 1 && descriptorMatchCount === 0 && !relatedSource) {
    score -= 170;
  }
  if (headingTokens.length > 1 && headingMatchCount === 0 && descriptorMatchCount === 0 && !relatedSource && !compactHeadingMatch) {
    score -= 240;
  }
  if (!exactHeadingMatch && !relatedSource && descriptorMatchCount === 0 && headingMatchCount === 0 && !compactHeadingMatch) {
    score -= 260;
  }

  return {
    preview,
    score,
    headingMatchCount,
    descriptorMatchCount,
    compactHeadingMatch,
    relatedSource,
  };
}

function getMatchedRailImageForResult(result, { minScore = 220 } = {}) {
  if (!result || !state.railImages.length) {
    return null;
  }

  const preferredImage = state.railImages
    .map((imageResult, index) => ({
      imageResult,
      index,
      ...scoreRailImageForResult(imageResult, result, index),
    }))
    .filter((entry) => entry.preview)
    .sort((first, second) => (
      second.score - first.score
      || Number(second.relatedSource) - Number(first.relatedSource)
      || second.descriptorMatchCount - first.descriptorMatchCount
      || second.headingMatchCount - first.headingMatchCount
      || Number(second.compactHeadingMatch) - Number(first.compactHeadingMatch)
      || first.index - second.index
    ))[0];

  if (!preferredImage || preferredImage.score < minScore) {
    return null;
  }

  return {
    src: preferredImage.preview,
    alt: preferredImage.imageResult.title || getInfoCardHeading(result),
    href: preferredImage.imageResult.url || result?.url || "",
  };
}

function getInfoCardImage(result) {
  const directPreview = getResultPreviewImage(result);
  if (directPreview) {
    return {
      src: directPreview,
      alt: result.title || getInfoCardHeading(result),
      href: result.url,
    };
  }

  return getMatchedRailImageForResult(result, {
    minScore: isKnowledgeResult(result) ? 240 : 220,
  });
}

function getSocialHighlightContext(item) {
  const result = item?.result;
  const sourceLabel = String(item?.label || "").trim();
  const explicitSource = String(result?.source || "").trim();
  if (explicitSource && normalizeSuggestionKey(explicitSource) !== normalizeSuggestionKey(sourceLabel)) {
    return explicitSource;
  }

  try {
    if (item?.id === "reddit") {
      const match = new URL(String(result?.url || "")).pathname.match(/^\/r\/([^/]+)/i);
      if (match?.[1]) {
        return `r/${match[1]}`;
      }
    }
  } catch {}

  return "";
}

function getAiSummarySidebarSources() {
  const sources = Array.isArray(state.aiSummarySources) ? state.aiSummarySources : [];
  const fallbackSource = state.aiSummarySource || getAiSummaryAnchorResult();
  const sourcePool = sources.length ? sources : (fallbackSource ? [fallbackSource] : []);
  const seen = new Set();

  return sourcePool
    .filter(Boolean)
    .filter((source) => {
      const title = String(source?.title || "").trim();
      const url = String(source?.url || "").trim();
      const key = normalizeSuggestionKey(url || title);
      if (!title || !url || !key || seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

function buildAiSourceItemMarkup(source, index) {
  const title = String(source?.title || "Source").trim();
  const url = String(source?.url || "").trim();
  const snippet = String(source?.content || "").trim() || "Open this source to see what informed the AI overview.";
  const sourceLabel = getAiSummarySourceName(source) || getAiSummarySourceLabel(source) || "Source";
  const faviconUrl = getResultFaviconUrl(source);
  const faviconFallback = sourceLabel.slice(0, 1).toUpperCase() || "S";
  const media = index === 0 ? getResultPreviewImage(source) : "";

  return `
    <article class="ai-source-item${media ? " has-media" : ""}">
      <a class="ai-source-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
        <span class="ai-source-copy">
          <span class="ai-source-title">${escapeHtml(title)}</span>
          <span class="ai-source-snippet">${escapeHtml(snippet)}</span>
          <span class="ai-source-meta">
            <span class="ai-source-favicon" aria-hidden="true">
              <span class="ai-source-favicon-fallback">${escapeHtml(faviconFallback)}</span>
              ${faviconUrl
                ? `<img class="ai-source-favicon-image" src="${escapeHtml(faviconUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true">`
                : ""}
            </span>
            <span class="ai-source-name">${escapeHtml(sourceLabel)}</span>
          </span>
        </span>
        ${media
          ? `<span class="ai-source-media"><img src="${escapeHtml(media)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('.ai-source-item')?.classList.remove('has-media'); this.closest('.ai-source-media')?.remove();"></span>`
          : ""}
      </a>
      <button
        type="button"
        class="ai-source-more"
        data-ai-source-details-index="${index}"
        aria-label="More about ${escapeHtml(title)}"
        aria-haspopup="dialog"
        aria-expanded="false"
        title="More about ${escapeHtml(title)}"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="5" r="1.7"></circle>
          <circle cx="12" cy="12" r="1.7"></circle>
          <circle cx="12" cy="19" r="1.7"></circle>
        </svg>
      </button>
    </article>
	  `;
}

function buildAiSourcesViewAllMarkup(totalCount) {
  const sourceLabel = totalCount === 1 ? "source" : "sources";
  return `
    <button
      type="button"
      class="ai-sources-show-all"
      data-ai-sources-details
      aria-label="View all ${totalCount} AI ${sourceLabel}"
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      <span>View Sources (${totalCount})</span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5.75h8M8 12h8M8 18.25h8"></path>
        <path d="m17 8 3 4-3 4"></path>
      </svg>
    </button>
  `;
}

function buildAiSourcesSidebarSkeletonMarkup() {
  return `
    <div class="ai-sources-head" aria-hidden="true">
      <span class="skeleton-line skeleton-line-sidebar-meta"></span>
      <span class="skeleton-circle ai-sources-more-skeleton"></span>
    </div>
    ${Array.from({ length: AI_SOURCES_SIDEBAR_LIMIT }, (_, index) => `
      <article class="ai-source-item ai-source-item-skeleton result-item-skeleton${index === 0 ? " has-media" : ""}" aria-hidden="true" style="--delay: ${index};">
        <div class="ai-source-link">
          <span class="ai-source-copy">
            <span class="skeleton-line skeleton-line-news-related-title"></span>
            <span class="skeleton-line skeleton-line-body"></span>
            <span class="skeleton-line skeleton-line-body skeleton-line-body-short"></span>
            <span class="ai-source-meta">
              <span class="skeleton-circle ai-source-favicon-skeleton"></span>
              <span class="skeleton-line skeleton-line-sidebar-meta"></span>
            </span>
          </span>
          ${index === 0 ? '<span class="ai-source-media ai-source-media-skeleton"></span>' : ""}
        </div>
        <span class="skeleton-circle ai-source-more-skeleton"></span>
      </article>
    `).join("")}
  `;
}

function renderAiSourcesLoadingSidebar() {
  if (!resultsSidebar || !aiSourcesSection || !aiSourcesCard || !aiSourcesList || !shouldRenderAiLoadingSurfaces()) {
    return false;
  }

  resultsSidebar.hidden = false;
  aiSourcesSection.hidden = false;
  aiSourcesCard.hidden = false;
  aiSourcesCard.setAttribute("aria-busy", "true");
  aiSourcesCard.classList.add("ai-section-collapsible", "ai-sources-card-skeleton");
  aiSourcesCard.classList.remove("is-expanded");
  aiSourcesList.innerHTML = buildAiSourcesSidebarSkeletonMarkup();
  return true;
}

function renderAiSourcesSidebar() {
  if (!resultsSidebar || !aiSourcesSection || !aiSourcesCard || !aiSourcesList) {
    return false;
  }

  const shouldShow = (
    state.activeView === "general"
    && isAiEnabled()
    && (state.aiSummaryLoading || Boolean(state.aiSummary))
  );
  const sources = shouldShow ? getAiSummarySidebarSources() : [];
  if (!sources.length) {
    aiSourcesSection.hidden = true;
    aiSourcesSection.style.removeProperty("--ai-section-height");
    aiSourcesSection.style.removeProperty("--ai-section-top-offset");
    aiSourcesCard.hidden = true;
    aiSourcesList.innerHTML = "";
    return false;
  }

  const visibleSources = sources.slice(0, AI_SOURCES_SIDEBAR_LIMIT);
  const hasAdditionalSources = sources.length > AI_SOURCES_SIDEBAR_LIMIT;
  aiSourcesSection.hidden = false;
  aiSourcesCard.hidden = false;
  aiSourcesCard.setAttribute("aria-busy", state.aiSummaryLoading ? "true" : "false");
  aiSourcesCard.classList.toggle("ai-section-collapsible", state.aiSummaryLoading || Boolean(state.aiSummary));
  aiSourcesCard.classList.toggle("is-expanded", !state.aiSummaryLoading && Boolean(state.aiSectionExpanded));
  aiSourcesList.innerHTML = `
    <div class="ai-sources-head">
      ${buildAiKickerMarkup("AI sources")}
      <button
        type="button"
        class="ai-sources-more-button"
        data-ai-sources-details
        aria-label="About AI Overview sources"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 7.25a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Zm0 7a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Zm0 7a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Z"/>
        </svg>
      </button>
    </div>
    ${visibleSources.map((source, index) => buildAiSourceItemMarkup(source, index)).join("")}
    ${hasAdditionalSources ? buildAiSourcesViewAllMarkup(sources.length) : ""}
  `;

  syncAiSectionLayout();
  return true;
}

function renderSocialSidebar() {
  if (!resultsSidebar || !socialCard || !socialRail) {
    return false;
  }

  if (state.activeView !== "general" || state.literalSearch || !state.railSocial.length) {
    return false;
  }

  socialCard.hidden = false;
  resetSidebarCardHeader(socialCard, socialHeading, "Popular On", "Reddit, YouTube, Amazon");

  socialRail.innerHTML = state.railSocial
    .map((item) => {
      const result = item.result;
      const media = getResultPreviewImage(result);
      const snippet = String(result?.content || "").trim() || "Open this result to explore more.";
      const faviconUrl = getResultFaviconUrl(result);
      const faviconFallback = String(item.label || getResultSiteName(result) || "W").slice(0, 1).toUpperCase();
      const sourceMeta = [item.label, getSocialHighlightContext(item)].filter(Boolean).join(" · ");

      return `
        <a class="social-rail-item${media ? " has-media" : ""}" href="${escapeHtml(result.url)}" target="_blank" rel="noopener noreferrer">
          <span class="social-rail-copy">
            <span class="social-rail-title">${escapeHtml(result.title)}</span>
            <span class="social-rail-snippet">${escapeHtml(snippet)}</span>
            <span class="social-rail-source-row">
              <span class="social-rail-source-icon" aria-hidden="true">
                <span class="social-rail-source-fallback">${escapeHtml(faviconFallback)}</span>
                ${faviconUrl
                  ? `<img class="social-rail-source-image" src="${escapeHtml(faviconUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true">`
                  : ""}
              </span>
              <span class="social-rail-source-text">${escapeHtml(sourceMeta || item.label)}</span>
            </span>
          </span>
          ${media
            ? `<span class="social-rail-media"><img src="${escapeHtml(media)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('.social-rail-item')?.classList.remove('has-media'); this.closest('.social-rail-media')?.remove();"></span>`
            : ""}
        </a>
      `;
    })
    .join("");

  return true;
}

function renderInfoSidebar() {
  if (!resultsSidebar || !infoCard || !infoHeading || !infoDescription || !infoMediaShell) {
    return false;
  }

  if (state.activeView !== "general") {
    return false;
  }

  infoCard.classList.remove("info-card-place");
  infoCard.querySelector("[data-info-place-extra]")?.remove();

  const result = getInfoResultCandidate();
  if (!result) {
    return false;
  }

  const heading = getInfoCardHeading(result);
  const description = getInfoCardDescription(result);
  const meta = [
    result.domain || getHostLabel(result.url),
    result.engine,
  ].filter(Boolean).join(" · ");
  const media = getInfoCardImage(result);

  infoCard.hidden = false;
  resetSidebarCardHeader(infoCard, infoHeading, "Info", heading);
  infoDescription.textContent = description;

  if (infoMeta) {
    infoMeta.textContent = meta;
    infoMeta.hidden = !meta;
  }

  if (infoLink instanceof HTMLAnchorElement && result.url) {
    infoLink.hidden = false;
    infoLink.href = result.url;
    infoLink.textContent = result.domain || getHostLabel(result.url) || "Open result";
  }

  infoMediaShell.hidden = !media;
  infoMediaShell.innerHTML = media ? `
    <a class="info-card-media" href="${escapeHtml(media.href || result.url)}" target="_blank" rel="noopener noreferrer">
      <img src="${escapeHtml(media.src)}" alt="${escapeHtml(media.alt || heading)}" loading="lazy">
    </a>
  ` : `
    <div class="info-card-fallback" aria-hidden="true">${escapeHtml(heading.slice(0, 1).toUpperCase())}</div>
  `;

  if (!media) {
    infoMediaShell.hidden = false;
  }

  return true;
}

function renderNewsSidebar() {
  if (!resultsSidebar || !newsCard || !newsRail) {
    return false;
  }

  if (state.activeView !== "general" || !state.railNews.length) {
    return false;
  }

  const [leadStory, ...otherStories] = state.railNews.slice(0, 4);
  const preview = leadStory ? getResultPreviewImage(leadStory) : "";
  const meta = leadStory ? buildNewsMeta(leadStory) : "";
  const heading = state.query
    ? `${state.query} news`
    : (getSavedAreaTerms().join(", ") || "Top stories");

  newsCard.hidden = false;
  resetSidebarCardHeader(newsCard, newsHeading, "Top News", heading);

  newsRail.innerHTML = leadStory ? `
    <a class="news-rail-feature" href="${escapeHtml(leadStory.url)}" target="_blank" rel="noopener noreferrer">
      <span class="news-rail-media">
        ${preview
          ? `<img src="${escapeHtml(preview)}" alt="${escapeHtml(leadStory.title)}" loading="lazy">`
          : '<span class="news-result-placeholder">Top story</span>'}
      </span>
      <span class="news-rail-feature-copy">
        ${meta ? `<span class="news-rail-meta">${escapeHtml(meta)}</span>` : ""}
        <span class="news-rail-title">${escapeHtml(leadStory.title)}</span>
        <span class="news-rail-snippet">${escapeHtml(leadStory.content || "Open this story to read more.")}</span>
      </span>
    </a>
    ${otherStories.length
      ? `<div class="news-rail-list">
          ${otherStories.map((result) => {
            const itemMeta = buildNewsMeta(result);
            return `
              <a class="news-rail-item" href="${escapeHtml(result.url)}" target="_blank" rel="noopener noreferrer">
                <span class="news-rail-item-copy">
                  <span class="news-rail-item-title">${escapeHtml(result.title)}</span>
                  ${itemMeta ? `<span class="news-rail-item-meta">${escapeHtml(itemMeta)}</span>` : ""}
                </span>
              </a>
            `;
          }).join("")}
        </div>`
      : ""}
  ` : "";

  return true;
}

function renderImagesSidebar() {
  if (!resultsSidebar || !imagesCard || !imageRail) {
    return false;
  }

  if (state.activeView !== "general" || !state.railImages.length) {
    return false;
  }

  imagesCard.hidden = false;
  resetSidebarCardHeader(imagesCard, imagesHeading, "Related", state.query ? `Images for "${state.query}"` : "Images");
  imageRail.innerHTML = state.railImages
    .slice(0, GENERAL_IMAGE_RAIL_LIMIT)
    .map((result) => {
      const preview = result.thumbnail_url || result.image_url || "";
      return `
        <a class="image-rail-item" href="${escapeHtml(result.url)}" target="_blank" rel="noopener noreferrer">
          <span class="image-rail-media">
            ${preview ? `<img src="${escapeHtml(preview)}" alt="${escapeHtml(result.title)}" loading="lazy">` : '<span class="image-rail-placeholder">Image</span>'}
          </span>
          <span class="image-rail-copy">
            <span class="image-rail-title">${escapeHtml(result.title)}</span>
            <span class="image-rail-source">${escapeHtml(result.source || result.domain || "Source")}</span>
          </span>
        </a>
      `;
    })
    .join("");

  return true;
}

function renderGeneralSidebar() {
  if (!resultsSidebar) {
    return;
  }

  const hasPlaces = renderPlacesSidebar();
  const hasPromotedPlaces = shouldPromotePlaces();
  const hasAiSources = renderAiSourcesSidebar();
  const hasSocial = renderSocialSidebar();
  const hasInfo = renderInfoSidebar();
  const hasNews = renderNewsSidebar();
  const hasImages = renderImagesSidebar();
  resultsSidebar.hidden = !hasPlaces && !hasAiSources && !hasSocial && !hasInfo && !hasNews && !hasImages;
  updateResultsLayoutState({
    hasSidebar: hasPlaces || hasAiSources || hasSocial || hasInfo || hasNews || hasImages,
    hasPromotedPlaces,
  });
  syncAiSectionLayout();
  requestAiSectionLayoutSync({ settle: true });
}

function clearAiSectionLayoutSyncTimers() {
  aiSectionLayoutSyncTimers.forEach((timerId) => {
    window.clearTimeout(timerId);
  });
  aiSectionLayoutSyncTimers = [];
}

function requestAiSectionLayoutSync({ settle = false } = {}) {
  if (!aiSectionLayoutSyncFrame) {
    aiSectionLayoutSyncFrame = window.requestAnimationFrame(() => {
      aiSectionLayoutSyncFrame = 0;
      syncAiSectionLayout();
    });
  }

  if (!settle) {
    return;
  }

  clearAiSectionLayoutSyncTimers();
  aiSectionLayoutSyncTimers = AI_SECTION_LAYOUT_SETTLE_DELAYS_MS.map((delay) => (
    window.setTimeout(() => {
      syncAiSectionLayout();
    }, delay)
  ));
}

function getFirstResultAlignmentTop(firstResultRow) {
  if (!(firstResultRow instanceof HTMLElement)) {
    return null;
  }

  const anchors = [
    firstResultRow.querySelector(".standard-result-site"),
    firstResultRow.querySelector(".result-item"),
    firstResultRow,
  ];
  for (const anchor of anchors) {
    if (!(anchor instanceof HTMLElement)) {
      continue;
    }

    const rect = anchor.getBoundingClientRect();
    if (rect.width || rect.height) {
      return rect.top;
    }
  }

  return null;
}

function syncAiSectionLayout() {
  if (!resultsSidebar || resultsSidebar.hidden) {
    return;
  }

  const sidebarStack = resultsSidebarStack instanceof HTMLElement
    ? resultsSidebarStack
    : resultsSidebar.querySelector(".results-sidebar-sticky-stack");
  const canPositionSidebarStack = sidebarStack instanceof HTMLElement;
  if (canPositionSidebarStack) {
    sidebarStack.style.removeProperty("--results-sidebar-stack-offset");
  }
  if (aiSourcesSection) {
    aiSourcesSection.style.removeProperty("--ai-section-height");
    aiSourcesSection.style.removeProperty("--ai-section-top-offset");
  }
  if (placesCard) {
    placesCard.style.removeProperty("--place-info-section-height");
    placesCard.style.removeProperty("--place-info-section-top-offset");
  }

  const shouldAlignSidebarRows = (
    state.activeView === "general"
    && window.matchMedia("(min-width: 801px)").matches
  );
  if (!shouldAlignSidebarRows) {
    return;
  }

  const overviewRow = resultsRoot?.querySelector?.("[data-ai-overview-row]");
  const firstResultRow = resultsRoot?.querySelector?.(".result-row:not(.result-row-ai)");
  const sidebarTop = resultsSidebar.getBoundingClientRect().top;
  const hasPromotedPlacesLayout = shouldPromotePlaces() || (
    state.loading
    && resultsLayout?.dataset.places === "true"
  );
  const placesStageElement = hasPromotedPlacesLayout && resultsStage instanceof HTMLElement && !resultsStage.hidden
    ? resultsStage
    : null;
  const placesInfoTopOffset = placesStageElement instanceof HTMLElement
    ? Math.max(0, Math.ceil(placesStageElement.getBoundingClientRect().top - sidebarTop))
    : 0;
  const placesInfoHeight = placesStageElement instanceof HTMLElement
    ? Math.ceil(placesStageElement.getBoundingClientRect().height)
    : 0;

  if (placesCard && !placesCard.hidden && placesInfoHeight > 0) {
    placesCard.style.setProperty("--place-info-section-top-offset", `${placesInfoTopOffset}px`);
    placesCard.style.setProperty("--place-info-section-height", `${placesInfoHeight}px`);
  }

  if (!(overviewRow instanceof HTMLElement) || !(firstResultRow instanceof HTMLElement)) {
    if (canPositionSidebarStack && placesInfoHeight > 0) {
      sidebarStack.style.setProperty(
        "--results-sidebar-stack-offset",
        `${placesInfoTopOffset + placesInfoHeight + AI_SOURCES_SIDEBAR_MIN_STACK_GAP_PX}px`,
      );
    }
    return;
  }

  const overviewTop = overviewRow.getBoundingClientRect().top;
  const firstResultTop = getFirstResultAlignmentTop(firstResultRow);
  if (!Number.isFinite(firstResultTop)) {
    return;
  }

  const overviewOffset = Math.max(0, Math.ceil(overviewTop - sidebarTop));
  const firstResultOffset = Math.max(0, Math.ceil(firstResultTop - sidebarTop));
  const availableOverviewHeight = Math.max(0, firstResultOffset - overviewOffset);
  const aiSourcesContentHeight = aiSourcesSection && !aiSourcesSection.hidden && aiSourcesCard instanceof HTMLElement
    ? Math.ceil(aiSourcesCard.getBoundingClientRect().height)
    : 0;
  const aiSourcesSectionHeight = availableOverviewHeight || aiSourcesContentHeight;
  const aiSidebarStackOffset = firstResultOffset;
  const placesSidebarStackOffset = placesInfoHeight > 0
    ? placesInfoTopOffset + placesInfoHeight + AI_SOURCES_SIDEBAR_MIN_STACK_GAP_PX
    : 0;
  const sidebarStackOffset = Math.max(aiSidebarStackOffset, placesSidebarStackOffset);

  if (aiSourcesSection && !aiSourcesSection.hidden) {
    aiSourcesSection.style.setProperty("--ai-section-top-offset", `${overviewOffset}px`);
    if (aiSourcesSectionHeight > 0) {
      aiSourcesSection.style.setProperty("--ai-section-height", `${aiSourcesSectionHeight}px`);
    }
  }

  if (canPositionSidebarStack) {
    if (sidebarStackOffset > 0) {
      sidebarStack.style.setProperty("--results-sidebar-stack-offset", `${sidebarStackOffset}px`);
    }
  }
}

function buildStaticMapPinMarkup(result, viewport, { label = "1", selected = false } = {}) {
  const position = getMapViewportPosition(result, viewport);
  if (!position || position.left < -8 || position.left > 108 || position.top < -8 || position.top > 108) {
    return "";
  }

  return `
    <span
      class="map-pin map-pin-static${selected ? " is-active" : ""}"
      style="--pin-left: ${position.left.toFixed(3)}%; --pin-top: ${position.top.toFixed(3)}%;"
      aria-hidden="true"
    >
      <span>${escapeHtml(label)}</span>
    </span>
  `;
}

function buildPlaceRouteMapMarkup(primaryPlace, places = []) {
  if (!primaryPlace) {
    return '<div class="map-empty">No route preview is available for this result.</div>';
  }

  const visiblePlaces = (Array.isArray(places) ? places : []).filter(Boolean).slice(0, PROMOTED_PLACES_LIMIT);
  const viewport = getRouteViewport(primaryPlace);
  if (!viewport) {
    return '<div class="map-empty">No route preview is available for this result.</div>';
  }

  const title = getMapDisplayTitle(primaryPlace);
  const selectedIndex = Math.max(0, visiblePlaces.indexOf(primaryPlace));
  return `
    <div class="places-stage-route-map" aria-label="Route preview for ${escapeHtml(title)}">
      <div class="map-tile-layer" aria-hidden="true">
        ${buildMapTilesMarkup(viewport)}
      </div>
      <div class="map-route-layer">
        ${buildMapRouteOverlayMarkup(primaryPlace, viewport)}
      </div>
      <div class="map-pin-layer">
        ${buildStaticMapPinMarkup(primaryPlace, viewport, {
          label: String(selectedIndex + 1),
          selected: true,
        })}
      </div>
      <p class="map-attribution">© OpenStreetMap contributors</p>
    </div>
  `;
}

function getSelectedPromotedPlace(places = []) {
  const normalizedPlaces = (Array.isArray(places) ? places : []).filter(Boolean);
  if (!normalizedPlaces.length) {
    state.selectedMapResultId = "";
    return null;
  }

  const selectedPlace = state.selectedMapResultId
    ? normalizedPlaces.find((result, index) => getMapResultKey(result, index) === state.selectedMapResultId)
    : null;
  const resolvedPlace = selectedPlace || normalizedPlaces[0];
  state.selectedMapResultId = getMapResultKey(resolvedPlace, normalizedPlaces.indexOf(resolvedPlace));
  return resolvedPlace;
}

function selectPromotedPlaceByIndex(index) {
  const places = state.mapResults.slice(0, PROMOTED_PLACES_LIMIT);
  if (!Number.isInteger(index) || index < 0 || index >= places.length) {
    return;
  }

  state.selectedMapResultId = getMapResultKey(places[index], index);
  renderPlacesStage();
  renderGeneralSidebar();
}

function buildMapExplorerPlaceMarkup(result, index, selectedKey) {
  const resultKey = getMapResultKey(result, index);
  const isSelected = resultKey === selectedKey;
  const meta = formatMapResultMeta(result);
  const address = formatMapAddress(result, { fallbackToTitle: false });
  const routeSummaryMarkup = isSelected ? buildMapRouteSummaryMarkup(result) : "";

  return `
    <article class="map-explorer-place${isSelected ? " is-active" : ""}" role="listitem">
      <button
        type="button"
        class="map-place-select"
        data-map-select-index="${index}"
        aria-pressed="${isSelected ? "true" : "false"}"
      >
        <span class="map-place-rank">${index + 1}</span>
        <span class="map-place-copy">
          <span class="map-place-title">${escapeHtml(getMapDisplayTitle(result))}</span>
          ${meta ? `<span class="map-place-meta">${escapeHtml(meta)}</span>` : ""}
          ${address ? `<span class="map-place-address">${escapeHtml(address)}</span>` : ""}
          ${routeSummaryMarkup}
        </span>
      </button>
    </article>
  `;
}

function buildMapSelectedPlaceFactMarkup(label, value) {
  const normalizedValue = String(value || "").trim();
  if (!normalizedValue) {
    return "";
  }

  return `
    <div class="map-selected-place-fact">
      <p class="map-selected-place-fact-label">${escapeHtml(label)}</p>
      <p class="map-selected-place-fact-value">${escapeHtml(normalizedValue)}</p>
    </div>
  `;
}

function buildMapSelectedPlaceCardMarkup(result) {
  const title = getMapDisplayTitle(result);
  const address = formatMapAddress(result, { fallbackToTitle: false });
  const placeType = getMapPlaceType(result);
  const routeSummary = formatMapRouteSummary(result);
  const coordinates = formatCoordinatePair(result, { precision: 5 });
  const openUrl = getMapOpenUrl(result);
  const directionsUrl = buildMapDirectionsUrl(result);
  const sourceLabel = String(result?.source || result?.engine || result?.domain || getHostLabel(openUrl) || "").trim();
  const description = String(result?.content || "").trim();
  const summaryText = description && description !== address
    ? description
    : (address || routeSummary || "Select a place on the map to view its location details.");
  const supplementalAddress = address && address !== summaryText ? address : "";
  const facts = [
    buildMapSelectedPlaceFactMarkup("Type", placeType),
    buildMapSelectedPlaceFactMarkup("Distance", formatMapDistance(result)),
    buildMapSelectedPlaceFactMarkup("Coordinates", coordinates),
    buildMapSelectedPlaceFactMarkup("Source", result?.source || result?.engine || result?.domain),
  ].filter(Boolean).join("");

  return `
    <article class="map-selected-place-card">
      <div class="map-selected-place-head">
        <div>
          <p class="map-card-kicker">Info</p>
          <h2>${escapeHtml(title)}</h2>
        </div>
        ${sourceLabel ? `<span class="map-selected-place-source">${escapeHtml(sourceLabel)}</span>` : ""}
      </div>
      <div class="map-selected-place-summary">
        <span class="map-selected-place-fallback" aria-hidden="true">${escapeHtml(title.slice(0, 1).toUpperCase())}</span>
        <div class="map-selected-place-copy">
          ${placeType ? `<p class="map-selected-place-meta">${escapeHtml(placeType)}</p>` : ""}
          <p>${escapeHtml(summaryText)}</p>
          ${supplementalAddress ? `<p>${escapeHtml(supplementalAddress)}</p>` : ""}
          ${routeSummary ? `<p class="map-selected-place-route">${escapeHtml(routeSummary)}</p>` : ""}
        </div>
      </div>
      ${(openUrl || directionsUrl)
        ? `
          <div class="map-selected-place-actions">
            ${openUrl
              ? `<a class="map-selected-place-action map-selected-place-action-primary" href="${escapeHtml(openUrl)}" target="_blank" rel="noopener noreferrer">Open map</a>`
              : ""}
            ${directionsUrl
              ? `<a class="map-selected-place-action" href="${escapeHtml(directionsUrl)}" target="_blank" rel="noopener noreferrer">Directions</a>`
              : ""}
          </div>
        `
        : ""}
      ${facts ? `<div class="map-selected-place-facts">${facts}</div>` : ""}
    </article>
  `;
}

function renderMapSelectedSidebar(result) {
  if (state.activeView !== "maps" || state.loading || !result || !state.selectedMapResultId) {
    return false;
  }

  const selectedIndex = state.results.indexOf(result);
  if (getMapResultKey(result, selectedIndex) !== state.selectedMapResultId) {
    return false;
  }

  return renderViewSidebarMarkup(`
    <div class="map-selected-drawer">
      ${buildMapSelectedPlaceCardMarkup(result)}
    </div>
  `);
}

function renderMapStage() {
  if (!resultsStage) {
    return;
  }

  const primaryLocation = syncSelectedMapResult();

  if (!primaryLocation) {
    resultsStage.hidden = true;
    resultsStage.innerHTML = "";
    return;
  }

  const selectedKey = getMapResultKey(primaryLocation, state.results.indexOf(primaryLocation));
  const displayTitle = getMapDisplayTitle(primaryLocation);
  const areaLabel = getPreferredAreaLabel();
  const mapAreaTitle = getMapStageAreaTitle();
  const mapQueryLabel = String(state.query || "").trim();
  const visiblePlaces = state.results.slice(0, 14);
  const viewport = getRouteViewport(primaryLocation);
  const routeSummary = formatMapRouteSummary(primaryLocation);
  const mapRefinements = buildRefinementRailMarkup(buildMapRefinementItems(), "map-refinement-rail");
  resultsStage.hidden = false;
  resultsStage.innerHTML = `
    ${mapAreaTitle
      ? `
        <div class="map-stage-heading">
          <h2>${escapeHtml(mapAreaTitle)}</h2>
          ${mapQueryLabel ? `<p class="map-stage-query">Map results for “${escapeHtml(mapQueryLabel)}”</p>` : ""}
        </div>
      `
      : ""}
    <section class="map-explorer" aria-label="Map results">
      <aside class="map-explorer-sidebar">
        <div class="map-sidebar-head">
          <p class="map-card-kicker">Map results</p>
          <h2>${escapeHtml(areaLabel || state.query || "Places")}</h2>
          <p>${escapeHtml(state.results.length === 1 ? "1 place" : `${state.results.length} places`)}</p>
        </div>
        <div class="map-explorer-list" role="list" aria-label="Map result list">
          ${visiblePlaces.map((result, index) => buildMapExplorerPlaceMarkup(result, index, selectedKey)).join("")}
        </div>
      </aside>
      <div class="map-explorer-map">
        <div class="map-tile-layer" aria-hidden="true">
          ${buildMapTilesMarkup(viewport)}
        </div>
        <div class="map-route-layer">
          ${buildMapRouteOverlayMarkup(primaryLocation, viewport)}
        </div>
        <div class="map-pin-layer">
          ${buildMapPinsMarkup(state.results, viewport, selectedKey)}
        </div>
        <div class="map-selected-route-card">
          <p class="map-card-kicker">Route preview</p>
          <h2>${escapeHtml(displayTitle)}</h2>
          ${routeSummary ? `<p>${escapeHtml(routeSummary)}</p>` : ""}
        </div>
        <p class="map-attribution">© OpenStreetMap contributors</p>
        ${visiblePlaces.length > 1
          ? ""
          : `<div class="map-empty map-empty-inline">${escapeHtml(formatCoordinatePair(primaryLocation, { precision: 5 }) || "No map preview is available.")}</div>`
        }
      </div>
      ${!viewport
        ? '<div class="map-empty">No embeddable map preview is available for this result.</div>'
          : ""}
    </section>
    ${mapRefinements}
  `;
  renderMapSelectedSidebar(primaryLocation);
}

function buildAiSummaryResultMarkup(summary, source) {
  const parsedSummary = parseAiSummary(summary);
  if ((!parsedSummary.leadParagraph && !parsedSummary.detailItems.length) || !source) {
    return "";
  }

  const heading = getAiSummaryDisplayHeading(source);
  const copy = getAiCardCopy();

  return `
    <li class="result-row result-row-ai" data-ai-overview-row>
      <article class="spotlight-card spotlight-card-ai ai-section-collapsible${state.aiSectionExpanded ? " is-expanded" : ""}">
        <div class="spotlight-copy">
          <div class="spotlight-ai-head">
            <div class="spotlight-ai-headings">
              ${buildAiKickerMarkup(copy.kicker)}
              <p class="spotlight-title">${escapeHtml(copy.titlePrefix)} “${escapeHtml(heading)}”</p>
            </div>
            ${buildAiSummaryModelBadge()}
          </div>
          <div class="spotlight-summary-copy">
            ${parsedSummary.leadParagraph ? `<p class="spotlight-snippet spotlight-ai-lead">${escapeHtml(parsedSummary.leadParagraph)}</p>` : ""}
            ${parsedSummary.detailItems.length ? `
              <div class="spotlight-details spotlight-details-ai">
                <p class="spotlight-details-title">Key Details</p>
                <ul class="spotlight-details-list spotlight-details-list-ai">
                  ${parsedSummary.detailItems.map((item) => renderSummaryDetailItem(item)).join("")}
                </ul>
              </div>
            ` : ""}
          </div>
          <p class="spotlight-ai-disclaimer">AI can make mistakes, so double-check responses</p>
        </div>
        ${buildAiSectionToggleMarkup()}
      </article>
    </li>
  `;
}

function formatResultLabel(value) {
  return String(value || "")
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getResultHost(result) {
  return String(result?.domain || getHostLabel(result?.url) || "").trim().toLowerCase();
}

function isLikelyLocaleSourceLabel(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return /^[a-z]{2,3}(?:-[a-z]{2,3})?$/.test(normalized);
}

function getResultSiteName(result) {
  const host = getResultHost(result);
  if (host.includes("wikipedia.org")) {
    return "Wikipedia";
  }
  if (host.includes("wikidata.org")) {
    return "Wikidata";
  }
  if (host.includes("britannica.com")) {
    return "Britannica";
  }

  const source = String(result?.source || "").trim();
  if (source && !isLikelyLocaleSourceLabel(source)) {
    return source;
  }

  if (!host) {
    return "Website";
  }

  const hostParts = host.split(".");
  const primarySegment = hostParts.length > 2 && hostParts[0].length <= 3
    ? hostParts[1]
    : hostParts[0];
  const label = formatResultLabel(primarySegment);
  return label || host;
}

function getResultSectionLabel(result) {
  const category = String(result?.category || "").trim().toLowerCase();
  if (category && category !== "general") {
    return formatResultLabel(category);
  }

  try {
    const pathname = new URL(String(result?.url || "")).pathname;
    const [firstSegment = ""] = pathname.split("/").filter(Boolean);
    const normalizedSegment = String(firstSegment || "").trim().toLowerCase();
    if (!normalizedSegment || normalizedSegment.length > 24) {
      return "";
    }

    const ignoredSegments = new Set([
      "amp",
      "article",
      "articles",
      "blog",
      "en",
      "home",
      "index",
      "news",
      "post",
      "posts",
      "search",
      "tag",
      "tags",
      "topic",
      "topics",
      "us",
    ]);
    if (ignoredSegments.has(normalizedSegment)) {
      return "";
    }

    return formatResultLabel(normalizedSegment);
  } catch {
    return "";
  }
}

function getResultDisplayUrl(result) {
  const host = getResultHost(result);
  return host ? `https://${host}` : String(result?.url || "").trim();
}

function getResultFaviconUrl(result) {
  try {
    return `${new URL(String(result?.url || "")).origin}/favicon.ico`;
  } catch {
    return "";
  }
}

function buildStandardResultMarkup(result, emptySnippet = "No preview text was returned for this result.", index = -1) {
  const siteName = getResultSiteName(result);
  const resultUrl = String(result?.url || "").trim();
  const displayUrl = getResultDisplayUrl(result);
  const sectionLabel = getResultSectionLabel(result);
  const siteMeta = [displayUrl, sectionLabel].filter(Boolean).join(" \u203a ");
  const faviconUrl = getResultFaviconUrl(result);
  const faviconFallback = (siteName || getResultHost(result) || "W").slice(0, 1).toUpperCase();
  const titleMarkup = resultUrl
    ? `<a class="result-title standard-result-title" href="${escapeHtml(resultUrl)}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(result.title)}
        </a>`
    : `<span class="result-title standard-result-title">${escapeHtml(result.title)}</span>`;
  const readMoreMarkup = resultUrl
    ? `<a class="standard-result-read-more" href="${escapeHtml(resultUrl)}" target="_blank" rel="noopener noreferrer">Read more</a>`
    : "";
  return `
    <li class="result-row">
      <article class="result-item standard-result-item">
        <div class="standard-result-site">
          <span class="standard-result-icon" aria-hidden="true">
            <span class="standard-result-icon-fallback">${escapeHtml(faviconFallback)}</span>
            ${faviconUrl
              ? `<img class="standard-result-icon-image" src="${escapeHtml(faviconUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true">`
              : ""}
          </span>
          <span class="standard-result-site-copy">
            <span class="standard-result-site-name">${escapeHtml(siteName)}</span>
            ${siteMeta ? `<span class="standard-result-site-meta">${escapeHtml(siteMeta)}</span>` : ""}
          </span>
          ${Number.isInteger(index) && index >= 0
            ? `<button
                type="button"
                class="standard-result-more"
                data-result-details-index="${index}"
                aria-label="About this result"
                aria-haspopup="dialog"
                aria-expanded="false"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 7.25a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Zm0 7a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Zm0 7a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Z"/>
                </svg>
              </button>`
            : ""}
        </div>
        ${titleMarkup}
        <p class="result-snippet standard-result-snippet">
          ${escapeHtml(result.content || emptySnippet)}
          ${readMoreMarkup}
        </p>
      </article>
    </li>
  `;
}

function getResultPreviewImage(result) {
  return result.thumbnail_url || result.image_url || "";
}

function getMatchedQueryTerms(value, tokens = getQueryTokens()) {
  const haystack = String(value || "").toLowerCase();
  return tokens.filter((token, index) => haystack.includes(token) && tokens.indexOf(token) === index);
}

function formatQueryTermsList(terms = []) {
  if (!terms.length) {
    return "";
  }
  if (terms.length === 1) {
    return `"${terms[0]}"`;
  }
  if (terms.length === 2) {
    return `"${terms[0]}" and "${terms[1]}"`;
  }

  const leadingTerms = terms.slice(0, -1).map((term) => `"${term}"`).join(", ");
  return `${leadingTerms}, and "${terms[terms.length - 1]}"`;
}

function buildResultDetailsFacts(result) {
  return [
    {
      label: "Site",
      value: getResultHost(result) || getResultSiteName(result),
    },
    {
      label: "Section",
      value: getResultSectionLabel(result),
    },
    {
      label: "Source",
      value: result.engine || "SearXNG",
    },
  ].filter((fact) => fact.value);
}

function buildResultDetailsAboutText(result) {
  const siteName = getResultSiteName(result);
  const host = getResultHost(result);
  const sectionLabel = getResultSectionLabel(result);
  const hostLabel = host || siteName;
  const parts = [`Hosted on ${hostLabel}.`];

  if (sectionLabel) {
    parts.push(`From the ${sectionLabel} section.`);
  }
  if (result.engine) {
    parts.push(`Returned by ${result.engine}.`);
  }

  return parts.join(" ");
}

function buildResultDetailsReasons(result) {
  const queryTerms = getQueryTokens();
  const titleMatches = getMatchedQueryTerms(result?.title, queryTerms);
  const snippetMatches = getMatchedQueryTerms(result?.content, queryTerms)
    .filter((term) => !titleMatches.includes(term));
  const reasons = [];

  if (titleMatches.length) {
    reasons.push(`Title matches ${formatQueryTermsList(titleMatches)}.`);
  }
  if (snippetMatches.length) {
    reasons.push(`Snippet mentions ${formatQueryTermsList(snippetMatches)}.`);
  }

  const sectionLabel = getResultSectionLabel(result);
  if (sectionLabel) {
    reasons.push(`From the ${sectionLabel} section.`);
  }

  const host = getResultHost(result);
  if (host) {
    reasons.push(`Hosted on ${host}.`);
  }

  if (!reasons.length) {
    reasons.push(`Links to ${getResultDisplayUrl(result)}.`);
  }

  return reasons.slice(0, 3);
}

function getNewsAiResultSummaryLine(result, index) {
  const title = String(result?.title || "Untitled story").trim();
  const source = String(result?.source || result?.domain || getHostLabel(result?.url) || "").trim();
  const published = formatPublishedDate(result?.published_date);
  const snippet = trimNewsAiSnippet(result?.content);
  const meta = [published, source].filter(Boolean).join(" · ");
  return `${index + 1}. ${title}${meta ? ` (${meta})` : ""}${snippet ? ` - ${snippet}` : ""}`;
}

function buildNewsAiPeriodSource(period, results = [], now = new Date()) {
  const sortedResults = sortNewsResultsByRecency(results);
  const lines = [
    `Time window: ${period.heading} (${getNewsAiDateRangeLabel(period, now)})`,
    sortedResults.length
      ? "Loaded stories in this window:"
      : "No loaded stories with publish dates in this window.",
    ...sortedResults.map((result, index) => getNewsAiResultSummaryLine(result, index)),
  ];

  return {
    id: `news-ai-${period.id}`,
    title: `News context - ${period.heading}`,
    url: `https://${NEWS_AI_SOURCE_HOST}/${period.id}`,
    content: lines.join("\n"),
    source: "Loaded news results",
    domain: NEWS_AI_SOURCE_HOST,
  };
}

function getNewsAiSummaryContext(results = state.results, now = new Date()) {
  const effective = getEffectivePreferences();
  const sortedResults = sortNewsResultsByRecency(dedupeResultsForView(results, "news"));
  const periodEntries = NEWS_AI_PERIODS.map((period) => ({
    period,
    results: sortedResults.filter((result) => isNewsResultInPeriod(result, period, now)),
  }));
  const hasRecentDatedStories = periodEntries.some((entry) => entry.results.length);
  const resultKey = sortedResults
    .map((result) => [
      getInfiniteResultKey(result, "news"),
      String(result?.published_date || ""),
    ].join("@"))
    .join("|");
  const key = [
    "news-ai",
    getLocalDateKey(now),
    state.query,
    state.newsTopic,
    state.newsBaseQuery,
    state.literalSearch ? "literal" : "normal",
    String(effective.aiTemperature),
    String(effective.aiNumPredict),
    String(effective.aiSourceLimit),
    sortedResults.length,
    resultKey,
  ].join("::");

  return {
    key,
    resultCount: sortedResults.length,
    periodEntries,
    sources: hasRecentDatedStories
      ? periodEntries.map((entry) => buildNewsAiPeriodSource(entry.period, entry.results, now))
      : [],
  };
}

function buildNewsAiSummaryPrompt(context) {
  const today = formatNewsAiDate(new Date());
  const periodRules = NEWS_AI_PERIODS
    .map((period) => `- ${period.heading}: use only stories from ${getNewsAiDateRangeLabel(period)}.`)
    .join("\n");

  return `Create a concise news impact brief from the supplied search-result context only.

Today is ${today}. The context is grouped into time windows.

Rank "biggest" by real-world impact: crises, public safety, war/conflict, major policy or legal changes, economic impact, important business/science/technology changes, and stories likely to be among the most widely followed. Do not prioritize routine, promotional, or low-impact items unless the supplied context clearly makes them one of the biggest stories.

Output exactly these two sections, in this order:
Past 3 Days
Other Events

Window rules:
${periodRules}

Writing rules:
- Put 1 to 3 bullets under each section.
- Start each bullet with a short event label, then a colon, then a one-sentence summary.
- In Past 3 Days, use only stories from the last 3 days and pick the biggest events in that window.
- In Other Events, use only stories from the past month that are not included in Past 3 Days.
- If a section has no meaningful event in the supplied context, write exactly: - No major events found in the loaded results for this window.
- Do not mention sources, search results, supplied context, prompts, or how the brief was produced.
- Do not use outside knowledge or guess beyond the supplied context.
- Keep each bullet short and factual.`;
}

function normalizeNewsAiSummaryText(value) {
  return normalizeSummaryTextWithPrefaceFilter(value)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getNewsAiPeriodFromHeading(value) {
  const normalized = String(value || "")
    .replace(/^#+\s*/, "")
    .replace(/^\d+[.)]\s*/, "")
    .replace(/[*_`]+/g, "")
    .replace(/[:：]\s*$/, "")
    .trim()
    .toLowerCase();
  if (!normalized) {
    return null;
  }

  if (/past\s*3|last\s*3|three\s*days/.test(normalized)) {
    return NEWS_AI_PERIODS[0];
  }
  if (/other|past\s*month|last\s*month|past\s*30|last\s*30|month/.test(normalized)) {
    return NEWS_AI_PERIODS[1];
  }

  return null;
}

function parseNewsAiSummarySections(summary) {
  const sections = NEWS_AI_PERIODS.map((period) => ({
    period,
    items: [],
  }));
  const sectionById = new Map(sections.map((section) => [section.period.id, section]));
  let currentSection = sections[0];
  const fallbackItems = [];

  normalizeNewsAiSummaryText(summary).split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }

    const period = getNewsAiPeriodFromHeading(trimmed);
    if (period) {
      currentSection = sectionById.get(period.id) || currentSection;
      return;
    }

    const bulletMatch = trimmed.match(/^(?:[-*•]|\d+[.)])\s*(.+)$/);
    const text = normalizeSummaryDetailItem(bulletMatch ? bulletMatch[1] : trimmed);
    if (!text) {
      return;
    }

    if (currentSection) {
      currentSection.items.push(text);
      return;
    }

    fallbackItems.push(text);
  });

  if (sections.every((section) => !section.items.length) && fallbackItems.length) {
    sections[0].items.push(...fallbackItems.slice(0, 3));
  }

  return sections;
}

function renderNewsAiSummaryItem(item) {
  const compact = String(item || "").trim();
  if (!compact) {
    return "";
  }

  const separatorIndex = compact.indexOf(":");
  if (separatorIndex > 0) {
    const label = compact.slice(0, separatorIndex).trim();
    const value = compact.slice(separatorIndex + 1).trim();
    if (label && value) {
      return `
        <li class="news-ai-summary-item">
          <span class="news-ai-summary-dot" aria-hidden="true"></span>
          <span><span class="news-ai-summary-label">${escapeHtml(label)}:</span> ${escapeHtml(value)}</span>
        </li>
      `;
    }
  }

  return `
    <li class="news-ai-summary-item">
      <span class="news-ai-summary-dot" aria-hidden="true"></span>
      <span>${escapeHtml(compact)}</span>
    </li>
  `;
}

function buildNewsAiSummarySectionMarkup(section, { featured = false } = {}) {
  const items = section.items.length
    ? section.items
    : ["No major events found in the loaded results for this window."];
  return `
    <section class="news-ai-summary-section${featured ? " is-featured" : ""}">
      <p class="news-ai-summary-section-kicker">${escapeHtml(featured ? "Biggest events" : "Other recent events")}</p>
      <h3>${escapeHtml(section.period.heading)}</h3>
      <ul class="news-ai-summary-list">
        ${items.slice(0, 3).map((item) => renderNewsAiSummaryItem(item)).join("")}
      </ul>
    </section>
  `;
}

function buildNewsAiSummaryBodyMarkup(summary) {
  const [primarySection, ...timelineSections] = parseNewsAiSummarySections(summary);
  return `
    ${buildNewsAiSummarySectionMarkup(primarySection, { featured: true })}
    <div class="news-ai-summary-timeline">
      ${timelineSections.map((section) => buildNewsAiSummarySectionMarkup(section)).join("")}
    </div>
  `;
}

function buildNewsAiSummaryLoadingBodyMarkup(message = "Generating AI news brief...", { textless = false } = {}) {
  const loadingKickerMarkup = textless
    ? '<span class="skeleton-line skeleton-line-news-related-meta"></span>'
    : `<p class="news-ai-summary-section-kicker">${escapeHtml(message)}</p>`;
  return `
    <section class="news-ai-summary-section is-featured news-ai-summary-section-loading result-item-skeleton" aria-hidden="true">
      ${loadingKickerMarkup}
      <span class="skeleton-line skeleton-line-news-title"></span>
      <div class="news-ai-summary-loading-lines">
        ${Array.from({ length: 3 }, () => `
          <span class="news-ai-summary-loading-item">
            <span class="skeleton-circle ai-summary-detail-dot-skeleton"></span>
            <span class="news-ai-summary-loading-copy">
              <span class="skeleton-line skeleton-line-news-related-title"></span>
              <span class="skeleton-line skeleton-line-place-snippet skeleton-line-place-snippet-short"></span>
            </span>
          </span>
        `).join("")}
      </div>
    </section>
    <div class="news-ai-summary-timeline result-item-skeleton" aria-hidden="true">
      ${Array.from({ length: 1 }, () => `
        <section class="news-ai-summary-section news-ai-summary-section-loading">
          <span class="skeleton-line skeleton-line-news-related-meta"></span>
          <span class="skeleton-line skeleton-line-news-related-title"></span>
          <span class="news-ai-summary-loading-item">
            <span class="skeleton-circle ai-summary-detail-dot-skeleton"></span>
            <span class="news-ai-summary-loading-copy">
              <span class="skeleton-line skeleton-line-news-related-title"></span>
              <span class="skeleton-line skeleton-line-place-snippet skeleton-line-place-snippet-short"></span>
            </span>
          </span>
        </section>
      `).join("")}
    </div>
  `;
}

function buildNewsAiSummarySkeletonCardMarkup() {
  return `
    <article class="news-ai-summary-card" aria-live="polite" aria-busy="true">
      <div class="news-ai-summary-head">
        <div aria-hidden="true">
          <span class="skeleton-line skeleton-line-news-related-meta"></span>
          <span class="skeleton-line skeleton-line-sidebar-title"></span>
        </div>
        <span class="skeleton-line skeleton-line-news-related-meta" aria-hidden="true"></span>
      </div>
      ${buildNewsAiSummaryLoadingBodyMarkup("Preparing AI news brief...", { textless: true })}
    </article>
  `;
}

function buildNewsAiSummaryCardMarkup() {
  if (!isAiEnabled()) {
    return "";
  }

  const context = getNewsAiSummaryContext();
  const isCurrentSummary = Boolean(context.key && context.key === state.newsAiSummaryKey);
  const storyCount = Math.max(context.resultCount, state.newsAiSummaryResultCount);
  const storyLabel = storyCount === 1 ? "1 story loaded" : `${storyCount} stories loaded`;
  const canGenerate = Boolean(context.sources.length);
  const isLoading = canGenerate && (!isCurrentSummary || state.newsAiSummaryLoading);
  const summary = isCurrentSummary ? state.newsAiSummary : "";
  const bodyMarkup = !canGenerate
    ? `
      <section class="news-ai-summary-section is-featured">
        <p class="news-ai-summary-empty">No dated stories from the past month are loaded yet.</p>
      </section>
    `
    : (isLoading
      ? buildNewsAiSummaryLoadingBodyMarkup(isCurrentSummary ? "Generating AI news brief..." : "Refreshing AI news brief...")
      : buildNewsAiSummaryBodyMarkup(summary || NEWS_AI_SUMMARY_FALLBACK_TEXT));

  return `
    <article class="news-ai-summary-card" aria-live="polite" aria-busy="${isLoading ? "true" : "false"}">
      <div class="news-ai-summary-head">
        <div>
          ${buildAiKickerMarkup("AI news brief")}
          <h2>Biggest events</h2>
        </div>
        <span class="news-ai-summary-count">${escapeHtml(storyLabel)}</span>
      </div>
      ${bodyMarkup}
    </article>
  `;
}

function renderNewsAiSidebar({ skeleton = false } = {}) {
  if (state.activeView !== "news" || !isAiEnabled()) {
    return false;
  }

  const cardMarkup = skeleton
    ? buildNewsAiSummarySkeletonCardMarkup()
    : buildNewsAiSummaryCardMarkup();
  return renderViewSidebarMarkup(`
    <aside class="news-ai-summary-slot" data-news-ai-summary-slot>
      ${cardMarkup}
    </aside>
  `);
}

function renderNewsAiSummaryUpdate() {
  if (state.activeView !== "news") {
    return;
  }

  let slot = resultsSidebar?.querySelector("[data-news-ai-summary-slot]")
    || resultsStage?.querySelector("[data-news-ai-summary-slot]");
  if (!(slot instanceof HTMLElement) && renderNewsAiSidebar()) {
    slot = resultsSidebar?.querySelector("[data-news-ai-summary-slot]");
  }
  if (!(slot instanceof HTMLElement)) {
    return;
  }

  slot.innerHTML = buildNewsAiSummaryCardMarkup();
}

function buildNewsMeta(result) {
  return [
    result.source || result.domain || getHostLabel(result.url),
    result.author,
    formatPublishedDate(result.published_date),
  ].filter(Boolean).join(" · ");
}

function getNewsResultPublishedTimestamp(result) {
  const parsedDate = parsePublishedDateValue(result?.published_date);
  return parsedDate ? parsedDate.getTime() : Number.NEGATIVE_INFINITY;
}

function sortNewsResultsByRecency(results = []) {
  return (Array.isArray(results) ? results : [])
    .filter(Boolean)
    .map((result, index) => ({
      result,
      index,
      timestamp: getNewsResultPublishedTimestamp(result),
    }))
    .sort((first, second) => {
      const recencyDelta = second.timestamp - first.timestamp;
      return Number.isFinite(recencyDelta) && recencyDelta !== 0
        ? recencyDelta
        : first.index - second.index;
    })
    .map((entry) => entry.result);
}

function chunkResults(items, size = 4) {
  const normalizedItems = Array.isArray(items) ? items : [];
  const chunkedItems = [];

  for (let index = 0; index < normalizedItems.length; index += size) {
    chunkedItems.push(normalizedItems.slice(index, index + size));
  }

  return chunkedItems;
}

function buildNewsRelatedStoryMarkup(result) {
  const meta = buildNewsMeta(result);
  return `
    <a class="news-story-related" href="${escapeHtml(result.url)}" target="_blank" rel="noopener noreferrer">
      ${meta ? `<span class="news-story-related-meta">${escapeHtml(meta)}</span>` : ""}
      <span class="news-story-related-title">${escapeHtml(result.title)}</span>
    </a>
  `;
}

function buildNewsStoryClusterMarkup(results, { featured = false } = {}) {
  const [leadStory, ...relatedStories] = Array.isArray(results) ? results : [];
  if (!leadStory) {
    return "";
  }

  const preview = getResultPreviewImage(leadStory);
  const meta = buildNewsMeta(leadStory);
  const hostLabel = getHostLabel(leadStory.url) || leadStory.domain || leadStory.source || "Article";
  const snippet = leadStory.content || "Open this story to continue reading.";
  return `
    <article class="news-story-cluster${featured ? " is-featured" : ""}">
      <div class="news-story-main">
        <a
          class="news-story-media"
          href="${escapeHtml(leadStory.url)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open ${escapeHtml(leadStory.title)}"
        >
          ${preview
            ? `<img src="${escapeHtml(preview)}" alt="${escapeHtml(leadStory.title)}" loading="lazy">`
            : '<span class="news-result-placeholder">Story image</span>'}
        </a>
        <div class="news-story-copy">
          ${meta ? `<p class="news-story-meta">${escapeHtml(meta)}</p>` : ""}
          <a class="news-story-title" href="${escapeHtml(leadStory.url)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(leadStory.title)}
          </a>
          <p class="news-story-snippet">${escapeHtml(snippet)}</p>
          <div class="news-story-footer">
            <p class="news-story-url">${escapeHtml(hostLabel)}</p>
            <a class="panel-link news-story-link" href="${escapeHtml(leadStory.url)}" target="_blank" rel="noopener noreferrer">Open article</a>
          </div>
        </div>
      </div>
      ${relatedStories.length
        ? `<div class="news-story-related-list">
            ${relatedStories.map((story) => buildNewsRelatedStoryMarkup(story)).join("")}
          </div>`
        : ""}
    </article>
  `;
}

function buildNewsStageMarkup(results) {
  const presentation = getNewsTopicPresentation();
  return `
    <section class="news-stage-layout">
      <div class="news-stage-main">
        <section class="news-stage-shell">
          <div class="news-stage-head">
            <div class="news-stage-copy">
              <div class="news-stage-context-row">
                <p class="news-stage-kicker">News</p>
                <span class="news-stage-context-separator" aria-hidden="true"></span>
                <p class="news-stage-context">${escapeHtml(presentation.contextLabel)}</p>
              </div>
              <h2 class="news-stage-title">${escapeHtml(presentation.title)}</h2>
              <p class="news-stage-subtitle">${escapeHtml(presentation.subtitle)}</p>
            </div>
          </div>
          ${buildNewsStoryClusterMarkup(results, { featured: true })}
        </section>
      </div>
    </section>
  `;
}

function renderPlacesStage() {
  if (!resultsStage || !shouldPromotePlaces()) {
    return false;
  }

  const places = state.mapResults.slice(0, PROMOTED_PLACES_LIMIT);
  const primaryPlace = getSelectedPromotedPlace(places);
  const hasMorePlaces = state.mapResults.length > places.length;
  const location = getPreferredAreaLabel();
  const contextLabel = location
    ? `Results for ${location}`
    : "Local-intent results";
  resultsStage.hidden = false;
  resultsStage.innerHTML = `
    <article class="places-stage-card">
      <div class="places-stage-head">
        <div>
          <p class="places-section-kicker places-stage-kicker">
            ${MAP_KICKER_ICON_SVG}
            <span>Places Summary</span>
          </p>
          <p class="places-stage-context">${escapeHtml(contextLabel)}</p>
        </div>
      </div>
      <div class="places-stage-grid">
        <div class="places-stage-list">
          ${places.map((result, index) => {
            const title = getMapDisplayTitle(result);
            const meta = formatPlaceMeta(result);
            const routeSummaryMarkup = buildMapRouteSummaryMarkup(result, "place-stage-route");
            const isSelected = result === primaryPlace;
            return `
              <button
                type="button"
                class="place-stage-item${isSelected ? " is-active" : ""}"
                data-place-stage-index="${index}"
                aria-pressed="${isSelected ? "true" : "false"}"
              >
                <span class="place-stage-rank">${index + 1}</span>
                <span class="place-stage-body">
                  <span class="place-stage-title">${escapeHtml(title)}</span>
                  ${meta ? `<span class="place-stage-meta">${escapeHtml(meta)}</span>` : ""}
                  ${routeSummaryMarkup}
                  <span class="place-stage-snippet">${escapeHtml(result.content || "Open this place match to see the listing details.")}</span>
                </span>
              </button>
            `;
          }).join("")}
          ${hasMorePlaces
            ? `<button
                type="button"
                class="place-stage-map-link"
                data-stage-action="maps"
                aria-label="View more places in Maps"
              >
                <span class="place-stage-map-link-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M5.25 4.4 9 2.9l6 2.7 3.75-1.5A.75.75 0 0 1 19.75 4.8v14.8a.75.75 0 0 1-.47.7L15 22.02l-6-2.7-3.75 1.5a.75.75 0 0 1-1-.7V5.1a.75.75 0 0 1 .47-.7ZM9.75 17.98l4.5 2.02V6.92L9.75 4.9v13.08Zm-1.5-13.24-2.5 1v13.28l2.5-1V4.74Zm7.5 15.02 2.5-1V5.48l-2.5 1v13.28Z"/>
                  </svg>
                </span>
                <span class="place-stage-map-link-copy">
                  <span class="place-stage-map-link-title">View Maps</span>
                  <span class="place-stage-map-link-meta">See the full place view for this search.</span>
                </span>
              </button>`
            : ""}
        </div>
        <div class="places-stage-map">
          <div class="places-stage-map-shell places-stage-map-shell-routed">
            ${buildPlaceRouteMapMarkup(primaryPlace, places)}
          </div>
        </div>
      </div>
    </article>
  `;

  return true;
}

function renderAllResults() {
  if (!resultsRoot) {
    return;
  }

  clearSecondaryResults();
  renderPlacesStage();

  if (!state.results.length) {
    setResultsState("ready");
    resultsRoot.innerHTML = `
      <li class="result-row">
        <article class="notice-card">${escapeHtml(
          state.mapResults.length
            ? `No web results came back for "${state.query}", but we found matching places.`
            : `No results came back for "${state.query}".`,
        )}</article>
      </li>
    `;
    renderGeneralSidebar();
    return;
  }

  setResultsState("ready");
  const summarySource = state.aiSummarySource || getAiSummaryAnchorResult();
  const summaryMarkup = buildCurrentAiSummaryMarkup(summarySource);
  const standardResults = state.results
    .map((result, index) => buildStandardResultMarkup(result, "No preview text was returned for this result.", index))
    .join("");
  resultsRoot.innerHTML = `${summaryMarkup}${standardResults}`;
  renderGeneralSidebar();
}

function buildCurrentAiSummaryMarkup(source = state.aiSummarySource || getAiSummaryAnchorResult()) {
  if (!isAiEnabled() || !source) {
    return "";
  }

  return state.aiSummaryLoading
    ? buildAiSummaryLoadingMarkup(source, state.query)
    : buildAiSummaryResultMarkup(state.aiSummary, source);
}

function renderAiSummaryUpdate() {
  if (!resultsRoot || state.activeView !== "general" || state.loading || !state.results.length) {
    renderResults();
    return;
  }

  const existingSummaryRow = resultsRoot.querySelector(".spotlight-card-ai")?.closest(".result-row");
  const hasRenderedResults = Boolean(resultsRoot.querySelector(".result-item"));
  if (!existingSummaryRow && !hasRenderedResults) {
    renderResults();
    return;
  }

  const summaryMarkup = buildCurrentAiSummaryMarkup();
  if (!summaryMarkup) {
    existingSummaryRow?.remove();
    renderGeneralSidebar();
    return;
  }

  const template = document.createElement("template");
  template.innerHTML = summaryMarkup.trim();
  const nextSummaryRow = template.content.firstElementChild;
  if (!nextSummaryRow) {
    return;
  }

  if (existingSummaryRow) {
    existingSummaryRow.replaceWith(nextSummaryRow);
    renderGeneralSidebar();
    return;
  }

  resultsRoot.prepend(nextSummaryRow);
  renderGeneralSidebar();
}

function renderNewsResults() {
  if (!resultsRoot) {
    return;
  }

  clearSecondaryResults();
  renderNewsTopicNavigation();

  if (!state.results.length) {
    renderEmpty(getNewsTopicPresentation().emptyText);
    return;
  }

  const sortedStories = sortNewsResultsByRecency(state.results);
  const featuredStories = sortedStories.slice(0, Math.min(4, sortedStories.length));
  const remainingStories = sortedStories.slice(featuredStories.length);

  if (resultsStage && featuredStories.length) {
    resultsStage.hidden = false;
    resultsStage.innerHTML = buildNewsStageMarkup(featuredStories);
  }
  renderNewsAiSidebar();

  setResultsState("ready");
  resultsRoot.innerHTML = buildNewsResultRowsMarkup(remainingStories);
  requestNewsAiSummaryForCurrentResults();
}

function renderImageResults() {
  if (!resultsRoot) {
    return;
  }

  clearSecondaryResults();
  closeImagePreview({ restoreFocus: false });

  if (!state.results.length) {
    renderEmpty(`No image results came back for "${state.query}".`);
    return;
  }

  const relatedTopics = getImageRelatedTopics();
  if (resultsStage && relatedTopics.length) {
    resultsStage.hidden = false;
    resultsStage.innerHTML = buildImageTopicStageMarkup(relatedTopics);
    fitImageTopicStrip();
    requestImageTopicStripFit();
  }

  setResultsState("ready");
  resultsRoot.innerHTML = state.results
    .map((result, index) => buildImageResultMarkup(result, index))
    .join("");
}

function renderMapResults() {
  if (!resultsRoot) {
    return;
  }

  clearSecondaryResults();
  renderMapStage();

  if (!state.results.length) {
    renderEmpty(`No mapped locations came back for "${state.query}"${getPreferredAreaLabel() ? ` near ${getPreferredAreaLabel()}` : ""}.`);
    return;
  }

  setResultsState("ready");
  resultsRoot.innerHTML = "";
}

function selectMapResultByIndex(index, { focusStage = false } = {}) {
  if (state.activeView !== "maps" || !Number.isInteger(index) || index < 0 || index >= state.results.length) {
    return;
  }

  const result = state.results[index];
  state.selectedMapResultId = getMapResultKey(result, index);
  renderMapResults();

  if (focusStage && resultsStage instanceof HTMLElement) {
    resultsStage.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
}

function renderResults() {
  if (state.activeView === "images") {
    renderImageResults();
    return;
  }

  if (state.activeView === "news") {
    renderNewsResults();
    return;
  }

  if (state.activeView === "maps") {
    renderMapResults();
    return;
  }

  renderAllResults();
}

function createEmptyPaginationState() {
  return {
    pageResultCount: 0,
    totalResults: 0,
    totalResultsKnown: false,
    hasNextPage: null,
    probing: false,
  };
}

function getPayloadPageResultCount(payload) {
  const explicitCount = Number(payload?.page_result_count);
  if (Number.isFinite(explicitCount) && explicitCount >= 0) {
    return explicitCount;
  }
  const resultCount = Array.isArray(payload?.results) ? payload.results.length : state.results.length;
  return Number.isFinite(resultCount) && resultCount >= 0 ? resultCount : 0;
}

function getPayloadTotalResults(payload) {
  const pageResultCount = getPayloadPageResultCount(payload);
  const rawTotalResults = Number(payload?.total_results);
  if (Boolean(payload?.total_results_known) && Number.isFinite(rawTotalResults) && rawTotalResults > 0) {
    return Math.max(rawTotalResults, pageResultCount);
  }
  return pageResultCount;
}

function getResultCountSuffix(count, view = state.activeView) {
  if (view === "images") {
    return count === 1 ? "image" : "images";
  }
  if (view === "news") {
    return count === 1 ? "story" : "stories";
  }
  if (view === "maps") {
    return count === 1 ? "place" : "places";
  }
  return count === 1 ? "result" : "results";
}

function createEmptyInfiniteScrollState() {
  return {
    nextPage: 2,
    hasMore: false,
    loading: false,
    exhausted: false,
    emptyAttempts: 0,
    seenKeys: new Set(),
    abortController: null,
  };
}

function isInfiniteScrollView(view = state.activeView) {
  return INFINITE_SCROLL_VIEWS.has(normalizeResultsView(view));
}

function resetInfiniteScrollState() {
  state.infiniteScroll.abortController?.abort();
  state.infiniteScroll = createEmptyInfiniteScrollState();
}

function getCanonicalResultUrlKey(value) {
  const rawUrl = String(value || "").trim();
  if (!rawUrl) {
    return "";
  }

  try {
    const url = new URL(rawUrl);
    url.hash = "";
    Array.from(url.searchParams.keys()).forEach((key) => {
      const normalizedKey = key.toLowerCase();
      if (
        normalizedKey.startsWith("utm_")
        || ["fbclid", "gclid", "mc_cid", "mc_eid"].includes(normalizedKey)
      ) {
        url.searchParams.delete(key);
      }
    });
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const search = url.searchParams.toString();
    return normalizeSuggestionKey(`${url.origin.toLowerCase()}${path}${search ? `?${search}` : ""}`);
  } catch {
    return normalizeSuggestionKey(rawUrl.replace(/#.*$/, "").replace(/\/+$/, ""));
  }
}

function getInfiniteResultKey(result, view = state.activeView) {
  const normalizedView = normalizeResultsView(view);
  if (normalizedView === "images") {
    return getCanonicalResultUrlKey(result?.image_url)
      || getCanonicalResultUrlKey(result?.thumbnail_url)
      || getCanonicalResultUrlKey(result?.url)
      || getImageResultKey(result);
  }

  return getCanonicalResultUrlKey(result?.url)
    || getResultIdentityKey(result)
    || normalizeSuggestionKey(`${result?.title || ""} ${result?.source || ""} ${result?.content || ""}`);
}

function dedupeResultsForView(results = [], view = state.activeView) {
  const seen = new Set();
  const uniqueResults = [];
  (Array.isArray(results) ? results : []).forEach((result) => {
    const key = getInfiniteResultKey(result, view);
    if (!key || seen.has(key)) {
      return;
    }

    seen.add(key);
    uniqueResults.push(result);
  });
  return uniqueResults;
}

function rememberInfiniteResultKeys(results = state.results, view = state.activeView) {
  state.infiniteScroll.seenKeys = new Set();
  (Array.isArray(results) ? results : []).forEach((result) => {
    const key = getInfiniteResultKey(result, view);
    if (key) {
      state.infiniteScroll.seenKeys.add(key);
    }
  });
}

function filterNewInfiniteResults(results = [], view = state.activeView) {
  const uniqueResults = [];
  (Array.isArray(results) ? results : []).forEach((result) => {
    const key = getInfiniteResultKey(result, view);
    if (!key || state.infiniteScroll.seenKeys.has(key)) {
      return;
    }

    state.infiniteScroll.seenKeys.add(key);
    uniqueResults.push(result);
  });
  return uniqueResults;
}

function resetInfiniteScrollEmptyAttempts() {
  state.infiniteScroll.emptyAttempts = 0;
  state.searchServiceFailureCount = 0;
}

function isInfiniteScrollTriggerZoneActive() {
  const documentElement = document.documentElement;
  const documentHeight = Math.max(
    documentElement.scrollHeight,
    document.body?.scrollHeight || 0,
  );
  const viewportBottom = window.scrollY + window.innerHeight;
  return documentHeight - viewportBottom <= INFINITE_SCROLL_BOTTOM_OFFSET_PX;
}

function isCurrentAiSignal(controller, currentSignal) {
  return Boolean(currentSignal && controller?.signal === currentSignal);
}

function temporarilyPauseAiService({ currentSignal = null } = {}) {
  clearTemporaryServicePauseRelease("ai");
  armTemporaryServicePauseRelease("ai");
  markServiceDurationOutcome("ai", "failure");
  state.aiTemporarilyDisabledBySystem = true;

  const preserveAiSummary = isCurrentAiSignal(state.aiSummaryAbortController, currentSignal);
  const preserveNewsAiSummary = isCurrentAiSignal(state.newsAiSummaryAbortController, currentSignal);
  const preserveChat = isCurrentAiSignal(state.chatAbortController, currentSignal);

  if (!preserveAiSummary) {
    state.aiSummaryAbortController?.abort();
    if (state.aiSummaryLoading) {
      setAiSummaryState({
        summary: state.aiSummary,
        source: state.aiSummarySource,
        sources: state.aiSummarySources,
      });
      renderAiSummaryUpdate();
    }
  }

  if (!preserveNewsAiSummary) {
    state.newsAiSummaryAbortController?.abort();
    if (state.newsAiSummaryLoading) {
      setNewsAiSummaryState({
        summary: state.newsAiSummary,
        key: state.newsAiSummaryKey,
        sources: state.newsAiSummarySources,
        resultCount: state.newsAiSummaryResultCount,
      });
      renderNewsAiSummaryUpdate();
    }
  }

  if (!preserveChat) {
    state.chatAbortController?.abort();
  }

  if (state.activeView === "news") {
    renderNewsResults();
  }
  updateChatActionStates();
  syncAiToggleButtons();
}

function temporarilyPauseSearchService({ pauseAi = false } = {}) {
  clearTemporaryServicePauseRelease("search");
  armTemporaryServicePauseRelease("search");
  markServiceDurationOutcome("search", "failure");
  state.searchServiceTemporarilyDisabled = true;
  state.infiniteScroll.hasMore = false;
  state.infiniteScroll.exhausted = true;
  state.infiniteScroll.loading = false;
  state.infiniteScroll.reentryRequired = false;
  state.infiniteScroll.abortController?.abort();
  if (pauseAi) {
    temporarilyPauseAiService();
  }
  syncAutoLoadButtons();
  if (!pauseAi) {
    syncAiToggleButtons();
  }
}

function releaseTemporaryServicePause(serviceKind) {
  clearTemporaryServicePauseRelease(serviceKind);

  if (serviceKind === "ai") {
    if (!state.aiTemporarilyDisabledBySystem) {
      return;
    }

    state.aiTemporarilyDisabledBySystem = false;
    state.aiServiceFailureCount = 0;
    updateChatActionStates();
    syncAiToggleButtons();
    return;
  }

  if (serviceKind !== "search" || !state.searchServiceTemporarilyDisabled) {
    return;
  }

  state.searchServiceTemporarilyDisabled = false;
  state.searchServiceFailureCount = 0;
  state.infiniteScroll.loading = false;
  state.infiniteScroll.abortController = null;
  if (
    state.query
    && state.results.length
    && isInfiniteScrollView(state.activeView)
    && getEffectivePreferences().autoLoadResults
    && !state.loading
  ) {
    state.infiniteScroll.hasMore = true;
    state.infiniteScroll.exhausted = false;
    state.infiniteScroll.reentryRequired = isInfiniteScrollTriggerZoneActive();
  } else {
    state.infiniteScroll.reentryRequired = false;
  }

  syncAutoLoadButtons();
  renderPagination();
  requestInfiniteScrollCheck();
}

function resetServiceRunGuards() {
  clearTemporaryServicePauseRelease("search");
  clearTemporaryServicePauseRelease("ai");
  state.searchServiceTemporarilyDisabled = false;
  state.aiTemporarilyDisabledBySystem = false;
  state.searchServiceFailureCount = 0;
  state.aiServiceFailureCount = 0;
  state.infiniteScroll.reentryRequired = false;
  syncAutoLoadButtons();
  syncAiToggleButtons();
}

function setupInfiniteScrollFromPayload(payload, {
  page = state.page,
  view = state.activeView,
  usableResultCount = null,
} = {}) {
  const normalizedView = normalizeResultsView(view);
  rememberInfiniteResultKeys(state.results, normalizedView);
  const payloadPage = Number(payload?.page);
  const resolvedPage = Number.isFinite(payloadPage) && payloadPage > 0 ? payloadPage : page;
  const pageResultCount = getPayloadPageResultCount(payload);
  const resolvedUsableResultCount = Number.isFinite(Number(usableResultCount))
    ? Number(usableResultCount)
    : pageResultCount;
  if (resolvedUsableResultCount > 0) {
    state.searchServiceFailureCount = 0;
  }
  state.infiniteScroll.nextPage = resolvedPage + 1;
  state.infiniteScroll.loading = false;
  state.infiniteScroll.exhausted = state.searchServiceTemporarilyDisabled;
  state.infiniteScroll.emptyAttempts = 0;
  state.infiniteScroll.reentryRequired = false;
  state.infiniteScroll.hasMore = (
    !state.searchServiceTemporarilyDisabled
    && isInfiniteScrollView(normalizedView)
    && pageResultCount > 0
    && resolvedUsableResultCount > 0
  );
  renderPagination();
}

function buildPaginationState(payload) {
  const pageResultCount = getPayloadPageResultCount(payload);
  const totalResultsKnown = Boolean(payload?.total_results_known);
  const totalResults = getPayloadTotalResults(payload);
  const payloadHasNextPage = payload?.has_more_pages;

  return {
    pageResultCount,
    totalResults,
    totalResultsKnown,
    hasNextPage: typeof payloadHasNextPage === "boolean" ? payloadHasNextPage : null,
    probing: false,
  };
}

async function probeNextPageResultCount(query, page, view, { signal, literalSearch = false } = {}) {
  if (view === "images") {
    const payloads = await fetchImageSearchPayloads(query, page + 1, { signal, literalSearch });
    const mergedPayload = mergeImageSearchPayloads(payloads, query, page + 1);
    return getPayloadPageResultCount(mergedPayload);
  }

  const nextPayload = await fetchJson(
    buildSearchUrl(
      view === "general" ? getGeneralWebRequestQuery(query) : query,
      page + 1,
      view,
      { literalSearch },
    ),
    signal ? { signal } : {},
  );
  return getPayloadPageResultCount(nextPayload);
}

async function syncPaginationState(payload, {
  query = state.query,
  page = state.page,
  view = state.activeView,
  literalSearch = state.literalSearch,
  requestId = state.searchRequestId,
  signal = null,
} = {}) {
  const baseState = buildPaginationState(payload);

  if (!query || view === "maps" || view === "news") {
    state.pagination = {
      ...baseState,
      hasNextPage: false,
      probing: false,
    };
    renderPagination();
    return;
  }

  if (baseState.pageResultCount <= 0) {
    state.pagination = {
      ...baseState,
      hasNextPage: false,
      probing: false,
    };
    renderPagination();
    return;
  }

  if (typeof baseState.hasNextPage === "boolean") {
    state.pagination = baseState;
    renderPagination();
    return;
  }

  if (baseState.totalResultsKnown && page === 1) {
    state.pagination = {
      ...baseState,
      hasNextPage: baseState.totalResults > baseState.pageResultCount,
      probing: false,
    };
    renderPagination();
    return;
  }

  state.pagination = {
    ...baseState,
    probing: true,
  };
  renderPagination();

  try {
    const nextPageResultCount = await probeNextPageResultCount(query, page, view, {
      signal,
      literalSearch,
    });
    if (
      requestId !== state.searchRequestId
      || signal?.aborted
      || state.query !== query
      || state.page !== page
      || state.activeView !== view
    ) {
      return;
    }

    state.pagination = {
      ...baseState,
      hasNextPage: nextPageResultCount > 0,
      probing: false,
    };
    renderPagination();
  } catch (error) {
    if (error?.name === "AbortError") {
      return;
    }

    if (
      requestId !== state.searchRequestId
      || state.query !== query
      || state.page !== page
      || state.activeView !== view
    ) {
      return;
    }

    state.pagination = {
      ...baseState,
      hasNextPage: page > 1 ? null : false,
      probing: false,
    };
    renderPagination();
  }
}

function renderPagination() {
  if (!pagination) {
    return;
  }

  ensurePaginationPrecedesRefinementRail();

  if (
    !state.query
    || state.loading
    || !isInfiniteScrollView(state.activeView)
    || !state.results.length
  ) {
    pagination.hidden = true;
    return;
  }

  const isLoadingMore = state.infiniteScroll.loading;
  const isExhausted = state.infiniteScroll.exhausted && !state.infiniteScroll.hasMore;
  if (!isLoadingMore && !isExhausted) {
    pagination.hidden = true;
    return;
  }

  pagination.hidden = false;
  pagination.dataset.state = isLoadingMore ? "loading" : "done";
  if (isLoadingMore) {
    pagination.innerHTML = `
      <article class="notice-card notice-card-loading infinite-scroll-status" role="status" aria-live="polite" aria-atomic="true" aria-busy="true">
        Searching for more ${escapeHtml(getResultCountSuffix(2, state.activeView))}...
      </article>
    `;
    return;
  }

  pagination.innerHTML = `
    <article class="notice-card infinite-scroll-status" role="status" aria-live="polite" aria-atomic="true">
      No more unique ${escapeHtml(getResultCountSuffix(2, state.activeView))} found.
    </article>
  `;
}

function buildImageResultMarkup(result, index = -1) {
  const preview = result.thumbnail_url || result.image_url || "";
  const meta = [result.source || result.domain, result.resolution].filter(Boolean).join(" · ");
  return `
    <li class="result-row image-result-row">
      <article class="image-result-card">
        <button
          type="button"
          class="image-result-media"
          data-image-preview-index="${index}"
          aria-label="Preview ${escapeHtml(result.title)}"
        >
          ${preview
            ? `<img src="${escapeHtml(preview)}" alt="${escapeHtml(result.title)}" loading="lazy">`
            : '<span class="image-result-placeholder">Image</span>'}
        </button>
        <div class="image-result-copy">
          ${meta ? `<p class="image-result-meta">${escapeHtml(meta)}</p>` : ""}
          <button
            type="button"
            class="image-result-title"
            data-image-preview-index="${index}"
          >
            ${escapeHtml(result.title)}
          </button>
        </div>
      </article>
    </li>
  `;
}

function buildNewsResultRowsMarkup(results = []) {
  return chunkResults(sortNewsResultsByRecency(results), 4)
    .map((cluster) => `
      <li class="result-row news-story-row">
        ${buildNewsStoryClusterMarkup(cluster)}
      </li>
    `)
    .join("");
}

async function fetchInfiniteScrollPayload({ query, page, view, signal, literalSearch = false }) {
  if (view === "images") {
    const imagePayloads = await fetchImageSearchPayloads(query, page, {
      signal,
      literalSearch,
    });
    return mergeImageSearchPayloads(imagePayloads, query, page);
  }

  if (view === "news") {
    const newsQuery = buildNewsTopicQuery(query, state.newsTopic);
    return fetchJson(
      buildSearchUrl(newsQuery, page, "news", { literalSearch }),
      signal ? { signal } : {},
    );
  }

  return fetchJson(
    buildSearchUrl(getGeneralWebRequestQuery(query), page, "general", { literalSearch }),
    signal ? { signal } : {},
  );
}

function getInfinitePayloadResults(payload, view = state.activeView) {
  const rawResults = Array.isArray(payload?.results) ? payload.results : [];
  if (view === "news") {
    return sortNewsResultsByRecency(
      filterNewsResultsForTopic(rawResults, state.newsTopic, state.newsBaseQuery || state.query),
    );
  }
  return rawResults;
}

function appendInfiniteResults(results = [], view = state.activeView) {
  if (!resultsRoot || !results.length) {
    return;
  }

  if (view === "news") {
    state.results = sortNewsResultsByRecency(
      dedupeResultsForView([...state.results, ...results], "news"),
    );
    renderNewsResults();
    return;
  }

  const startIndex = state.results.length;
  state.results = [...state.results, ...results];
  if (view === "images") {
    resultsRoot.insertAdjacentHTML(
      "beforeend",
      results.map((result, index) => buildImageResultMarkup(result, startIndex + index)).join(""),
    );
    return;
  }

  resultsRoot.insertAdjacentHTML(
    "beforeend",
    results
      .map((result, index) => buildStandardResultMarkup(
        result,
        "No preview text was returned for this result.",
        startIndex + index,
      ))
      .join(""),
  );
}

function updateInfiniteResultsSummary() {
  if (!(resultsSummary instanceof HTMLElement)) {
    return;
  }

  const count = state.results.length;
  if (state.activeView === "news") {
    resultsSummary.textContent = buildNewsSummaryText(count, state.newsTopic, state.query);
    return;
  }

  const suffix = getResultCountSuffix(count, state.activeView);
  resultsSummary.textContent = `Showing ${count} ${suffix} for "${state.query}".`;
}

async function collectInfiniteScrollResults({
  query,
  view,
  requestId,
  abortController,
  literalSearch,
  targetRawResults,
}) {
  const accumulatedResults = [];
  const maxPages = Math.max(1, Math.ceil(targetRawResults / SEARCH_RESULTS_PER_PAGE_LIMIT));
  let checkedPages = 0;
  let inspectedResults = 0;

  while (
    checkedPages < maxPages
    && inspectedResults < targetRawResults
    && accumulatedResults.length < SEARCH_RESULTS_PER_PAGE_LIMIT
  ) {
    const page = state.infiniteScroll.nextPage;
    const payload = await fetchInfiniteScrollPayload({
      query,
      page,
      view,
      signal: abortController.signal,
      literalSearch,
    });

    if (
      requestId !== state.searchRequestId
      || abortController.signal.aborted
      || state.query !== query
      || state.activeView !== view
    ) {
      return { stale: true, results: [] };
    }

    const payloadPage = Number(payload?.page);
    state.infiniteScroll.nextPage = (
      Number.isFinite(payloadPage) && payloadPage > 0 ? payloadPage : page
    ) + 1;

    const pageResults = getInfinitePayloadResults(payload, view);
    const rawPageCount = getPayloadPageResultCount(payload);
    inspectedResults += Math.max(
      rawPageCount,
      pageResults.length,
      SEARCH_RESULTS_PER_PAGE_LIMIT,
    );
    checkedPages += 1;

    const newResults = filterNewInfiniteResults(pageResults, view);
    if (!newResults.length) {
      continue;
    }

    const remainingSlots = SEARCH_RESULTS_PER_PAGE_LIMIT - accumulatedResults.length;
    accumulatedResults.push(...newResults.slice(0, remainingSlots));
  }

  return {
    stale: false,
    results: accumulatedResults,
    inspectedResults,
  };
}

async function loadMoreResults() {
  if (
    state.loading
    || state.infiniteScroll.loading
    || !state.infiniteScroll.hasMore
    || !isAutoLoadResultsEnabled()
    || !state.query
    || !isInfiniteScrollView(state.activeView)
  ) {
    return;
  }

  const requestId = state.searchRequestId;
  const view = state.activeView;
  const query = state.query;
  const literalSearch = state.literalSearch;
  const abortController = new AbortController();
  state.infiniteScroll.abortController?.abort();
  state.infiniteScroll.abortController = abortController;
  state.infiniteScroll.loading = true;
  syncAutoLoadButtons();
  showInfiniteScrollPlaceholders(view);
  renderPagination();

  try {
    let accumulatedResults = [];
    for (let attemptIndex = 0; attemptIndex < INFINITE_SCROLL_RETRY_RESULT_TARGETS.length; attemptIndex += 1) {
      if (attemptIndex > 0) {
        await wait(INFINITE_SCROLL_RETRY_DELAY_MS);
      }

      const attempt = await collectInfiniteScrollResults({
        query,
        view,
        requestId,
        abortController,
        literalSearch,
        targetRawResults: INFINITE_SCROLL_RETRY_RESULT_TARGETS[attemptIndex],
      });

      if (attempt.stale) {
        return;
      }

      if (attempt.results.length) {
        accumulatedResults = attempt.results;
        break;
      }

      state.infiniteScroll.emptyAttempts = attemptIndex + 1;
      state.searchServiceFailureCount = attemptIndex + 1;
    }

    if (accumulatedResults.length) {
      clearInfiniteScrollPlaceholders();
      appendInfiniteResults(accumulatedResults, view);
      updateInfiniteResultsSummary();
      resetInfiniteScrollEmptyAttempts();
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.exhausted = false;
    } else {
      temporarilyPauseSearchService();
    }
  } catch (error) {
    if (error?.name === "AbortError") {
      return;
    }
    temporarilyPauseSearchService();
  } finally {
    if (
      requestId === state.searchRequestId
      && state.query === query
      && state.activeView === view
    ) {
      clearInfiniteScrollPlaceholders();
      state.infiniteScroll.loading = false;
      syncAutoLoadButtons();
      renderPagination();
    }
  }
}

function requestInfiniteScrollCheck() {
  if (infiniteScrollFrame) {
    return;
  }

  infiniteScrollFrame = window.requestAnimationFrame(() => {
    infiniteScrollFrame = 0;
    if (
      state.loading
      || state.infiniteScroll.loading
      || !state.infiniteScroll.hasMore
      || !isAutoLoadResultsEnabled()
      || !isInfiniteScrollView(state.activeView)
    ) {
      return;
    }

    const isInTriggerZone = isInfiniteScrollTriggerZoneActive();
    if (state.infiniteScroll.reentryRequired) {
      if (!isInTriggerZone) {
        state.infiniteScroll.reentryRequired = false;
      }
      return;
    }

    if (isInTriggerZone) {
      loadMoreResults();
    }
  });
}

function renderSummary(payload) {
  if (!resultsSummary) {
    return;
  }

  const correctionPayload = payload?.loading
    ? payload
    : (state.activeView === "news" && !newsTopicUsesSearchQuery(state.newsTopic) ? null : payload);
  renderResultsCorrection(correctionPayload);

  if (!payload) {
    resultsSummary.textContent = "Search the web with private, AI-augmented results.";
    return;
  }

  const displayQuery = payload.loading && payload.query
    ? payload.query
    : (state.query || payload.query);
  const areaLabel = getPreferredAreaLabel(displayQuery);
  const areaSuffix = areaLabel ? ` near ${areaLabel}` : "";
  const newsPresentation = getNewsTopicPresentation(state.newsTopic, displayQuery);

  if (payload.loading) {
    const verb = state.activeView === "images"
      ? "Searching images"
      : (state.activeView === "news"
        ? newsPresentation.loadingText.replace(/\.\.\.$/, "")
        : (state.activeView === "maps" ? "Searching maps" : "Searching"));
    resultsSummary.textContent = state.activeView === "news"
      ? newsPresentation.loadingText
      : `${verb} for "${displayQuery}"...`;
    return;
  }

  const count = getPayloadPageResultCount(payload);
  const totalResults = getPayloadTotalResults(payload);
  const totalResultsKnown = Boolean(payload.total_results_known);
  if (state.activeView === "maps") {
    const suffix = count === 1 ? "place" : "places";
    resultsSummary.textContent = `Showing ${count} ${suffix} matching "${displayQuery}"${areaSuffix}.`;
    return;
  }

  const suffix = getResultCountSuffix(count);

  if (state.activeView === "news") {
    resultsSummary.textContent = buildNewsSummaryText(state.results.length, state.newsTopic, displayQuery);
    return;
  }

  if (state.activeView === "general" && state.mapResults.length) {
    const placeCount = state.mapResults.length;
    const placeSuffix = placeCount === 1 ? "place match" : "place matches";

    if (count === 0) {
      resultsSummary.textContent = `No web results came back for "${displayQuery}", but we found ${placeCount} ${placeSuffix}${areaSuffix}.`;
      return;
    }

    if (totalResultsKnown && totalResults > count) {
      resultsSummary.textContent = `Showing ${count} of ${totalResults} ${getResultCountSuffix(totalResults)} for "${displayQuery}", plus ${placeCount} ${placeSuffix}${areaSuffix}.`;
    } else if (totalResultsKnown) {
      resultsSummary.textContent = `Showing all ${count} ${suffix} for "${displayQuery}", plus ${placeCount} ${placeSuffix}${areaSuffix}.`;
    } else {
      resultsSummary.textContent = `Showing ${count} ${suffix} for "${displayQuery}", plus ${placeCount} ${placeSuffix}${areaSuffix}.`;
    }
    return;
  }

  if (totalResultsKnown && totalResults > count) {
    resultsSummary.textContent = `Showing ${count} of ${totalResults} ${getResultCountSuffix(totalResults)} for "${displayQuery}".`;
  } else if (totalResultsKnown) {
    resultsSummary.textContent = `Showing all ${count} ${suffix} for "${displayQuery}".`;
  } else {
    resultsSummary.textContent = `Showing ${count} ${suffix} for "${displayQuery}".`;
  }
}

function renderResultsCorrection(payload = null) {
  if (!(resultsCorrection instanceof HTMLElement)) {
    return;
  }

  if (payload?.loading) {
    renderTopLoadingNotice(payload.query || state.query || "");
    return;
  }

  delete resultsCorrection.dataset.mode;

  if (
    state.query
    && state.activeView === "general"
    && !state.literalSearch
    && state.generalWebSearchBias?.label
  ) {
    resultsCorrection.dataset.mode = "local-bias";
    resultsCorrection.innerHTML = `
      <p class="results-correction-line">
        Showing local web results for
        <em class="results-correction-term">${escapeHtml(state.query)}</em>
        near ${escapeHtml(state.generalWebSearchBias.label)}.
      </p>
      <p class="results-correction-subline">
        <button
          type="button"
          class="results-correction-link"
          data-query-suggestion="${escapeHtml(state.query)}"
          data-query-literal="true"
        >Search exact phrase without local ZIP</button>
      </p>
    `;
    resultsCorrection.hidden = false;
    return;
  }

  const suggestions = getDistinctQuerySuggestions(
    payload?.suggestions ?? state.querySuggestions,
    state.query || payload?.query || "",
  );

  if (!state.query || state.activeView !== "general" || payload?.loading || state.literalSearch || !suggestions.length) {
    resultsCorrection.hidden = true;
    resultsCorrection.innerHTML = "";
    return;
  }

  const [primarySuggestion] = suggestions;

  resultsCorrection.innerHTML = `
    <p class="results-correction-line">
      These are results for
      <em class="results-correction-term">${escapeHtml(primarySuggestion)}</em>
    </p>
    <p class="results-correction-subline">
      <button
        type="button"
        class="results-correction-link"
        data-query-suggestion="${escapeHtml(state.query)}"
        data-query-literal="true"
      >Search instead for ${escapeHtml(state.query)}</button>
    </p>
  `;
  resultsCorrection.hidden = false;
}

function populatePreferenceForm() {
  const effective = getEffectivePreferences();
  const defaultAiModel = normalizeAiModelPreference(state.health?.ollama?.default_model || "");
  const installedModels = Array.isArray(state.health?.ollama?.models)
    ? state.health.ollama.models
      .map((model) => normalizeAiModelPreference(model))
      .filter(Boolean)
    : [];
  const modelOptions = Array.from(new Set([
    ...(installedModels.some((model) => aiModelNamesMatch(defaultAiModel, model)) ? [defaultAiModel] : []),
    ...installedModels,
  ].filter(Boolean)));

  if (aiModelOptions) {
    aiModelOptions.replaceChildren(...modelOptions.map((model) => {
      const option = document.createElement("option");
      option.value = model;
      return option;
    }));
  }

  [preferencesForm, settingsForm].forEach((form) => {
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const themeInput = form.querySelector('select[name="theme"]');
    const defaultViewInput = form.querySelector('select[name="defaultView"]');
    const providerInput = form.querySelector('select[name="provider"]');
    const safesearchInput = form.querySelector('select[name="safesearch"]');
    const autoLoadResultsInput = form.querySelector('select[name="autoLoadResults"]');
    const aiEnabledInput = form.querySelector('select[name="aiEnabled"]');
    const aiModelInput = form.querySelector('input[name="aiModel"]');
    const languageInput = form.querySelector('input[name="language"]');
    const timeRangeInput = form.querySelector('select[name="timeRange"]');
    const enginesInput = form.querySelector('input[name="engines"]');
    const newsTimeRangeInput = form.querySelector('select[name="newsTimeRange"]');
    const newsEnginesInput = form.querySelector('input[name="newsEngines"]');
    const imageEnginesInput = form.querySelector('input[name="imageEngines"]');
    const mapEnginesInput = form.querySelector('input[name="mapEngines"]');
    const autocompleteProviderInput = form.querySelector('input[name="autocompleteProvider"]');
    const autocompleteMinCharsInput = form.querySelector('input[name="autocompleteMinChars"]');
    const autocompleteLimitInput = form.querySelector('input[name="autocompleteLimit"]');
    const aiTemperatureInput = form.querySelector('input[name="aiTemperature"]');
    const aiNumPredictInput = form.querySelector('input[name="aiNumPredict"]');
    const aiSourceLimitInput = form.querySelector('input[name="aiSourceLimit"]');
    const aiOverviewExpandedInput = form.querySelector('select[name="aiOverviewExpanded"]');
    const chatHistoryStorageInput = form.querySelector('select[name="chatHistoryStorage"]');
    const zipInput = form.querySelector('input[name="zipCode"]');

    if (themeInput) {
      themeInput.value = effective.theme;
    }
    if (defaultViewInput) {
      defaultViewInput.value = effective.defaultView;
    }
    if (providerInput instanceof HTMLSelectElement) {
      populateProviderOptions(providerInput);
      providerInput.value = effective.provider;
    } else if (providerSelect instanceof HTMLSelectElement) {
      populateProviderOptions(providerSelect);
      providerSelect.value = effective.provider;
    }
    if (safesearchInput) {
      safesearchInput.value = effective.safesearch;
    }
    if (autoLoadResultsInput) {
      autoLoadResultsInput.value = effective.autoLoadResults ? "enabled" : "disabled";
    }
    if (aiEnabledInput) {
      aiEnabledInput.value = effective.aiEnabled ? "enabled" : "disabled";
    }
    if (aiModelInput instanceof HTMLInputElement) {
      aiModelInput.value = effective.aiModel;
      aiModelInput.placeholder = defaultAiModel || modelOptions[0] || "gemma3:4b";
    }
    if (languageInput) {
      languageInput.value = effective.language || "";
    }
    if (timeRangeInput) {
      timeRangeInput.value = effective.timeRange || "";
    }
    if (enginesInput) {
      enginesInput.value = effective.engines || "";
    }
    if (newsTimeRangeInput) {
      newsTimeRangeInput.value = effective.newsTimeRange || "";
    }
    if (newsEnginesInput instanceof HTMLInputElement) {
      newsEnginesInput.value = effective.newsEngines || "";
    }
    if (imageEnginesInput instanceof HTMLInputElement) {
      imageEnginesInput.value = effective.imageEngines || "";
    }
    if (mapEnginesInput instanceof HTMLInputElement) {
      mapEnginesInput.value = effective.mapEngines || "";
    }
    if (autocompleteProviderInput instanceof HTMLInputElement) {
      autocompleteProviderInput.value = effective.autocompleteProvider || "";
      autocompleteProviderInput.placeholder = getDefaults().autocompleteProvider || "google";
    }
    if (autocompleteMinCharsInput instanceof HTMLInputElement) {
      autocompleteMinCharsInput.value = String(effective.autocompleteMinChars);
    }
    if (autocompleteLimitInput instanceof HTMLInputElement) {
      autocompleteLimitInput.value = String(effective.autocompleteLimit);
    }
    if (aiTemperatureInput instanceof HTMLInputElement) {
      aiTemperatureInput.value = String(effective.aiTemperature);
    }
    if (aiNumPredictInput instanceof HTMLInputElement) {
      aiNumPredictInput.value = String(effective.aiNumPredict);
    }
    if (aiSourceLimitInput instanceof HTMLInputElement) {
      aiSourceLimitInput.value = String(effective.aiSourceLimit);
    }
    if (aiOverviewExpandedInput instanceof HTMLSelectElement) {
      aiOverviewExpandedInput.value = effective.aiOverviewExpanded ? "enabled" : "disabled";
    }
    if (chatHistoryStorageInput instanceof HTMLSelectElement) {
      chatHistoryStorageInput.value = effective.chatHistoryStorage;
    }
    if (zipInput instanceof HTMLInputElement) {
      zipInput.value = effective.zipCode;
      zipInput.setCustomValidity("");
    }
  });

  syncZipInputs(effective.zipCode);
  clearZipStatus();
}

function updateCopyFromHealth() {
  const providers = Array.isArray(state.health?.providers) ? state.health.providers : [];
  const provider = providers.find((entry) => entry.default || entry.id === state.health?.default_provider) || providers[0];
  const providerBaseUrl = provider?.base_url || DEFAULT_SEARXNG_URL;
  const providerLabel = provider?.label || "Search backend";
  const ollama = state.health?.ollama || {};
  const ollamaBaseUrl = String(ollama?.base_url || "").trim();
  const ollamaModel = String(ollama?.default_model || "").trim();
  const selectedAiModel = getSelectedAiModel();
  const hasProviderUrl = /^https?:\/\//i.test(String(providerBaseUrl || "").trim());
  const hasOllamaUrl = /^https?:\/\//i.test(ollamaBaseUrl);
  const deployment = state.health?.deployment || {};
  const accessLabel = deployment?.shared_on_network ? "Local network" : "This device";
  const accessSummary = describeAccessCardStatus(deployment);
  const accessDestinations = describeAccessDestinations(deployment);

  if (heroSubtitle) {
    heroSubtitle.textContent = String(state.health?.tagline || "").trim();
  }
  if (searchServiceTitle) {
    searchServiceTitle.textContent = providerLabel;
  }
  if (searchServiceMeta) {
    setServiceCardMeta(searchServiceMeta, describeProviderStatus(provider, providerBaseUrl));
  }
  if (aiServiceTitle) {
    aiServiceTitle.textContent = "Ollama";
  }
  if (aiServiceMeta) {
    setServiceCardMeta(aiServiceMeta, describeAiStatus(ollama, selectedAiModel));
  }
  updateServiceStatusDetails(provider, providerBaseUrl, ollama, selectedAiModel);
  if (accessServiceTitle) {
    accessServiceTitle.textContent = accessLabel;
  }
  if (accessServiceMeta) {
    setServiceCardMeta(accessServiceMeta, accessSummary);
  }

  if (aboutDetail) {
    const aboutModel = selectedAiModel || ollamaModel;
    aboutDetail.textContent = `${providerLabel} handles web search at ${providerBaseUrl}. ${aboutModel ? `${aboutModel} through Ollama` : "Ollama"} handles the AI side${hasOllamaUrl ? ` at ${ollamaBaseUrl}` : ""}.`;
  }
  if (aboutNetworkDetail) {
    aboutNetworkDetail.textContent = accessDestinations;
  }
  if (searxngLink instanceof HTMLAnchorElement) {
    searxngLink.hidden = !hasProviderUrl;
    if (hasProviderUrl) {
      searxngLink.href = providerBaseUrl;
    }
  }
  if (ollamaLink instanceof HTMLAnchorElement) {
    ollamaLink.hidden = !hasOllamaUrl;
    if (hasOllamaUrl) {
      ollamaLink.href = `${ollamaBaseUrl.replace(/\/$/, "")}/api/tags`;
    }
  }

  updateDocumentMetadata();
}

function getAutocompleteMinChars() {
  const minChars = Number(getEffectivePreferences().autocompleteMinChars || state.health?.autocomplete?.min_chars || 3);
  return Number.isFinite(minChars) && minChars > 0 ? Math.max(1, minChars) : 3;
}

function shouldAutoExpandAiOverview() {
  return state.activeView === "general" && getEffectivePreferences().aiOverviewExpanded;
}

function setAiSummaryState({
  summary = "",
  loading = false,
  source = null,
  sources = null,
} = {}) {
  state.aiSummary = summary;
  state.aiSummaryLoading = loading;
  state.aiSummarySource = source;
  state.aiSummarySources = Array.isArray(sources)
    ? sources
      .filter((item) => item && typeof item === "object")
      .map((item) => ({ ...item }))
    : (source ? [{ ...source }] : []);
  const shouldExpand = shouldAutoExpandAiOverview();
  state.aiSourcesExpanded = shouldExpand;
  state.aiSectionExpanded = shouldExpand;
  syncAiToggleButtons();
}

function setNewsAiSummaryState({
  summary = "",
  loading = false,
  key = "",
  sources = [],
  resultCount = 0,
} = {}) {
  state.newsAiSummary = summary;
  state.newsAiSummaryLoading = loading;
  state.newsAiSummaryKey = key;
  state.newsAiSummarySources = Array.isArray(sources)
    ? sources
      .filter((item) => item && typeof item === "object")
      .map((item) => ({ ...item }))
    : [];
  state.newsAiSummaryResultCount = Math.max(0, Number(resultCount) || 0);
  syncAiToggleButtons();
}

function clearNewsAiSummaryState({ abortCurrent = true } = {}) {
  if (abortCurrent) {
    state.newsAiSummaryAbortController?.abort();
  }
  setNewsAiSummaryState();
}

async function hydrateHealth() {
  try {
    state.health = await fetchJson("/api/health");
  } catch (error) {
    state.health = {
      app: APP_NAME,
      tagline: DEFAULT_META_DESCRIPTION,
      default_provider: "searxng",
      search_defaults: {
        categories: "general",
        safesearch: 0,
        language: "all",
        time_range: "",
        engines: "",
      },
      autocomplete: {
        provider: "google",
        min_chars: 3,
        limit: 8,
      },
      ai_defaults: {
        temperature: 0.2,
        num_predict: 240,
        max_sources: 5,
      },
      providers: [
        {
          id: "searxng",
          label: "SearXNG",
          base_url: "Unavailable",
          status: "offline",
          detail: "Unable to reach the configured SearXNG instance.",
        },
      ],
      ollama: {
        status: "offline",
        base_url: "Unavailable",
        default_model: null,
        models: [],
        detail: "Unable to reach Ollama.",
      },
      deployment: {
        shared_on_network: false,
        summary: "Running only on this device at http://127.0.0.1:8891. Set SEAR_CH_HOST=0.0.0.0 to share it on your local network.",
        local_url: "http://127.0.0.1:8891",
        network_url: null,
        access_urls: [
          {
            label: "Local",
            url: "http://127.0.0.1:8891",
          },
        ],
      },
    };
  }

  const defaults = getDefaults();
  state.preferences = {
    theme: normalizeThemePreference(state.preferences.theme || defaults.theme),
    defaultView: normalizeResultsView(state.preferences.defaultView || defaults.defaultView),
    provider: state.preferences.provider || defaults.provider,
    safesearch: state.preferences.safesearch || defaults.safesearch,
    aiEnabled: normalizeAiPreference(state.preferences.aiEnabled ?? defaults.aiEnabled),
    aiModel: normalizeAiModelPreference(state.preferences.aiModel || defaults.aiModel),
    language: state.preferences.language ?? defaults.language,
    timeRange: normalizeTimeRangePreference(state.preferences.timeRange ?? defaults.timeRange),
    engines: normalizeEnginesPreference(state.preferences.engines ?? defaults.engines),
    newsTimeRange: normalizeTimeRangePreference(state.preferences.newsTimeRange ?? defaults.newsTimeRange),
    newsEngines: normalizeEnginesPreference(state.preferences.newsEngines ?? defaults.newsEngines),
    imageEngines: normalizeEnginesPreference(state.preferences.imageEngines ?? defaults.imageEngines),
    mapEngines: normalizeEnginesPreference(state.preferences.mapEngines ?? defaults.mapEngines),
    autocompleteProvider: normalizeAutocompleteProviderPreference(state.preferences.autocompleteProvider ?? defaults.autocompleteProvider),
    autocompleteMinChars: normalizeAutocompleteMinCharsPreference(state.preferences.autocompleteMinChars ?? defaults.autocompleteMinChars, defaults.autocompleteMinChars),
    autocompleteLimit: normalizeAutocompleteLimitPreference(state.preferences.autocompleteLimit ?? defaults.autocompleteLimit, defaults.autocompleteLimit),
    aiTemperature: normalizeAiTemperaturePreference(state.preferences.aiTemperature ?? defaults.aiTemperature, defaults.aiTemperature),
    aiNumPredict: normalizeAiNumPredictPreference(state.preferences.aiNumPredict ?? defaults.aiNumPredict, defaults.aiNumPredict),
    aiSourceLimit: normalizeAiSourceLimitPreference(state.preferences.aiSourceLimit ?? defaults.aiSourceLimit, defaults.aiSourceLimit),
    aiOverviewExpanded: normalizeAiOverviewExpandedPreference(state.preferences.aiOverviewExpanded ?? defaults.aiOverviewExpanded),
    chatHistoryStorage: normalizeChatHistoryStoragePreference(state.preferences.chatHistoryStorage ?? defaults.chatHistoryStorage),
    zipCode: resolveZipCodePreference(state.preferences.zipCode ?? state.preferences.location, defaults.zipCode),
    autoLoadResults: normalizeAutoLoadPreference(state.preferences.autoLoadResults ?? defaults.autoLoadResults),
  };
  state.pendingView = normalizeResultsView(state.pendingView || state.preferences.defaultView);
  state.newsTopic = normalizeNewsTopic(state.newsTopic);

  populatePreferenceForm();
  updateCopyFromHealth();
  applyThemePreference();
  syncAutoLoadButtons();
  syncAiToggleButtons();
  getActiveChatSession();
  renderChatSessions();
  renderChatMessages();
}

async function fetchAiSummary({ requestId, signal, contextKey = "" }) {
  if (!state.query || state.loading || state.activeView !== "general" || !isAiEnabled()) {
    setAiSummaryState();
    return;
  }

  const aiCopy = getAiCardCopy(state.query);
  const anchorResult = getAiSummaryAnchorResult();
  if (!anchorResult) {
    setAiSummaryState();
    renderAiSummaryUpdate();
    return;
  }

  if (requestId !== state.searchRequestId || signal?.aborted) {
    return;
  }

  const aiAbortController = new AbortController();
  state.aiSummaryAbortController?.abort();
  state.aiSummaryAbortController = aiAbortController;
  const abortAiSummaryFromSearch = () => {
    aiAbortController.abort();
  };
  if (signal?.aborted) {
    if (state.aiSummaryAbortController === aiAbortController) {
      state.aiSummaryAbortController = null;
    }
    return;
  }
  signal?.addEventListener?.("abort", abortAiSummaryFromSearch, { once: true });
  const aiSignal = aiAbortController.signal;

  setAiSummaryState({
    loading: true,
    source: anchorResult,
    sources: [anchorResult],
  });
  renderAiSummaryUpdate();

  try {
    const selection = await resolveAiSummarySelection({ mode: aiCopy.mode });
    if (requestId !== state.searchRequestId || state.activeView !== "general" || aiSignal.aborted || !isAiEnabled()) {
      return;
    }

    if (!selection.sources.length) {
      setAiSummaryState({
        source: anchorResult,
        sources: [anchorResult],
      });
      renderAiSummaryUpdate();
      return;
    }

    state.aiSummarySource = selection.source || anchorResult;
    setAiSummaryState({
      loading: true,
      source: state.aiSummarySource,
      sources: selection.sources,
    });
    renderAiSummaryUpdate();
    const selectedAiModel = getSelectedAiModel();
    const payload = await fetchJson("/api/assist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: aiCopy.mode,
        query: state.query,
        prompt: aiCopy.prompt,
        ...(selectedAiModel ? { model: selectedAiModel } : {}),
        ...buildAiRequestPreferencePayload(),
        results: selection.sources,
        include_pages: true,
      }),
      signal: aiSignal,
    });

    if (requestId !== state.searchRequestId || state.activeView !== "general" || aiSignal.aborted || !isAiEnabled()) {
      return;
    }

    setAiSummaryState({
      summary: aiCopy.mode === "summary"
        ? normalizeSummaryTextWithPrefaceFilter(payload?.answer)
        : normalizeSummaryText(payload?.answer),
      source: state.aiSummarySource,
      sources: selection.sources,
    });
    if (contextKey) {
      rememberAiSummaryData(contextKey, {
        summary: state.aiSummary,
        source: state.aiSummarySource,
        sources: state.aiSummarySources,
      });
    }
    renderAiSummaryUpdate();
    return;
  } catch (error) {
    if (error?.name === "AbortError" || aiSignal.aborted || requestId !== state.searchRequestId || state.activeView !== "general") {
      return;
    }

    const normalizedErrorMessage = normalizeSummaryText(String(error?.message || ""));
    setAiSummaryState({
      summary: normalizedErrorMessage && !normalizedErrorMessage.startsWith("Request failed.")
        ? normalizedErrorMessage
        : aiCopy.fallback,
      source: state.aiSummarySource,
      sources: state.aiSummarySources,
    });
    if (contextKey) {
      rememberAiSummaryData(contextKey, {
        summary: state.aiSummary,
        source: state.aiSummarySource,
        sources: state.aiSummarySources,
      });
    }
    renderAiSummaryUpdate();
  } finally {
    signal?.removeEventListener?.("abort", abortAiSummaryFromSearch);
    if (state.aiSummaryAbortController === aiAbortController) {
      state.aiSummaryAbortController = null;
    }
    syncAiToggleButtons();
  }
}

function requestNewsAiSummaryForCurrentResults() {
  if (
    !isAiEnabled()
    || !state.query
    || state.loading
    || state.activeView !== "news"
    || !state.results.length
  ) {
    return;
  }

  const context = getNewsAiSummaryContext();
  if (!context.sources.length) {
    if (state.newsAiSummaryKey !== context.key || state.newsAiSummaryLoading) {
      state.newsAiSummaryAbortController?.abort();
      setNewsAiSummaryState({
        key: context.key,
        resultCount: context.resultCount,
      });
      renderNewsAiSummaryUpdate();
    }
    return;
  }

  if (
    context.key
    && state.newsAiSummaryKey === context.key
    && (state.newsAiSummaryLoading || state.newsAiSummary)
  ) {
    return;
  }

  fetchNewsAiSummary({
    requestId: state.searchRequestId,
    signal: state.searchAbortController?.signal || null,
    context,
  });
}

async function fetchNewsAiSummary({ requestId, signal, context }) {
  if (!state.query || state.loading || state.activeView !== "news" || !isAiEnabled() || !context?.sources?.length) {
    return;
  }

  if (requestId !== state.searchRequestId || signal?.aborted) {
    return;
  }

  const aiAbortController = new AbortController();
  state.newsAiSummaryAbortController?.abort();
  state.newsAiSummaryAbortController = aiAbortController;
  const abortNewsAiSummaryFromSearch = () => {
    aiAbortController.abort();
  };
  if (signal?.aborted) {
    if (state.newsAiSummaryAbortController === aiAbortController) {
      state.newsAiSummaryAbortController = null;
    }
    return;
  }
  signal?.addEventListener?.("abort", abortNewsAiSummaryFromSearch, { once: true });
  const aiSignal = aiAbortController.signal;

  setNewsAiSummaryState({
    loading: true,
    key: context.key,
    sources: context.sources,
    resultCount: context.resultCount,
  });
  renderNewsAiSummaryUpdate();

  try {
    const selectedAiModel = getSelectedAiModel();
    const payload = await fetchJson("/api/assist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "qa",
        query: `${state.query} news impact brief`,
        prompt: buildNewsAiSummaryPrompt(context),
        ...(selectedAiModel ? { model: selectedAiModel } : {}),
        ...buildAiRequestPreferencePayload(),
        results: context.sources,
        include_pages: false,
      }),
      signal: aiSignal,
    });

    if (requestId !== state.searchRequestId || state.activeView !== "news" || aiSignal.aborted || !isAiEnabled()) {
      return;
    }

    setNewsAiSummaryState({
      summary: normalizeNewsAiSummaryText(payload?.answer) || NEWS_AI_SUMMARY_FALLBACK_TEXT,
      key: context.key,
      sources: context.sources,
      resultCount: context.resultCount,
    });
    renderNewsAiSummaryUpdate();
  } catch (error) {
    if (error?.name === "AbortError" || aiSignal.aborted || requestId !== state.searchRequestId || state.activeView !== "news") {
      return;
    }

    const normalizedErrorMessage = normalizeSummaryText(String(error?.message || ""));
    setNewsAiSummaryState({
      summary: normalizedErrorMessage && !normalizedErrorMessage.startsWith("Request failed.")
        ? normalizedErrorMessage
        : NEWS_AI_SUMMARY_FALLBACK_TEXT,
      key: context.key,
      sources: context.sources,
      resultCount: context.resultCount,
    });
    renderNewsAiSummaryUpdate();
  } finally {
    signal?.removeEventListener?.("abort", abortNewsAiSummaryFromSearch);
    if (state.newsAiSummaryAbortController === aiAbortController) {
      state.newsAiSummaryAbortController = null;
    }
    syncAiToggleButtons();
  }
}

async function runSearch({
  query,
  page = 1,
  view = state.activeView,
  newsTopic = state.newsTopic,
  newsBaseQuery = state.newsBaseQuery,
  literalSearch = state.literalSearch,
}) {
  const previousQuery = state.query;
  const previousLiteralSearch = state.literalSearch;
  const normalizedView = normalizeResultsView(view);
  const normalizedNewsTopic = normalizeNewsTopic(newsTopic);
  const trimmedQuery = String(query || "").trim();
  const trimmedNewsBaseQuery = String(newsBaseQuery || "").trim();
  const resolvedLiteralSearch = Boolean(literalSearch);
  const resolvedNewsBaseQuery = !trimmedQuery
    ? ""
    : (
      normalizedView === "news"
        ? (
          newsTopicUsesSearchQuery(normalizedNewsTopic)
            ? (trimmedNewsBaseQuery || trimmedQuery)
            : (trimmedNewsBaseQuery || state.newsBaseQuery || trimmedQuery)
        )
        : (trimmedNewsBaseQuery || state.newsBaseQuery || trimmedQuery)
    );
  const requestId = state.searchRequestId + 1;
  state.searchRequestId = requestId;
  state.searchAbortController?.abort();
  resetServiceDurationTracking("search");
  const searchAbortController = new AbortController();
  const searchSignal = searchAbortController.signal;
  state.searchAbortController = searchAbortController;
  state.query = trimmedQuery;
  state.literalSearch = resolvedLiteralSearch;
  state.newsTopic = normalizedNewsTopic;
  state.newsBaseQuery = resolvedNewsBaseQuery;
  state.generalWebSearchQuery = "";
  state.generalWebSearchBias = null;
  closeResultDetails({ restoreFocus: false, immediate: true });
  closeImagePreview({ restoreFocus: false });
  closeZipEditors();
  setActiveResultsView(normalizedView);
  state.page = page;
  updateDocumentMetadata();
  syncQueryInputs(trimmedQuery);
  state.autocompleteRequestId += 1;
  state.autocompleteAbortController?.abort();
  clearSuggestions();
  resetServiceRunGuards();

  if (!trimmedQuery) {
    state.loading = false;
    state.results = [];
    setAiSummaryState();
    clearNewsAiSummaryState();
    state.infoResult = null;
    state.railNews = [];
    state.railSocial = [];
    state.railImages = [];
    state.mapResults = [];
    state.selectedMapResultId = "";
    state.literalSearch = false;
    state.querySuggestions = [];
    state.newsBaseQuery = "";
    state.pagination = createEmptyPaginationState();
    resetInfiniteScrollState();
    setActiveResultsView(getEffectivePreferences().defaultView);
    setResultsState("idle");
    setView("home");
    renderSummary(null);
    renderFilters();
    renderRefinements();
    renderPagination();
    syncUrl();
    syncAutoLoadButtons();
    return;
  }

  setView("results");
  state.loading = true;
  syncAutoLoadButtons();
  state.results = [];
  setAiSummaryState();
  clearNewsAiSummaryState();
  state.infoResult = null;
  state.railNews = [];
  state.railSocial = [];
  state.railImages = [];
  state.mapResults = [];
  state.selectedMapResultId = "";
  state.querySuggestions = [];
  state.pagination = createEmptyPaginationState();
  resetInfiniteScrollState();
  const hasLocalIntent = looksLikeLocalIntent(trimmedQuery);
  const generalWebSearchPlan = normalizedView === "general"
    ? buildGeneralWebSearchPlan(trimmedQuery, {
      hasLocalIntent,
      literalSearch: resolvedLiteralSearch,
    })
    : { query: "", bias: null };
  state.generalWebSearchQuery = generalWebSearchPlan.query;
  state.generalWebSearchBias = generalWebSearchPlan.bias;
  let newsQuery = normalizedView === "news"
    ? buildNewsTopicQuery(trimmedQuery, normalizedNewsTopic)
    : trimmedQuery;
  const loadingQuery = normalizedView === "news"
    ? newsQuery
    : (normalizedView === "maps" ? buildMapLoadingQuery(trimmedQuery) : trimmedQuery);
  renderFilters();
  renderLoading(loadingQuery);
  renderSummary({
    query: loadingQuery,
    page,
    loading: true,
  });
  renderPagination();
  syncUrl();
  smoothScrollToTopForSearch();

  try {
    let payload;
    const queryAreaHint = getQueryAreaHint(trimmedQuery);
    const normalizedAreaZip = normalizeZipCode(queryAreaHint);
    const queryZipHint = isValidZipCode(normalizedAreaZip) ? normalizedAreaZip : "";
    const shouldUseSavedArea = !queryAreaHint && (
      state.activeView === "maps"
      || hasLocalIntent
      || (state.activeView === "news" && state.newsTopic === "local")
    );
    const shouldResolveQueryZip = Boolean(queryZipHint) && (
      state.activeView === "maps"
      || hasLocalIntent
      || (state.activeView === "news" && state.newsTopic === "local")
    );
    const shouldResolveSavedArea = shouldUseSavedArea
      || shouldResolveQueryZip
      || (state.activeView === "general" && hasLocalIntent && !queryAreaHint);
    if (shouldResolveSavedArea) {
      try {
        await resolveZipAnchor(queryZipHint || getZipCodeBias(), { signal: searchSignal });
      } catch (error) {
        if (error?.name === "AbortError") {
          throw error;
        }
      }
    }

    if (state.activeView === "general" && state.generalWebSearchBias) {
      state.generalWebSearchBias = {
        ...state.generalWebSearchBias,
        label: getLocalResultsBiasLabel(state.generalWebSearchBias.zipCode),
      };
      renderFilters();
    }

    const shouldFetchRelatedPlaces = state.activeView === "maps" || hasLocalIntent || Boolean(queryAreaHint);
    const shouldBiasPlaces = state.activeView === "maps" || hasLocalIntent;
    const shouldUseZipAnchor = (Boolean(queryZipHint) || !queryAreaHint) && (state.activeView === "maps" || hasLocalIntent);
    const mapsQuery = shouldFetchRelatedPlaces
      ? getLocationBiasedQuery(trimmedQuery, { force: shouldBiasPlaces })
      : trimmedQuery;
    const resolvedNewsQuery = state.activeView === "news"
      ? buildNewsTopicQuery(trimmedQuery, state.newsTopic)
      : trimmedQuery;
    if (state.activeView === "news" && resolvedNewsQuery !== newsQuery) {
      newsQuery = resolvedNewsQuery;
      renderSummary({
        query: newsQuery,
        page,
        loading: true,
      });
    }

    if (state.activeView === "general") {
      const { primaryQuery: sidebarPrimaryNewsQuery, fallbackQuery: sidebarFallbackNewsQuery } = getSidebarNewsQueries(trimmedQuery);
      const generalWebQuery = state.generalWebSearchQuery || trimmedQuery;
      payload = await fetchJson(
        buildSearchUrl(generalWebQuery, page, "general", { literalSearch: resolvedLiteralSearch }),
        { signal: searchSignal },
      );

      if (requestId !== state.searchRequestId) {
        return;
      }

      const primaryResults = dedupeResultsForView(
        Array.isArray(payload.results) ? payload.results : [],
        "general",
      );
      const resultsContextKey = getGeneralSidebarContextKey(trimmedQuery, {
        literalSearch: resolvedLiteralSearch,
      });
      const canReuseResultsContext = (
        trimmedQuery === previousQuery
        && resolvedLiteralSearch === previousLiteralSearch
      );
      const storedSidebarData = canReuseResultsContext
        ? getStoredGeneralSidebarData(resultsContextKey)
        : null;
      const storedAiSummary = canReuseResultsContext
        ? getStoredAiSummaryData(resultsContextKey)
        : null;
      let resolvedSidebarData = storedSidebarData;

      if (page === 1 && !resolvedSidebarData) {
        try {
          resolvedSidebarData = await fetchGeneralSidebarData({
            query: trimmedQuery,
            primaryResults,
            mapsQuery,
            hasLocalIntent,
            shouldFetchRelatedPlaces,
            shouldUseZipAnchor,
            sidebarPrimaryNewsQuery,
            sidebarFallbackNewsQuery,
            requestId,
            signal: searchSignal,
          });
        } catch (error) {
          if (error?.name === "AbortError") {
            throw error;
          }
          resolvedSidebarData = null;
        }

        if (requestId !== state.searchRequestId) {
          return;
        }

        if (resolvedSidebarData) {
          rememberGeneralSidebarData(resultsContextKey, resolvedSidebarData);
        }
      }

      state.loading = false;
      state.results = primaryResults;
      setAiSummaryState(
        storedAiSummary || undefined,
      );
      applyGeneralSidebarData(
        resolvedSidebarData || createGeneralSidebarData({
          infoResult: pickInfoResult(primaryResults, []),
        }),
      );
      state.querySuggestions = Array.isArray(payload.suggestions) ? payload.suggestions : [];
      state.page = payload.page || page;
	      setupInfiniteScrollFromPayload(payload, {
	        page: state.page,
	        view: "general",
	        usableResultCount: primaryResults.length,
	      });
      if (page === 1 && !storedAiSummary) {
        fetchAiSummary({
          requestId,
          signal: searchSignal,
          contextKey: resultsContextKey,
        });
      }
      renderResults();
      renderSummary(payload);
      renderRefinements();
      renderPagination();
      syncAutoLoadButtons();
      requestInfiniteScrollCheck();
    } else if (state.activeView === "images") {
      const imagePayloads = await fetchImageSearchPayloads(trimmedQuery, page, {
        signal: searchSignal,
        literalSearch: resolvedLiteralSearch,
      });
      payload = mergeImageSearchPayloads(imagePayloads, trimmedQuery, page);
    } else if (state.activeView === "news") {
      payload = await fetchJson(
        buildSearchUrl(newsQuery, page, "news", { literalSearch: resolvedLiteralSearch }),
        { signal: searchSignal },
      );
    } else {
      payload = await fetchJson(
        buildSearchUrl(mapsQuery, 1, "maps", { literalSearch: resolvedLiteralSearch }),
        { signal: searchSignal },
      );
    }

    if (requestId !== state.searchRequestId) {
      return;
    }

    if (state.activeView === "general") {
      return;
    }

    state.loading = false;
    const nextResults = Array.isArray(payload.results) ? payload.results : [];
    const filteredNewsResults = state.activeView === "news"
      ? sortNewsResultsByRecency(
        filterNewsResultsForTopic(nextResults, state.newsTopic, state.newsBaseQuery || trimmedQuery),
      )
      : nextResults;
    const rankedMapResults = state.activeView === "maps"
      ? rankMapResultsByZip(nextResults, {
        preferNearby: true,
        useZipAnchor: shouldUseZipAnchor,
        maxDistanceMiles: shouldUseZipAnchor ? LOCAL_DISTANCE_MAP_MILES : null,
      })
      : [];
    state.results = state.activeView === "maps"
      ? rankedMapResults
      : dedupeResultsForView(
        state.activeView === "news" ? filteredNewsResults : nextResults,
        state.activeView,
      );
    state.infoResult = null;
    setAiSummaryState();
    if (state.activeView !== "news") {
      clearNewsAiSummaryState();
    }
    state.railNews = [];
    state.railSocial = [];
    state.railImages = [];
    state.mapResults = rankedMapResults;
    syncSelectedMapResult();
    state.querySuggestions = Array.isArray(payload.suggestions) ? payload.suggestions : [];
    state.page = state.activeView === "maps" ? 1 : (payload.page || page);
	    setupInfiniteScrollFromPayload(payload, {
	      page: state.page,
	      view: state.activeView,
	      usableResultCount: state.results.length,
	    });
    renderResults();
    renderSummary(payload);
    renderRefinements();
    renderPagination();
    syncAutoLoadButtons();
    requestInfiniteScrollCheck();
  } catch (error) {
    if (requestId !== state.searchRequestId) {
      return;
    }

    if (error?.name === "AbortError") {
      return;
    }

    state.loading = false;
    state.results = [];
    setAiSummaryState();
    state.infoResult = null;
    resetInfiniteScrollState();
    state.railNews = [];
    state.railSocial = [];
    state.railImages = [];
    state.mapResults = [];
    state.selectedMapResultId = "";
    state.querySuggestions = [];
    renderResultsCorrection(null);
    renderError(error instanceof Error ? error.message : "Search failed.");
    renderRefinements();
    renderPagination();
    syncAutoLoadButtons();
  }
}

async function runLuckySearch() {
  const activeSearchInput = getVisibleSearchInput();
  const query = activeSearchInput?.value.trim() || state.query.trim();
  if (!query) {
    return;
  }

  try {
    const payload = await fetchJson(buildSearchUrl(query, 1, "general"));
    const firstResult = Array.isArray(payload.results) ? payload.results[0] : null;
    if (firstResult?.url) {
      window.location.href = firstResult.url;
      return;
    }
  } catch (error) {
  }

  runSearch({
    query,
    page: 1,
    view: "general",
    literalSearch: false,
  });
}

function requestAutocomplete(input) {
  if (!(input instanceof HTMLInputElement)) {
    clearSuggestions();
    return;
  }

  const rawQuery = input.value;
  const trimmedQuery = rawQuery.trim();
  state.autocompleteActiveInput = input;
  syncQueryInputs(rawQuery, { source: input });
  updateSearchClearButtons();

  if (state.autocompleteTimer) {
    window.clearTimeout(state.autocompleteTimer);
    state.autocompleteTimer = null;
  }

  if (!isAutocompleteArmedForInput(input)) {
    state.autocompleteRequestId += 1;
    state.autocompleteAbortController?.abort();
    state.autocompleteQuery = "";
    state.autocompleteSuggestions = [];
    hideAutocompletePanels({ clear: true });
    return;
  }

  if (trimmedQuery.length < getAutocompleteMinChars()) {
    state.autocompleteRequestId += 1;
    state.autocompleteAbortController?.abort();
    state.autocompleteQuery = "";
    state.autocompleteSuggestions = [];
    hideAutocompletePanels({ clear: true });
    return;
  }

  state.autocompleteTimer = window.setTimeout(async () => {
    state.autocompleteTimer = null;
    const requestId = state.autocompleteRequestId + 1;
    state.autocompleteRequestId = requestId;
    state.autocompleteAbortController?.abort();
    const autocompleteAbortController = new AbortController();
    state.autocompleteAbortController = autocompleteAbortController;

    try {
      const autocompleteParams = new URLSearchParams({ q: trimmedQuery });
      const effectivePreferences = getEffectivePreferences();
      const autocompleteProvider = effectivePreferences.autocompleteProvider;
      if (autocompleteProvider) {
        autocompleteParams.set("autocomplete_provider", autocompleteProvider);
      }
      autocompleteParams.set("autocomplete_min_chars", String(effectivePreferences.autocompleteMinChars));
      autocompleteParams.set("autocomplete_limit", String(effectivePreferences.autocompleteLimit));
      const payload = await fetchJson(`/api/autocomplete?${autocompleteParams.toString()}`, {
        signal: autocompleteAbortController.signal,
      });
      if (requestId !== state.autocompleteRequestId) {
        return;
      }

      if (input.value.trim() !== trimmedQuery) {
        return;
      }

      renderSuggestions(Array.isArray(payload.suggestions) ? payload.suggestions : [], {
        query: trimmedQuery,
        input,
      });
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }
      renderSuggestions([], {
        query: trimmedQuery,
        input,
      });
    }
  }, 140);
}

function getVisibleImagePreview() {
  return imagePreviewBackdrop && !imagePreviewBackdrop.hidden && imagePreviewPanel instanceof HTMLElement
    ? imagePreviewPanel
    : null;
}

function getVisibleResultDetails() {
  return resultDetailsBackdrop && !resultDetailsBackdrop.hidden && resultDetailsPanel instanceof HTMLElement
    ? resultDetailsPanel
    : null;
}

function getVisibleElementTop(element) {
  if (!(element instanceof HTMLElement) || element.hidden || element.closest("[hidden]")) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return null;
  }

  return rect.top;
}

function getResultsLayoutContentTop() {
  if (!(resultsLayout instanceof HTMLElement) || resultsLayout.hidden || resultsLayout.closest("[hidden]")) {
    return null;
  }

  const rect = resultsLayout.getBoundingClientRect();
  const paddingTop = Number.parseFloat(window.getComputedStyle(resultsLayout).paddingTop) || 0;
  return rect.top + paddingTop;
}

function getResultsContentGapPx() {
  if (!(resultsLayout instanceof HTMLElement)) {
    return 0;
  }

  const paddingTop = Number.parseFloat(window.getComputedStyle(resultsLayout).paddingTop);
  return Number.isFinite(paddingTop) ? paddingTop : 0;
}

function getResultsRightRailTop() {
  if (!(resultsShell instanceof HTMLElement) || resultsShell.hidden || resultsShell.closest("[hidden]")) {
    return null;
  }

  const header = resultsShell.querySelector(".results-header");
  const headerRect = header instanceof HTMLElement && !header.closest("[hidden]")
    ? header.getBoundingClientRect()
    : null;
  const contentGap = getResultsContentGapPx();
  if (headerRect && (headerRect.width || headerRect.height)) {
    return Math.max(0, Math.round(headerRect.bottom + contentGap));
  }

  const contentTop = getResultsLayoutContentTop();
  return Number.isFinite(contentTop) ? Math.max(0, Math.round(contentTop)) : null;
}

function syncResultsRightRailTop() {
  if (!(resultsShell instanceof HTMLElement)) {
    return;
  }

  const railTop = getResultsRightRailTop();
  if (!Number.isFinite(railTop)) {
    resultsShell.style.removeProperty("--results-sidebar-sticky-top");
    return;
  }

  resultsShell.style.setProperty("--results-sidebar-sticky-top", `${railTop}px`);
}

function getResultsShellBottomInset(minBottom = RESULTS_FLOATING_PANEL_MIN_BOTTOM_PX, panelTop = 0) {
  const viewportHeight = Math.max(0, window.innerHeight || document.documentElement.clientHeight || 0);
  if (!viewportHeight) {
    return minBottom;
  }

  const shellRect = resultsShell instanceof HTMLElement && !resultsShell.hidden && !resultsShell.closest("[hidden]")
    ? resultsShell.getBoundingClientRect()
    : null;
  const shellBottom = shellRect && Number.isFinite(shellRect.bottom)
    ? shellRect.bottom
    : viewportHeight;
  const lowestViewportBottom = viewportHeight - minBottom;
  const lowestShellBottom = shellBottom - minBottom;
  const panelBottomEdge = Math.max(
    panelTop,
    Math.min(lowestViewportBottom, lowestShellBottom),
  );

  return Math.max(
    minBottom,
    Math.round(viewportHeight - panelBottomEdge),
  );
}

function syncResultsFloatingPanelBounds() {
  if (!(resultsShell instanceof HTMLElement)) {
    return;
  }

  if (resultsShell.hidden || resultsShell.closest("[hidden]")) {
    resultsShell.style.removeProperty("--results-floating-panel-bottom");
    return;
  }

  resultsShell.style.setProperty(
    "--results-floating-panel-bottom",
    `${getResultsShellBottomInset()}px`,
  );
}

function requestResultsFloatingPanelBoundsSync() {
  if (resultsFloatingPanelSyncFrame) {
    return;
  }

  resultsFloatingPanelSyncFrame = window.requestAnimationFrame(() => {
    resultsFloatingPanelSyncFrame = 0;
    syncResultsFloatingPanelBounds();
  });
}

function getResultDetailsPanelTop() {
  const aiSummaryCard = resultsRoot?.querySelector(".spotlight-card-ai");
  const placesStageTop = shouldPromotePlaces()
    ? getVisibleElementTop(resultsStage)
    : null;
  const anchorTops = [
    placesStageTop,
    shouldPromotePlaces() ? null : getVisibleElementTop(aiSummaryCard),
    getVisibleElementTop(infoCard),
    getVisibleElementTop(resultsSidebar),
    getVisibleElementTop(resultsRoot),
    getResultsLayoutContentTop(),
  ].filter(Number.isFinite);

  const header = resultsShell?.querySelector(".results-header");
  const headerRect = header instanceof HTMLElement && !header.closest("[hidden]")
    ? header.getBoundingClientRect()
    : null;
  const minimumTop = Math.max(
    RESULT_DETAILS_PANEL_MIN_TOP_PX,
    (headerRect?.bottom || 0) + RESULT_DETAILS_PANEL_MIN_TOP_PX,
  );
  const targetTop = anchorTops.length ? anchorTops[0] : minimumTop;
  const maximumTop = Math.max(
    RESULT_DETAILS_PANEL_MIN_TOP_PX,
    window.innerHeight - RESULT_DETAILS_PANEL_MIN_VISIBLE_HEIGHT_PX,
  );

  return Math.round(Math.min(Math.max(targetTop, minimumTop), maximumTop));
}

function getResultDetailsPanelBottom(panelTop = getResultDetailsPanelTop()) {
  return getResultsShellBottomInset(RESULT_DETAILS_PANEL_MIN_BOTTOM_PX, panelTop);
}

function getImagePreviewPanelTop() {
  const header = resultsShell?.querySelector(".results-header");
  const headerRect = header instanceof HTMLElement && !header.closest("[hidden]")
    ? header.getBoundingClientRect()
    : null;
  const minimumTop = Math.max(
    IMAGE_PREVIEW_PANEL_MIN_TOP_PX,
    (headerRect?.bottom || 0) + IMAGE_PREVIEW_PANEL_MIN_TOP_PX,
  );
  const anchorTops = [
    getVisibleElementTop(resultsStage),
    getVisibleElementTop(resultsRoot),
    getResultsLayoutContentTop(),
  ].filter(Number.isFinite);
  const targetTop = anchorTops.length ? anchorTops[0] : minimumTop;
  const maximumTop = Math.max(
    IMAGE_PREVIEW_PANEL_MIN_TOP_PX,
    window.innerHeight - IMAGE_PREVIEW_PANEL_MIN_VISIBLE_HEIGHT_PX,
  );

  return Math.round(Math.min(Math.max(targetTop, minimumTop), maximumTop));
}

function syncImagePreviewPanelTop() {
  if (!(imagePreviewBackdrop instanceof HTMLElement)) {
    return;
  }

  const panelTop = getImagePreviewPanelTop();
  imagePreviewBackdrop.style.setProperty(
    "--image-preview-panel-top",
    `${panelTop}px`,
  );
  imagePreviewBackdrop.style.setProperty(
    "--image-preview-panel-bottom",
    `${getResultsShellBottomInset(IMAGE_PREVIEW_PANEL_MIN_BOTTOM_PX, panelTop)}px`,
  );
}

function syncResultDetailsPanelTop() {
  if (!(resultDetailsBackdrop instanceof HTMLElement)) {
    return;
  }

  const panelTop = getResultDetailsPanelTop();
  resultDetailsBackdrop.style.setProperty(
    "--result-details-panel-top",
    `${panelTop}px`,
  );
  resultDetailsBackdrop.style.setProperty(
    "--result-details-panel-bottom",
    `${getResultDetailsPanelBottom(panelTop)}px`,
  );
}

function requestResultDetailsPanelSync() {
  if (resultDetailsPanelSyncFrame) {
    return;
  }

  resultDetailsPanelSyncFrame = window.requestAnimationFrame(() => {
    resultDetailsPanelSyncFrame = 0;
    if (getVisibleResultDetails()) {
      syncResultDetailsPanelTop();
    }
  });
}

function getVisibleChat() {
  return chatPopout instanceof HTMLElement && !chatPopout.hidden
    ? chatPanel
    : null;
}

function isChatOpen() {
  return Boolean(getVisibleChat());
}

function isChatMenuOpen() {
  return chatMenuPanel instanceof HTMLElement && !chatMenuPanel.hidden;
}

function setChatMenuOpen(open, { focusFirst = false } = {}) {
  if (!(chatMenuPanel instanceof HTMLElement)) {
    return;
  }

  const shouldOpen = Boolean(open);
  chatMenuPanel.hidden = !shouldOpen;
  if (chatMenuButton instanceof HTMLButtonElement) {
    chatMenuButton.setAttribute("aria-expanded", String(shouldOpen));
  }

  if (shouldOpen) {
    renderChatSessions();
    updateChatActionStates();
    if (focusFirst) {
      window.requestAnimationFrame(() => {
        const firstFocusable = getFocusableElements(chatMenuPanel)[0];
        firstFocusable?.focus();
      });
    }
  }
}

function closeChatMenu() {
  setChatMenuOpen(false);
}

function toggleChatMenu() {
  setChatMenuOpen(!isChatMenuOpen(), { focusFirst: true });
}

function setChatToggleState(isOpen) {
  chatToggleButtons.forEach((button) => {
    button.setAttribute("aria-expanded", String(isOpen));
  });
}

function syncChatFullscreenState() {
  const isFullscreen = Boolean(state.chatFullscreen);
  if (chatPopout instanceof HTMLElement) {
    chatPopout.classList.toggle("is-fullscreen", isFullscreen);
  }
  document.body.classList.toggle("has-chat-fullscreen", isFullscreen && isChatOpen());
  if (chatPanel instanceof HTMLElement) {
    chatPanel.setAttribute("aria-modal", isFullscreen ? "true" : "false");
  }
  if (chatFullscreenButton instanceof HTMLButtonElement) {
    chatFullscreenButton.setAttribute("aria-pressed", String(isFullscreen));
    chatFullscreenButton.setAttribute("aria-label", isFullscreen ? `Collapse ${CHAT_FEATURE_NAME}` : `Expand ${CHAT_FEATURE_NAME}`);
    chatFullscreenButton.title = isFullscreen ? `Collapse ${CHAT_FEATURE_NAME}` : `Expand ${CHAT_FEATURE_NAME}`;
  }
}

function setChatFullscreen(isFullscreen) {
  state.chatFullscreen = Boolean(isFullscreen);
  syncChatFullscreenState();
  syncChatInputHeight();
  if (isChatOpen() && chatInput instanceof HTMLTextAreaElement) {
    window.requestAnimationFrame(() => {
      chatInput.focus();
      if (chatLog instanceof HTMLElement) {
        chatLog.scrollTop = chatLog.scrollHeight;
      }
    });
  }
}

function toggleChatFullscreen() {
  closeChatMenu();
  setChatFullscreen(!state.chatFullscreen);
}

function getInstalledAiModels() {
  const installedModels = Array.isArray(state.health?.ollama?.models)
    ? state.health.ollama.models.map((model) => normalizeAiModelPreference(model)).filter(Boolean)
    : [];
  return Array.from(new Set(installedModels));
}

function getActiveChatSession() {
  let session = state.chatSessions.find((entry) => entry.id === state.activeChatSessionId);
  if (!session) {
    session = createChatSession({
      model: getSelectedAiModel(),
      useSearchContext: true,
    });
    state.chatSessions = [session, ...state.chatSessions].slice(0, CHAT_SESSION_LIMIT);
    state.activeChatSessionId = session.id;
  }

  state.chatMessages = session.messages;
  return session;
}

function touchChatSession(session = getActiveChatSession()) {
  session.updatedAt = new Date().toISOString();
  session.title = getChatTitleFromMessages(session.messages);
  session.messages = session.messages.slice(-CHAT_SESSION_MESSAGE_LIMIT);
  state.chatMessages = session.messages;
  state.chatSessions = [
    session,
    ...state.chatSessions.filter((entry) => entry.id !== session.id),
  ].slice(0, CHAT_SESSION_LIMIT);
  state.activeChatSessionId = session.id;
  saveChatState();
}

function getActiveChatModelForRequest() {
  return resolveUsableAiModel(getActiveChatSession().model || getSelectedAiModel());
}

function updateChatSessionTitle() {
  if (chatSessionTitle instanceof HTMLElement) {
    chatSessionTitle.textContent = getActiveChatSession().title || "New chat";
  }
}

function populateChatModelSelect() {
  if (!(chatModelSelect instanceof HTMLSelectElement)) {
    return;
  }

  const session = getActiveChatSession();
  const defaultModel = normalizeAiModelPreference(getSelectedAiModel() || state.health?.ollama?.default_model || "");
  const modelOptions = getInstalledAiModels();

  const defaultLabel = defaultModel ? `Configured default (${defaultModel})` : "Configured default";
  chatModelSelect.innerHTML = [
    `<option value="">${escapeHtml(defaultLabel)}</option>`,
    ...modelOptions.map((model) => `<option value="${escapeHtml(model)}">${escapeHtml(model)}</option>`),
  ].join("");
  chatModelSelect.value = modelOptions.includes(session.model) ? session.model : "";
}

function syncChatContextToggle() {
  if (chatContextToggle instanceof HTMLInputElement) {
    chatContextToggle.checked = getActiveChatSession().useSearchContext !== false;
  }
}

function syncChatHistoryStorageToggle() {
  if (chatHistoryStorageToggle instanceof HTMLInputElement) {
    chatHistoryStorageToggle.checked = shouldPersistChatHistory(getEffectivePreferences());
  }
}

function setChatHistoryStoragePreference(value, { announce = false } = {}) {
  const nextStorage = normalizeChatHistoryStoragePreference(value);
  const wasPersisting = shouldPersistChatHistory(getEffectivePreferences());
  state.preferences = {
    ...state.preferences,
    chatHistoryStorage: nextStorage,
  };
  savePreferences();

  if (nextStorage === "memory") {
    removeStoredChatState();
    if (announce) {
      setChatStatus("Chat history is memory-only. It will disappear when this page reloads or closes.", { tone: "success" });
    }
  } else {
    saveChatState();
    if (announce && !wasPersisting) {
      setChatStatus("Chat history will be saved in this browser.", { tone: "success" });
    }
  }

  populatePreferenceForm();
  syncChatHistoryStorageToggle();
}

function renderChatSessions() {
  if (!(chatSessionList instanceof HTMLElement)) {
    updateChatSessionTitle();
    populateChatModelSelect();
    syncChatContextToggle();
    syncChatHistoryStorageToggle();
    return;
  }

  chatSessionList.innerHTML = state.chatSessions
    .map((session) => {
      const isActive = session.id === state.activeChatSessionId;
      const updated = new Date(session.updatedAt);
      const meta = Number.isNaN(updated.getTime())
        ? ""
        : updated.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      return `
        <button
          type="button"
          class="chat-session-chip${isActive ? " is-active" : ""}"
          data-chat-session-id="${escapeHtml(session.id)}"
          aria-pressed="${isActive ? "true" : "false"}"
        >
          <span class="chat-session-chip-title">${escapeHtml(session.title || "New chat")}</span>
          ${meta ? `<span class="chat-session-chip-meta">${escapeHtml(meta)}</span>` : ""}
        </button>
      `;
    })
    .join("");

  updateChatSessionTitle();
  populateChatModelSelect();
  syncChatContextToggle();
  syncChatHistoryStorageToggle();
}

function setChatStatus(message = "", { tone = "default" } = {}) {
  if (!(chatStatus instanceof HTMLElement)) {
    return;
  }

  chatStatus.textContent = message;
  chatStatus.hidden = !message;
  if (!message) {
    delete chatStatus.dataset.tone;
    return;
  }
  chatStatus.dataset.tone = tone;
}

function syncChatInputHeight() {
  if (!(chatInput instanceof HTMLTextAreaElement)) {
    return;
  }
  chatInput.style.height = "auto";
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 160)}px`;
}

function clampChatInputValue() {
  if (!(chatInput instanceof HTMLTextAreaElement)) {
    return;
  }
  if (chatInput.maxLength !== CHAT_INPUT_CHAR_LIMIT) {
    chatInput.maxLength = CHAT_INPUT_CHAR_LIMIT;
  }
  if (chatInput.value.length > CHAT_INPUT_CHAR_LIMIT) {
    chatInput.value = chatInput.value.slice(0, CHAT_INPUT_CHAR_LIMIT);
  }
}

function normalizeChatMessageText(value) {
  return String(value || "").replace(/\r\n/g, "\n").trim();
}

function applyInlineChatMarkdown(value) {
  let text = escapeHtml(value);
  text = text.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  text = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  return text;
}

function renderChatTextSegment(segment) {
  const lines = String(segment || "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let paragraph = [];
  let listItems = [];
  let orderedListItems = [];

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }
    blocks.push(`<p>${applyInlineChatMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (listItems.length) {
      blocks.push(`<ul>${listItems.map((item) => `<li>${applyInlineChatMarkdown(item)}</li>`).join("")}</ul>`);
      listItems = [];
    }
    if (orderedListItems.length) {
      blocks.push(`<ol>${orderedListItems.map((item) => `<li>${applyInlineChatMarkdown(item)}</li>`).join("")}</ol>`);
      orderedListItems = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = Math.min(4, headingMatch[1].length + 2);
      blocks.push(`<h${level}>${applyInlineChatMarkdown(headingMatch[2])}</h${level}>`);
      return;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (orderedListItems.length) {
        flushList();
      }
      listItems.push(unorderedMatch[1]);
      return;
    }

    const orderedMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      if (listItems.length) {
        flushList();
      }
      orderedListItems.push(orderedMatch[1]);
      return;
    }

    flushList();
    paragraph.push(trimmed);
  });

  flushParagraph();
  flushList();
  return blocks.join("");
}

function renderChatMarkdown(value) {
  const text = normalizeChatMessageText(value);
  if (!text) {
    return "";
  }

  const parts = [];
  const fencePattern = /```([^\n`]*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  while ((match = fencePattern.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before) {
      parts.push(renderChatTextSegment(before));
    }
    const language = normalizeChatMessageText(match[1]).replace(/[^\w#+.-]/g, "").slice(0, 32);
    const code = match[2].replace(/^\n+|\n+$/g, "");
    parts.push(`
      <pre class="chat-code-block"${language ? ` data-language="${escapeHtml(language)}"` : ""}><code>${escapeHtml(code)}</code></pre>
    `);
    lastIndex = match.index + match[0].length;
  }

  const after = text.slice(lastIndex);
  if (after) {
    parts.push(renderChatTextSegment(after));
  }

  return `<div class="chat-markdown">${parts.join("")}</div>`;
}

function buildChatMessageMarkup(message, index) {
  const role = message?.role === "user" ? "user" : "assistant";
  const tone = String(message?.tone || "").trim();
  const content = normalizeChatMessageText(message?.content) || (role === "assistant" ? "I could not generate a reply." : "");
  const model = normalizeAiModelPreference(message?.model || "");
  const timestamp = getChatMessageTimestamp(message?.createdAt);
  const metaParts = [
    ...(model && role === "assistant" ? [escapeHtml(model)] : []),
    ...(timestamp
      ? [`<time datetime="${escapeHtml(timestamp.iso)}" title="${escapeHtml(timestamp.iso)}">${escapeHtml(timestamp.label)}</time>`]
      : []),
  ];
  const messageLabel = role === "user" ? "Your message" : `${CHAT_FEATURE_NAME} message`;
  return `
    <article class="chat-message chat-message-${role}${tone ? ` chat-message-${escapeHtml(tone)}` : ""}" data-chat-message-index="${index}" aria-label="${escapeHtml(messageLabel)}">
      <div class="chat-message-bubble">
        <div class="chat-message-content">${renderChatMarkdown(content)}</div>
        ${metaParts.length ? `<p class="chat-message-meta">${metaParts.join('<span aria-hidden="true"> · </span>')}</p>` : ""}
      </div>
    </article>
  `;
}

function renderChatMessages() {
  if (!(chatLog instanceof HTMLElement)) {
    return;
  }

  const session = getActiveChatSession();
  const messagesMarkup = session.messages.length
    ? session.messages.map((message, index) => buildChatMessageMarkup(message, index)).join("")
    : `
      <div class="chat-empty">
        <p>What can I help with?</p>
      </div>
    `;
  const typingMarkup = state.chatLoading
    ? `
      <article class="chat-message chat-message-assistant chat-message-loading" aria-label="${escapeHtml(CHAT_FEATURE_NAME)} is replying" aria-busy="true">
        <div class="chat-message-bubble">
          <div class="chat-loading-head">
            <span class="chat-typing-dot"></span>
            <span class="chat-typing-dot"></span>
            <span class="chat-typing-dot"></span>
            <span class="chat-loading-label">Drafting reply</span>
          </div>
          <div class="chat-loading-lines" aria-hidden="true">
            <span class="skeleton-line skeleton-line-body-wide"></span>
            <span class="skeleton-line skeleton-line-body"></span>
            <span class="skeleton-line skeleton-line-body-short"></span>
          </div>
        </div>
      </article>
    `
    : "";

  chatLog.innerHTML = `${messagesMarkup}${typingMarkup}`;
  chatLog.scrollTop = chatLog.scrollHeight;
  renderChatSessions();
  updateChatActionStates();
}

function hasUserChatMessage() {
  return getActiveChatSession().messages.some((message) => message.role === "user");
}

function updateChatActionStates() {
	  const session = getActiveChatSession();
	  const hasMessages = session.messages.length > 0;
	  const hasUserMessage = session.messages.some((message) => message.role === "user");
	  const canDeleteSession = hasMessages || state.chatSessions.length > 1;
	  const canUseAi = isAiEnabled();
	  if (chatSubmit instanceof HTMLButtonElement) {
	    chatSubmit.hidden = state.chatLoading;
	    chatSubmit.disabled = state.chatLoading || !canUseAi;
	  }
  if (chatStopButton instanceof HTMLButtonElement) {
    chatStopButton.hidden = !state.chatLoading;
  }
  if (chatClearButton instanceof HTMLButtonElement) {
    chatClearButton.disabled = state.chatLoading || !canDeleteSession;
  }
  if (chatRegenerateButton instanceof HTMLButtonElement) {
    chatRegenerateButton.disabled = state.chatLoading || !hasUserMessage;
  }
  if (chatCopyConversationButton instanceof HTMLButtonElement) {
    chatCopyConversationButton.disabled = !hasMessages;
  }
  if (chatExportButton instanceof HTMLButtonElement) {
    chatExportButton.disabled = !hasMessages;
  }
  if (chatNewButton instanceof HTMLButtonElement) {
    chatNewButton.disabled = state.chatLoading;
  }
  if (chatModelSelect instanceof HTMLSelectElement) {
    chatModelSelect.disabled = state.chatLoading;
  }
  if (chatContextToggle instanceof HTMLInputElement) {
    chatContextToggle.disabled = state.chatLoading;
  }
}

function setChatLoading(loading) {
  state.chatLoading = Boolean(loading);
  if (chatPanel instanceof HTMLElement) {
    chatPanel.classList.toggle("is-loading", state.chatLoading);
  }
  setChatStatus(state.chatLoading ? `${CHAT_FEATURE_NAME} is thinking...` : "");
  syncAiToggleButtons();
  updateChatActionStates();
  renderChatMessages();
}

function buildChatContextResults() {
  const combinedResults = [];
  const seen = new Set();
  const appendResult = (result) => {
    const key = String(result?.id || result?.url || result?.title || "").trim();
    if (!key || seen.has(key) || combinedResults.length >= CHAT_CONTEXT_RESULT_LIMIT) {
      return;
    }
    seen.add(key);
    combinedResults.push({
      title: String(result?.title || "").trim(),
      url: String(result?.url || "").trim(),
      content: String(result?.content || result?.address_label || "").trim(),
      domain: String(result?.domain || result?.source || "").trim(),
      category: String(result?.category || state.activeView || "").trim(),
      provider: String(result?.provider || "").trim(),
    });
  };

  state.results.forEach(appendResult);
  if (state.activeView === "general") {
    state.mapResults.forEach(appendResult);
  }
  return combinedResults;
}

function openChat(trigger = null) {
  if (!(chatPopout instanceof HTMLElement) || !(chatPanel instanceof HTMLElement)) {
    return;
  }

  closePanels();
  closeImagePreview({ restoreFocus: false });
  closeResultDetails({ restoreFocus: false, immediate: true });
  hideAutocompletePanels();

  lastChatTrigger = trigger instanceof HTMLElement
    ? trigger
    : (document.activeElement instanceof HTMLElement ? document.activeElement : null);
  window.clearTimeout(chatCloseTimer);
  chatCloseTimer = 0;
  chatPopout.hidden = false;
  chatPopout.classList.remove(CHAT_OPEN_CLASS);
  document.body.classList.add("has-chat-popout");
  setChatToggleState(true);
  syncChatFullscreenState();
  closeChatMenu();
  getActiveChatSession();
  renderChatSessions();
  renderChatMessages();
  syncChatInputHeight();

  window.requestAnimationFrame(() => {
    chatPopout.classList.add(CHAT_OPEN_CLASS);
    if (chatInput instanceof HTMLTextAreaElement) {
      chatInput.focus();
      return;
    }
    chatPanel.focus();
  });
}

function stopChatGeneration() {
  if (!state.chatAbortController) {
    return;
  }

  setChatStatus("Stopping...");
  state.chatAbortController.abort();
}

function closeChat({ restoreFocus = true, immediate = false } = {}) {
  if (!(chatPopout instanceof HTMLElement)) {
    return;
  }

  closeChatMenu();
  window.clearTimeout(chatCloseTimer);
  chatCloseTimer = 0;
  const wasChatFullscreen = state.chatFullscreen;
  chatPopout.classList.remove(CHAT_OPEN_CLASS);
  document.body.classList.remove("has-chat-popout");
  if (!wasChatFullscreen || immediate || chatPopout.hidden) {
    document.body.classList.remove("has-chat-fullscreen");
  }
  setChatToggleState(false);
  setChatStatus("");

  const finishClose = () => {
    chatPopout.hidden = true;
    document.body.classList.remove("has-chat-fullscreen");
    if (restoreFocus && lastChatTrigger instanceof HTMLElement) {
      lastChatTrigger.focus();
    }
    lastChatTrigger = null;
  };

  if (immediate || chatPopout.hidden) {
    finishClose();
    return;
  }

  chatCloseTimer = window.setTimeout(() => {
    finishClose();
    chatCloseTimer = 0;
  }, CHAT_TRANSITION_MS);
}

function deleteActiveChat() {
  if (state.chatLoading) {
    return;
  }

  const activeSession = getActiveChatSession();
  const remainingSessions = state.chatSessions.filter((session) => session.id !== activeSession.id);
  const nextSession = remainingSessions[0] || createChatSession({
    model: activeSession.model || getSelectedAiModel(),
    useSearchContext: activeSession.useSearchContext !== false,
  });

  state.chatSessions = remainingSessions.length
    ? remainingSessions.slice(0, CHAT_SESSION_LIMIT)
    : [nextSession];
  state.activeChatSessionId = nextSession.id;
  state.chatMessages = nextSession.messages;
  saveChatState();
  setChatStatus("");
  renderChatSessions();
  renderChatMessages();
  if (chatInput instanceof HTMLTextAreaElement) {
    chatInput.value = "";
    syncChatInputHeight();
    chatInput.focus();
  }
}

function createNewChat() {
  if (state.chatLoading) {
    return;
  }

  const previousSession = getActiveChatSession();
  const nextSession = createChatSession({
    model: previousSession.model || getSelectedAiModel(),
    useSearchContext: previousSession.useSearchContext !== false,
  });
  state.chatSessions = [nextSession, ...state.chatSessions].slice(0, CHAT_SESSION_LIMIT);
  state.activeChatSessionId = nextSession.id;
  state.chatMessages = nextSession.messages;
  saveChatState();
  setChatStatus("");
  renderChatSessions();
  renderChatMessages();
  if (chatInput instanceof HTMLTextAreaElement) {
    chatInput.value = "";
    syncChatInputHeight();
    chatInput.focus();
  }
}

function activateChatSession(sessionId) {
  if (state.chatLoading) {
    return;
  }
  const session = state.chatSessions.find((entry) => entry.id === sessionId);
  if (!session) {
    return;
  }
  state.activeChatSessionId = session.id;
  state.chatMessages = session.messages;
  saveChatState();
  setChatStatus("");
  renderChatSessions();
  renderChatMessages();
  syncChatInputHeight();
  if (chatInput instanceof HTMLTextAreaElement) {
    chatInput.focus();
  }
}

function formatChatTranscript(session = getActiveChatSession()) {
  const model = normalizeAiModelPreference(session.model || getSelectedAiModel());
  const lines = [
    `# ${session.title || CHAT_FEATURE_NAME}`,
    "",
    `Created: ${session.createdAt}`,
    `Updated: ${session.updatedAt}`,
    model ? `Model: ${model}` : "Model: configured default",
    `Search context: ${session.useSearchContext === false ? "off" : "on"}`,
    "",
  ];
  session.messages.forEach((message) => {
    lines.push(`## ${message.role === "user" ? "User" : CHAT_FEATURE_NAME}`);
    if (message.model) {
      lines.push(`Model: ${message.model}`);
      lines.push("");
    }
    lines.push(message.content);
    lines.push("");
  });
  return lines.join("\n").trim();
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

async function copyActiveChatConversation() {
  const session = getActiveChatSession();
  if (!session.messages.length) {
    return;
  }
  try {
    await copyTextToClipboard(formatChatTranscript(session));
    setChatStatus("Conversation copied.", { tone: "success" });
  } catch {
    setChatStatus("Could not copy conversation.", { tone: "error" });
  }
}

function getChatExportFilename(session = getActiveChatSession()) {
  const slug = String(session.title || "ai-chat")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "sear-e-chat";
  return `${slug}.md`;
}

function exportActiveChatConversation() {
  const session = getActiveChatSession();
  if (!session.messages.length) {
    return;
  }

  const blob = new Blob([formatChatTranscript(session)], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getChatExportFilename(session);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
  setChatStatus("Conversation exported.", { tone: "success" });
}

function getChatRequestMessages(session = getActiveChatSession()) {
  return session.messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .slice(-CHAT_API_MESSAGE_LIMIT)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, CHAT_API_MESSAGE_CHAR_LIMIT),
    }));
}

async function requestChatCompletion() {
  if (state.chatLoading || !hasUserChatMessage()) {
    return;
  }
  if (!isAiEnabled()) {
    setChatStatus(
      state.aiTemporarilyDisabledBySystem
        ? "AI is cooling down for a moment. Try again after the time bubble clears."
        : (getAiUnavailableReason() || "AI service is off."),
      { tone: "error" },
    );
    syncAiToggleButtons();
    return;
  }

  const session = getActiveChatSession();
  setChatLoading(true);

  const chatAbortController = new AbortController();
  state.chatAbortController = chatAbortController;
  let stopped = false;
  try {
    const selectedAiModel = getActiveChatModelForRequest();
    const useSearchContext = session.useSearchContext !== false;
    const payload = await fetchJson("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: useSearchContext ? state.query : "",
        ...(selectedAiModel ? { model: selectedAiModel } : {}),
        ...buildAiRequestPreferencePayload(),
        messages: getChatRequestMessages(session),
        results: useSearchContext ? buildChatContextResults() : [],
      }),
      signal: chatAbortController.signal,
    });
    if (chatAbortController.signal.aborted) {
      return;
    }
    const answer = normalizeChatMessageText(payload?.answer);
    session.messages.push({
      id: createClientId("msg"),
      role: "assistant",
      content: answer || "I could not generate a reply.",
      model: payload?.model || "",
      createdAt: new Date().toISOString(),
    });
    touchChatSession(session);
  } catch (error) {
    if (error?.name === "AbortError") {
      stopped = true;
      return;
    }
    session.messages.push({
      id: createClientId("msg"),
      role: "assistant",
      tone: "error",
      content: normalizeChatMessageText(error?.message) || "I could not reach the AI service.",
      createdAt: new Date().toISOString(),
    });
    touchChatSession(session);
  } finally {
    if (state.chatAbortController === chatAbortController) {
      state.chatAbortController = null;
    }
    setChatLoading(false);
    if (stopped) {
      setChatStatus("Stopped.", { tone: "default" });
    }
    if (isChatOpen() && chatInput instanceof HTMLTextAreaElement) {
      chatInput.focus();
    }
  }
}

async function sendChatMessage() {
  if (!(chatInput instanceof HTMLTextAreaElement) || state.chatLoading) {
    return;
  }

  clampChatInputValue();
  const content = normalizeChatMessageText(chatInput.value).slice(0, CHAT_INPUT_CHAR_LIMIT).trim();
  if (!content) {
    chatInput.focus();
    return;
  }

  const session = getActiveChatSession();
  session.messages.push({
    id: createClientId("msg"),
    role: "user",
    content,
    createdAt: new Date().toISOString(),
  });
  touchChatSession(session);
  chatInput.value = "";
  syncChatInputHeight();
  renderChatMessages();
  await requestChatCompletion();
}

function regenerateLastChatAnswer() {
  if (state.chatLoading) {
    return;
  }

  const session = getActiveChatSession();
  while (session.messages.length && session.messages[session.messages.length - 1].role === "assistant") {
    session.messages.pop();
  }
  if (!session.messages.some((message) => message.role === "user")) {
    setChatStatus("Send a message first.", { tone: "error" });
    return;
  }
  touchChatSession(session);
  renderChatMessages();
  requestChatCompletion();
}

function getVisiblePanel() {
  return panelBackdrop?.querySelector("[data-panel]:not([hidden])") || null;
}

function setPanelTriggerState(activeName = "") {
  panelTriggers.forEach((button) => {
    const isActive = button.getAttribute("data-open-panel") === activeName;
    button.setAttribute("aria-expanded", String(Boolean(activeName) && isActive));
  });
}

function getFocusableElements(container) {
  if (!(container instanceof HTMLElement)) {
    return [];
  }

  return Array.from(
    container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => (
    element instanceof HTMLElement
    && !element.hidden
    && !element.closest("[hidden]")
    && element.getAttribute("aria-hidden") !== "true"
  ));
}

function closeImagePreview({ restoreFocus = true } = {}) {
  if (!imagePreviewBackdrop || !imagePreviewPanel) {
    return;
  }

  imagePreviewBackdrop.hidden = true;
  document.body.classList.remove("has-image-preview");
  hideImagePreviewSidebar();

  if (imagePreviewStage) {
    imagePreviewStage.innerHTML = "";
  }
  if (imagePreviewTitle) {
    imagePreviewTitle.textContent = "Preview";
  }
  if (imagePreviewSite) {
    imagePreviewSite.textContent = "Source";
  }
  if (imagePreviewDetails) {
    imagePreviewDetails.textContent = "Image result";
  }
  if (imagePreviewUrl) {
    imagePreviewUrl.textContent = "";
    imagePreviewUrl.hidden = true;
  }
  if (imagePreviewSnippet) {
    imagePreviewSnippet.textContent = "";
    imagePreviewSnippet.hidden = true;
  }
  if (imagePreviewOpen instanceof HTMLAnchorElement) {
    imagePreviewOpen.hidden = true;
    imagePreviewOpen.removeAttribute("href");
  }

  if (restoreFocus && lastImagePreviewTrigger instanceof HTMLElement) {
    lastImagePreviewTrigger.focus();
  }
  lastImagePreviewTrigger = null;
  activeImagePreviewIndex = -1;
}

function setResultDetailsStatus(message, { tone = "default" } = {}) {
  if (!(resultDetailsStatus instanceof HTMLElement)) {
    return;
  }

  resultDetailsStatus.textContent = message;
  resultDetailsStatus.hidden = !message;
  if (!message) {
    delete resultDetailsStatus.dataset.tone;
    return;
  }

  resultDetailsStatus.dataset.tone = tone;
}

function hideResultDetailsBackdrop({ immediate = false, afterHidden = null } = {}) {
  if (!resultDetailsBackdrop) {
    return;
  }

  window.clearTimeout(resultDetailsCloseTimer);
  resultDetailsCloseTimer = 0;

  const finishClose = () => {
    resultDetailsBackdrop.classList.remove(RESULT_DETAILS_OPEN_CLASS);
    resultDetailsBackdrop.hidden = true;
    if (typeof afterHidden === "function") {
      afterHidden();
    }
  };

  if (immediate || resultDetailsBackdrop.hidden) {
    finishClose();
    return;
  }

  resultDetailsBackdrop.classList.remove(RESULT_DETAILS_OPEN_CLASS);
  resultDetailsCloseTimer = window.setTimeout(() => {
    finishClose();
    resultDetailsCloseTimer = 0;
  }, RESULT_DETAILS_TRANSITION_MS);
}

function resetResultDetailsContent() {
  if (!(resultDetailsPanel instanceof HTMLElement)) {
    return;
  }

  setResultDetailsStatus("");
  delete resultDetailsPanel.dataset.variant;
  setResultDetailsSectionTitles();
  setResultDetailsListMode();

  if (resultDetailsSourceIcon instanceof HTMLElement) {
    resultDetailsSourceIcon.innerHTML = '<span class="result-details-source-fallback">W</span>';
  }
  if (resultDetailsSourceName instanceof HTMLElement) {
    resultDetailsSourceName.textContent = "Website";
  }
  if (resultDetailsSourceMeta instanceof HTMLElement) {
    resultDetailsSourceMeta.textContent = "";
    resultDetailsSourceMeta.hidden = true;
  }
  if (resultDetailsTitle instanceof HTMLElement) {
    resultDetailsTitle.textContent = "Result";
  }
  if (resultDetailsUrl instanceof HTMLElement) {
    resultDetailsUrl.textContent = "";
    resultDetailsUrl.hidden = true;
  }
  if (resultDetailsSnippet instanceof HTMLElement) {
    resultDetailsSnippet.textContent = "";
    resultDetailsSnippet.hidden = true;
  }
  if (resultDetailsOpen instanceof HTMLAnchorElement) {
    resultDetailsOpen.textContent = "Visit";
    resultDetailsOpen.hidden = true;
    resultDetailsOpen.removeAttribute("href");
  }
  if (resultDetailsCopy instanceof HTMLButtonElement) {
    delete resultDetailsCopy.dataset.url;
    resultDetailsCopy.hidden = false;
  }
  if (resultDetailsFacts instanceof HTMLElement) {
    resultDetailsFacts.innerHTML = "";
  }
  if (resultDetailsAbout instanceof HTMLElement) {
    resultDetailsAbout.textContent = "";
    resultDetailsAbout.hidden = true;
  }
  if (resultDetailsList instanceof HTMLElement) {
    resultDetailsList.innerHTML = "";
  }
}

function setResultDetailsSectionTitles({
  about = "About the source",
  list = "Your search & this result",
} = {}) {
  const [aboutTitle, listTitle] = resultDetailsPanel?.querySelectorAll(".result-details-section-title") || [];
  if (aboutTitle instanceof HTMLElement) {
    aboutTitle.textContent = about;
  }
  if (listTitle instanceof HTMLElement) {
    listTitle.textContent = list;
  }
}

function setResultDetailsListMode(mode = "default") {
  if (!(resultDetailsList instanceof HTMLElement)) {
    return;
  }

  resultDetailsList.classList.toggle("result-details-source-list", mode === "sources");
}

function closeResultDetails({ restoreFocus = true, immediate = false } = {}) {
  if (!resultDetailsBackdrop || !resultDetailsPanel) {
    return;
  }

  hideResultDetailsBackdrop({
    immediate,
    afterHidden: resetResultDetailsContent,
  });
  document.body.classList.remove("has-result-details");

  if (lastResultDetailsTrigger instanceof HTMLElement) {
    lastResultDetailsTrigger.setAttribute("aria-expanded", "false");
    if (restoreFocus && lastResultDetailsTrigger.isConnected) {
      lastResultDetailsTrigger.focus();
    }
  }
  lastResultDetailsTrigger = null;
}

function openResultDetails(result, trigger = null) {
  if (!resultDetailsBackdrop || !resultDetailsPanel || !result) {
    return;
  }

  hideAppTooltip();
  closeChat({ restoreFocus: false, immediate: true });
  closePanels();
  closeImagePreview({ restoreFocus: false });
  closeResultDetails({ restoreFocus: false, immediate: true });

  const siteName = getResultSiteName(result);
  const host = getResultHost(result);
  const displayUrl = getResultDisplayUrl(result);
  const sectionLabel = getResultSectionLabel(result);
  const siteMeta = [host, sectionLabel].filter(Boolean).join(" \u203a ");
  const faviconUrl = getResultFaviconUrl(result);
  const faviconFallback = (siteName || getResultHost(result) || "W").slice(0, 1).toUpperCase();
  const reasons = buildResultDetailsReasons(result);
  const facts = buildResultDetailsFacts(result);
  const snippet = String(result.content || "").replace(/\s+/g, " ").trim();
  const aboutText = buildResultDetailsAboutText(result);

  lastResultDetailsTrigger = trigger instanceof HTMLElement
    ? trigger
    : (document.activeElement instanceof HTMLElement ? document.activeElement : null);

  if (lastResultDetailsTrigger instanceof HTMLElement) {
    lastResultDetailsTrigger.setAttribute("aria-expanded", "true");
  }

  delete resultDetailsPanel.dataset.variant;
  setResultDetailsSectionTitles();
  setResultDetailsListMode();

  if (resultDetailsSourceIcon instanceof HTMLElement) {
    resultDetailsSourceIcon.innerHTML = `
      <span class="result-details-source-fallback">${escapeHtml(faviconFallback)}</span>
      ${faviconUrl
        ? `<img class="result-details-source-image" src="${escapeHtml(faviconUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true">`
        : ""}
    `;
  }
  if (resultDetailsSourceName instanceof HTMLElement) {
    resultDetailsSourceName.textContent = siteName;
  }
  if (resultDetailsSourceMeta instanceof HTMLElement) {
    resultDetailsSourceMeta.textContent = siteMeta;
    resultDetailsSourceMeta.hidden = !siteMeta;
  }
  if (resultDetailsTitle instanceof HTMLElement) {
    resultDetailsTitle.textContent = result.title || "Result";
  }
  if (resultDetailsUrl instanceof HTMLElement) {
    resultDetailsUrl.textContent = displayUrl;
    resultDetailsUrl.hidden = !displayUrl;
  }
  if (resultDetailsSnippet instanceof HTMLElement) {
    resultDetailsSnippet.textContent = snippet || "Open this result to view the full page.";
    resultDetailsSnippet.hidden = false;
  }
  if (resultDetailsOpen instanceof HTMLAnchorElement) {
    if (result.url) {
      resultDetailsOpen.href = result.url;
      resultDetailsOpen.textContent = "Visit";
      resultDetailsOpen.hidden = false;
    } else {
      resultDetailsOpen.hidden = true;
      resultDetailsOpen.removeAttribute("href");
    }
  }
  if (resultDetailsCopy instanceof HTMLButtonElement) {
    if (result.url) {
      resultDetailsCopy.dataset.url = String(result.url || "");
      resultDetailsCopy.hidden = false;
    } else {
      delete resultDetailsCopy.dataset.url;
      resultDetailsCopy.hidden = true;
    }
  }
  if (resultDetailsFacts instanceof HTMLElement) {
    resultDetailsFacts.innerHTML = facts
      .map((fact) => `
        <div class="result-details-fact">
          <p class="result-details-fact-label">${escapeHtml(fact.label)}</p>
          <p class="result-details-fact-value">${escapeHtml(fact.value)}</p>
        </div>
      `)
      .join("");
  }
  if (resultDetailsAbout instanceof HTMLElement) {
    resultDetailsAbout.textContent = aboutText;
    resultDetailsAbout.hidden = !aboutText;
  }
  if (resultDetailsList instanceof HTMLElement) {
    resultDetailsList.innerHTML = reasons
      .map((reason) => `<li>${escapeHtml(reason)}</li>`)
      .join("");
  }

  setResultDetailsStatus("");
  window.clearTimeout(resultDetailsCloseTimer);
  resultDetailsCloseTimer = 0;
  resultDetailsBackdrop.classList.remove(RESULT_DETAILS_OPEN_CLASS);
  syncResultDetailsPanelTop();
  resultDetailsBackdrop.hidden = false;
  document.body.classList.add("has-result-details");
  resultDetailsPanel.scrollTop = 0;

  window.requestAnimationFrame(() => {
    resultDetailsBackdrop.classList.add(RESULT_DETAILS_OPEN_CLASS);
    const [firstFocusable] = getFocusableElements(resultDetailsPanel);
    focusElementWithoutTooltip(firstFocusable || resultDetailsPanel);
  });
}

function buildAiSourcesDetailsListMarkup(sources) {
  if (!sources.length) {
    return `
      <li class="result-details-source-row">
        <p class="result-details-source-snippet">No AI sources are available for this overview.</p>
      </li>
    `;
  }

  return sources
    .map((source, index) => {
      const title = String(source?.title || "Source").trim();
      const sourceLabel = getAiSummarySourceName(source) || getAiSummarySourceLabel(source) || getResultHost(source) || "Source";
      const displayUrl = getResultDisplayUrl(source);
      const snippet = String(source?.content || "").replace(/\s+/g, " ").trim()
        || "Open this source to see what informed the AI overview.";
      const meta = [sourceLabel, displayUrl].filter(Boolean).join(" · ");

      return `
        <li class="result-details-source-row">
          <div class="result-details-source-row-head">
            <span class="result-details-source-index">${index + 1}</span>
            <p class="result-details-source-row-title">${escapeHtml(title)}</p>
          </div>
          ${meta ? `<p class="result-details-source-row-meta">${escapeHtml(meta)}</p>` : ""}
          <p class="result-details-source-snippet">${escapeHtml(snippet)}</p>
          <button
            type="button"
            class="secondary-button result-details-source-card-button"
            data-ai-source-details-index="${index}"
            aria-label="View ${escapeHtml(title)} in this card"
            aria-haspopup="dialog"
          >
            View in card
          </button>
        </li>
      `;
    })
    .join("");
}

function openAiSourceDetailsByIndex(index, trigger = null) {
  const source = getAiSummarySidebarSources()[index] || null;
  if (!source) {
    return false;
  }

  const rememberedTrigger = trigger instanceof HTMLElement && resultDetailsPanel?.contains(trigger)
    ? lastResultDetailsTrigger
    : trigger;
  openResultDetails(source, rememberedTrigger);
  return true;
}

function openAiSourcesDetails(trigger = null) {
  if (!resultDetailsBackdrop || !resultDetailsPanel) {
    return;
  }

  hideAppTooltip();
  closeChat({ restoreFocus: false, immediate: true });
  closePanels();
  closeImagePreview({ restoreFocus: false });
  closeResultDetails({ restoreFocus: false, immediate: true });

  const modelLabel = getAiSummaryModelLabel() || "Configured model";
  const sources = getAiSummarySidebarSources();
  const sourceCount = sources.length;
  const searchLabel = String(state.query || "").trim() || "your search";
  const sourceText = sourceCount === 1 ? "1 source" : `${sourceCount || 0} sources`;
  const aboutText = `This overview was generated with the help of AI using your configured local model. It is supported by ${sourceText} gathered from your search results. AI can make mistakes, so double-check responses and source pages.`;
  const facts = [
    { label: "Type", value: getAiModeForQuery() === "qa" ? "AI answer" : "AI overview" },
    { label: "Model", value: modelLabel },
    { label: "Sources", value: sourceText },
    { label: "Search", value: searchLabel },
  ];

  lastResultDetailsTrigger = trigger instanceof HTMLElement
    ? trigger
    : (document.activeElement instanceof HTMLElement ? document.activeElement : null);

  if (lastResultDetailsTrigger instanceof HTMLElement) {
    lastResultDetailsTrigger.setAttribute("aria-expanded", "true");
  }

  resultDetailsPanel.dataset.variant = "ai-sources";
  setResultDetailsSectionTitles({
    about: "About these sources",
    list: "All sources",
  });
  setResultDetailsListMode("sources");

  if (resultDetailsSourceIcon instanceof HTMLElement) {
    resultDetailsSourceIcon.innerHTML = `
      <svg class="result-details-source-sparkle" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.25 13.72 8.5 19 10.22 13.72 11.94 12 17.25 10.28 11.94 5 10.22 10.28 8.5 12 3.25Z"></path>
        <path d="M18.5 14.5 19.18 16.32 21 17 19.18 17.68 18.5 19.5 17.82 17.68 16 17 17.82 16.32 18.5 14.5Z"></path>
      </svg>
    `;
  }
  if (resultDetailsSourceName instanceof HTMLElement) {
    resultDetailsSourceName.textContent = "AI Overview";
  }
  if (resultDetailsSourceMeta instanceof HTMLElement) {
    resultDetailsSourceMeta.textContent = sourceCount
      ? `${sourceText} studied for "${searchLabel}"`
      : `Sources for "${searchLabel}"`;
    resultDetailsSourceMeta.hidden = false;
  }
  if (resultDetailsTitle instanceof HTMLElement) {
    resultDetailsTitle.textContent = "Sources";
  }
  if (resultDetailsUrl instanceof HTMLElement) {
    resultDetailsUrl.textContent = "";
    resultDetailsUrl.hidden = true;
  }
  if (resultDetailsSnippet instanceof HTMLElement) {
    resultDetailsSnippet.textContent = "";
    resultDetailsSnippet.hidden = true;
  }
  if (resultDetailsOpen instanceof HTMLAnchorElement) {
    resultDetailsOpen.hidden = true;
    resultDetailsOpen.removeAttribute("href");
  }
  if (resultDetailsCopy instanceof HTMLButtonElement) {
    delete resultDetailsCopy.dataset.url;
    resultDetailsCopy.hidden = true;
  }
  if (resultDetailsFacts instanceof HTMLElement) {
    resultDetailsFacts.innerHTML = facts
      .map((fact) => `
        <div class="result-details-fact">
          <p class="result-details-fact-label">${escapeHtml(fact.label)}</p>
          <p class="result-details-fact-value">${escapeHtml(fact.value)}</p>
        </div>
      `)
      .join("");
  }
  if (resultDetailsAbout instanceof HTMLElement) {
    resultDetailsAbout.textContent = sourceCount
      ? `${aboutText} Select a source to inspect it in this card.`
      : aboutText;
    resultDetailsAbout.hidden = false;
  }
  if (resultDetailsList instanceof HTMLElement) {
    resultDetailsList.innerHTML = buildAiSourcesDetailsListMarkup(sources);
  }

  setResultDetailsStatus("");
  window.clearTimeout(resultDetailsCloseTimer);
  resultDetailsCloseTimer = 0;
  resultDetailsBackdrop.classList.remove(RESULT_DETAILS_OPEN_CLASS);
  syncResultDetailsPanelTop();
  resultDetailsBackdrop.hidden = false;
  document.body.classList.add("has-result-details");
  resultDetailsPanel.scrollTop = 0;

  window.requestAnimationFrame(() => {
    resultDetailsBackdrop.classList.add(RESULT_DETAILS_OPEN_CLASS);
    const [firstFocusable] = getFocusableElements(resultDetailsPanel);
    focusElementWithoutTooltip(firstFocusable || resultDetailsPanel);
  });
}

function openImagePreview(result, trigger = null, index = -1) {
  if (!imagePreviewBackdrop || !imagePreviewPanel || !result) {
    return;
  }

  hideAppTooltip();
  closeChat({ restoreFocus: false, immediate: true });
  closeResultDetails({ restoreFocus: false, immediate: true });

  const previewUrl = result.image_url || result.thumbnail_url || result.img_src || "";
  const hostLabel = result.source || result.domain || getHostLabel(result.url) || "Source";
  const details = [result.resolution, result.engine].filter(Boolean).join(" · ") || "Image result";
  const pageUrl = String(result.url || "").trim();
  const snippet = String(result.content || "").trim();

  lastImagePreviewTrigger = trigger instanceof HTMLElement
    ? trigger
    : (document.activeElement instanceof HTMLElement ? document.activeElement : null);
  const triggerIndex = trigger instanceof HTMLElement
    ? Number(trigger.getAttribute("data-image-preview-index") || "-1")
    : -1;
  activeImagePreviewIndex = Number.isInteger(index) && index >= 0
    ? index
    : (Number.isInteger(triggerIndex) ? triggerIndex : -1);

  if (imagePreviewStage) {
    imagePreviewStage.innerHTML = previewUrl
      ? `<img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(result.title || "Preview image")}" class="image-preview-image">`
      : '<div class="image-result-placeholder">Preview unavailable</div>';
  }
  if (imagePreviewTitle) {
    imagePreviewTitle.textContent = result.title || "Image preview";
  }
  if (imagePreviewSite) {
    imagePreviewSite.textContent = hostLabel;
  }
  if (imagePreviewDetails) {
    imagePreviewDetails.textContent = details;
  }
  if (imagePreviewUrl) {
    imagePreviewUrl.textContent = pageUrl;
    imagePreviewUrl.hidden = !pageUrl;
  }
  if (imagePreviewSnippet) {
    imagePreviewSnippet.textContent = snippet;
    imagePreviewSnippet.hidden = !snippet;
  }
  if (imagePreviewOpen instanceof HTMLAnchorElement) {
    if (pageUrl) {
      imagePreviewOpen.href = pageUrl;
      imagePreviewOpen.hidden = false;
    } else {
      imagePreviewOpen.hidden = true;
      imagePreviewOpen.removeAttribute("href");
    }
  }

  syncImagePreviewPanelTop();
  showImagePreviewSidebar();
  imagePreviewBackdrop.hidden = false;
  document.body.classList.add("has-image-preview");
  imagePreviewPanel.scrollTop = 0;

  window.requestAnimationFrame(() => {
    syncImagePreviewPanelTop();
    const [firstFocusable] = getFocusableElements(imagePreviewPanel);
    focusElementWithoutTooltip(firstFocusable || imagePreviewPanel);
  });
}

function getPreferencesReloadConfirmation(form = pendingPreferenceForm) {
  if (form instanceof HTMLFormElement) {
    const scopedConfirmation = form.querySelector("[data-preferences-reload-confirmation]");
    if (scopedConfirmation instanceof HTMLElement) {
      return scopedConfirmation;
    }
  }

  return document.querySelector("[data-preferences-reload-confirmation]");
}

function hidePreferencesReloadConfirmation({ form = null, restoreFocus = false } = {}) {
  const confirmations = form instanceof HTMLFormElement
    ? [getPreferencesReloadConfirmation(form)]
    : Array.from(document.querySelectorAll("[data-preferences-reload-confirmation]"));

  confirmations.forEach((confirmation) => {
    if (!(confirmation instanceof HTMLElement)) {
      return;
    }
    confirmation.hidden = true;
  });

  const focusForm = form instanceof HTMLFormElement ? form : pendingPreferenceForm;
  pendingPreferenceSave = null;
  pendingPreferenceForm = null;

  if (restoreFocus && focusForm instanceof HTMLFormElement) {
    const submitButton = focusForm.querySelector('button[type="submit"]');
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.focus();
    }
  }
}

function showPreferencesReloadConfirmation(form, nextPreferences) {
  const confirmation = getPreferencesReloadConfirmation(form);
  if (!(confirmation instanceof HTMLElement)) {
    return false;
  }

  pendingPreferenceSave = normalizePreferenceSnapshot(nextPreferences);
  pendingPreferenceForm = form instanceof HTMLFormElement ? form : null;
  confirmation.hidden = false;

  window.requestAnimationFrame(() => {
    const continueButton = confirmation.querySelector("[data-confirm-preferences-save]");
    if (continueButton instanceof HTMLButtonElement) {
      continueButton.focus();
    }
  });

  return true;
}

function savePreferenceChanges(nextPreferences) {
  state.preferences = normalizePreferenceSnapshot(nextPreferences);
  state.zipAnchor = null;
  clearTemporaryServicePauseRelease("search");
  clearTemporaryServicePauseRelease("ai");
  state.searchServiceTemporarilyDisabled = false;
  state.searchServiceFailureCount = 0;
  state.aiTemporarilyDisabledBySystem = false;
  state.aiServiceFailureCount = 0;
  state.infiniteScroll.reentryRequired = false;
  savePreferences();
  if (shouldPersistChatHistory(state.preferences)) {
    saveChatState();
  } else {
    removeStoredChatState();
  }
  syncChatHistoryStorageToggle();
}

function openPanel(name, trigger = null) {
  if (!panelBackdrop) {
    return;
  }

  hideAppTooltip();
  closeChat({ restoreFocus: false, immediate: true });
  closeResultDetails({ restoreFocus: false, immediate: true });
  closeImagePreview({ restoreFocus: false });
  if (name === "preferences" || name === "footer-settings") {
    hidePreferencesReloadConfirmation();
    populatePreferenceForm();
  }
  lastPanelTrigger = trigger instanceof HTMLElement
    ? trigger
    : (document.activeElement instanceof HTMLElement ? document.activeElement : null);
  panelBackdrop.hidden = false;
  document.body.classList.add("has-open-panel");
  setPanelTriggerState(name);
  Array.from(panelBackdrop.querySelectorAll("[data-panel]")).forEach((panel) => {
    panel.hidden = panel.getAttribute("data-panel") !== name;
  });

  window.requestAnimationFrame(() => {
    const visiblePanel = getVisiblePanel();
    if (!(visiblePanel instanceof HTMLElement)) {
      return;
    }

    const [firstFocusable] = getFocusableElements(visiblePanel);
    focusElementWithoutTooltip(firstFocusable || visiblePanel);
  });
}

function closePanels() {
  if (!panelBackdrop) {
    return;
  }

  hidePreferencesReloadConfirmation();
  panelBackdrop.hidden = true;
  document.body.classList.remove("has-open-panel");
  setPanelTriggerState("");
  Array.from(panelBackdrop.querySelectorAll("[data-panel]")).forEach((panel) => {
    panel.hidden = true;
  });

  if (lastPanelTrigger instanceof HTMLElement) {
    lastPanelTrigger.focus();
  }
  lastPanelTrigger = null;
}

function hydrateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";
  const rawView = params.get("view");
  const rawNewsTopic = params.get("newsTopic");
  const rawNewsBaseQuery = params.get("newsBaseQuery") || "";
  const rawLiteralSearch = params.get("literal");

  const provider = params.get("provider");
  const safesearch = params.get("safesearch");
  const language = params.get("language");
  const timeRange = params.get("time_range");
  const engines = params.get("engines");
  const urlView = rawView ? normalizeResultsView(rawView) : getEffectivePreferences().defaultView;

  if (provider) {
    state.preferences.provider = provider;
  }
  if (safesearch) {
    state.preferences.safesearch = safesearch;
  }
  if (language !== null) {
    state.preferences.language = language;
  }
  if (timeRange !== null) {
    state.preferences[getTimeRangePreferenceKeyForView(urlView)] = normalizeTimeRangePreference(timeRange);
  }
  if (engines !== null) {
    state.preferences[getEnginesPreferenceKeyForView(urlView)] = normalizeEnginesPreference(engines);
  }
  state.newsTopic = normalizeNewsTopic(rawNewsTopic || state.newsTopic);
  state.newsBaseQuery = String(rawNewsBaseQuery || query || "").trim();

  populatePreferenceForm();
  renderFilters();
  applyThemePreference();

  if (query) {
    runSearch({
      query,
      page: 1,
      view: urlView,
      newsTopic: state.newsTopic,
      newsBaseQuery: state.newsBaseQuery,
      literalSearch: rawLiteralSearch === "1",
    });
  } else {
    setResultsState("idle");
    syncQueryInputs("");
    updateDocumentMetadata();
    state.literalSearch = false;
    state.newsBaseQuery = "";
    setActiveResultsView(getEffectivePreferences().defaultView);
    setView("home");
    renderSummary(null);
    renderFilters();
    renderRefinements();
    renderPagination();
  }
}

searchForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector('input[name="q"]');
    const isHomeForm = form.getAttribute("data-search-form") === "home";
    const submittedQuery = String(input?.value || "").trim();
    if (!submittedQuery) {
      hideAutocompletePanels({ clear: true });
      return;
    }

    const nextView = state.query
      ? state.activeView
      : (isHomeForm ? state.pendingView : getEffectivePreferences().defaultView);
    const nextNewsTopic = nextView === "news" ? DEFAULT_NEWS_TOPIC : state.newsTopic;
    runSearch({
      query: submittedQuery,
      page: 1,
      view: nextView,
      newsTopic: nextNewsTopic,
      newsBaseQuery: submittedQuery,
      literalSearch: false,
    });
    hideAutocompletePanels({ clear: true });
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey) {
    markAutocompleteKeyboardFocusIntent();
  }
}, true);

searchInputs.forEach((input) => {
  input.addEventListener("pointerdown", () => {
    armAutocompleteForInput(input);
  });

  input.addEventListener("focus", () => {
    state.autocompleteActiveInput = input;
    updateSearchClearButtons();
    if (shouldKeepAutocompleteQuietForFocus(input)) {
      hideAutocompletePanels({ clear: true });
      return;
    }

    if (!isAutocompleteArmedForInput(input) && consumeAutocompleteKeyboardFocusIntent()) {
      armAutocompleteForInput(input, { requestIfReady: false });
    }

    if (isAutocompleteArmedForInput(input) && input.value.trim().length >= getAutocompleteMinChars()) {
      requestAutocomplete(input);
    } else {
      hideAutocompletePanels({ clear: true });
    }
  });

  input.addEventListener("input", () => {
    requestAutocomplete(input);
  });

  input.addEventListener("search", () => {
    requestAutocomplete(input);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      disarmAutocomplete(input);
      hideAutocompletePanels({ clear: true });
      return;
    }

    if (event.key !== "ArrowDown") {
      return;
    }

    const panel = getAutocompletePanelForInput(input);
    const firstSuggestion = panel?.querySelector?.("[data-autocomplete-query]");
    if (!(firstSuggestion instanceof HTMLElement) || panel.hidden) {
      if (input.value.trim().length >= getAutocompleteMinChars()) {
        event.preventDefault();
        armAutocompleteForInput(input);
      }
      return;
    }

    event.preventDefault();
    firstSuggestion.focus();
  });
});

searchClearButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const form = button.closest("[data-search-form]");
    const input = form?.querySelector?.('input[name="q"]');
    syncQueryInputs("");
    clearSuggestions();
    if (input instanceof HTMLInputElement) {
      focusSearchInput(input);
    }
  });
});

autoLoadButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toggleAutoLoadResultsPreference();
  });
});

aiToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toggleAiEnabledPreference();
  });
});

chatToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (isChatOpen()) {
      closeChat();
      return;
    }
    openChat(button);
  });
});

chatCloseButton?.addEventListener("click", () => {
  setChatFullscreen(false);
  closeChat();
});

chatMinimizeButton?.addEventListener("click", () => {
  closeChat();
});

chatMenuButton?.addEventListener("click", () => {
  toggleChatMenu();
});

chatClearButton?.addEventListener("click", () => {
  deleteActiveChat();
  closeChatMenu();
});

chatFullscreenButton?.addEventListener("click", () => {
  toggleChatFullscreen();
});

chatNewButton?.addEventListener("click", () => {
  createNewChat();
});

chatRegenerateButton?.addEventListener("click", () => {
  regenerateLastChatAnswer();
  closeChatMenu();
});

chatCopyConversationButton?.addEventListener("click", () => {
  copyActiveChatConversation();
  closeChatMenu();
});

chatExportButton?.addEventListener("click", () => {
  exportActiveChatConversation();
  closeChatMenu();
});

chatStopButton?.addEventListener("click", () => {
  stopChatGeneration();
});

chatModelSelect?.addEventListener("change", () => {
  if (!(chatModelSelect instanceof HTMLSelectElement)) {
    return;
  }
  const session = getActiveChatSession();
  session.model = normalizeAiModelPreference(chatModelSelect.value);
  touchChatSession(session);
  renderChatSessions();
});

chatContextToggle?.addEventListener("change", () => {
  if (!(chatContextToggle instanceof HTMLInputElement)) {
    return;
  }
  const session = getActiveChatSession();
  session.useSearchContext = chatContextToggle.checked;
  touchChatSession(session);
  renderChatSessions();
});

chatHistoryStorageToggle?.addEventListener("change", () => {
  if (!(chatHistoryStorageToggle instanceof HTMLInputElement)) {
    return;
  }
  setChatHistoryStoragePreference(chatHistoryStorageToggle.checked ? "browser" : "memory", { announce: true });
});

chatSessionList?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const sessionButton = target.closest("[data-chat-session-id]");
  if (!(sessionButton instanceof HTMLElement)) {
    return;
  }
  activateChatSession(sessionButton.getAttribute("data-chat-session-id") || "");
  closeChatMenu();
});

chatForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  sendChatMessage();
});

chatInput?.addEventListener("input", () => {
  clampChatInputValue();
  syncChatInputHeight();
});

chatInput?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.shiftKey || event.isComposing) {
    return;
  }

  event.preventDefault();
  sendChatMessage();
});

searchBoxes.forEach((searchBox) => {
  if (!(searchBox instanceof HTMLElement)) {
    return;
  }

  searchBox.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest("button, a, input, select, textarea")) {
      return;
    }

    const input = searchBox.querySelector('input[name="q"]');
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    event.preventDefault();
    focusSearchInput(input, { suppressAutocomplete: false });
  });
});

zipInputs.forEach((input) => {
  input.addEventListener("input", () => {
    const normalizedValue = normalizeZipCode(input.value);
    if (input.value !== normalizedValue) {
      input.value = normalizedValue;
    }

    input.setCustomValidity("");
    syncZipInputs(normalizedValue, { source: input });
    clearZipStatus({ form: input.closest("[data-zip-form]") });
  });
});

preferencesForm?.querySelector('input[name="zipCode"]')?.addEventListener("input", (event) => {
  const target = event.currentTarget;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  const normalizedValue = normalizeZipCode(target.value);
  if (target.value !== normalizedValue) {
    target.value = normalizedValue;
  }

  target.setCustomValidity("");
});

zipToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    toggleZipEditor(toggle.closest("[data-zip-shell]"));
  });
});

function handleNewsTopicSelection(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !state.query) {
    return;
  }

  const button = target.closest("[data-news-topic]");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const nextTopic = button.getAttribute("data-news-topic") || state.newsTopic;
  const nextBaseQuery = getNewsBaseQuery(state.query);
  const visibleQuery = isGeneratedNewsTopicQuery(state.query, state.newsTopic, nextBaseQuery)
    ? nextBaseQuery
    : state.query;
  runSearch({
    query: visibleQuery,
    page: 1,
    view: "news",
    newsTopic: nextTopic,
    newsBaseQuery: nextBaseQuery,
    literalSearch: state.literalSearch,
  });
}

newsTopicStrip?.addEventListener("click", handleNewsTopicSelection);

resultsViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!state.query) {
      return;
    }

    const nextView = button.getAttribute("data-results-view") || "general";
    const preserveTopicQuery = isGeneratedNewsTopicQuery(state.query, state.newsTopic, state.newsBaseQuery);
    const shouldRestoreBaseQuery = isGeneratedNewsTopicState();
    const nextBaseQuery = preserveTopicQuery
      ? getNewsBaseQuery(state.query)
      : String(state.query || "").trim();
    const nextNewsTopic = nextView === "news"
      ? (shouldRestoreBaseQuery ? DEFAULT_NEWS_TOPIC : (preserveTopicQuery ? state.newsTopic : DEFAULT_NEWS_TOPIC))
      : state.newsTopic;
    runSearch({
      query: nextView === "news"
        ? getNewsTopicDisplayQuery(nextNewsTopic, nextBaseQuery)
        : (shouldRestoreBaseQuery ? nextBaseQuery : state.query),
      page: 1,
      view: nextView,
      newsTopic: nextNewsTopic,
      newsBaseQuery: nextBaseQuery,
      literalSearch: state.literalSearch,
    });
  });
});

luckyButton?.addEventListener("click", () => {
  runLuckySearch();
});

zipForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const zipInput = form.querySelector("[data-zip-input]");
    if (!(zipInput instanceof HTMLInputElement)) {
      return;
    }

    const nextZipCode = normalizeZipCode(zipInput.value);
    if (!isValidZipCode(nextZipCode)) {
      zipInput.value = getZipCodeBias();
      zipInput.setCustomValidity("Enter a 5-digit ZIP code.");
      zipInput.reportValidity();
      zipInput.focus();
      setZipStatus("Enter a valid 5-digit ZIP code.", {
        form,
        tone: "error",
      });
      return;
    }

    zipInput.setCustomValidity("");
    state.preferences = {
      ...state.preferences,
      zipCode: nextZipCode,
    };
    state.zipAnchor = null;
    savePreferences();
    syncZipInputs(nextZipCode, { source: zipInput });
    clearZipStatus({ form });
    closeZipEditors();
    renderFilters();

    if (state.query) {
      runSearch({
        query: state.query,
        page: 1,
        view: state.activeView,
        literalSearch: state.literalSearch,
      });
    }
  });
});

function handlePreferenceFormSubmit(form, event) {
  event.preventDefault();

  const zipInput = form.querySelector('input[name="zipCode"]');
  const nextPreferences = getSubmittedPreferences(form);
  const nextZipCode = nextPreferences.zipCode;
  if (zipInput instanceof HTMLInputElement && !isValidZipCode(nextZipCode)) {
    zipInput.value = getZipCodeBias();
    zipInput.setCustomValidity("Enter a 5-digit ZIP code.");
    zipInput.reportValidity();
    zipInput.focus();
    return;
  }

  if (zipInput instanceof HTMLInputElement) {
    zipInput.setCustomValidity("");
  }

  if (preferencesAreEqual(nextPreferences, getEffectivePreferences())) {
    hidePreferencesReloadConfirmation({ form });
    closePanels();
    return;
  }

  if (!showPreferencesReloadConfirmation(form, nextPreferences)) {
    savePreferenceChanges(nextPreferences);
    window.location.reload();
  }
}

function getDefaultedPreferencesForForm(form) {
  const nextPreferences = { ...getEffectivePreferences() };
  const defaults = getDefaults();

  getPreferenceFormFieldNames(form).forEach((name) => {
    nextPreferences[name] = defaults[name];
  });

  return normalizePreferenceSnapshot(nextPreferences);
}

[preferencesForm, settingsForm].forEach((form) => {
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  form.addEventListener("submit", (event) => {
    handlePreferenceFormSubmit(form, event);
  });

  form.addEventListener("input", () => {
    hidePreferencesReloadConfirmation({ form });
  });

  form.addEventListener("change", () => {
    hidePreferencesReloadConfirmation({ form });
  });
});

document.querySelectorAll("[data-confirm-preferences-save]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!pendingPreferenceSave) {
      hidePreferencesReloadConfirmation({ restoreFocus: true });
      return;
    }

    savePreferenceChanges(pendingPreferenceSave);
    window.location.reload();
  });
});

document.querySelectorAll("[data-cancel-preferences-save]").forEach((button) => {
  button.addEventListener("click", () => {
    hidePreferencesReloadConfirmation({ restoreFocus: true });
  });
});

document.querySelectorAll("[data-reset-preferences]").forEach((button) => {
  button.addEventListener("click", () => {
    const form = button.closest("form");
    hidePreferencesReloadConfirmation({ form });
    const resetsDefaultView = !(form instanceof HTMLFormElement) || formHasPreferenceField(form, "defaultView");
    const nextPreferences = form instanceof HTMLFormElement
      ? getDefaultedPreferencesForForm(form)
      : getDefaults();

    clearTemporaryServicePauseRelease("search");
    clearTemporaryServicePauseRelease("ai");
    state.preferences = nextPreferences;
    state.zipAnchor = null;
    state.searchServiceTemporarilyDisabled = false;
    state.searchServiceFailureCount = 0;
    state.aiTemporarilyDisabledBySystem = false;
    state.aiServiceFailureCount = 0;
    state.infiniteScroll.reentryRequired = false;
    savePreferences();
    if (shouldPersistChatHistory(state.preferences)) {
      saveChatState();
    } else {
      removeStoredChatState();
    }
    applyThemePreference();
    populatePreferenceForm();
    syncAutoLoadButtons();
    syncAiToggleButtons();
    syncChatHistoryStorageToggle();
    updateCopyFromHealth();
    renderFilters();

    if (state.query) {
      runSearch({
        query: state.query,
        page: 1,
        view: resetsDefaultView ? state.preferences.defaultView : state.activeView,
        literalSearch: state.literalSearch,
      });
    } else if (resetsDefaultView) {
      setPendingHomeView(state.preferences.defaultView);
      setActiveResultsView(state.preferences.defaultView);
      syncUrl();
    } else {
      syncUrl();
    }
  });
});

document.querySelectorAll("[data-open-panel]").forEach((button) => {
  button.addEventListener("click", () => {
    openPanel(button.getAttribute("data-open-panel"), button);
  });
});

document.querySelectorAll("[data-close-panel]").forEach((button) => {
  button.addEventListener("click", closePanels);
});

document.querySelectorAll("[data-clear-local-data]").forEach((button) => {
  button.addEventListener("click", clearLocalAppData);
});

panelBackdrop?.addEventListener("click", (event) => {
  if (event.target === panelBackdrop) {
    closePanels();
  }
});

imagePreviewBackdrop?.addEventListener("click", (event) => {
  if (event.target === imagePreviewBackdrop) {
    closeImagePreview();
  }
});

resultDetailsBackdrop?.addEventListener("click", (event) => {
  if (event.target === resultDetailsBackdrop) {
    closeResultDetails();
  }
});

window.addEventListener("resize", () => {
  syncResultsRightRailTop();
  syncResultsFloatingPanelBounds();
  requestResultsFloatingPanelBoundsSync();
  if (getVisibleImagePreview()) {
    syncImagePreviewPanelTop();
  }
  if (getVisibleResultDetails()) {
    syncResultDetailsPanelTop();
    requestResultDetailsPanelSync();
  }
  requestImageTopicStripFit();
  syncAiSectionLayout();
  requestInfiniteScrollCheck();
});

window.addEventListener("scroll", () => {
  syncResultsFloatingPanelBounds();
  requestResultsFloatingPanelBoundsSync();
  if (getVisibleImagePreview()) {
    syncImagePreviewPanelTop();
  }
  if (getVisibleResultDetails()) {
    syncResultDetailsPanelTop();
    requestResultDetailsPanelSync();
  }
  requestInfiniteScrollCheck();
}, { passive: true });

if (typeof window.ResizeObserver === "function" && resultsShell instanceof HTMLElement) {
  const resultDetailsBoundsObserver = new ResizeObserver(() => {
    requestResultsFloatingPanelBoundsSync();
    if (getVisibleResultDetails()) {
      requestResultDetailsPanelSync();
    }
  });
  resultDetailsBoundsObserver.observe(resultsShell);
}

document.querySelectorAll("[data-close-image-preview]").forEach((button) => {
  button.addEventListener("click", () => {
    closeImagePreview();
  });
});

document.querySelectorAll("[data-close-result-details]").forEach((button) => {
  button.addEventListener("click", () => {
    closeResultDetails();
  });
});

resultDetailsCopy?.addEventListener("click", async () => {
  const url = resultDetailsCopy.dataset.url || "";
  if (!url) {
    return;
  }

  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard unavailable");
    }

    await navigator.clipboard.writeText(url);
    setResultDetailsStatus("Link copied.", { tone: "success" });
  } catch {
    setResultDetailsStatus("Could not copy the link.", { tone: "error" });
  }
});

resultDetailsPanel?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const aiSourceDetails = target.closest("[data-ai-source-details-index]");
  if (!(aiSourceDetails instanceof HTMLButtonElement)) {
    return;
  }

  const index = Number(aiSourceDetails.getAttribute("data-ai-source-details-index") || "-1");
  openAiSourceDetailsByIndex(index, aiSourceDetails);
});

resultsStage?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const aiSectionToggle = target.closest("[data-ai-section-toggle]");
  if (aiSectionToggle instanceof HTMLButtonElement && state.activeView === "general") {
    state.aiSectionExpanded = !state.aiSectionExpanded;
    state.aiSourcesExpanded = state.aiSectionExpanded;
    renderAiSummaryUpdate();
    return;
  }

  const mapSelectTrigger = target.closest("[data-map-select-index]");
  if (mapSelectTrigger instanceof HTMLButtonElement && state.activeView === "maps") {
    const index = Number(mapSelectTrigger.getAttribute("data-map-select-index") || "-1");
    selectMapResultByIndex(index);
    return;
  }

  const placeStageTrigger = target.closest("[data-place-stage-index]");
  if (placeStageTrigger instanceof HTMLButtonElement && state.activeView === "general") {
    const index = Number(placeStageTrigger.getAttribute("data-place-stage-index") || "-1");
    selectPromotedPlaceByIndex(index);
    return;
  }

  const imageTopicTrigger = target.closest("[data-image-topic-query]");
  if (imageTopicTrigger instanceof HTMLButtonElement) {
    runSearch({
      query: imageTopicTrigger.getAttribute("data-image-topic-query") || state.query,
      page: 1,
      view: "images",
      literalSearch: false,
    });
    return;
  }

  const refinementTrigger = target.closest("[data-refinement-query]");
  if (refinementTrigger instanceof HTMLButtonElement) {
    runRefinementSearchFromButton(refinementTrigger);
    return;
  }

  const trigger = target.closest("[data-stage-action]");
  if (!(trigger instanceof HTMLButtonElement)) {
    return;
  }

  const action = trigger.getAttribute("data-stage-action");
  if (action === "maps") {
    runSearch({
      query: state.query,
      page: 1,
      view: "maps",
      literalSearch: state.literalSearch,
    });
    return;
  }

});

resultsRoot?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const aiSectionToggle = target.closest("[data-ai-section-toggle]");
  if (aiSectionToggle instanceof HTMLButtonElement && state.activeView === "general") {
    state.aiSectionExpanded = !state.aiSectionExpanded;
    state.aiSourcesExpanded = state.aiSectionExpanded;
    renderAiSummaryUpdate();
    return;
  }

  const mapSelectTrigger = target.closest("[data-map-select-index]");
  if (mapSelectTrigger instanceof HTMLButtonElement && state.activeView === "maps") {
    const index = Number(mapSelectTrigger.getAttribute("data-map-select-index") || "-1");
    selectMapResultByIndex(index, { focusStage: true });
    return;
  }

  const detailsTrigger = target.closest("[data-result-details-index]");
  if (detailsTrigger instanceof HTMLButtonElement && state.activeView === "general") {
    const index = Number(detailsTrigger.getAttribute("data-result-details-index") || "-1");
    if (!Number.isInteger(index) || index < 0 || index >= state.results.length) {
      return;
    }

    if (getVisibleResultDetails() && lastResultDetailsTrigger === detailsTrigger) {
      closeResultDetails();
      return;
    }

    openResultDetails(state.results[index], detailsTrigger);
    return;
  }

  const trigger = target.closest("[data-image-preview-index]");
  if (!(trigger instanceof HTMLButtonElement) || state.activeView !== "images") {
    return;
  }

  const index = Number(trigger.getAttribute("data-image-preview-index") || "-1");
  if (!Number.isInteger(index) || index < 0 || index >= state.results.length) {
    return;
  }

  if (getVisibleImagePreview() && activeImagePreviewIndex === index) {
    closeImagePreview();
    return;
  }

  openImagePreview(state.results[index], trigger, index);
});

resultsRoot?.addEventListener("load", (event) => {
  if (event.target instanceof HTMLImageElement) {
    syncAiSectionLayout();
  }
}, true);

aiSourcesList?.addEventListener("load", (event) => {
  if (event.target instanceof HTMLImageElement) {
    syncAiSectionLayout();
  }
}, true);

resultsSidebar?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const aiSourcesToggle = target.closest("[data-ai-sources-toggle]");
  if (aiSourcesToggle instanceof HTMLButtonElement) {
    state.aiSourcesExpanded = !state.aiSourcesExpanded;
    renderGeneralSidebar();
    return;
  }

  const aiSourceDetails = target.closest("[data-ai-source-details-index]");
  if (aiSourceDetails instanceof HTMLButtonElement) {
    const index = Number(aiSourceDetails.getAttribute("data-ai-source-details-index") || "-1");
    if (getVisibleResultDetails() && lastResultDetailsTrigger === aiSourceDetails) {
      closeResultDetails();
      return;
    }

    if (!openAiSourceDetailsByIndex(index, aiSourceDetails)) {
      return;
    }

    return;
  }

  const aiSourcesDetails = target.closest("[data-ai-sources-details]");
  if (aiSourcesDetails instanceof HTMLButtonElement) {
    if (getVisibleResultDetails() && lastResultDetailsTrigger === aiSourcesDetails) {
      closeResultDetails();
      return;
    }

    openAiSourcesDetails(aiSourcesDetails);
  }
});

activeFilters?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const clearTrigger = target.closest("[data-filter-clear-action]");
  if (clearTrigger instanceof HTMLElement) {
    const clearAction = clearTrigger.getAttribute("data-filter-clear-action");
    if (clearAction === "local-literal") {
      runSearch({
        query: state.query,
        page: 1,
        view: state.activeView,
        literalSearch: true,
      });
      return;
    }
  }

  const filterButton = target.closest("[data-filter-action]");
  if (!(filterButton instanceof HTMLButtonElement)) {
    return;
  }

  const action = filterButton.getAttribute("data-filter-action");
  if (action === "zip") {
    openZipEditor({
      zipShell: getPreferredZipShell(),
      focus: true,
      reveal: shell?.dataset.view === "results",
    });
    return;
  }

  const defaults = getDefaults();
  if (action === "clear-language") {
    updateSearchPreferences({
      language: defaults.language,
    });
    return;
  }
  if (action === "clear-time-range") {
    const timeRangeKey = getTimeRangePreferenceKeyForView(state.activeView);
    updateSearchPreferences({
      [timeRangeKey]: defaults[timeRangeKey],
    });
    return;
  }
  if (action === "clear-engines") {
    const enginesKey = getEnginesPreferenceKeyForView(state.activeView);
    updateSearchPreferences({
      [enginesKey]: defaults[enginesKey],
    });
    return;
  }
  if (action === "clear-safesearch") {
    updateSearchPreferences({
      safesearch: defaults.safesearch,
    });
    return;
  }
  if (action === "clear-search-limits") {
    const timeRangeKey = getTimeRangePreferenceKeyForView(state.activeView);
    const enginesKey = getEnginesPreferenceKeyForView(state.activeView);
    updateSearchPreferences({
      language: defaults.language,
      [timeRangeKey]: defaults[timeRangeKey],
      [enginesKey]: defaults[enginesKey],
      safesearch: defaults.safesearch,
    });
  }
});

refinementRail?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const button = target.closest("[data-refinement-query]");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  runRefinementSearchFromButton(button);
});

resultsCorrection?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const button = target.closest("[data-query-suggestion]");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  runSearch({
    query: button.getAttribute("data-query-suggestion") || state.query,
    page: 1,
    view: state.activeView,
    literalSearch: button.getAttribute("data-query-literal") === "true",
  });
});

document.addEventListener("keydown", (event) => {
  const visibleImagePreview = getVisibleImagePreview();
  const visibleResultDetails = getVisibleResultDetails();
  const visiblePanel = getVisiblePanel();
  const visibleChat = getVisibleChat();
  const visibleAutocompletePanel = autocompletePanels.find((panel) => (
    panel instanceof HTMLElement && !panel.hidden
  ));
  const activeOverlay = visibleResultDetails
    || visiblePanel
    || (visibleChat && (state.chatFullscreen || visibleChat.contains(document.activeElement)) ? visibleChat : null);

  if (event.key === "Escape") {
    if (visibleChat && (state.chatFullscreen || visibleChat.contains(document.activeElement))) {
      if (isChatMenuOpen()) {
        closeChatMenu();
        chatMenuButton?.focus?.();
        return;
      }
      if (state.chatFullscreen) {
        setChatFullscreen(false);
        return;
      }
      closeChat();
      return;
    }

    if (visibleAutocompletePanel) {
      hideAutocompletePanels({ clear: true });
      return;
    }

    if (visibleImagePreview) {
      closeImagePreview();
      return;
    }

    if (visibleResultDetails) {
      closeResultDetails();
      return;
    }

    if (visiblePanel) {
      closePanels();
      return;
    }

    if (hasOpenZipEditor()) {
      closeZipEditors({ restoreFocus: true });
    }
    return;
  }

  if (activeOverlay && event.key === "Tab") {
    const focusableElements = getFocusableElements(activeOverlay);
    if (!focusableElements.length) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
      return;
    }
  }

  if (activeOverlay) {
    return;
  }

  if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
    event.preventDefault();
    focusVisibleSearchInput();
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (isChatMenuOpen() && !target.closest("[data-chat-menu-shell]")) {
    closeChatMenu();
  }

  const autocompleteTrigger = target.closest("[data-autocomplete-query]");
  if (autocompleteTrigger instanceof HTMLElement) {
    const panel = autocompleteTrigger.closest("[data-autocomplete-panel]");
    const input = panel ? getAutocompleteInputForPanel(panel) : state.autocompleteActiveInput;
    runAutocompleteSearch(autocompleteTrigger.getAttribute("data-autocomplete-query") || "", input);
    closeZipEditors();
    return;
  }

  if (!target.closest("[data-search-form]")) {
    disarmAutocomplete();
    hideAutocompletePanels();
  }

  if (target.closest("[data-zip-shell]") || target.closest("[data-filter-action='zip']")) {
    return;
  }

  closeZipEditors();
});

if (systemThemeMedia) {
  const handleThemeMediaChange = () => {
    if (normalizeThemePreference(state.preferences.theme || "system") === "system") {
      applyThemePreference("system");
    }
  };

  if ("addEventListener" in systemThemeMedia) {
    systemThemeMedia.addEventListener("change", handleThemeMediaChange);
  } else if ("addListener" in systemThemeMedia) {
    systemThemeMedia.addListener(handleThemeMediaChange);
  }
}

initializeTooltips();
applyAppShellConfig();
await hydrateHealth();
hydrateFromUrl();
syncAutoLoadButtons();
syncAiToggleButtons();
focusSearchOnPageLoad();

window.addEventListener("pageshow", () => {
  focusSearchOnPageLoad();
});
