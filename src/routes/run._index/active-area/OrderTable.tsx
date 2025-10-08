/* eslint-disable react/no-create-ref */
import type { ReactElement, RefObject } from "react";
import { styled as p } from "panda/jsx";
import { createRef, useEffect, useRef, useState } from "react";

import { Table } from "@/components/atomic/Table";
import { OrderTableRow } from "./OrderTableRow";

export type KeyField = "productCode" | "quantity";

type Row = {
  id: number;
  productCode: string;
  quantity: string;
};
type RowRefs = Record<KeyField, RefObject<HTMLInputElement | null>>;

const initialRow = (): Row => ({ id: Date.now() + Math.random(), productCode: "", quantity: "" });

export function OrderTable(): ReactElement {
  const [rows, setRows] = useState<Row[]>(() => [initialRow()]);
  const tableRef = useRef<HTMLTableElement>(null);

  // 各行の各セル（商品番号・個数）にrefを持つ
  const [rowRefs, setRowRefs] = useState<RowRefs[]>(() => [
    { productCode: createRef<HTMLInputElement>(), quantity: createRef<HTMLInputElement>() },
  ]);

  // rowsの増減に合わせてrefも増減
  if (rowRefs.length < rows.length) {
    setRowRefs((prev) => [
      ...prev,
      ...Array.from({ length: rows.length - prev.length }, () => ({ productCode: createRef<HTMLInputElement>(), quantity: createRef<HTMLInputElement>() })),
    ]);
  } else if (rowRefs.length > rows.length) {
    setRowRefs((prev) => prev.slice(0, rows.length));
  }

  // 完全に空の行は1つだけ残す
  const nonEmptyRows = rows.filter((r) => r.productCode !== "" || r.quantity !== "");
  let displayRows: Row[] = [];
  if (nonEmptyRows.length === 0) {
    if (rows[0])
      displayRows = [rows[0]];
  } else {
    displayRows = [...nonEmptyRows];
    // 最後の行が空なら1つだけ追加
    const last = rows[rows.length - 1];
    if (last && last.productCode === "" && last.quantity === "") {
      displayRows.push(last);
    }
  }

  const handleChange = (rowId: number, field: KeyField, value: string): void => {
    setRows((prev) => prev.map((r) => r.id === rowId ? { ...r, [field]: value } : r));
  };

  // 個数セルにフォーカス時、末尾なら新行追加
  const handleFocus = (rowIdx: number, field: KeyField): void => {
    if (field === "quantity") {
      setRows((prev) => {
        if (rowIdx === prev.length - 1) {
          return [...prev, initialRow()];
        }
        return prev;
      });
    }
  };

  const [pendingFocusRow, setPendingFocusRow] = useState<number>();
  const handleKeyDown = (rowIdx: number, field: KeyField, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      // 商品番号が空なら何もしない
      if (rows[rowIdx]?.productCode === "") {
        return;
      }

      setRows((prev) => {
        let updated = prev.map((r, i) => {
          if (i !== rowIdx)
            return r;
          // 個数セルでEnter時、空なら'1'で補完
          if (field === "quantity" && (!r.quantity || r.quantity === "")) {
            return { ...r, quantity: "1" };
          }
          // 商品番号セルでEnter時、quantityも空なら'1'で補完
          if (field === "productCode" && (!r.quantity || r.quantity === "")) {
            return { ...r, quantity: "1" };
          }
          return r;
        });
        if (rowIdx === prev.length - 1) {
          updated = [...updated, initialRow()];
        }
        return updated;
      });
      setPendingFocusRow(rowIdx + 1);
    } else if (e.key === "Tab") {
      // Tabで次セル（デフォルト挙動）
    } else if (e.key === "Backspace") {
      // Backspaceでセルを空にし前のセルに戻る
      e.preventDefault();
      setRows((prev) => {
        // すべて空なら1行だけ残す
        const updated = prev.map((r, i) =>
          i === rowIdx ? { ...r, [field]: "" } : r,
        );
        const allEmpty = updated.every((r) => r.productCode === "" && r.quantity === "");
        if (allEmpty) {
          return updated[0] ? [updated[0]] : [];
        } else {
          return updated.filter((r, i) => i === 0 || r.productCode !== "" || r.quantity !== "");
        }
      });
      // 前のセルにフォーカス（例: 個数→商品番号、商品番号→前行の個数）
      setTimeout(() => {
        if (field === "quantity") {
          const input = rowRefs[rowIdx]?.productCode.current;
          input?.focus();
          input?.select();
        } else if (field === "productCode" && rowIdx > 0) {
          const input = rowRefs[rowIdx - 1]?.quantity.current;
          input?.focus();
          input?.select();
        }
      }, 0);
    }
  };

  // 新しい行が追加されたときに自動でフォーカス
  useEffect(() => {
    if (pendingFocusRow != null && rowRefs[pendingFocusRow]?.productCode.current) {
      rowRefs[pendingFocusRow]?.productCode.current.focus();
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setPendingFocusRow(undefined);
    }
  }, [rowRefs, pendingFocusRow]);

  return (
    <p.table ref={tableRef} w="full">
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
        {displayRows.map((row, idx) => (
          <OrderTableRow
            index={idx + 1}
            key={row.id}
            onChange={(field: KeyField, value: string) => {
              handleChange(row.id, field, value);
            }}
            onFocus={(field: KeyField) => {
              handleFocus(idx, field);
            }}
            onKeyDown={(field: KeyField, e: React.KeyboardEvent<HTMLInputElement>) => {
              handleKeyDown(idx, field, e);
            }}
            productCode={row.productCode}
            productCodeRef={rowRefs[idx]?.productCode}
            quantity={row.quantity}
            quantityRef={rowRefs[idx]?.quantity}
          />
        ))}
      </Table.body>
    </p.table>
  );
}
