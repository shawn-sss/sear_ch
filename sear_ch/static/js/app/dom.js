const shell = document.querySelector(".page-shell");
const hero = document.querySelector("[data-hero]");
const resultsShell = document.querySelector("[data-results-shell]");
const resultsLayout = document.querySelector("[data-results-layout]");
const resultsStage = document.querySelector("[data-results-stage]");
const resultsRoot = document.querySelector("[data-results]");
const resultsSidebar = document.querySelector("[data-results-sidebar]");
const refinementRail = document.querySelector("[data-refinement-rail]");
const resultsSummary = document.querySelector("[data-results-summary]");
const resultsCorrection = document.querySelector("[data-results-correction]");
const newsTopicStrip = document.querySelector("[data-news-topic-strip]");
const activeFilters = document.querySelector("[data-active-filters]");
const newsRail = document.querySelector("[data-news-rail]");
const newsCard = document.querySelector("[data-news-card]");
const newsHeading = document.querySelector("[data-news-heading]");
const socialRail = document.querySelector("[data-social-rail]");
const socialCard = document.querySelector("[data-social-card]");
const socialHeading = document.querySelector("[data-social-heading]");
const imageRail = document.querySelector("[data-image-rail]");
const imagesCard = document.querySelector("[data-images-card]");
const imagesHeading = document.querySelector("[data-images-heading]");
const aiSourcesSection = document.querySelector("[data-ai-sources-section]");
const aiSourcesCard = document.querySelector("[data-ai-sources-card]");
const aiSourcesList = document.querySelector("[data-ai-sources-list]");
const resultsSidebarStack = document.querySelector(".results-sidebar-sticky-stack");
const viewSidebarCard = document.querySelector("[data-view-sidebar-card]");
const infoCard = document.querySelector("[data-info-card]");
const infoHeading = document.querySelector("[data-info-heading]");
const infoLink = document.querySelector("[data-info-link]");
const infoMeta = document.querySelector("[data-info-meta]");
const infoDescription = document.querySelector("[data-info-description]");
const infoMediaShell = document.querySelector("[data-info-media-shell]");
const placesCard = document.querySelector("[data-places-card]");
const placesHeading = document.querySelector("[data-places-heading]");
const placesList = document.querySelector("[data-places-list]");
const placesLink = document.querySelector("[data-places-link]");
const sidebarMapShell = document.querySelector("[data-sidebar-map-shell]");
const pagination = document.querySelector("[data-pagination]");
const aboutDetail = document.querySelector("[data-about-detail]");
const aboutNetworkDetail = document.querySelector("[data-about-network-detail]");
const searxngLink = document.querySelector("[data-searxng-link]");
const ollamaLink = document.querySelector("[data-ollama-link]");
const topbarSecondaryNav = document.querySelector(".topbar-left");
const topbarSettingsNav = document.querySelector(".topbar-right");
const homeWordmark = document.querySelector(".wordmark-mini");
const resultsWordmark = document.querySelector(".results-wordmark");
const heroSearchForm = document.querySelector(".search-form-home");
const heroSubtitle = document.querySelector("[data-hero-subtitle]");
const searchServiceTitle = document.querySelector("[data-search-service-title]");
const searchServiceMeta = document.querySelector("[data-search-service-meta]");
const aiServiceTitle = document.querySelector("[data-ai-service-title]");
const aiServiceMeta = document.querySelector("[data-ai-service-meta]");
const searxngHealth = document.querySelector("[data-searxng-health]");
const searxngEndpoint = document.querySelector("[data-searxng-endpoint]");
const searxngCapabilities = document.querySelector("[data-searxng-capabilities]");
const searxngProfile = document.querySelector("[data-searxng-profile]");
const searxngEngines = document.querySelector("[data-searxng-engines]");
const searxngAutocomplete = document.querySelector("[data-searxng-autocomplete]");
const ollamaHealth = document.querySelector("[data-ollama-health]");
const ollamaEndpoint = document.querySelector("[data-ollama-endpoint]");
const ollamaModels = document.querySelector("[data-ollama-models]");
const ollamaActiveModel = document.querySelector("[data-ollama-active-model]");
const ollamaGeneration = document.querySelector("[data-ollama-generation]");
const ollamaContext = document.querySelector("[data-ollama-context]");
const accessServiceTitle = document.querySelector("[data-access-service-title]");
const accessServiceMeta = document.querySelector("[data-access-service-meta]");
const aiModelOptions = document.querySelector("[data-ai-model-options]");
const resultsHeading = document.getElementById("results-heading");
const appNameTextElements = Array.from(document.querySelectorAll("[data-app-name-text]"));
const currentYearElements = Array.from(document.querySelectorAll("[data-current-year]"));
const panelBackdrop = document.querySelector("[data-panel-backdrop]");
const imagePreviewBackdrop = document.querySelector("[data-image-preview-backdrop]");
const imagePreviewPanel = document.querySelector("[data-image-preview-panel]");
const imagePreviewStage = document.querySelector("[data-image-preview-stage]");
const imagePreviewTitle = document.querySelector("[data-image-preview-title]");
const imagePreviewSite = document.querySelector("[data-image-preview-site]");
const imagePreviewDetails = document.querySelector("[data-image-preview-details]");
const imagePreviewUrl = document.querySelector("[data-image-preview-url]");
const imagePreviewSnippet = document.querySelector("[data-image-preview-snippet]");
const imagePreviewOpen = document.querySelector("[data-image-preview-open]");
const resultDetailsBackdrop = document.querySelector("[data-result-details-backdrop]");
const resultDetailsPanel = document.querySelector("[data-result-details-panel]");
const resultDetailsSourceIcon = document.querySelector("[data-result-details-source-icon]");
const resultDetailsSourceName = document.querySelector("[data-result-details-source-name]");
const resultDetailsSourceMeta = document.querySelector("[data-result-details-source-meta]");
const resultDetailsTitle = document.querySelector("[data-result-details-title]");
const resultDetailsUrl = document.querySelector("[data-result-details-url]");
const resultDetailsSnippet = document.querySelector("[data-result-details-snippet]");
const resultDetailsOpen = document.querySelector("[data-result-details-open]");
const resultDetailsCopy = document.querySelector("[data-result-details-copy]");
const resultDetailsFacts = document.querySelector("[data-result-details-facts]");
const resultDetailsAbout = document.querySelector("[data-result-details-about]");
const resultDetailsList = document.querySelector("[data-result-details-list]");
const resultDetailsStatus = document.querySelector("[data-result-details-status]");
const providerSelect = document.querySelector("[data-provider-select]");
const preferencesForm = document.querySelector("[data-preferences-form]");
const settingsForm = document.querySelector("[data-settings-form]");
const luckyButton = document.querySelector("[data-lucky-button]");
const zipShells = Array.from(document.querySelectorAll("[data-zip-shell]"));
const zipToggles = Array.from(document.querySelectorAll("[data-zip-toggle]"));
const zipForms = Array.from(document.querySelectorAll("[data-zip-form]"));
const zipEditors = Array.from(document.querySelectorAll("[data-zip-editor]"));
const zipInputs = zipForms
  .map((form) => form.querySelector("[data-zip-input]"))
  .filter(Boolean);
