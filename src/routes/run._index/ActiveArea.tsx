import type { ReactElement } from "react";
import { css } from "panda/css";
import { useEffect, useRef } from "react";
import { Expanded } from "@/components/atomic/Expanded";
import { focusReceiptInput } from "@/lib/focus-manager";
import { resetCurrentOrder } from "@/lib/stores/current-order";
import { $orderPhase } from "@/lib/stores/phase";
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
  const timerRef = useRef<number | undefined>(undefined);
  const longPressTriggeredRef = useRef(false);

  useEffect(() => {
    const clearTimer = (): void => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };

    const triggerReset = (): void => {
      if (longPressTriggeredRef.current)
        return;
      longPressTriggeredRef.current = true;
      resetCurrentOrder();
      $orderPhase.set("CHECK_RECEIPT_NUMBER");
      requestAnimationFrame(() => {
        focusReceiptInput();
      });
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Backspace")
        return;
      if (longPressTriggeredRef.current)
        return;
      if (event.repeat)
        return;

      clearTimer();
      timerRef.current = window.setTimeout(() => {
        triggerReset();
        clearTimer();
      }, 3000);
    };

    const handleKeyUp = (event: KeyboardEvent): void => {
      if (event.key !== "Backspace")
        return;
      longPressTriggeredRef.current = false;
      clearTimer();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return (): void => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearTimer();
      longPressTriggeredRef.current = false;
    };
  }, []);

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
