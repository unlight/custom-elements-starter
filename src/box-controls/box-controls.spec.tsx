import './box-controls';

describe('box-controls', () => {
    let element: HTMLElement;

    beforeEach(() => {
        if (element) {
            element.remove();
        }
        element = document.createElement('box-controls');
        element.innerHTML = `<slot>
            <div>some box</div>
            </slot>
            <slot name="controls">controls</slot>
        `;
    });

    it('smoke', () => {
        document.body.append(element);
        expect(element.textContent).toContain('some box');
    });
});
