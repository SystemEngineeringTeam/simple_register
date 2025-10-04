import { defineGlobalStyles, defineKeyframes } from "@pandacss/dev";

// eslint-disable-next-line @pandacss/no-config-function-in-source
export const highlight = defineGlobalStyles({
  div: {
    "& [data-highlight-warn='true']": {
      animationDuration: "2s",
      animationName: "highlight-warn",
      animationIterationCount: "infinite",
      animationTimingFunction: "steps(2, jump-none)",
    },
  },
});

// eslint-disable-next-line @pandacss/no-config-function-in-source
export const highlightKeyframes = defineKeyframes({
  "highlight-warn": {
    "0%": {
      background: "yellow.200",
    },
    "100%": {
      background: "transparent",
    },
  },
});
