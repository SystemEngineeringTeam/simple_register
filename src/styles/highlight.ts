import { defineGlobalStyles, defineKeyframes } from "@pandacss/dev";

// eslint-disable-next-line @pandacss/no-config-function-in-source
export const highlight = defineGlobalStyles({
  div: {
    "& [data-highlight-warn='true']": {
      "animationDuration": "2s",
      "animationName": "highlight-warn",
      "animationIterationCount": "infinite",
      "animationTimingFunction": "steps(2, jump-none)",
      "& > .flash": {
        animation: "ping",
        animationDuration: "2s",
      },
    },
    "& [data-highlight-warn-once='true']": {
      animationDuration: "1s",
      animationName: "highlight-warn",
      animationIterationCount: "3",
      animationTimingFunction: "steps(2, jump-none)",
    },
  },
});

// eslint-disable-next-line @pandacss/no-config-function-in-source
export const highlightKeyframes = defineKeyframes({
  "highlight-warn": {
    "0%": {
      background: "highlight.bg",
    },
    "100%": {
      background: "transparent",
    },
  },
});
