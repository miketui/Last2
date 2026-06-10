export const analyticsEvents = {
  pageView: "page_view",
  scrollDepth: "scroll_depth",
  ctaClick: "cta_click",
  emailCaptureSuccess: "email_capture_success",
  checkoutStarted: "checkout_started",
  preorderCompleted: "preorder_completed",
  purchaseCompleted: "purchase_completed",
  signupStarted: "signup_started",
  loginCompleted: "login_completed",
  dashboardViewed: "dashboard_viewed",
  downloadSigned: "download_signed",
  downloadDenied: "download_denied",
  bonusClaimStarted: "bonus_claim_started",
  bonusClaimCompleted: "bonus_claim_completed",
  refundRecorded: "refund_recorded",
  curlTrailSeen: "curl_trail_seen",
  magneticCtaEngaged: "magnetic_cta_engaged",
  chapterPathwayViewed: "chapter_pathway_viewed"
} as const;

export type AnalyticsEventName = (typeof analyticsEvents)[keyof typeof analyticsEvents];

export function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return Object.values(analyticsEvents).includes(value as AnalyticsEventName);
}
