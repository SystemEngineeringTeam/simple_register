import { atom } from "nanostores";
import { Discount, DiscountNumber } from "@/types/item";
import DISCOUNTS from "~/data/discount.json";

const DiscountWithNumber = Discount
  .merge({
    discountNumber: DiscountNumber,
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
