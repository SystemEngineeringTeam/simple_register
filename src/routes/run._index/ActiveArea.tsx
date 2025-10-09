import type { ReactElement } from "react";
import type { Nullable } from "@/types/utils";
import { css } from "panda/css";
import { useEffect, useRef } from "react";
import { Expanded } from "@/components/atomic/Expanded";
import { focusReceiptInput } from "@/lib/focus-manager";
import { $currentOrder, resetCurrentOrder } from "@/lib/stores/current-order";
import { $orderPhase } from "@/lib/stores/phase";
import { $status } from "@/lib/stores/status";
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
  const progressIntervalRef = useRef<number | undefined>(undefined);
  const statusClearTimerRef = useRef<number | undefined>(undefined);
  const longPressTriggeredRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const LONG_PRESS_DURATION = 2000; // ms

    const clearTimer = (): void => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };

    const clearProgressInterval = (): void => {
      if (progressIntervalRef.current != null) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = undefined;
      }
    };

    const clearStatusTimer = (): void => {
      if (statusClearTimerRef.current != null) {
        window.clearTimeout(statusClearTimerRef.current);
        statusClearTimerRef.current = undefined;
      }
    };

    const updateProgress = (): void => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(1, elapsed / LONG_PRESS_DURATION);
      const receiptNumber = $currentOrder.get().receiptNumber;
      $status.set({ type: "RESET_PROGRESS", progress, receiptNumber });
    };

    const triggerReset = (receiptNumber: Nullable<number>): void => {
      if (longPressTriggeredRef.current) {
        return;
      }
      longPressTriggeredRef.current = true;
      clearProgressInterval();
      resetCurrentOrder();
      $orderPhase.set("CHECK_RECEIPT_NUMBER");
      requestAnimationFrame(() => {
        focusReceiptInput();
      });
      $status.set({ type: "RESET", receiptNumber });
      statusClearTimerRef.current = window.setTimeout(() => {
        $status.set(null);
      }, 1000);
    };

    const handleKeyDown = (keyboardEvent: KeyboardEvent): void => {
      if (keyboardEvent.key !== "Backspace")
        return;

      // 長押しリセットがトリガー済みなら全てブロック
      if (longPressTriggeredRef.current) {
        keyboardEvent.preventDefault();
        keyboardEvent.stopPropagation();
        keyboardEvent.stopImmediatePropagation();
        return;
      }

      // repeat（連打・長押し継続）なら通常処理をブロックしタイマーのみ継続
      if (keyboardEvent.repeat) {
        keyboardEvent.preventDefault();
        keyboardEvent.stopPropagation();
        keyboardEvent.stopImmediatePropagation();
        return;
      }

      // 初回押下時のみタイマー開始
      clearTimer();
      clearProgressInterval();
      startTimeRef.current = Date.now();
      const receiptNumber = $currentOrder.get().receiptNumber;
      updateProgress();

      // リセットタイマー
      timerRef.current = window.setTimeout(() => {
        triggerReset(receiptNumber);
        clearTimer();
      }, LONG_PRESS_DURATION);

      // 進捗更新タイマー
      progressIntervalRef.current = window.setInterval(() => {
        updateProgress();
      }, 50);
    };

    const handleKeyUp = (keyboardEvent: KeyboardEvent): void => {
      if (keyboardEvent.key !== "Backspace")
        return;
      longPressTriggeredRef.current = false;
      clearTimer();
      clearProgressInterval();
      $status.set(null);
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("keyup", handleKeyUp, { capture: true });

    return (): void => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("keyup", handleKeyUp, { capture: true });
      clearTimer();
      clearProgressInterval();
      clearStatusTimer();
      longPressTriggeredRef.current = false;
      $status.set(null);
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
