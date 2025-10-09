import { atom } from "nanostores";

export type OrderRowInput = {
  id: number;
  productCode: string;
  quantity: string;
};

export type CurrentOrderState = {
  receiptNumber: string;
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
    receiptNumber: "",
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

export function setReceiptNumber(value: string): void {
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
