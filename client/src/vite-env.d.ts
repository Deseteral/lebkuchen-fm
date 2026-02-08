/// <reference types="vite/types/importMeta" />

declare module '*.module.css' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const classes: any;
  export default classes;
}

declare module '*.png' {
  const src: string;
  export default src;
}

// TODO: Remove when all icons are removed.
declare module '*.svg' {
  const src: string;
  export default src;
}

declare const __APP_VERSION__: string;
