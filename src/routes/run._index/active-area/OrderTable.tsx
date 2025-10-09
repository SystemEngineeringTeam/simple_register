/* eslint-disable react/no-create-ref */
import type { ReactElement, RefObject } from "react";
import type { OrderRowInput } from "@/lib/stores/current-order";
import { useStore } from "@nanostores/react";
import { styled as p } from "panda/jsx";
import { createRef, useEffect, useMemo, useRef, useState } from "react";

import { Table } from "@/components/atomic/Table";
import { wrapValidation } from "@/lib/arktype";
import {
  focusReceiptInput,
  registerOrderFocusHelpers,
} from "@/lib/focus-manager";
import {
  $currentOrder,
  appendOrderRow,
  createOrderRow,
  findDiscountByNumber,
  findItemByNumber,
  updateOrderRows,
} from "@/lib/stores/current-order";
import { $orderPhase } from "@/lib/stores/phase";
import { DiscountNumber, ItemNumber } from "@/types/item";
import { OrderTableRow } from "./OrderTableRow";

export type KeyField = "productCode" | "quantity";

type RowRefs = Record<KeyField, RefObject<HTMLInputElement | null>>;

function createRowRefs(): RowRefs {
  return {
    productCode: createRef<HTMLInputElement>(),
    quantity: createRef<HTMLInputElement>(),
  };
}

function isRowEmpty(row: OrderRowInput): boolean {
  return row.productCode === "" && row.quantity === "";
}

