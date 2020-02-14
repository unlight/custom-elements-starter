// @ts-ignore
import style from './box-controls.css';

const styles = document.createElement('style');
styles.textContent = style;

const templateSlotDefault = document.createElement('template');
templateSlotDefault.innerHTML = `
    <div class="root">
    <slot></slot>
</div>
`;

const templateSlotControls = document.createElement('template');
templateSlotControls.innerHTML = `
    <div class="slot-controls">
        <slot name="controls"></slot>
    </div>`;

class BoxControlsElement extends HTMLElement {
    /**
     * Return an array containing the names of the attributes you want to observe.
     */
    static observedAttributes = [];

    private get shadow() {
        if (!this.shadowRoot) {
            throw new Error('No shadowRoot');
        }
        return this.shadowRoot;
    }

    private root: HTMLElement;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadow.appendChild(styles.cloneNode(true));
        this.shadow.appendChild(templateSlotDefault.content.cloneNode(true));
        this.root = this.shadow.querySelector('.root');
    }

    /**
     * Invoked each time the custom element is appended into a document-connected element.
     * This will happen each time the node is moved, and may happen before the element's contents
     * have been fully parsed
     */
    connectedCallback() {
        this.shadow.addEventListener('mouseover', this);
        this.shadow.addEventListener('mouseout', this);
    }

    /**
     * Invoked each time the custom element is disconnected from the document's DOM.
     */
    disconnectedCallback() {
        this.shadow.removeEventListener('mouseover', this);
        this.shadow.removeEventListener('mouseout', this);
    }

    /**
     * Invoked each time one of the custom element's attributes is added, removed, or changed.
     * Which attributes to notice change for is specified in a static get observedAttributes method
     */
    attributeChangedCallback(name, oldValue, newValue) {}

    handleEvent(event: Event) {
        this[`${event.type}Callback`](event);
    }

    mouseoverCallback(event: MouseEvent) {
        this.classList.add('hovered');
        this.root.append(templateSlotControls.content.cloneNode(true));
    }

    mouseoutCallback(event: MouseEvent) {
        this.classList.remove('hovered');
        this.root.querySelector('.slot-controls')?.remove();
    }
}

customElements.define('box-controls', BoxControlsElement);
