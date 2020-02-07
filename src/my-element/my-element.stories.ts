import { html } from 'lit-element';

import './my-element';

export default {
    title: 'Demo My Element',
    component: 'my-element',
};

export const heading = () =>
    html`
        <h1>Hello World</h1>
        <input type="text" />
    `;

export const myElement = () =>
    html`
        <my-element></my-element>
    `;

// export const assets = () =>
//     html`
//         <img src=${new URL('../assets/logo.png', import.meta.url)} title="loaded logo" />
//     `;
