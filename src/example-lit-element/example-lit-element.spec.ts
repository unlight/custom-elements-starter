import { ExampleLitElement } from './example-lit-element';

describe('example-lit-element', () => {
    it('smoke', () => {
        const element = new ExampleLitElement();
        expect(element).toBeTruthy();
    });

    it('prop', () => {
        const element = new ExampleLitElement();
        expect(element.foo).toBe('foo bar');
    });
});
