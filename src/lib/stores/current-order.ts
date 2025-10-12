import type { DiscountNumber, Item, ItemNumber } from "@/types/item";
import type { OrderItemAmount as OrderItemAmountType, ReceiptNumber } from "@/types/order";
import type { Nullable } from "@/types/utils";
import { persistentAtom } from "@nanostores/persistent";
import { computed } from "nanostores";
import { wrapValidation } from "@/lib/arktype";
import { getLocalStorageKey } from "@/lib/consts";
import { ItemNumber as ItemNumberType } from "@/types/item";
import { OrderItemAmount } from "@/types/order";
import { $discounts } from "./discounts";
import { $items } from "./items";

const coder = {
  encode: JSON.stringify,
  decode: JSON.parse,
};

export type OrderRowInput = {
  id: number;
  productCode: string;
  quantity: string;
};

export type CurrentOrderState = {
  orderId: Nullable<string>;
  receiptNumber: Nullable<ReceiptNumber>;
  createdAt: Nullable<string>; // 受付番号発行時刻（ISO形式）
};

export function createOrderRow(): OrderRowInput {
  return {
    id: Date.now() + Math.random(),
    productCode: "",
    quantity: "",
  };
}

function createInitialState(): CurrentOrderState {
  return {
    orderId: null,
    receiptNumber: null,
    createdAt: null,
  };
}

function createInitialRows(): OrderRowInput[] {
  return [createOrderRow()];
}

export const $currentOrder = persistentAtom<CurrentOrderState>(
  getLocalStorageKey("currentOrder"),
  createInitialState(),
  coder,
);
export const $orderRows = persistentAtom<OrderRowInput[]>(
  getLocalStorageKey("orderRows"),
  createInitialRows(),
  coder,
);
export const $discountCode = persistentAtom<string>(
  getLocalStorageKey("discountCode"),
  "",
  coder,
);
function sanitizeNumericString(value: string): string {
  if (value === "")
    return "";

  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly;
}

export const $depositAmount = persistentAtom<string>(
  getLocalStorageKey("depositAmount"),
  "",
  coder,
);

const initialDepositAmount = $depositAmount.get();
const sanitizedInitialDepositAmount = sanitizeNumericString(initialDepositAmount);
if (sanitizedInitialDepositAmount !== initialDepositAmount) {
  $depositAmount.set(sanitizedInitialDepositAmount);
}

function updateState(updater: (previous: CurrentOrderState) => CurrentOrderState): void {
  $currentOrder.set(updater($currentOrder.get()));
}

function ensureRows(rows: OrderRowInput[]): OrderRowInput[] {
  if (rows.length === 0)
    return [createOrderRow()];
  return rows;
}

export function setOrderId(value: CurrentOrderState["orderId"]): void {
  updateState((previous) => ({
    ...previous,
    orderId: value,
  }));
}

export function setReceiptNumber(value: CurrentOrderState["receiptNumber"]): void {
  updateState((previous) => ({
    ...previous,
    receiptNumber: value,
  }));
}

export function setCreatedAt(value: CurrentOrderState["createdAt"]): void {
  updateState((previous) => ({
    ...previous,
    createdAt: value,
  }));
}

export function setDiscountCode(value: string): void {
  $discountCode.set(value);
}

export function setDepositAmount(value: string): void {
  const sanitized = sanitizeNumericString(value);
  $depositAmount.set(sanitized);
}

export function updateOrderRows(mutator: (rows: OrderRowInput[]) => OrderRowInput[]): void {
  $orderRows.set(ensureRows(mutator($orderRows.get())));
}

export function appendOrderRow(): void {
  updateOrderRows((rows) => [...rows, createOrderRow()]);
}

export function resetCurrentOrder(): void {
  $currentOrder.set(createInitialState());
  $orderRows.set(createInitialRows());
  $discountCode.set("");
  $depositAmount.set("");
}

export function getFilledOrderRows(rows: OrderRowInput[] = $orderRows.get()): OrderRowInput[] {
  return rows.filter((row) => row.productCode.trim() !== "" || row.quantity.trim() !== "");
}

export function findItemByNumber(itemNumber: ItemNumber): (typeof Item.infer & { itemNumber: ItemNumber }) | null {
  const items = $items.get();
  for (const group of items) {
    for (const item of group.children) {
      if (item.itemNumber === itemNumber) {
        return item;
      }
    }
  }
  return null;
}

export function findDiscountByNumber(discountNumber: DiscountNumber): { id: string; name: string; amount: Record<string, number> } | null {
  const discounts = $discounts.get();
  const discount = discounts.find((d) => d.discountNumber === discountNumber);
  if (discount == null) {
    return null;
  }
  return {
    id: discount.id,
    name: discount.name,
    amount: discount.amount ?? {},
  };
}

/**
 * 注文前の商品を正規化（同じ商品をまとめる）して返す
 */
export function getNormalizedCurrentOrderItems(
  rows: OrderRowInput[] = $orderRows.get(),
): Array<typeof Item.infer & { amount: OrderItemAmountType; itemNumber: ItemNumber }> {
  const filledRows = rows.filter(
    (row) => row.productCode.trim() !== "" && row.quantity.trim() !== "",
  );

  // itemIdごとに数量を集計
  const itemMap = new Map<string, { item: typeof Item.infer & { itemNumber: ItemNumber }; totalAmount: number }>();

  for (const row of filledRows) {
    const itemNumberResult = wrapValidation(
      ItemNumberType(Number.parseInt(row.productCode, 10)),
    );
    if (itemNumberResult.isErr())
      continue;

    const itemNumber = itemNumberResult.value;
    const item = findItemByNumber(itemNumber);
    if (!item)
      continue;

    const quantityResult = wrapValidation(
      OrderItemAmount(Number.parseInt(row.quantity, 10)),
    );
    if (quantityResult.isErr())
      continue;

    const quantity = Number(quantityResult.value);

    const existing = itemMap.get(item.id);
    if (existing) {
      existing.totalAmount += quantity;
    } else {
      itemMap.set(item.id, { item, totalAmount: quantity });
    }
  }

  const normalizedItems: Array<typeof Item.infer & { amount: OrderItemAmountType; itemNumber: ItemNumber }> = [];

  for (const { item, totalAmount } of itemMap.values()) {
    const amountResult = wrapValidation(OrderItemAmount(totalAmount));
    if (amountResult.isErr()) {
      continue;
    }

    normalizedItems.push({
      ...item,
      amount: amountResult.value,
    });
  }

  return normalizedItems;
}

// Computed atoms for performance optimization
export const $normalizedCurrentOrderItems = computed(
  [$orderRows],
  (rows) => getNormalizedCurrentOrderItems(rows),
);

export const $filledOrderRows = computed(
  [$orderRows],
  (rows) => getFilledOrderRows(rows),
);
