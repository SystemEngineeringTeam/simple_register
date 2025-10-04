import type { Order } from "@/types/order";
import { persistentAtom } from "@nanostores/persistent";
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
