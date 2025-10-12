import type { Order } from "@/types/order";
import type { Nullable } from "@/types/utils";
import { persistentAtom } from "@nanostores/persistent";
import { SAMPLE_ORDERS } from "@/assets/data/sample-orders";
import { getLocalStorageKey } from "@/lib/consts";
import { waitMs } from "..";

const coder = {
  encode: JSON.stringify,
  decode: JSON.parse,
};

export const $orders = persistentAtom<Order[]>(
  getLocalStorageKey("orders"),
  SAMPLE_ORDERS.concat(SAMPLE_ORDERS).concat(SAMPLE_ORDERS).concat(SAMPLE_ORDERS).concat(SAMPLE_ORDERS).concat(SAMPLE_ORDERS).concat(SAMPLE_ORDERS).concat(SAMPLE_ORDERS).concat(SAMPLE_ORDERS).concat(SAMPLE_ORDERS).concat(SAMPLE_ORDERS),
  coder,
);

// 受付番号によるインデックス（パフォーマンス最適化用）
// receiptNumber -> { order: Order, index: number }[]のマッピング
const receiptNumberIndex = new Map<
  number,
  Array<{ order: Order; index: number }>
>();

// インデックスを構築する関数
function buildReceiptNumberIndex(orders: readonly Order[]): void {
  receiptNumberIndex.clear();

  orders.forEach((order, index) => {
    const receiptNumber = order.receiptNumber;
    const existing = receiptNumberIndex.get(receiptNumber) || [];
    existing.push({ order, index });
    receiptNumberIndex.set(receiptNumber, existing);
  });

  // 各受付番号のグループをcreatedAtで事前にソート（降順、最新が先頭）
  for (const [, orderGroup] of receiptNumberIndex) {
    orderGroup.sort((a, b) => {
      const dateA = new Date(a.order.createdAt).getTime();
      const dateB = new Date(b.order.createdAt).getTime();
      return dateB - dateA; // 降順
    });
  }
}

// $ordersの変更を監視してインデックスを更新
$orders.subscribe((orders) => {
  buildReceiptNumberIndex(orders);
});

// 初期化時にインデックスを構築
buildReceiptNumberIndex($orders.get());

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
  // Mapインデックスから直接該当する注文を取得（O(1)）
  const matchingOrders = receiptNumberIndex.get(receiptNumber);

  if (!matchingOrders || matchingOrders.length === 0) {
    return false;
  }

  // インデックス構築時に既にソート済みなので、最初の要素（最新）を取得
  const { order, index: orderIndex } = matchingOrders[0]!;

  const orders = $orders.get();
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
  void waitMs(300).then(() => {
    $lastStatusChangedReceiptNumber.set(receiptNumber);
  });

  return true;
}
