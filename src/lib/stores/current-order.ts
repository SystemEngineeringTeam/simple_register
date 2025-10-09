import type { DiscountNumber, Item, ItemNumber } from "@/types/item";
import type { ReceiptNumber } from "@/types/order";
import type { Nullable } from "@/types/utils";
import { atom } from "nanostores";
import { $discounts } from "./discounts";
import { $items } from "./items";

export type OrderRowInput = {
  id: number;
  productCode: string;
  quantity: string;
};

export type CurrentOrderState = {
  orderId: Nullable<string>;
  receiptNumber: Nullable<ReceiptNumber>;
  discountCode: string;
  depositAmount: string;
  rows: OrderRowInput[];
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
    discountCode: "",
    depositAmount: "",
    rows: [createOrderRow()],
  };
}

export const $currentOrder = atom<CurrentOrderState>(createInitialState());

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

export function setDiscountCode(value: string): void {
  updateState((previous) => ({
    ...previous,
    discountCode: value,
  }));
}

export function setDepositAmount(value: string): void {
  updateState((previous) => ({
    ...previous,
    depositAmount: value,
  }));
}

export function updateOrderRows(mutator: (rows: OrderRowInput[]) => OrderRowInput[]): void {
  updateState((previous) => ({
    ...previous,
    rows: ensureRows(mutator(previous.rows)),
  }));
}

export function appendOrderRow(): void {
  updateOrderRows((rows) => [...rows, createOrderRow()]);
}

export function resetCurrentOrder(): void {
  $currentOrder.set(createInitialState());
}

export function getFilledOrderRows(state: CurrentOrderState = $currentOrder.get()): OrderRowInput[] {
  return state.rows.filter((row) => row.productCode.trim() !== "" || row.quantity.trim() !== "");
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
