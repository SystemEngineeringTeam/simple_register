import type { ReactElement } from "react";
import { css } from "panda/css";
import { Expanded } from "@/components/atomic/Expanded";
import { AmountSection } from "./active-area/AmountSection";
import { OrderTable } from "./active-area/OrderTable";
import { PhaseIndicator } from "./active-area/PhaseIndicator";

function LeftArea(): ReactElement {
  return (
    <Expanded>
      <OrderTable />
    </Expanded>
  );
}

function RightArea(): ReactElement {
  return (
    <Expanded display="flex" flexDirection="column" justifyContent="space-between">
      <AmountSection />
      <PhaseIndicator />
    </Expanded>
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
