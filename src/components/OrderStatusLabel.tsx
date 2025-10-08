import type { ReactElement } from "react";
import type { OrderStatus } from "@/types/order";
import { styled as p } from "panda/jsx";
import { OrderStatusImpl } from "@/lib/order";

export function OrderStatusLabel({ orderStatus }: { orderStatus: OrderStatus }): ReactElement {
  const orderStatusImpl = OrderStatusImpl(orderStatus);
  const color = orderStatusImpl.toColor();

  return (
    <p.div
      border="1px solid"
      fontSize="sm"
      fontWeight="bold"
      mx="auto"
      px="2"
      rounded="full"
      style={{
        backgroundColor: color.bg,
        borderColor: color.onBg,
        color: color.text,
      }}
      w="fit-content"
    >
      {orderStatusImpl.toLabelStr()}
    </p.div>
  );
}
