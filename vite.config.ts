import { URL, fileURLToPath } from "node:url";
import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import { setupVitePlugins } from "./build/plugins/index";
import { getBuildTime } from "./build/config";

export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta;
  const { VITE_SERVER_BASEURL, VITE_APP_PROXY, VITE_APP_PROXY_PREFIX } = viteEnv;
  const buildTime = getBuildTime();

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      // 使其通过能 ~ 或 @ 导入
      alias: {
        "~": fileURLToPath(new URL("./", import.meta.url)),
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          additionalData: `@use "@/styles/scss/global.scss" as *;`
        }
      }
    },
    plugins: setupVitePlugins(viteEnv, buildTime),
    //
    define: {
      BUILD_TIME: JSON.stringify(buildTime)
    },
    server: {
      host: "0.0.0.0",
      port: 8080,
      open: true,
      // 用于配置开发服务器启动时预加载的一些客户端文件，以提高初次加载的速度。
      warmup: {
        clientFiles: ["./index.html", "./src/{pages,components}/*"]
      },
      proxy:
        VITE_APP_PROXY === "Y"
          ? {
              [VITE_APP_PROXY_PREFIX]: {
                target: VITE_SERVER_BASEURL,
                changeOrigin: true, // 跨域
                rewrite: (path) => path.replace(/^\/api/, "") //路径重写，把'/api'替换为''
                // rewrite: (path) => path.replace(new RegExp(`^${VITE_APP_PROXY_PREFIX}`), "")
              }
            }
          : undefined
    },
    // 用于生产环境，可以使用vite preview预览构建后的应用 pnpm run preview
    preview: {
      port: 9725
    }
  };
});
