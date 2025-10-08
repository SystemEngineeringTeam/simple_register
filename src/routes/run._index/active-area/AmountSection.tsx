import type { ReactElement } from "react";
import { HStack, styled as p, VStack } from "panda/jsx";
import { NumberInput } from "@/components/atomic/NumberInput";
import { Table } from "@/components/atomic/Table";

const TableBodyRow = p("tr", {
  base: {
    "& > :first-child": {
      textAlign: "right",
      verticalAlign: "middle",
    },
    "& > td": {
      fontFamily: "sans",
      fontWeight: "bold",
    },
  },
});

export function AmountSection(): ReactElement {
  return (
    <VStack alignItems="flex-start" px="4" w="100%">
      <p.table w="100%">
        <Table.head>
          <p.tr>
            <p.th p="0!" w="40"></p.th>
            <p.th p="0!" w="stretch"></p.th>
          </p.tr>
        </Table.head>
        <Table.body>
          <TableBodyRow>
            <Table.cell align="right" verticalAlign="middle!">
              受付番号
            </Table.cell>
            <Table.cell>
              <NumberInput
                h="10"
                outline={{
                  base: "2px solid",
                  _focus: "4px solid",
                }}
                outlineColor="black"
                textAlign="center"
                w="10"
              />
            </Table.cell>
          </TableBodyRow>
          <TableBodyRow bg="green.600" color="white">
            <Table.cell align="right" verticalAlign="middle!">
              合計
            </Table.cell>
            <Table.cell textAlign="right">
              <HStack gap="2" justifyContent="flex-end">
                <p.code fontSize="2xl">10</p.code>
                <p.p>円</p.p>
              </HStack>
            </Table.cell>
          </TableBodyRow>
          <TableBodyRow bg="red.200">
            <Table.cell align="right" verticalAlign="middle!">
              うち&ensp;割引
            </Table.cell>
            <Table.cell textAlign="right">
              <HStack gap="2" justifyContent="flex-end">
                <HStack>
                  <p.p fontWeight="normal">割引種別番号</p.p>
                  <NumberInput
                    h="10"
                    outline={{
                      base: "2px solid",
                      _focus: "4px solid",
                    }}
                    outlineColor="black"
                    textAlign="center"
                    w="10"
                  />
                </HStack>
                <p.code
                  color="red.600"
                  fontSize="2xl"
                  w="32"
                >
                  -10
                </p.code>
                <p.p>円</p.p>
              </HStack>
            </Table.cell>
          </TableBodyRow>
          <TableBodyRow>
            <Table.cell align="right" verticalAlign="middle!">
              預かり
            </Table.cell>
            <Table.cell textAlign="right">
              <HStack gap="2" justifyContent="flex-end">
                <NumberInput
                  fontSize="2xl"
                  textAlign="right"
                  w="32"
                />
                <p.p>円</p.p>
              </HStack>
            </Table.cell>
          </TableBodyRow>
          <TableBodyRow>
            <Table.cell align="right" verticalAlign="middle!">
              お釣り
            </Table.cell>
            <Table.cell textAlign="right">
              <HStack gap="2" justifyContent="flex-end">
                <p.code fontSize="2xl">10</p.code>
                <p.p>円</p.p>
              </HStack>
            </Table.cell>
          </TableBodyRow>
        </Table.body>
      </p.table>
    </VStack>
  );
}
