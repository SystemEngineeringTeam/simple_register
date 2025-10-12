import type { ReactElement } from "react";
import type { OrderStatus } from "@/types/order";
import { cva } from "panda/css";
import { styled as p } from "panda/jsx";
import { OrderStatusImpl } from "@/lib/order";

type OrderStatusLabelProps = {
  orderStatus: OrderStatus;
  size?: "small" | "large";
};

const orderStatusLabelStyles = cva({
  base: {
    borderStyle: "solid",
    fontWeight: "bold",
    mx: "auto",
    rounded: "full",
    w: "fit-content",
  },
  variants: {
    size: {
      small: {
        borderWidth: "1px",
        fontSize: "sm",
        px: "2",
      },
      large: {
        borderWidth: "3px",
        fontSize: "3xl",
        px: "6",
        py: "2",
      },
    },
  },
  defaultVariants: {
    size: "small",
  },
});

const OrderStatusLabelContainer = p("div", orderStatusLabelStyles);

export function OrderStatusLabel({ orderStatus, size = "small" }: OrderStatusLabelProps): ReactElement {
  const orderStatusImpl = OrderStatusImpl(orderStatus);
  const color = orderStatusImpl.toColor();

  return (
    <OrderStatusLabelContainer
      size={size}
      style={{
        backgroundColor: color.bg,
        borderColor: color.onBg,
        color: color.text,
      }}
    >
      {orderStatusImpl.toLabelStr()}
    </OrderStatusLabelContainer>
  );
}
