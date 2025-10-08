import type { ReactElement } from "react";
import { css } from "panda/css";
import { Expanded } from "@/components/atomic/Expanded";
import { AmountSection } from "./active-area/AmountSection";
import { Information } from "./active-area/Information";
import { OrderTable } from "./active-area/OrderTable";

function LeftArea(): ReactElement {
  return (
    <Expanded>
      <Information />
    </Expanded>
  );
}

function MiddleArea(): ReactElement {
  return (
    <Expanded>
      <OrderTable />
    </Expanded>
  );
}

function RightArea(): ReactElement {
  return (
    <Expanded>
      <AmountSection />
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
      gridTemplateColumns="1fr 1fr 1fr"
    >
      <LeftArea />
      <MiddleArea />
      <RightArea />
    </Expanded>
  );
}
