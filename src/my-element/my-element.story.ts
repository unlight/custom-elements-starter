import './my-element';

import { text, withKnobs } from '@storybook/addon-knobs';
import { html } from 'lit-element';

export default {
    title: 'My Element',
    component: 'my-element',
    decorators: [withKnobs],
};

export const myElement = () =>
    html`
        <my-element .foo="${text('foo', 'Hello')}"></my-element>
    `;

// export const assets = () =>
//     html`
//         <img src=${new URL('../assets/logo.png', import.meta.url)} title="loaded logo" />
//     `;
