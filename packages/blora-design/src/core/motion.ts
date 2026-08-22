/**
 * Read the longest computed transition on an element. Used only to wait for
 * CSS enter/leave to finish before tearing down overlay hosts — not to drive
 * the motion itself.
 */
export function motionDurationMs(el: Element): number {
  const view = el.ownerDocument?.defaultView;
  if (!view) return 0;
  const style = view.getComputedStyle(el);
  const durations = style.transitionDuration.split(",");
  const delays = style.transitionDelay.split(",");
  let max = 0;
  for (let i = 0; i < durations.length; i++) {
    max = Math.max(max, cssTimeToMs(durations[i]!) + cssTimeToMs(delays[i] ?? delays[0] ?? "0s"));
  }
  return max;
}

function cssTimeToMs(value: string): number {
  const trimmed = value.trim();
  const n = Number.parseFloat(trimmed);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return trimmed.endsWith("ms") ? n : n * 1000;
}

/** Run `done` after the element's transitions finish, or immediately if none. */
export function whenMotionDone(el: Element, done: () => void): () => void {
  let finished = false;
  const onEnd = (event: Event) => {
    if (event.target !== el) return;
    finish();
  };
  function finish(): void {
    if (finished) return;
    finished = true;
    el.removeEventListener("transitionend", onEnd);
    if (timer !== undefined) clearTimeout(timer);
    done();
  }
  const ms = motionDurationMs(el);
  const timer = ms > 16 ? setTimeout(finish, ms + 50) : undefined;
  if (ms <= 16) {
    finish();
    return () => {
      finished = true;
    };
  }
  el.addEventListener("transitionend", onEnd);
  return () => {
    finished = true;
    el.removeEventListener("transitionend", onEnd);
    if (timer !== undefined) clearTimeout(timer);
  };
}
