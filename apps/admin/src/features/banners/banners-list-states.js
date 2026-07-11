export const BANNERS_LIST_STATES = Object.freeze([
  {
    key: "loading",
    title: "Loading state",
    description: "Skeleton rows communicate banner list hydration while the query resolves.",
    actionLabel: "Waiting for data"
  },
  {
    key: "empty",
    title: "Empty state",
    description: "Explain that no banners are available or match the active search term.",
    actionLabel: "Create first banner"
  },
  {
    key: "error",
    title: "Error state",
    description: "Show a recoverable inline failure with retry support and trace context.",
    actionLabel: "Retry fetch"
  }
]);