export function OrderTable(): ReactElement {
  const currentOrder = useStore($currentOrder);
  const { rows, discountCode } = currentOrder;
  const orderPhase = useStore($orderPhase);
  const isActive = orderPhase === "SELECT_ITEMS";

  const discountInfo = useMemo(() => {
    if (!discountCode || discountCode.trim() === "") {
      return null;
    }
    const discountNumber = wrapValidation(
      DiscountNumber(Number.parseInt(discountCode, 10)),
    ).unwrapOr(null);
    if (discountNumber == null) {
      return null;
    }
    return findDiscountByNumber(discountNumber);
  }, [discountCode]);

  const getDiscountAmountForRow = useMemo(() => (productCode: string): number => {
    if (!discountInfo || !productCode || productCode.trim() === "") {
      return 0;
    }
    const itemNumber = wrapValidation(
      ItemNumber(Number.parseInt(productCode, 10)),
    ).unwrapOr(null);
    if (itemNumber == null) {
      return 0;
    }
    const item = findItemByNumber(itemNumber);
    if (!item) {
      return 0;
    }
    return discountInfo.amount[item.id] ?? 0;
  }, [discountInfo]);

  const displayRows = useMemo<OrderRowInput[]>(() => {
    const nonEmptyRows = rows.filter((row) => !isRowEmpty(row));
    if (nonEmptyRows.length === 0) {
      return rows[0] ? [rows[0]] : [];
    }

    const nextRows = [...nonEmptyRows];
    const last = rows[rows.length - 1];
    if (last && isRowEmpty(last)) {
      nextRows.push(last);
    }
    return nextRows;
  }, [rows]);

  const [rowRefs, setRowRefs] = useState<RowRefs[]>(() => displayRows.map(() => createRowRefs()));

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setRowRefs((previous) => {
      if (previous.length === displayRows.length) {
        return previous;
      }
      if (previous.length < displayRows.length) {
        return [
          ...previous,
          ...Array.from({ length: displayRows.length - previous.length }, () => createRowRefs()),
        ];
      }
      return previous.slice(0, displayRows.length);
    });
  }, [displayRows.length]);

  const [pendingFocusIndex, setPendingFocusIndex] = useState<number>();
  const tableRef = useRef<HTMLTableElement>(null);
  const hasActivatedRef = useRef(false);

  const rowIndexMap = useMemo(() => {
    const map = new Map<number, number>();
    rows.forEach((row, index) => {
      map.set(row.id, index);
    });
    return map;
  }, [rows]);

  useEffect(() => {
    if (!isActive) {
      hasActivatedRef.current = false;
      return;
    }
    if (hasActivatedRef.current) {
      return;
    }
    if (pendingFocusIndex != null) {
      hasActivatedRef.current = true;
      return;
    }

    const firstInput = rowRefs[0]?.productCode.current;
    if (firstInput) {
      firstInput.focus();
      firstInput.select();
      hasActivatedRef.current = true;
    }
  }, [isActive, pendingFocusIndex, rowRefs]);

  useEffect(() => {
    registerOrderFocusHelpers({
      focusFirstRowProductInput: () => {
        if (displayRows.length === 0) {
          return;
        }
        setPendingFocusIndex(0);
      },
      focusLastRowProductInput: () => {
        if (displayRows.length === 0) {
          return;
        }
        setPendingFocusIndex(displayRows.length - 1);
      },
    });
    return (): void => {
      registerOrderFocusHelpers({});
    };
  }, [displayRows.length]);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    if (pendingFocusIndex == null) {
      return;
    }
    const input = rowRefs[pendingFocusIndex]?.productCode.current;
    if (input) {
      input.focus();
      input.select();
      hasActivatedRef.current = true;
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setPendingFocusIndex(undefined);
    }
  }, [isActive, pendingFocusIndex, rowRefs]);

  const handleChange = (rowId: number, field: KeyField, value: string): void => {
    updateOrderRows((previousRows) =>
      previousRows.map((row) => row.id === rowId ? { ...row, [field]: value } : row),
    );
  };

  const handleFocus = (rowId: number, field: KeyField): void => {
    if (!isActive || field !== "quantity") {
      return;
    }
    const targetIndex = rowIndexMap.get(rowId);
    if (targetIndex == null) {
      return;
    }
    if (targetIndex === rows.length - 1) {
      appendOrderRow();
    }
  };

  const handleKeyDown = (row: OrderRowInput, displayIndex: number, field: KeyField, event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!isActive) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const currentValue = event.currentTarget.value.trim();
      const targetIndex = rowIndexMap.get(row.id);
      if (targetIndex == null) {
        return;
      }

      if (field === "productCode") {
        const isLastDisplayRow = displayIndex === displayRows.length - 1;
        if (isLastDisplayRow && currentValue === "") {
          $orderPhase.set("CHECK_DISCOUNT");
          return;
        }
        if (currentValue === "") {
          return;
        }
      }

      updateOrderRows((previousRows) => {
        const index = previousRows.findIndex((candidate) => candidate.id === row.id);
        if (index === -1) {
          return previousRows;
        }

        const nextRows = [...previousRows];
        const targetRow = nextRows[index];
        if (!targetRow) {
          return previousRows;
        }
        if ((field === "quantity" || field === "productCode") && targetRow.quantity.trim() === "") {
          nextRows[index] = { ...targetRow, quantity: "1" };
        }
        return nextRows;
      });

      if (targetIndex === rows.length - 1) {
        appendOrderRow();
      }

      setPendingFocusIndex(displayIndex + 1);
    } else if (event.key === "Backspace") {
      event.preventDefault();

      if (field === "productCode" && displayIndex === 0 && isRowEmpty(row)) {
        $orderPhase.set("CHECK_RECEIPT_NUMBER");
        focusReceiptInput();
        return;
      }

      updateOrderRows((previousRows) => {
        const index = previousRows.findIndex((candidate) => candidate.id === row.id);
        if (index === -1) {
          return previousRows;
        }

        const clearedRows = previousRows.map((candidate, idx) =>
          idx === index ? { ...candidate, [field]: "" } : candidate,
        );

        const allEmpty = clearedRows.every(isRowEmpty);
        if (allEmpty) {
          const first = clearedRows[0] ?? createOrderRow();
          return [first];
        }

        return clearedRows.filter((candidate, idx) =>
          idx === 0 || !isRowEmpty(candidate),
        );
      });

      setTimeout(() => {
        if (field === "quantity") {
          const input = rowRefs[displayIndex]?.productCode.current;
          input?.focus();
          input?.select();
        } else if (field === "productCode" && displayIndex > 0) {
          const input = rowRefs[displayIndex - 1]?.quantity.current;
          input?.focus();
          input?.select();
        }
      }, 0);
    }
  };

  return (
    <p.table fontSize="sm" ref={tableRef} w="full">
      <Table.head>
        <p.tr>
          <p.th w="10">#</p.th>
          <p.th w="20">商品番号</p.th>
          <p.th textAlign="left" w="stretch">商品名</p.th>
          <p.th w="20">
            価格&ensp;
            <p.span color="gray.500">[円]</p.span>
          </p.th>
          <p.th w="16">個数</p.th>
          <p.th w="20">
            割引&ensp;
            <p.span color="gray.500">[円]</p.span>
          </p.th>
          <p.th w="16">小計</p.th>
        </p.tr>
      </Table.head>
      <Table.body>
        {displayRows.map((row, index) => (
          <OrderTableRow
            disabled={!isActive}
            discountAmount={getDiscountAmountForRow(row.productCode) * Number.parseInt(row.quantity ?? "1", 10)}
            index={index + 1}
            key={row.id}
            onChange={(field: KeyField, value: string) => {
              handleChange(row.id, field, value);
            }}
            onFocus={(field: KeyField) => {
              handleFocus(row.id, field);
            }}
            onKeyDown={(field: KeyField, event: React.KeyboardEvent<HTMLInputElement>) => {
              handleKeyDown(row, index, field, event);
            }}
            productCode={row.productCode}
            productCodeRef={rowRefs[index]?.productCode}
            quantity={row.quantity}
            quantityRef={rowRefs[index]?.quantity}
          />
        ))}
      </Table.body>
    </p.table>
  );
}
