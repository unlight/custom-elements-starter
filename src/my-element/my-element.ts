/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import { LitElement, html, customElement, property, TemplateResult, css } from 'lit-element';
// @ts-ignore
import { template } from './my-element.html';

// import style from './scss/toggle-switch.scss';

/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement('my-element')
export class MyElement extends LitElement {
    // public static styles = style({ css });
    /**
     * Create an observed property. Triggers update on change.
     */
    @property()
    foo = 'foo bar test';

    /**
     * Implement `render` to define a template for your element.
     */
    render(): TemplateResult {
        return template({
            html,
            values: { self: this },
        });
    }
}
