import './checkbox-list.element';
import { CheckboxListElement } from './checkbox-list.element';

fdescribe('CheckboxListElement', () => {
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
        expect(element instanceof CheckboxListElement).toBeTruthy();
    });

    it('render several options', () => {
        element.options = [
            { label: 'A', value: 1 },
            { label: 'B', value: 'b' },
        ];
        const label = element.shadowRoot!.querySelector<HTMLLabelElement>('[for=checkboxes1]')!;
        expect(label).toBeInstanceOf(HTMLLabelElement);
        expect(label.innerText).toEqual('B');
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
});
