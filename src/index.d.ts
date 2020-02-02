declare module '*.html' {
    const template: string;
    export default template;
}

declare module '*.scss' {
    import { css, CSSResult } from 'lit-element';
    const scss: (params: { css: typeof css }) => CSSResult;
    export default scss;
}

declare module '*.css' {
    const style: any;
    export default style;
}
