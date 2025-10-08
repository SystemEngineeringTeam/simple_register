import { atom } from "nanostores";

export type OrderPhase
  = | "CHECK_RECEIPT_NUMBER"
    | "SELECT_ITEMS"
    | "CHECK_DISCOUNT"
    | "PROCESS_PAYMENT";

export const $orderPhase = atom<OrderPhase>("CHECK_RECEIPT_NUMBER");
