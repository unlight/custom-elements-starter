import { html, customElement } from 'functional-element';

customElement('section-controls', ({ constructing }) => {
    debugger;
    if (constructing) {
        return {};
    }

    return html`
        <div>
            <slot></slot>
            <slot name="one"></slot>
        </div>
    `;
});
