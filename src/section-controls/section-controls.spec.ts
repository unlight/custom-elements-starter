import './section-controls';

fdescribe('section-controls', () => {
    let element: HTMLElement;

    beforeEach(() => {
        if (element) {
            element.remove();
        }
        element = document.createElement('section-controls');
        element.innerHTML = `<div style="width: 100; height: 50; border: 1px solid"></div>`;
    });

    it('smoke', () => {
        document.body.append(element);
    });
});
