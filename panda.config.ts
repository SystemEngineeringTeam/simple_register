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
      semanticTokens: {
        colors: {
          highlight: {
            bg: { value: "{colors.yellow.300}" },
          },
          orderStatus: {
            unconfirmed: {
              bg: { value: "{colors.white}" },
              onBg: { value: "{colors.black}" },
              text: { value: "{colors.black}" },
            },
            waitingCooking: {
              bg: { value: "{colors.orange.50}" },
              onBg: { value: "{colors.orange.500}" },
              text: { value: "{colors.orange.800}" },
            },
            waitingPickup: {
              bg: { value: "{colors.blue.50}" },
              onBg: { value: "{colors.blue.500}" },
              text: { value: "{colors.blue.800}" },
            },
            pickedUp: {
              bg: { value: "{colors.green.100}" },
              onBg: { value: "{colors.green.600}" },
              text: { value: "{colors.green.900}" },
            },
            refunded: {
              bg: { value: "{colors.red.100}" },
              onBg: { value: "{colors.red.600}" },
              text: { value: "{colors.red.900}" },
            },
            canceled: {
              bg: { value: "{colors.red.100}" },
              onBg: { value: "{colors.red.600}" },
              text: { value: "{colors.red.900}" },
            },
          },
        },
      },
    },
  },
  outdir: "panda",
  jsxFramework: "react",
});
