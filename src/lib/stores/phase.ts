import { persistentAtom } from "@nanostores/persistent";
import { getLocalStorageKey } from "@/lib/consts";

const coder = {
  encode: JSON.stringify,
  decode: JSON.parse,
};

export type OrderPhase
  = | "CHECK_RECEIPT_NUMBER"
    | "SELECT_ITEMS"
    | "CHECK_DISCOUNT"
    | "PROCESS_PAYMENT";

export const $orderPhase = persistentAtom<OrderPhase>(
  getLocalStorageKey("orderPhase"),
  "CHECK_RECEIPT_NUMBER",
  coder,
);
