import { cva } from "panda/css";
import { styled as p } from "panda/jsx";

export const cvaArticle = cva({
  base: {
    "w": "full",
    "display": "flex",
    "flexDir": "column",
    "gap": "3",
    "maxW": "1200px",
    "px": "10",
    "mdDown": {
      px: "5",
    },
    "mx": "auto",
    "& img": {
      rounded: "lg",
    },
    "& figure": {
      "& figcaption": {
        textAlign: "center",
        fontSize: "sm",
        pt: "1",
        color: "text/50",
      },
    },
  },
  variants: {
    noPadding: {
      false: {
        pt: "10",
        pb: "20",
      },
      true: {
        pt: "0",
        pb: "0",
      },
    },
  },
  defaultVariants: {
    noPadding: false,
  },
});

export const Article = p("article", cvaArticle);
