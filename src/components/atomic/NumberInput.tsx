import { cva } from "panda/css";
import { styled as p } from "panda/jsx";

export const cvaNumberInput = cva({
  base: {
    _focus: {
      outlineColor: "blue.600",
    },
    bg: "blue.100",
    fontFamily: "mono",
    outline: "4px solid",
    outlineColor: "blue.100",
    textAlign: "right",
    px: "1",
  },
});

export const NumberInput = p("input", cvaNumberInput);
