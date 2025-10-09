import { atom } from "nanostores";
import { ItemGroup, ItemWithItemNumber } from "@/types/item";
import ITEM_GROUPS from "~/data/item_groups.json";

const ItemGroupWithItemNumber = ItemGroup
  .merge({
    children: ItemWithItemNumber.array(),
  });
type ItemGroupWithItemNumber = typeof ItemGroupWithItemNumber.infer;

export const $items = atom<ItemGroupWithItemNumber[]>(
  ITEM_GROUPS
    .map((data, groupIdx) => {
      const dataWithItemNumber = {
        ...data,
        children: data.children.map((child, itemIdx) => ({
          ...child,
          itemNumber: groupIdx * 10 + itemIdx,
        })),
      };
      return ItemGroupWithItemNumber.assert(dataWithItemNumber);
    }),
);
