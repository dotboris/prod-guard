import { type Warning, WarningStyle } from "../schema";
import { makeBanner } from "./banner";

main();

interface Globals {
  prodGuardWarnings?: (Warning & { id: string })[];
}

declare const window: Window & typeof globalThis & Globals;

function main() {
  const warnings = window.prodGuardWarnings ?? [];

  for (const warning of warnings) {
    const selector = `[data-prod-guard-warning-id="${warning.id}"]`;
    const element = document.querySelector(selector);
    if (!document.contains(element)) {
      switch (warning.warningStyle) {
        case WarningStyle.Border:
          document.body.style.border = `3px solid #${warning.borderColor}`;
          break;
        case WarningStyle.TopBanner:
        case WarningStyle.BottomBanner:
          makeBanner(warning);
          break;
      }
    }
  }
}
