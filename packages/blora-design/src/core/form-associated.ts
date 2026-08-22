/** Attach ElementInternals when the host declared `static formAssociated = true`. */
export function attachFormInternals(host: HTMLElement): ElementInternals | null {
  const el = host as HTMLElement & { attachInternals?: () => ElementInternals };
  if (typeof el.attachInternals !== "function") return null;
  try {
    return el.attachInternals();
  } catch {
    return null;
  }
}

export function setHostFormValue(
  internals: ElementInternals | null,
  value: string | File | FormData | null,
): void {
  if (typeof internals?.setFormValue === "function") internals.setFormValue(value);
}
