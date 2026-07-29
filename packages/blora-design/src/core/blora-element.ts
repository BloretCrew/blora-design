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

  protected get isConnectedInternal(): boolean {
    return this._isConnected;
  }

  connectedCallback(): void {
    if (this._isConnected) return;
    this._isConnected = true;
    this.abortController = new AbortController();
    this.upgradeProperties();
    this.render();
    this.bindEvents();
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
  protected onDisconnect(): void {}

  private upgradeProperties(): void {
    // Subclasses can override to handle pre-upgrade properties
  }
}
