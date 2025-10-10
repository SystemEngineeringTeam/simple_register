import { cva } from "panda/css";
import { styled as p } from "panda/jsx";

export const cvaExpanded = cva({
  base: {
    w: "full",
    h: "full",
  },
  variants: {
    basedOn: {
      container: {
        w: "full",
        h: "full",
      },
      restOfHeader: {
        h: { base: "calc(100vh - 4rem)", lg: "calc(100vh - 5rem)" },
      },
      screen: {
        h: ["100dvh", "100vh"],
      },
    },
    items: {
      center: {
        display: "grid",
        placeItems: "center",
        alignItems: "center",
      },
    },
  },
});

export const Expanded = p("div", cvaExpanded);
