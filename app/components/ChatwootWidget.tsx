"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    chatwootSettings: {
      position: string;
      type: string;
      launcherTitle: string;
      hideMessageBubble?: boolean;
    };
    chatwootSDK: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    $chatwoot: {
      toggle: (state?: "open" | "close") => void;
      isOpen: boolean;
    };
  }
}

export default function ChatwootWidget() {
  useEffect(() => {
    window.chatwootSettings = {
      position: "right",
      type: "expanded_bubble",
      launcherTitle: "Chat with us",
      hideMessageBubble: true,
    };

    const script = document.createElement("script");
    script.src = "https://app.chatwoot.com/packs/js/sdk.js";
    script.async = true;
    script.onload = () => {
      window.chatwootSDK.run({
        websiteToken: "5yDEdg4sCLJ7SRfiGZfZuBWK",
        baseUrl: "https://app.chatwoot.com",
      });
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://app.chatwoot.com/packs/js/sdk.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
}

export function toggleChatwoot() {
  if (window.$chatwoot) {
    window.$chatwoot.toggle("open");
  }
}
