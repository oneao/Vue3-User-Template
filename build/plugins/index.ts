import type { PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import VueDevtools from "vite-plugin-vue-devtools";
import progress from "vite-plugin-progress";
import { setupUnocss } from "./unocss";
import { setupHtmlPlugin } from "./html";
import { setupUnPluginIcon } from "./unplugin-icon";
import { setupAutoImport } from "./auto-import";

export function setupVitePlugins(viteEnv: Env.ImportMeta, buildTime: string) {
  const plugins: PluginOption = [
    vue(),
    VueDevtools(),
    progress(),
    setupUnocss(viteEnv),
    setupHtmlPlugin(buildTime),
    setupAutoImport(viteEnv),
    ...setupUnPluginIcon(viteEnv),
  ];

  return plugins;
}
