import { type } from "arktype";

const Price = type("0 <= number.integer <= 500");

export const Item = type({
  id: "string#itemId",
  name: "string",
  price: Price,
});
export type Item = typeof Item.infer;

export const Discount = type({
  id: type("string#discountId"),
  name: "string",
  amount: type.Record(Item.get("id"), Price).optional(),
});
export type Discount = typeof Discount.infer;

export const ItemGroup = type({
  id: "string#itemGroupId",
  name: "string",
  children: Item.array(),
});
export type ItemGroup = typeof ItemGroup.infer;
