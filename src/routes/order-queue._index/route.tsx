import type { ReactElement } from "react";
import { OrderQueue } from "@/components/OrderQueue";

export default function (): ReactElement {
  return (
    <OrderQueue
      filterGroupId="bf8hypkw4ahz8t6bv3i0o0ot"
      filterStatus="WAITING_COOKING"
      size="large"
      visibleColumns={{
        receiptNumber: true,
        itemNumber: true,
        itemContent: true,
        status: false,
        orderTime: true,
        pickupTime: false,
      }}
    />
  );
}
