import rafThrottle from "raf-throttle";
import { type BannerWarning } from "../schema";
import { css, cx } from "@emotion/css";

const styles = {
  root: css({
    position: "fixed",
    left: 0,
    right: 0,
    zIndex: 9999999,
    pointerEvents: "none",
    fontSize: "1.25rem",
    fontWeight: "bold",
    textAlign: "center",
    padding: "0.5rem 0",
  }),
  top: css({ top: 0 }),
  bottom: css({ bottom: 0 }),
};

interface BannerState {
  mouseInWindow: boolean;
  mouseX: number;
  mouseY: number;
  bannerBox: DOMRect;
}

export function makeBanner({
  warningStyle,
  text,
  backgroundColor,
  textColor,
  id,
}: BannerWarning & { id: string }): void {
  const banner = document.createElement("div");
  banner.setAttribute("data-banner-id", id);
  banner.classList.add(
    cx(
      styles.root,
      warningStyle === "topBanner" && styles.top,
      warningStyle === "bottomBanner" && styles.bottom,
    ),
  );
  banner.textContent = text;
  banner.style.color = `#${textColor}`;
  banner.style.backgroundColor = `#${backgroundColor}`;
  document.body.append(banner);

  const state: BannerState = {
    mouseInWindow: true,
    mouseX: 0,
    mouseY: 0,
    bannerBox: banner.getBoundingClientRect(),
  };

  const setOpacity = rafThrottle((opacity: number) => {
    banner.style.opacity = String(opacity);
  });

  function update(newState: Partial<BannerState>): void {
    Object.assign(state, newState);

    if (state.mouseInWindow) {
      const distance = verticalDistance(state.bannerBox, state.mouseY);

      const threshold = state.bannerBox.height * 2;
      const opacity = Math.min(distance, threshold) / threshold;

      setOpacity(opacity);
    } else {
      setOpacity(1);
    }
  }

  window.addEventListener("resize", () => {
    update({
      bannerBox: banner.getClientRects()[0],
    });
  });
  document.addEventListener("mousemove", (event) => {
    update({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  });
  document.documentElement.addEventListener("mouseenter", () => {
    update({
      mouseInWindow: true,
    });
  });
  document.documentElement.addEventListener("mouseleave", () => {
    update({
      mouseInWindow: false,
    });
  });
}

function verticalDistance(box: DOMRect, y: number): number {
  const topDistance = Math.abs(box.top - y);
  const bottomDistance = Math.abs(box.bottom - y);

  if (topDistance < box.height && bottomDistance < box.height) {
    // we are within the box
    return 0;
  } else {
    // return the closest one
    return Math.min(topDistance, bottomDistance);
  }
}
