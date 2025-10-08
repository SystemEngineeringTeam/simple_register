import { atom } from "nanostores";
import { Discount } from "@/types/item";
import DISCOUNTS from "~/data/discount.json";

const DiscountWithNumber = Discount
  .merge({
    discountNumber: "0 <= number <= 10",
  });
type DiscountWithNumber = typeof DiscountWithNumber.infer;

export const $discounts = atom<DiscountWithNumber[]>(
  DISCOUNTS.map((data, idx) => {
    const dataWithNumber = {
      ...data,
      discountNumber: idx + 1,
    };
    return DiscountWithNumber.assert(dataWithNumber);
  }),
);
