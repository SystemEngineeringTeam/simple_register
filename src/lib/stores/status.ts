import type { Nullable } from "@/types/utils";
import { atom } from "nanostores";

export type Status
  = | {
    type: "RESET_PROGRESS";
    progress: number;
    receiptNumber: Nullable<number>;
  }
  | {
    type: "RESET";
    receiptNumber: Nullable<number>;
  }
  | {
    type: "INVALID_VALUE";
    receiptNumber: Nullable<number>;
    detail:
      | {
        type: "RECEIPT_NUMBER";
        receiptNumber: number;
      }
      | {
        type: "ITEM_EMPTY";
      }
      | {
        type: "ITEM_NUMBER";
        itemNumber: string;
      }
      | {
        type: "QUANTITY_TOO_LARGE";
        quantity: number;
      }
      | {
        type: "DISCOUNT_NUMBER";
        discountNumber: string;
      }
      | {
        type: "DEPOSIT_INSUFFICIENT";
        deposit: number;
        total: number;
      };
  }
  | {
    type: "ORDER_CONFIRMED";
    receiptNumber: Nullable<number>;
  };

export const $status = atom<Nullable<Status>>();

let currentTimeoutId: ReturnType<typeof setTimeout> | null = null;

export function setStatusWithTimeout(
  status: Nullable<Status>,
  durationMs: number = 5000,
): void {
  if (currentTimeoutId != null) {
    clearTimeout(currentTimeoutId);
    currentTimeoutId = null;
  }

  $status.set(status);

  if (status == null || durationMs <= 0) {
    return;
  }

  // 指定時間後に自動クリア
  currentTimeoutId = setTimeout(() => {
    $status.set(null);
    currentTimeoutId = null;
  }, durationMs);
}
