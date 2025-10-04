import { atom } from "nanostores";
import { ItemGroup } from "@/types/item";
import ITEM_GROUPS from "~/data/item_groups.json";

export const $items = atom<ItemGroup[]>(
  ITEM_GROUPS.map((data) => ItemGroup.assert(data)),
);
