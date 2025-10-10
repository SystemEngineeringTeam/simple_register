import { cva } from "panda/css";
import { styled as p } from "panda/jsx";

export const cvaContent = cva({
  base: {
    "display": "flex",
    "flexDirection": "column",
    "gap": "3",
    "w": "full",

    "& ol, & ul": {},
    "& h2": {
      fontSize: "2xl",
      fontWeight: "bold",
      pt: "5",
    },
    "& h3": {
      fontSize: "xl",
      fontWeight: "bold",
      pt: "3",
    },

    "& a:not(.anchor-copy)": {
      "textDecoration": "underline",
      "color": "bkp25-blue",
      "cursor": "pointer",
      "&:hover": {
        color: "skyblue/80",
      },
      "&::after": {
        display: "inline-block",
        w: "1em",
        h: "1em",
        mx: "1",
        mb: "0.25em",
        color: "skyblue",
        content: "''",
        backgroundRepeat: "no-repeat",
        backgroundSize: "auto",
        backgroundPosition: "bottom",
        // cspell:disable-next-line
        backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%233C8BCB" d="M14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2z"/%3E%3C/svg%3E')`,
        verticalAlign: "middle",
      },
    },

    // Anchor links
    "& h2, & h3": {
      "position": "relative",
      "&:hover": {
        "& > .anchor-copy": {
          opacity: "0.6",
        },
      },
      "& > .anchor-copy": {
        opacity: "0",
        cursor: "pointer",
        position: "absolute",
        left: "-5",
        pr: "5",
        transition: "opacity 0.1s",
      },
    },

    // "& p > code": {
    //   bg: "m3-neutral.10",
    //   border: "1px solid",
    //   borderColor: "m3-neutral.30",
    //   color: "m3-neutral.80",
    //   p: "1",
    //   px: "2",
    //   fontSize: "sm",
    //   rounded: "sm",
    // },
    "& iframe": {
      height: "100px",
    },
    "& figure": {
      "width": "full",
      "maxWidth": "full",
      "mdDown": {
        p: "0",
        py: "3",
      },
      "& > *": {
        w: "fit-content",
        margin: "0 auto",
        maxH: "100vh",
      },
      "& figcaption": {
        pt: "1",
        fontSize: "sm",
        opacity: "0.8",
      },
    },
    "& blockquote": {
      pl: "3",
      borderLeft: "5px solid",
    },
  },
});

export const Content = p("div", cvaContent);
