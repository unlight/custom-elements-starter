import { CheckboxListElement } from './checkbox-list.element';

describe('CheckboxListElement', () => {
    let element: CheckboxListElement;
    let input: HTMLInputElement;

    beforeEach(() => {
        if (element) {
            element.remove();
        }
        element = document.createElement('checkbox-list') as CheckboxListElement;
        element.setAttribute('name', 'checkboxes');
        document.body.append(element);
    });

    it('smoke', () => {
        expect(element).toBeTruthy();
        expect(element).toBeInstanceOf(CheckboxListElement);
    });

    it('render several options', () => {
        element.options = [
            { label: 'A', value: 1 },
            { label: 'B', value: 'b' },
        ];
        const label = element.shadowRoot!.querySelector<HTMLLabelElement>('[for=checkboxes1]')!;
        expect(label).toBeInstanceOf(HTMLLabelElement);
        expect(label.textContent).toEqual('B');
    });

    it('options', () => {
        element.options = [{ label: 'A', value: 1 }];
        expect(element.value).toEqual([]);
        input = element.shadowRoot!.querySelector<HTMLInputElement>('[id=checkboxes0]')!;
        input.checked = true;
        input.dispatchEvent(new Event('change'));
        expect(element.value).toEqual(['1']);
        element.options = [
            { label: 'A', value: 1 },
            { label: 'B', value: 'b' },
        ];
        [
            element.shadowRoot!.querySelector<HTMLInputElement>('[id=checkboxes0]')!,
            element.shadowRoot!.querySelector<HTMLInputElement>('[id=checkboxes1]')!,
        ].forEach(input => {
            input.checked = true;
            input.dispatchEvent(new Event('change'));
        });
        expect(element.value).toEqual(['1', 'b']);
    });

    it('change event', done => {
        element.options = [{ label: 'L1', value: 'V1' }];
        element.addEventListener('change', (event: any) => {
            expect(event.detail).toEqual(['V1']);
            done();
        });
        input = element.shadowRoot!.querySelector<HTMLInputElement>('[id=checkboxes0]')!;
        input.checked = true;
        input.dispatchEvent(new Event('change'));
    });
});
