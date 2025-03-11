import { defineConfig } from "@unocss/vite";
import transformerDirectives from "@unocss/transformer-directives";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import presetUno from "@unocss/preset-uno";
import type { Theme } from "@unocss/preset-uno";
export default defineConfig<Theme>({
  content: {
    pipeline: {
      exclude: ["node_modules", "dist"]
    }
  },
  rules: [],
  theme: {},
  shortcuts: {},
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [presetUno({ dark: "class" })]
});