const zipValueDisplays = Array.from(document.querySelectorAll("[data-zip-value]"));
const zipStatusElements = Array.from(document.querySelectorAll("[data-zip-status]"));
const autocompletePanels = Array.from(document.querySelectorAll("[data-autocomplete-panel]"));
const panelTriggers = Array.from(document.querySelectorAll("[data-open-panel]"));
const resultsViewButtons = Array.from(document.querySelectorAll("[data-results-view]"));
const metaDescription = document.querySelector('meta[name="description"]');
const openGraphSiteNameMeta = document.querySelector('meta[property="og:site_name"]');
const openGraphTitleMeta = document.querySelector('meta[property="og:title"]');
const openGraphDescriptionMeta = document.querySelector('meta[property="og:description"]');
const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
const twitterDescriptionMeta = document.querySelector('meta[name="twitter:description"]');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const applicationNameMeta = document.querySelector('meta[name="application-name"]');
const appleMobileWebAppTitleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]');
const systemThemeMedia = window.matchMedia?.("(prefers-color-scheme: dark)") ?? null;
const searchForms = Array.from(document.querySelectorAll("[data-search-form]"));
const searchInputs = searchForms
  .map((form) => form.querySelector('input[name="q"]'))
  .filter(Boolean);
const searchBoxes = Array.from(document.querySelectorAll(".search-box"));
const searchClearButtons = Array.from(document.querySelectorAll("[data-search-clear]"));
const autoLoadButtons = Array.from(document.querySelectorAll("[data-auto-load-toggle]"));
const aiToggleButtons = Array.from(document.querySelectorAll("[data-ai-toggle]"));
const chatToggleButtons = Array.from(document.querySelectorAll("[data-chat-toggle]"));
const chatPopout = document.querySelector("[data-chat-popout]");
const chatPanel = document.querySelector("[data-chat-panel]");
const chatLog = document.querySelector("[data-chat-log]");
const chatForm = document.querySelector("[data-chat-form]");
const chatInput = document.querySelector("[data-chat-input]");
const chatSubmit = document.querySelector("[data-chat-submit]");
const chatStatus = document.querySelector("[data-chat-status]");
const chatCloseButton = document.querySelector("[data-chat-close]");
const chatClearButton = document.querySelector("[data-chat-clear]");
const chatFullscreenButton = document.querySelector("[data-chat-fullscreen-toggle]");
const chatMinimizeButton = document.querySelector("[data-chat-minimize]");
const chatMenuButton = document.querySelector("[data-chat-menu-toggle]");
const chatMenuPanel = document.querySelector("[data-chat-menu]");
const chatNewButton = document.querySelector("[data-chat-new]");
const chatRegenerateButton = document.querySelector("[data-chat-regenerate]");
const chatCopyConversationButton = document.querySelector("[data-chat-copy-conversation]");
const chatExportButton = document.querySelector("[data-chat-export]");
const chatStopButton = document.querySelector("[data-chat-stop]");
const chatModelSelect = document.querySelector("[data-chat-model-select]");
const chatContextToggle = document.querySelector("[data-chat-context-toggle]");
const chatHistoryStorageToggle = document.querySelector("[data-chat-history-storage-toggle]");
const chatSessionList = document.querySelector("[data-chat-session-list]");
const chatSessionTitle = document.querySelector("[data-chat-session-title]");

export const DOM = {
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
};
