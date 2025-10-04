/* eslint-disable ts/explicit-function-return-type */
import type { Item } from "@/types/item";
import { $items } from "./stores/items";

export function ItemImpl(item: Item) {
  return {
    getGroup: () => {
      const groups = $items.get();
      return groups.find((group) => group.children.some((child) => child.id === item.id));
    },
  };
}
