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
  };

export const $status = atom<Nullable<Status>>();
