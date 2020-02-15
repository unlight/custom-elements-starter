/** @jsx h */
import { h } from 'h-document-element';
// @ts-ignore
import style from './checkbox-list.element.css';
import { Option } from './option';

const styles = document.createElement('style');
styles.textContent = style;

/**
 *
 */
export class CheckboxListElement extends HTMLElement {
    private name = '';
    private root: HTMLElement;

    private _options: Option[] = [];

    private _value = new Set<string>();

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadow.append(document.createElement('div'));
        this.root = this.shadow.firstElementChild as HTMLElement;
        this.shadow.append(styles.cloneNode(true));
    }
    static get observedAttributes() {
        return ['name'];
    }
    get options(): Option[] {
        return this._options;
    }
    set options(v: Option[]) {
        this._options = v;
        this.update();
    }
    get value(): string[] {
        return [...this._value.values()];
    }
    set value(values: string[]) {
        this._value = new Set<string>(values);
        this.update();
    }

    private get shadow() {
        return this.shadowRoot!;
    }

    connectedCallback() {
        // this.addEventListener('mouseenter', this);
        // this.addEventListener('mouseleave', this);
    }

    disconnectedCallback() {
        // this.removeEventListener('mouseenter', this);
        // this.removeEventListener('mouseleave', this);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (CheckboxListElement.observedAttributes.includes(name)) {
            this[name] = newValue;
        }
    }

    handleEvent(event: Event) {
        this[`${event.type}Callback`](event);
    }

    /**
     * Called when one of checkbox value changed.
     */
    private optionChange = (event: Event) => {
        const input = event.target as HTMLInputElement;
        const inputValue = String(input.value);
        if (input.checked) {
            this._value.add(inputValue);
        } else {
            this._value.delete(inputValue);
        }
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: this.value,
                composed: true,
                bubbles: true,
            }),
        );
    };

    /**
     * Checks if value is selected (checkbox will be mark as checked)
     */
    private checked = (value: unknown): boolean => {
        return this._value.has(String(value));
    };

    private update() {
        this.root.replaceWith(this.render() as any);
        this.root = this.shadow.firstElementChild as HTMLElement;
    }

    private render() {
        return (
            <div className="var-classList">
                {this.options.map((option, index) => {
                    return (
                        <div className="var-itemClassName">
                            <input
                                type="checkbox"
                                value={option.value}
                                checked={this.checked(option.value)}
                                id={`${this.name}${index}`}
                                onChange={this.optionChange as any}
                            />
                            <label htmlFor={`${this.name}${index}`}>{option.label}</label>
                        </div>
                    );
                })}
            </div>
        );
    }
}

customElements.define('checkbox-list', CheckboxListElement);
