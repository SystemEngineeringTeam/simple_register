import type { ReactElement } from "react";
import { useStore } from "@nanostores/react";
import { styled as p } from "panda/jsx";
import { useEffect, useRef } from "react";
import { match, P } from "ts-pattern";
import { Expanded } from "@/components/atomic/Expanded";
import { ItemImpl } from "@/lib/item";
import { OrderStatusImpl } from "@/lib/order";
import { $orders } from "@/lib/stores/orders";
import { dateToStr } from "@/lib/time";

const Thead = p("thead", {
  base: {
    "position": "sticky",
    "top": 0,
    "zIndex": 10,
    "& > tr": {
      "bg": "gray.200",
      "& > th": {
        p: "2",
        verticalAlign: "top",
        bg: "gray.200",
      },
    },
  },
});

const Tbody = p("tbody", {
  base: {
    "& > tr": {
      "borderBottom": "1px solid",
      "borderColor": "gray.200",
      "& > td": {
        verticalAlign: "top",
        p: "1",
      },
    },
  },
});

const TableCell = p("td", {
  base: {
    fontFamily: "mono",
  },
  variants: {
    align: {
      center: { textAlign: "center" },
      right: { textAlign: "right" },
    },
  },
});

const OrderItem = p("div", {
  base: {
    alignItems: "center",
    display: "flex",
    gap: "2",
  },
});

const ItemNumber = p("div", {
  base: {
    color: "gray.600",
    fontSize: "sm",
    textAlign: "center",
    w: "16",
  },
});

const ItemName = p("div", {
  base: {
    flex: "1",
  },
});

const ItemPrice = p("div", {
  base: {
    fontFamily: "mono",
    color: "gray.600",
    textAlign: "right",
    w: "20",
  },
});

const ItemAmount = p("div", {
  base: {
    fontFamily: "mono",
    fontWeight: "bold",
    textAlign: "center",
    w: "12",
  },
});

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
          <Thead>
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
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <p.tr key={order.id}>
                <p.td />
                <TableCell align="right">{order.receiptNumber}</TableCell>
                <p.td>
                  {order.items.map((item, index) => (
                    <OrderItem key={item.id}>
                      <ItemNumber>
                        {String(index + 1).padStart(2, "0")}
                      </ItemNumber>
                      <ItemName>
                        {
                          match(ItemImpl(item).getGroup()?.name)
                            .with(P.nullish, () => "")
                            .otherwise((name) => `${name}/`)
                        }
                        {item.name}
                      </ItemName>
                      <ItemPrice>{item.price}</ItemPrice>
                      <ItemAmount>{item.amount}</ItemAmount>
                    </OrderItem>
                  ))}
                </p.td>
                <TableCell
                  align="center"
                  fontSize="sm"
                >
                  {OrderStatusImpl(order.status).toLabelStr()}
                </TableCell>
                <TableCell align="center">
                  {dateToStr(order.createdAt).timeOnly}
                </TableCell>
                <TableCell align="center">
                  {order.status === "PICKED_UP"
                    ? new Date(
                        order.statusChange.find((sc) => sc.to === "PICKED_UP")?.at ?? order.createdAt,
                      ).toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"}
                </TableCell>
              </p.tr>
            ))}
          </Tbody>
        </p.table>
      </p.div>
    </Expanded>
  );
}
