import type { ChangeEvent, KeyboardEvent, ReactElement } from "react";
import type { KeyField } from "./OrderTable";
import { HStack, styled as p } from "panda/jsx";
import { NumberInput } from "@/components/atomic/NumberInput";
import { Table } from "@/components/atomic/Table";

// const ItemNumber = type("0 <= string.numeric <= 100");
// const ItemQuantity = type("0 < string.numeric <= 100");

type Props = {
  index: number;
  productCode: string;
  quantity: string;
  onChange: (field: KeyField, value: string) => void;
  onKeyDown: (field: KeyField, e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (field: KeyField) => void;
  productCodeRef?: React.RefObject<HTMLInputElement | null> | undefined;
  quantityRef?: React.RefObject<HTMLInputElement | null> | undefined;
};

export function OrderTableRow(props: Props): ReactElement {
  return (
    <p.tr color="gray.500">
      <Table.cell align="right">{props.index}</Table.cell>
      <Table.cell align="right" color="black">
        <NumberInput
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
          w="20"
        />
      </Table.cell>
      <Table.cell fontFamily="sans">
        {props.productCode ? `商品名(${props.productCode})` : ""}
      </Table.cell>
      <Table.cell align="right">
        150
      </Table.cell>
      <Table.cell align="right">
        <HStack>
          <p.p fontFamily="sans">×</p.p>
          <NumberInput
            color="black"
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
      <Table.cell align="right">0</Table.cell>
      <Table.cell align="right">0</Table.cell>
    </p.tr>
  );
}
