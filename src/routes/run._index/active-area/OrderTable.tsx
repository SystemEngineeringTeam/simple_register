import type { ReactElement } from "react";
import { styled as p } from "panda/jsx";
import { Table } from "@/components/atomic/Table";
import { OrderTableRow, OrderTableRowEmpty } from "./OrderTableRow";

export function OrderTable(): ReactElement {
  return (
    <p.table w="full">
      <Table.head>
        <p.tr>
          <p.th w="10">#</p.th>
          <p.th w="20">商品番号</p.th>
          <p.th textAlign="left" w="stretch">商品名</p.th>
          <p.th w="24">
            価格&ensp;
            <p.span color="gray.500">[円]</p.span>
          </p.th>
          <p.th w="20">個数</p.th>
          <p.th w="20">割引額</p.th>
          <p.th w="20">小計</p.th>
        </p.tr>
      </Table.head>
      <Table.body>
        <OrderTableRow />
        <OrderTableRow />
        <OrderTableRow />
        <OrderTableRowEmpty />
      </Table.body>
    </p.table>
  );
}
