import type { Order } from "@/types/order";
import type { Nullable } from "@/types/utils";
import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";
import { SAMPLE_ORDERS } from "@/assets/data/sample-orders";
import { getLocalStorageKey } from "@/lib/consts";
import { waitMs } from "..";

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

// 最後にステータス変更された注文の受付番号を追跡（ハイライト用）
export const $lastStatusChangedReceiptNumber = atom<Nullable<number>>(null);

// 注文ステータスを変更する関数
export function changeOrderStatus(
  receiptNumber: number,
  newStatus: Order["status"],
): boolean {
  const orders = $orders.get();
  const orderIndex = orders.findIndex((order) => order.receiptNumber === receiptNumber);

  if (orderIndex === -1) {
    return false;
  }

  const updatedOrders = [...orders];
  const order = updatedOrders[orderIndex];

  if (!order) {
    return false;
  }

  updatedOrders[orderIndex] = {
    ...order,
    status: newStatus,
    statusChange: [
      ...order.statusChange,
      {
        to: newStatus,
        at: new Date().toISOString(),
      },
    ],
  };

  $orders.set(updatedOrders);

  // ハイライト用に受付番号を記録
  $lastStatusChangedReceiptNumber.set(null);
  void waitMs(100).then(
    () => {
      $lastStatusChangedReceiptNumber.set(receiptNumber);
    },
  );

  return true;
}
