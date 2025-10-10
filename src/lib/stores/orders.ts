import type { Order } from "@/types/order";
import type { Nullable } from "@/types/utils";
import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";
import { SAMPLE_ORDERS } from "@/assets/data/sample-orders";
import { getLocalStorageKey } from "@/lib/consts";

export const $orders = persistentAtom<Order[]>(
  getLocalStorageKey("orders"),
  SAMPLE_ORDERS,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

// 最後に確定された注文のIDを追跡（ハイライト用）
export const $lastConfirmedOrderId = atom<Nullable<string>>(null);
