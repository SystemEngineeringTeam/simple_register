import type { ReactElement } from "react";
import { useStore } from "@nanostores/react";
import { styled as p } from "panda/jsx";
import { useEffect, useRef } from "react";
import { match, P } from "ts-pattern";
import { Expanded } from "@/components/atomic/Expanded";
import { Table } from "@/components/atomic/Table";
import { OrderStatusLabel } from "@/components/OrderStatusLabel";
import { ItemImpl } from "@/lib/item";
import { OrderStatusImpl } from "@/lib/order";
import { $orders } from "@/lib/stores/orders";
import { dateToStr } from "@/lib/time";

export function OrderQueue(): ReactElement {
  const orders = useStore($orders);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 新しい注文が追加されたときに最下部にスクロール
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
    }
  }, [orders.length]);

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
              <p.th w="10"></p.th>
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
            {orders.map((order, idx) => (
              <p.tr
                data-highlight-warn-once={orders.length - 1 === idx}
                key={order.id}
                style={{ backgroundColor: OrderStatusImpl(order.status).toColor().bg }}
              >
                <p.td />
                <Table.cell align="right">
                  <p.p bg="white" border="1px solid" ml="auto" mr="0" textAlign="center" w="[30px]">
                    {order.receiptNumber}
                  </p.p>
                </Table.cell>
                <p.td>
                  {order.items.map((item, index) => (
                    <Table.OrderItem key={item.id}>
                      <Table.ItemNumber>
                        {String(index + 1).padStart(2, "0")}
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
            ))}
          </Table.body>
        </p.table>
      </p.div>
    </Expanded>
  );
}
