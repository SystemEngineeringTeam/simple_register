import { defineGlobalStyles, defineKeyframes } from "@pandacss/dev";

// eslint-disable-next-line @pandacss/no-config-function-in-source
export const highlight = defineGlobalStyles({
  div: {
    "& [data-highlight-warn='true']": {
      "animationDuration": "2s",
      "animationName": "highlight-warn",
      "animationIterationCount": "infinite",
      "animationTimingFunction": "steps(2, jump-none)",
      "& > [data-highlight-flash='true']": {
        animation: "highlight-flash",
        animationDuration: "1s",
        animationIterationCount: "infinite",
        animationTimingFunction: "steps(2, jump-none)",
      },
    },
    "& [data-highlight-warn-once='true']": {
      animationDuration: "1s",
      animationName: "highlight-warn",
      animationIterationCount: "3",
      animationTimingFunction: "steps(2, jump-none)",
    },
    "& [data-highlight-warn-once-longer='true']": {
      animationDuration: "2s",
      animationName: "highlight-warn",
      animationIterationCount: "5",
      animationTimingFunction: "steps(2, jump-none)",
    },
  },
});

// eslint-disable-next-line @pandacss/no-config-function-in-source
export const highlightKeyframes = defineKeyframes({
  "highlight-flash": {
    "0%": {
      opacity: 1,
    },
    "100%": {
      opacity: 0,
    },
  },
  "highlight-warn": {
    "0%": {
      background: "highlight.bg",
      color: "black",
    },
    "100%": {
      background: "transparent",
    },
  },
});
