import { h } from 'h-document-element';

// @ts-ignore
import style from './example-plain.css';
// @ts-ignore
import templateHtml from './example-plain.html';

const styles = document.createElement('style');
styles.textContent = style;

const templateElement = document.createElement('template');
templateElement.innerHTML = templateHtml;

export class ExamplePlainElement extends HTMLElement {
    /**
     * Return an array containing the names of the attributes you want to observe.
     */
    static get observedAttributes() {
        return [];
    }

    private get shadow() {
        if (!this.shadowRoot) {
            throw new Error('shadowRoot is null');
        }
        return this.shadowRoot;
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadow.appendChild(styles.cloneNode(true));
        this.shadow.appendChild(templateElement.content.cloneNode(true) as Node);
    }

    /**
     * Invoked each time the custom element is appended into a document-connected element.
     * This will happen each time the node is moved, and may happen before the element's contents
     * have been fully parsed
     */
    connectedCallback() {
        this.shadow.addEventListener('click', this);
        this.dispatchEvent(
            new CustomEvent('exampleplain.connected', {
                detail: {},
                bubbles: true,
                composed: true,
            }),
        );
        this.shadow.append(<span>test</span>);
    }

    /**
     * Invoked each time the custom element is disconnected from the document's DOM.
     */
    disconnectedCallback() {
        this.shadow.removeEventListener('click', this);
    }

    /**
     * Invoked each time one of the custom element's attributes is added, removed, or changed.
     * Which attributes to notice change for is specified in a static get observedAttributes method
     */
    attributeChangedCallback(name, oldValue, newValue) {}

    handleEvent(event: Event) {
        if (
            event.type === 'click' &&
            event.target &&
            (event.target as HTMLAnchorElement).nodeName === 'A'
        ) {
            const anchor = event.target as HTMLAnchorElement;
            const detail = {
                url: anchor.getAttribute('href'),
            };
            dispatchEvent(new CustomEvent('go', { detail }));
            event.preventDefault();
        }
    }
}

customElements.define('example-plain', ExamplePlainElement);
