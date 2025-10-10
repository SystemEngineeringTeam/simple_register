import { styled as p } from "panda/jsx";

export const Table = {
  head: p("thead", {
    base: {
      "position": "sticky",
      "top": 0,
      "zIndex": 10,
      "& > tr": {
        "bg": "gray.200",
        "& > th": {
          p: "2",
          verticalAlign: "top",
          bg: "gray.200",
        },
      },
    },
  }),

  body: p("tbody", {
    base: {
      "& > tr": {
        "borderBottom": "1px solid",
        "borderColor": "gray.200",
        "& > td": {
          verticalAlign: "top",
          p: "1",
        },
      },
    },
  }),

  cell: p("td", {
    base: {
      fontFamily: "mono",
    },
    variants: {
      align: {
        center: { textAlign: "center" },
        right: { textAlign: "right" },
      },
    },
  }),

  OrderItem: p("div", {
    base: {
      alignItems: "center",
      display: "flex",
      gap: "2",
    },
  }),

  ItemNumber: p("div", {
    base: {
      color: "gray.500",
      fontSize: "sm",
      fontFamily: "mono",
      textAlign: "center",
      w: "[40px]",
    },
  }),

  ItemName: p("div", {
    base: {
      flex: "1",
    },
  }),

  ItemPrice: p("div", {
    base: {
      fontFamily: "mono",
      color: "gray.600",
      textAlign: "right",
      w: "20",
    },
  }),

  ItemAmount: p("div", {
    base: {
      fontFamily: "mono",
      fontWeight: "bold",
      textAlign: "center",
      w: "12",
    },
  }),
};
