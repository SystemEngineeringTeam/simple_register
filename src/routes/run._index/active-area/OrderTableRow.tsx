import type { ReactElement } from "react";
import { HStack, styled as p } from "panda/jsx";
import { Table } from "@/components/atomic/Table";

const NumberInput = p("input", {
  base: {
    _focus: {
      outlineColor: "blue.600",
    },
    bg: "blue.100",
    fontFamily: "mono",
    outline: "4px solid",
    outlineColor: "blue.100",
    textAlign: "right",
    px: "1",
  },
});

export function OrderTableRow(): ReactElement {
  return (
    <p.tr color="gray.500">
      <Table.cell align="right">
        1
      </Table.cell>
      <Table.cell align="right" color="black">
        <NumberInput w="20" />
      </Table.cell>
      <Table.cell
        fontFamily="sans"
      >
        しょうひんめいだよ〜〜〜
      </Table.cell>
      <Table.cell
        align="right"
      >
        150
      </Table.cell>
      <Table.cell align="right">
        <HStack>
          <p.p fontFamily="sans">×</p.p>
          <NumberInput color="black" w="10" />
        </HStack>
      </Table.cell>
      <Table.cell align="right">0</Table.cell>
      <Table.cell align="right">0</Table.cell>
    </p.tr>
  );
}

export function OrderTableRowEmpty(): ReactElement {
  return (
    <p.tr color="gray.500" h="8">
      <Table.cell align="right">
        1
      </Table.cell>
      <Table.cell
        colSpan={2}
        fontFamily="sans"
        fontSize="sm"
        fontStyle="italic"
        lineHeight="relaxed"
      >
        Enter で小計確認
      </Table.cell>
    </p.tr>
  );
}
