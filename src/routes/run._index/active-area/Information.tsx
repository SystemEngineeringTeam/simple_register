import type { ReactElement } from "react";
import { useStore } from "@nanostores/react";
import { Grid, HStack, styled as p, VStack } from "panda/jsx";
import { Expanded } from "@/components/atomic/Expanded";
import { NumberInput } from "@/components/atomic/NumberInput";
import { $items } from "@/lib/stores/items";
import { PhaseIndicator } from "./PhaseIndicator";

function ItemInfo(): ReactElement {
  const item = useStore($items);

  return (
    <VStack alignItems="flex-start" p="2"w="full">
      <p.p>商品情報</p.p>
      <Grid
        gridTemplateColumns="1fr 1fr 1fr"
        w="full"
      >
        {item.map((it) => (
          <VStack alignItems="flex-start" key={it.id} w="full">
            <p.p fontSize="lg" fontWeight="bold">{it.name}</p.p>
            <VStack alignItems="flex-start" gap="1" w="full">
              {
                it.children.map((child) => (
                  <HStack gap="2" key={child.id}>
                    <p.code
                      alignItems="center"
                      aspectRatio="1 / 1"
                      border="1px solid"
                      display="grid"
                      fontSize="sm"
                      h="8"
                      lineHeight="none"
                      placeItems="center"
                      position="relative"
                    >
                      <p.span
                        fontSize="xs"
                        left="0"
                        p="[1px]"
                        position="absolute"
                        top="0"
                      >
                        T
                      </p.span>
                      {child.itemNumber.toString().padStart(2, "0")}
                    </p.code>
                    <p.img
                      aspectRatio="1 / 1"
                      h="8"
                      objectFit="cover"
                      src={`/images/items/${child.id}.jpg`}
                    >
                    </p.img>
                    <p.p>
                      {child.name}
                    </p.p>
                  </HStack>
                ))
              }
            </VStack>
          </VStack>
        ))}
      </Grid>
    </VStack>
  );
}

export function Information(): ReactElement {
  return (
    <Expanded display="flex" flexDir="column" justifyContent="space-between">
      <ItemInfo />
      <VStack
        alignItems="flex-start"
        borderTop="1px solid"
        w="full"
      >
        <HStack gap="2" p="2">
          <p.p>
            受付番号
          </p.p>
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
        <PhaseIndicator />
      </VStack>
    </Expanded>
  );
}
