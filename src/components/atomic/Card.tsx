import { cva } from "panda/css";
import { styled as p } from "panda/jsx";

export const cvaCard = cva({
  base: {
    border: "1px solid",
    borderColor: "neutral.500",
    p: "2",
    rounded: "lg",
    w: "full",
  },
  variants: {
    centralized: {
      true: {
        display: "grid",
        placeItems: "center",
        alignItems: "center",
      },
      false: {},
    },
  },
});

export const Card = p("div", cvaCard);
