/* =========================================================
   567811.com — site configuration (the only file you edit)
   ========================================================= */
window.SITE = {
  name: "567811 · Count In. Dance On.",
  domain: "567811.com",
  partnerContact: "https://web.works/contact",

  /* Google AdSense — paste your publisher id ("ca-pub-XXXXXXXXXXXXXXXX") once approved,
     and the same id in /ads.txt. Empty = every slot shows a house ad selling your own inventory. */
  ADSENSE_CLIENT: "",
  AD_SLOTS: { inContent: "", sidebar: "", footer: "" },

  /* YouTube — your channel and video ids. Empty list = curated cards that open YouTube search. */
  YOUTUBE_CHANNEL: "",
  VIDEOS: [
    // { id: "VIDEO_ID", title: "5-6-7-8: learn your first 8-count", style: "Basics" },
  ],

  /* Donations — paste links when ready. Empty = pledge form is used. */
  DONATE: { paypal: "", kofi: "", bmac: "", stripe: "", patreon: "" },
  DONATION_GOAL: { label: "Season 1 · 11-Count Challenge prize & ops fund", raised: 0, goal: 5678 },

  /* Analytics — GA4 measurement id, e.g. "G-XXXXXXX" */
  GA4: ""
};

/* Contact routing — obfuscated and assembled only at submit time. Never replace with plain text. */
window.__r = [66,83,85,79,66,67,90,94,2,94,53,9,25,84,95,91,22,78,94,92];
window.__k = "5678-11-count";
