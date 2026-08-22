/**
 * BloraElement - thin base class for Blora custom elements.
 * Spec §10.1: minimal, no i18n/table/overlay/form/validation/global-state.
 * Spec §3.5: SSR-safe - importing must not throw without DOM globals.
 */

// In SSR (no HTMLElement), create a no-op base class so module import is safe.
const DOMBaseClass: typeof HTMLElement =
  typeof HTMLElement !== "undefined" ? HTMLElement : (class {} as typeof HTMLElement);

export abstract class BloraElement extends DOMBaseClass {
  protected abortController: AbortController = new AbortController();
  private _isConnected = false;
  private _connectScheduled = false;
  private _mounted = false;

  protected get isConnectedInternal(): boolean {
    return this._isConnected;
  }

  protected get hasMounted(): boolean {
    return this._mounted;
  }

  connectedCallback(): void {
    if (this._isConnected) return;
    /* A classic script can define/upgrade an element while the HTML parser is
       still positioned at its start tag. Defer one parser task so declarative
       child definitions (<blora-tab>, <blora-transfer-item>, …) exist before
       a composite CE consumes them into the official light-DOM tree. */
    if (this.ownerDocument?.readyState === "loading") {
      if (this._connectScheduled) return;
      this._connectScheduled = true;
      /* A microtask still runs before the HTML parser advances past this start
         tag. Use the next task so declarative children have actually parsed. */
      setTimeout(() => {
        this._connectScheduled = false;
        if (this.isConnected && !this._isConnected) this.connectNow();
      }, 0);
      return;
    }
    this.connectNow();
  }

  private connectNow(): void {
    this._isConnected = true;
    this.abortController = new AbortController();
    this.upgradeProperties();
    if (!this._mounted) {
      this.render();
      this._mounted = true;
    } else {
      this.sync();
    }
    this.bindEvents();
    this.listen(this.ownerDocument, "blora-locale-change", () => this.onLocaleChange());
  }

  disconnectedCallback(): void {
    this.abortController.abort();
    this._isConnected = false;
    this.onDisconnect();
  }

  protected listen(
    target: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options: AddEventListenerOptions = {},
  ): void {
    target.addEventListener(type, listener, {
      ...options,
      signal: this.abortController.signal,
    });
  }

  protected emit<T>(name: string, detail: T, options: CustomEventInit<T> = {}): boolean {
    return this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true,
        ...options,
      }),
    );
  }

  protected abstract render(): void;
  protected abstract bindEvents(): void;
  /** Patch the existing official tree after reconnect or a non-structural attribute change. */
  protected sync(): void {}
  /** Chrome strings follow `setLocale` / `html lang` without remounting. */
  protected onLocaleChange(): void {
    if (!this._mounted) return;
    this.sync();
  }
  protected onDisconnect(): void {}

  /** Re-attach listeners/controllers without rebuilding the official tree. */
  protected rebind(): void {
    this.onDisconnect();
    this.abortController.abort();
    this.abortController = new AbortController();
    this.bindEvents();
  }

  private upgradeProperties(): void {
    // Subclasses can override to handle pre-upgrade properties
  }
}
