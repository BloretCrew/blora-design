import { BloraElement } from "../../core/blora-element.js";
export declare const BLORA_COMMENT_TAG = "blora-comment";
export declare class BloraComment extends BloraElement {
    static get observedAttributes(): string[];
    attributeChangedCallback(): void;
    protected render(): void;
    protected sync(): void;
    protected bindEvents(): void;
}
export declare function defineBloraComment(registry?: CustomElementRegistry): void;
//# sourceMappingURL=comment.d.ts.map