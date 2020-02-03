import { MyElement } from './my-element';

describe('my-element', () => {
    it('smoke', () => {
        const element = new MyElement();
        expect(element).toBeTruthy();
    });

    it('smoke', () => {
        const element = new MyElement();
        expect(element.foo).toBe('foo bar test');
    });
});
