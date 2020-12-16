export {};

declare global {
  declare const __DEV__: boolean;
  declare const BASE_URL: string;

  declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      BUILD_ENV: 'local' | 'prod';
      BASE_URL: string;
    }
  }
}
