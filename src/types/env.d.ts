// src/env.d.ts
declare namespace Env {
  interface ImportMeta extends ImportMetaEnv {
    readonly VITE_BASE_URL: string;
    readonly VITE_APP_TITLE: string;
    readonly VITE_ICON_PREFIX: string;
    readonly VITE_ICON_LOCAL_PREFIX: string;
    readonly VITE_SERVER_BASEURL: string;
    readonly VITE_UPLOAD_BASEURL: string;
    readonly VITE_APP_PROXY: string;
    readonly VITE_APP_PROXY_PREFIX: string;
  }
}
