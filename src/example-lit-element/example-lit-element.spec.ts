import { MyElement } from './example-lit-element';

describe('example-lit-element', () => {
    it('smoke', () => {
        const element = new MyElement();
        expect(element).toBeTruthy();
    });

    it('prop', () => {
        const element = new MyElement();
        expect(element.foo).toBe('foo bar');
    });
});
