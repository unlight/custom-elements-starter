import './example-lit-element';

import { text, withKnobs } from '@storybook/addon-knobs';
import { html } from 'lit-element';

export default {
    title: 'Lit Element',
    component: 'example-lit-element',
    decorators: [withKnobs],
};

export const litElement = () =>
    html`
        <example-lit-element .foo="${text('foo', 'Hello')}"></example-lit-element>
    `;
