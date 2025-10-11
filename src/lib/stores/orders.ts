import type { Order } from "@/types/order";
import type { Nullable } from "@/types/utils";
import { persistentAtom } from "@nanostores/persistent";
import { getLocalStorageKey } from "@/lib/consts";
import { waitMs } from "..";

const coder = {
  encode: JSON.stringify,
  decode: JSON.parse,
};

export const $orders = persistentAtom<Order[]>(
  getLocalStorageKey("orders"),
  [],
  coder,
);

// 最後に確定された注文のIDを追跡（ハイライト用）
export const $lastConfirmedOrderId = persistentAtom<Nullable<string>>(
  getLocalStorageKey("lastConfirmedOrderId"),
  null,
  coder,
);

// 最後にステータス変更された注文の受付番号を追跡（ハイライト用）
export const $lastStatusChangedReceiptNumber = persistentAtom<Nullable<number>>(
  getLocalStorageKey("lastStatusChangedReceiptNumber"),
  null,
  coder,
);

// 注文ステータスを変更する関数
export function changeOrderStatus(
  receiptNumber: number,
  newStatus: Order["status"],
): boolean {
  const orders = $orders.get();

  // 同じ受付番号の注文を全て取得
  const matchingOrders = orders
    .map((order, index) => ({ order, index }))
    .filter(({ order }) => order.receiptNumber === receiptNumber);

  if (matchingOrders.length === 0) {
    return false;
  }

  // createdAtの降順（最新が先頭）でソートし、最新のものを取得
  const sortedMatches = matchingOrders.sort((a, b) => {
    const dateA = new Date(a.order.createdAt).getTime();
    const dateB = new Date(b.order.createdAt).getTime();
    return dateB - dateA; // 降順
  });

  const { order, index: orderIndex } = sortedMatches[0]!;

  const updatedOrders = [...orders];
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
  void waitMs(300).then(
    () => {
      $lastStatusChangedReceiptNumber.set(receiptNumber);
    },
  );

  return true;
}
