/// <reference types="react-scripts" />

// To solve the issue: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31245
/// <reference types="styled-components/cssprop" />
declare module '*.webm' {
    const src: string;
    export default src;
  }

  declare const Modernizr: any;