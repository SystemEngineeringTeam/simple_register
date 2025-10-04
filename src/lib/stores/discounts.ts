import { atom } from "nanostores";
import { Discount } from "@/types/item";
import DISCOUNTS from "~/data/discount.json";

export const $discounts = atom<Discount[]>(
  DISCOUNTS.map((data) => Discount.assert(data)),
);
