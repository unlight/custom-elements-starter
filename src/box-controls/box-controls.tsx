// @ts-ignore
import style from './box-controls.css';
// @ts-ignore
import templateHtml from './box-controls.html';

const styles = document.createElement('style');
styles.textContent = style;

const templateElement = document.createElement('template');
templateElement.innerHTML = templateHtml;

customElements.define(
    'box-controls',
    class BoxControlsElement extends HTMLElement {
        /**
         * Return an array containing the names of the attributes you want to observe.
         */
        static get observedAttributes() {
            return [];
        }

        private get shadow() {
            if (!this.shadowRoot) {
                throw new Error('No shadowRoot');
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

        handleEvent(event: Event) {}
    },
);
