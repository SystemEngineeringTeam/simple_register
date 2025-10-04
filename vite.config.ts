import pandacss from "@pandacss/dev/postcss";
import { reactRouter } from "@react-router/dev/vite";
import AutoImport from "unplugin-auto-import/vite";
import Unfonts from "unplugin-fonts/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// eslint-disable-next-line node/prefer-global/process
const host = process.env["TAURI_DEV_HOST"];

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),

    // NOTE: インポートなしにアイコンを使用できるようにするための設定
    // ref: https://github.com/unplugin/unplugin-icons/blob/3831eb07d96e94d503df62f45512f3ca3e50cc26/README.md#auto-importing
    AutoImport({
      resolvers: [
        IconsResolver({
          prefix: "Icon",
          extension: "jsx",
        }),
      ],
    }),
    Icons({
      autoInstall: true,
      compiler: "jsx",
      jsx: "react",
    }),
    Unfonts({
      custom: {
        families: [
          {
            name: "UDEV Gothic 35NF",
            src: "./src/assets/fonts/UDEVGothic35NF-*",
          },
          {
            name: "LINE Seed JP",
            src: "./src/assets/fonts/LINESeedJP_*",
          },
        ],
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [
        // @ts-expect-error: 本来 `postcss.config.cjs` で設定するものをここで設定している
        pandacss,
        // NOTE: PandaCSS で勧められている `autoprefixer`, `@csstools/postcss-cascade-layers` を内包している `postcss-preset-env` を使用
        // ref: https://github.com/csstools/postcss-plugins/tree/27b9126dc2f049aa20b02f7e3dbbb2c5c6c87f43/plugin-packs/postcss-preset-env
        // postcssPresetEnv,
      ],
    },
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host ?? false,
    hmr:
      host != null
        ? {
            protocol: "ws",
            host,
            port: 1421,
          }
        : {},
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
});
