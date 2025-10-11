import type { ChangeEvent, KeyboardEvent, ReactElement } from "react";
import type { KeyField } from "./OrderTable";
import type { ItemWithItemNumber } from "@/types/item";
import type { Nullable } from "@/types/utils";
import { useStore } from "@nanostores/react";
import { HStack, styled as p } from "panda/jsx";
import { memo, useMemo } from "react";
import { match, P } from "ts-pattern";
import { NumberInput } from "@/components/atomic/NumberInput";
import { Table } from "@/components/atomic/Table";
import { wrapValidation } from "@/lib/arktype";
import { ItemImpl } from "@/lib/item";
import { findItemByNumber } from "@/lib/stores/current-order";
import { $orderPhase } from "@/lib/stores/phase";
import { ItemNumber } from "@/types/item";

function ItemName(
  {
    itemWithItemNumber,
    isBlank,
  }:
  {
    itemWithItemNumber: Nullable<ItemWithItemNumber>;
    isBlank: boolean;
  },
): ReactElement {
  const phase = useStore($orderPhase);
  const isSelectItemsPhase = phase === "SELECT_ITEMS";

  if (isSelectItemsPhase) {
    if (isBlank) {
      return <p.p fontStyle="italic">Enter で割引確認へ</p.p>;
    }

    if (itemWithItemNumber == null) {
      return <p.p color="red.500" fontStyle="italic">該当なし</p.p>;
    }
  }

  if (isBlank) {
    return <p.p>---</p.p>;
  }

  if (itemWithItemNumber == null) {
    return <p.p color="red.500" fontStyle="italic">該当なし</p.p>;
  }

  return (
    <p.p>
      {
        match(ItemImpl(itemWithItemNumber).getGroup()?.name)
          .with(P.nullish, () => "")
          .otherwise((name) => `${name}/`)
          + itemWithItemNumber.name
      }
    </p.p>
  );
}

export const OrderTableRow = memo((
  props: {
    disabled: boolean;
    discountAmount: number;
    index: number;
    productCode: string;
    quantity: string;
    onChange: (field: KeyField, value: string) => void;
    onKeyDown: (field: KeyField, e: KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: (field: KeyField) => void;
    productCodeRef?: React.RefObject<HTMLInputElement | null> | undefined;
    quantityRef?: React.RefObject<HTMLInputElement | null> | undefined;
  },
): ReactElement => {
  const itemInfo = useMemo(() => {
    if (!props.productCode || props.productCode.trim() === "") {
      return null;
    }
    const itemNumber = Number.parseInt(props.productCode, 10);
    if (Number.isNaN(itemNumber)) {
      return null;
    }
    const validated = wrapValidation(ItemNumber(itemNumber)).unwrapOr(null);
    if (validated == null) {
      return null;
    }
    return findItemByNumber(validated);
  }, [props.productCode]);

  return (
    <p.tr color="gray.500">
      <Table.cell align="right">{props.index}</Table.cell>
      <Table.cell align="right" color="black">
        <HStack gap="2" justifyContent="flex-end" w="full">
          <p.code color="gray.500">T</p.code>
          <NumberInput
            disabled={props.disabled}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              props.onChange("productCode", e.target.value);
            }}
            onFocus={props.onFocus
              ? (_e): void => {
                  props.onFocus!("productCode");
                }
              : undefined}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              props.onKeyDown("productCode", e);
            }}
            ref={props.productCodeRef}
            value={props.productCode}
            w="10"
          />
        </HStack>
      </Table.cell>
      <Table.cell fontFamily="sans">
        <ItemName
          isBlank={props.productCode.trim() === "" && props.quantity.trim() === ""}
          itemWithItemNumber={itemInfo}
        />
      </Table.cell>
      <Table.cell align="right">
        {itemInfo?.price != null ? `@${itemInfo.price}` : "---"}
      </Table.cell>
      <Table.cell align="right">
        <HStack>
          <p.p fontFamily="sans">×</p.p>
          <NumberInput
            color="black"
            disabled={props.disabled}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              props.onChange("quantity", e.target.value);
            }}
            onFocus={props.onFocus
              ? (_e): void => {
                  props.onFocus?.("quantity");
                }
              : undefined}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              props.onKeyDown("quantity", e);
            }}
            ref={props.quantityRef}
            value={props.quantity}
            w="10"
          />
        </HStack>
      </Table.cell>
      <Table.cell align="right" color={props.discountAmount > 0 ? "red.600" : undefined}>
        {props.discountAmount > 0 ? `-${props.discountAmount}` : "0"}
      </Table.cell>
      <Table.cell align="right">
        {itemInfo && props.quantity
          ? (itemInfo.price * Number.parseInt(props.quantity ?? "0", 10) - props.discountAmount)
          : "0"}
      </Table.cell>
    </p.tr>
  );
});
