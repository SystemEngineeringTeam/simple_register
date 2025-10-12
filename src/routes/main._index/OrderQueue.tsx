import type { ReactElement } from "react";
import type { ItemNumber } from "@/types/item";
import type { OmitStrict } from "@/types/utils";
import { useStore } from "@nanostores/react";
import { styled as p } from "panda/jsx";
import { memo, useEffect, useMemo, useRef } from "react";
import { match, P } from "ts-pattern";
import { Expanded } from "@/components/atomic/Expanded";
import { Table } from "@/components/atomic/Table";
import { OrderStatusLabel } from "@/components/OrderStatusLabel";
import { wrapValidation } from "@/lib/arktype";
import { ItemImpl } from "@/lib/item";
import { OrderStatusImpl, ReceiptNumberImpl } from "@/lib/order";
import { $currentOrder, $depositAmount, $discountCode, $normalizedCurrentOrderItems, findDiscountByNumber } from "@/lib/stores/current-order";
import { $items } from "@/lib/stores/items";
import { $lastConfirmedOrderId, $lastStatusChangedReceiptNumber, $orders } from "@/lib/stores/orders";
import { $orderPhase } from "@/lib/stores/phase";
import { dateToStr } from "@/lib/time";
import { Discount, DiscountNumber } from "@/types/item";
import { Order } from "@/types/order";

type DisplayOrderItem = Order["items"][number] & { itemNumber: ItemNumber | null };
type DisplayOrder = OmitStrict<Order, "items"> & { items: DisplayOrderItem[] };

// メモ化された注文行コンポーネント
const OrderQueueRow = memo(({ order, isLastConfirmed, isLastStatusChanged }: { order: DisplayOrder; isLastConfirmed?: boolean; isLastStatusChanged?: boolean }): ReactElement => (
  <p.tr
    data-highlight-warn-once={isLastConfirmed === true || isLastStatusChanged === true ? "true" : undefined}
    key={order.id}
    style={{ backgroundColor: OrderStatusImpl(order.status).toColor().bg }}
  >
    <p.td />
    <Table.cell align="right">
      <p.p bg="white" border="1px solid" ml="auto" mr="0" textAlign="center" w="[30px]">
        {ReceiptNumberImpl(order.receiptNumber).toStr()}
      </p.p>
    </Table.cell>
    <p.td>
      {order.items.map((item) => (
        <Table.OrderItem key={item.id}>
          <Table.ItemNumber position="relative">
            {item.itemNumber != null
              ? `T${ReceiptNumberImpl(item.itemNumber).toStr()}`
              : "--"}
          </Table.ItemNumber>
          <Table.ItemName>
            {
              match(ItemImpl(item).getGroup()?.name)
                .with(P.nullish, () => "")
                .otherwise((name) => `${name}/`)
            }
            {item.name}
          </Table.ItemName>
          <Table.ItemPrice>{item.price}</Table.ItemPrice>
          <Table.ItemAmount>{item.amount}</Table.ItemAmount>
        </Table.OrderItem>
      ))}
    </p.td>
    <Table.cell
      align="center"
      fontSize="sm"
    >
      <OrderStatusLabel orderStatus={order.status} />
    </Table.cell>
    <Table.cell align="center">
      {dateToStr(order.createdAt).timeOnly}
    </Table.cell>
    <Table.cell align="center">
      {order.status === "PICKED_UP"
        ? new Date(
            order.statusChange.find((sc) => sc.to === "PICKED_UP")?.at ?? order.createdAt,
          ).toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "--:--"}
    </Table.cell>
  </p.tr>
));

