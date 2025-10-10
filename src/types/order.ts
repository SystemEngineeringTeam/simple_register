import { type } from "arktype";
import { Item } from "./item";

export const OrderNumber = type("0 <= number.integer#orderNumber <= 9999");
export type OrderNumber = typeof OrderNumber.infer;

export const ReceiptNumber = type("1 <= number.integer#receiptNumber <= 50");
export type ReceiptNumber = typeof ReceiptNumber.infer;

export const OrderItemAmount = type("0 <= number.integer#orderItemAmount <= 100");
export type OrderItemAmount = typeof OrderItemAmount.infer;

export const OrderStatus = type(
  "'UNCONFIRMED' | 'WAITING_COOKING' | 'WAITING_PICKUP' | 'PICKED_UP' | 'REFUNDED' | 'CANCELED'",
);
export type OrderStatus = typeof OrderStatus.infer;

export const Order = type({
  id: "string#orderId",
  receiptNumber: ReceiptNumber,
  createdAt: "string.date.iso",
  status: OrderStatus,
  statusChange: type({
    to: OrderStatus,
    at: "string.date.iso",
  }).array(),
  items: Item.merge({ amount: OrderItemAmount }).array(),
});
export type Order = typeof Order.infer;
