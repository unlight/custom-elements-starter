/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import { customElement, html, LitElement, property } from 'lit-element';

// @ts-ignore
import style from './example-lit-element.css';

/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <example-lit-element> as an HTML tag.
 */
@customElement('example-lit-element')
export class ExampleLitElement extends LitElement {
    static styles = style;

    /**
     * Create an observed property. Triggers update on change.
     */
    @property({ reflect: true, type: String })
    foo = 'foo bar';

    /**
     * Implement `render` to define a template for your element.
     */
    render() {
        return html`
            <p>${this.foo}</p>
        `;
    }
}
