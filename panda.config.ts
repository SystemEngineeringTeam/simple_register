import { defineConfig } from "@pandacss/dev";
import { globalCss } from "src/styles/global";
import { highlight, highlightKeyframes } from "@/styles/highlight";

// ref: https://panda-css.com/docs/installation/react-router#configure-the-content
export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  globalCss: {
    ...globalCss,
    ...highlight,
  },
  theme: {
    extend: {
      tokens: {
        fonts: {
          sans: { value: "'LINE Seed JP', sans-serif" },
          mono: { value: "'UDEV Gothic 35NF', monospace" },
        },
        zIndex: {
          header: { value: 10 },
          modal: { value: 100 },
          modalContent: { value: 110 },
        },
      },
      keyframes: {
        ...highlightKeyframes,
      },
    },
  },
  outdir: "panda",
  jsxFramework: "react",
});
