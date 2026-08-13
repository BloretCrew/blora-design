import { BloraElement } from "../../core/blora-element.js";

export const BLORA_NAVBAR_TAG = "blora-navbar";

interface NavbarDefinition {
  current: boolean;
  href: string;
  kind: "action" | "link" | "tool";
  label: string;
  nodes: Node[];
  variant: string;
}

export class BloraNavbar extends BloraElement {
  private definitions: NavbarDefinition[] | null = null;

  static get observedAttributes(): string[] {
    return ["brand-href", "title", "variant"];
  }

  attributeChangedCallback(): void {
    if (this.isConnectedInternal) this.sync();
  }

  protected render(): void {
    if (!this.definitions)
      this.definitions = Array.from(this.children)
        .filter(
          (item) =>
            item.localName === "blora-navbar-link" ||
            item.localName === "blora-navbar-action" ||
            item.localName === "blora-navbar-tool",
        )
        .map((item) => ({
          current: item.hasAttribute("current"),
          href: item.getAttribute("href") ?? "#",
          kind:
            item.localName === "blora-navbar-action"
              ? "action"
              : item.localName === "blora-navbar-tool"
                ? "tool"
                : "link",
          label: item.getAttribute("label") ?? item.textContent?.trim() ?? "",
          nodes: Array.from(item.childNodes),
          variant: item.getAttribute("variant") ?? "outline",
        }));
    const root = this.ownerDocument.createElement("nav");
    root.className = "blora-navbar";
    root.dataset.variant = this.getAttribute("variant") ?? "floating";
    root.dataset.bloraGenerated = "";
    const brandHref = this.getAttribute("brand-href");
    const brand = this.ownerDocument.createElement(brandHref ? "a" : "div");
    brand.className = "blora-navbar__brand";
    if (brand instanceof HTMLAnchorElement && brandHref) brand.href = brandHref;
    const mark = this.ownerDocument.createElement("span");
    mark.className = "blora-brand-mark";
    const logo = this.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
    logo.setAttribute("width", "20");
    logo.setAttribute("height", "20");
    logo.setAttribute("viewBox", "0 0 28 28");
    logo.setAttribute("fill", "currentColor");
    logo.setAttribute("aria-hidden", "true");
    for (const d of [
      "M5.564827499008331,11.30073113250122L8.613244389008331,9.55578903250122L7.719039689008332,7.993611832501221L4.670622762008331,9.73855403250122Q3.7145057890083315,10.285843332501221,3.714505549008331,11.38751893250122L3.714505909008331,21.189404032501223Q3.714505909008331,22.29107703250122,4.670622762008331,22.838368032501222L13.24553848900833,27.74672703250122Q14.189421489008332,28.28701603250122,15.133306589008331,27.746726032501222L23.70821758900833,22.838368032501222Q24.664333589008333,22.29107903250122,24.664333589008333,21.189403032501218L24.664333589008333,11.38751893250122Q24.664333589008333,10.285842932501222,23.708221589008332,9.73855403250122L15.144333589008331,4.836507112501221Q14.17949278900833,4.28422363250122,13.225343489008331,4.854777572501221L12.235854489008332,5.44646401250122L13.159642089008331,6.991331832501221L14.149129689008332,6.399646032501221Q14.19934828900833,6.369617032501221,14.250129489008332,6.398684332501221L22.81401458900833,11.30073023250122Q22.864333589008332,11.32953453250122,22.864333589008332,11.38751893250122L22.864333589008332,21.189403032501218Q22.864333589008332,21.24738603250122,22.814012589008332,21.27619003250122L14.23909738900833,26.18455203250122Q14.18942048900833,26.212988032501222,14.139742689008331,26.18455003250122L5.564828579008331,21.27619103250122Q5.514505799008331,21.24738603250122,5.514505799008331,21.189404032501223L5.514505449008332,11.38751893250122Q5.514505449008332,11.329536432501222,5.564827499008331,11.30073113250122Z",
      "M13.676674393811036,9.8286476L13.676419693811035,2.5857831Q13.676392093811035,1.76404774,12.958911393811036,1.3634555L11.142991493811035,0.34957015999999996Q10.464049593811035,-0.02950469999999994,9.783433893811035,0.34655654L7.945791753811035,1.36191076Q7.222857173811035,1.76135367,7.222857173811035,2.5873014000000003L7.222857173811035,19.634758Q7.222857173811035,20.456587,7.940433573811035,20.85717L13.577110793811034,24.003897Q14.267833193811036,24.3895,14.954539293811035,23.996788L20.450968093811035,20.853519Q21.155953093811036,20.450346,21.155953093811036,19.638218L21.155953093811036,13.368428Q21.155953093811036,12.541971,20.432357093811035,12.142673L15.606700893811034,9.4797554Q14.896982193811034,9.0881147,14.203994293811036,9.5086489L13.676674393811036,9.8286476ZM11.876428093811036,2.8206283L10.459485793811035,2.0295045L9.022857013811034,2.8232863L9.022857013811034,19.39995L14.257165393811036,22.322048L19.355953093811035,19.406179L19.355953093811035,13.604559L14.939816993811036,11.167625L14.003004993811036,11.736121Q13.303271793811035,12.160748,12.589999693811034,11.759276Q11.876728293811034,11.357804,11.876699493811035,10.5393085L11.876428093811036,2.8206283Z",
      "M11.361768030889893,4.572254157627869L13.073605530889893,3.6714597976278687L12.235387530889893,2.0785409176278686L10.461767930889893,3.0118460176278687L8.688148500889893,2.0785409176278686L7.849930760889893,3.6714597976278687L9.561768330889892,4.572254157627869L9.561768330889892,13.981741357627868Q9.561768330889892,14.793980357627868,10.267906530889892,15.196923357627869L13.397947330889892,16.98302035762787L13.397947330889892,23.35577235762787L15.197947030889893,23.35577235762787L15.197947030889893,16.97939035762787L20.706725630889892,13.791639357627869L19.805188630889894,12.233682957627869L14.294810730889893,15.422357357627869L11.361768030889893,13.748672357627868L11.361768030889893,4.572254157627869Z",
    ]) {
      const path = this.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      path.setAttribute("fill-rule", "evenodd");
      logo.appendChild(path);
    }
    mark.appendChild(logo);
    const title = this.ownerDocument.createElement("span");
    title.className = "blora-navbar__title";
    title.textContent = this.getAttribute("title") ?? "Blora Design";
    brand.append(mark, title);
    const menu = this.ownerDocument.createElement("div");
    menu.className = "blora-navbar__menu";
    const actions = this.ownerDocument.createElement("div");
    actions.className = "blora-navbar__actions";
    const tools = this.ownerDocument.createElement("div");
    tools.className = "blora-navbar__tools";
    this.definitions.forEach((definition) => {
      if (definition.kind === "tool") {
        tools.append(...definition.nodes);
        return;
      }
      const link = this.ownerDocument.createElement("a");
      link.href = definition.href;
      link.textContent = definition.label;
      if (definition.kind === "link") {
        link.className = "blora-navbar__link";
        if (definition.current) link.setAttribute("aria-current", "page");
        menu.appendChild(link);
      } else {
        link.className = `blora-button blora-navbar__${
          definition.variant === "primary" ? "cta" : "secondary"
        }`;
        link.dataset.variant = definition.variant;
        link.dataset.size = "sm";
        actions.appendChild(link);
      }
    });
    if (tools.childNodes.length > 0) actions.prepend(tools);
    root.append(brand, menu, actions);
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-navbar");
    if (!root) return;
    const brandHref = this.getAttribute("brand-href");
    const brand = root.querySelector(".blora-navbar__brand");
    if (brandHref && !(brand instanceof HTMLAnchorElement)) {
      this.render();
      return;
    }
    if (brand instanceof HTMLAnchorElement && brandHref) brand.href = brandHref;
    const title = root.querySelector(".blora-navbar__title");
    if (title) title.textContent = this.getAttribute("title") ?? "Blora Design";
    root.dataset.variant = this.getAttribute("variant") ?? "floating";
  }

  protected bindEvents(): void {}
}

export function defineBloraNavbar(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_NAVBAR_TAG)) return;
  registry.define(BLORA_NAVBAR_TAG, BloraNavbar);
}
