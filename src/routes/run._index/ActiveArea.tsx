import type { ReactElement } from "react";
import { css } from "panda/css";
import { VStack } from "panda/jsx";
import { Expanded } from "@/components/atomic/Expanded";
import { OrderTable } from "./active-area/OrderTable";

// type OrderPhase = "order_number" | "menu_selection" | "subtotal" | "payment";
type OrderPhase
  = | "CHECK_RECEIPT_NUMBER"
    | "SELECT_ITEMS"
    | "CONFIRM_SUBTOTAL"
    | "PROCESS_PAYMENT";

function LeftArea(): ReactElement {
  return <Expanded></Expanded>;
}

function RightArea(): ReactElement {
  return (
    <VStack alignItems="flex-start" w="100%">
      <Expanded>
        <OrderTable />
      </Expanded>
    </VStack>
  );
}

export function ActiveArea(): ReactElement {
  return (
    <Expanded
      className={css({
        "& > *": {
          outline: "1px solid",
          outlineColor: "gray.200",
        },
      })}
      display="grid"
      gridTemplateColumns="1fr 1fr"
    >
      <LeftArea />
      <RightArea />
    </Expanded>
  );
}