// 確定済み注文のリスト（current-order の影響を受けない）
const ConfirmedOrdersList = memo((): ReactElement => {
  const orders = useStore($orders);
  const items = useStore($items);
  const lastConfirmedOrderId = useStore($lastConfirmedOrderId);
  const lastStatusChangedReceiptNumber = useStore($lastStatusChangedReceiptNumber);

  const ordersWithItemNumbers = useMemo<DisplayOrder[]>(() => {
    const itemNumberMap = new Map<string, ItemNumber>();

    items.forEach((group) => {
      group.children.forEach((child) => {
        itemNumberMap.set(child.id, child.itemNumber);
      });
    });

    // すべての注文を表示（UNCONFIRMED は $orders に含まれない）
    return orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        itemNumber: itemNumberMap.get(item.id) ?? null,
      })),
    }));
  }, [orders, items]);

  return (
    <>
      {ordersWithItemNumbers.map((order) => (
        <OrderQueueRow
          isLastConfirmed={lastConfirmedOrderId === order.id}
          isLastStatusChanged={lastStatusChangedReceiptNumber === order.receiptNumber}
          key={order.id}
          order={order}
        />
      ))}
    </>
  );
});

// 未確定注文のプレビュー（current-order の変更を購読）
const UnconfirmedOrderPreview = memo((): ReactElement | null => {
  const currentOrder = useStore($currentOrder);
  const normalizedItems = useStore($normalizedCurrentOrderItems);
  const depositAmount = useStore($depositAmount);
  const orderPhase = useStore($orderPhase);
  const items = useStore($items);
  const discountCode = useStore($discountCode);

  const isActivePhase = orderPhase === "SELECT_ITEMS"
    || orderPhase === "CHECK_DISCOUNT"
    || orderPhase === "PROCESS_PAYMENT";

  if (!isActivePhase || currentOrder.orderId == null || currentOrder.receiptNumber == null) {
    return null;
  }

  if (normalizedItems.length === 0) {
    return null;
  }

  const itemNumberMap = new Map<string, ItemNumber>();
  items.forEach((group) => {
    group.children.forEach((child) => {
      itemNumberMap.set(child.id, child.itemNumber);
    });
  });

  // 預かり金額を数値に変換
  const cleanedDeposit = (depositAmount || "0").replace(/,/g, "");
  const depositAmountNumber = Number.parseInt(cleanedDeposit, 10);

  // 割引情報の処理
  const discountNumber = wrapValidation(
    DiscountNumber(Number.parseInt(discountCode, 10)),
  ).unwrapOr(null);
  const discountInfo = discountNumber != null
    ? findDiscountByNumber(discountNumber)
    : null;

  const previewOrderId = Order.get("id").from(currentOrder.orderId);
  const previewOrder: DisplayOrder = {
    id: previewOrderId,
    receiptNumber: currentOrder.receiptNumber,
    createdAt: new Date().toISOString(),
    status: "UNCONFIRMED" as const,
    statusChange: [],
    items: normalizedItems.map((item) => ({
      ...item,
      itemNumber: item.itemNumber,
    })),
    depositAmount: Order.get("depositAmount").from(depositAmountNumber),
    appliedDiscount: discountInfo ? Discount.assert(discountInfo) : null,
  };

  return <OrderQueueRow order={previewOrder} />;
});

export function OrderQueue(): ReactElement {
  const orders = useStore($orders);
  const normalizedItems = useStore($normalizedCurrentOrderItems);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 常に最下部にスクロール（注文数やプレビュー内容が変わったとき）
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
    }
  }, [orders.length, normalizedItems.length]);

  return (
    <Expanded>
      <p.div
        h="full"
        maxH="full"
        overflowY="auto"
        ref={tableContainerRef}
      >
        <p.table w="full">
          <Table.head>
            <p.tr>
              <p.th w="0"></p.th>
              <p.th w="20">受付番号</p.th>
              <p.th w="stretch">
                注文内容
                <p.div
                  display="flex"
                  fontSize="xs"
                  fontWeight="normal"
                  gap="2"
                  mt="1"
                >
                  <p.div w="16">商品番号</p.div>
                  <p.div flex="1" textAlign="left">商品</p.div>
                  <p.div textAlign="right" w="20">価格 [円]</p.div>
                  <p.div w="12">数量</p.div>
                </p.div>
              </p.th>
              <p.th w="24">状態</p.th>
              <p.th w="20">注文時刻</p.th>
              <p.th w="20">受取時刻</p.th>
            </p.tr>
          </Table.head>
          <Table.body>
            <ConfirmedOrdersList />
            <UnconfirmedOrderPreview />
          </Table.body>
        </p.table>
      </p.div>
    </Expanded>
  );
}
