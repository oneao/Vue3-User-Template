import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";
import type { PluginOption } from "vite";

export function setupAutoImport(viteEnv: Env.ImportMeta) {
  // 从环境变量中提取图标相关的前缀
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv;

  // 从本地图标前缀中提取图标集合名称
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(
    `${VITE_ICON_PREFIX}-`,
    ""
  );
  const plugins: PluginOption[] = [
    Components({
      // 自动导入的组件类型声明文件
      dts: "src/types/auto-import.d.ts",
      types: [
        {
          from: "vue-router",
          names: ["RouterLink", "RouterView"],
        },
      ],

      // 配置图标解析器
      resolvers: [
        IconsResolver({
          customCollections: [collectionName], // 本地图标集合
          componentPrefix: VITE_ICON_PREFIX, // 图标组件的前缀
        }),
        ArcoResolver(),
      ],
    }),
  ];
  return plugins;
}
