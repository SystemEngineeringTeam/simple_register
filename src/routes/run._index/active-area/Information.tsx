import type { ReactElement } from "react";
import { useStore } from "@nanostores/react";
import { Grid, HStack, styled as p, VStack } from "panda/jsx";
import { useEffect, useRef } from "react";
import { Expanded } from "@/components/atomic/Expanded";
import { NumberInput } from "@/components/atomic/NumberInput";
import { registerReceiptInput } from "@/lib/focus-manager";
import { ReceiptNumberImpl } from "@/lib/order";
import { $currentOrder, setReceiptNumber } from "@/lib/stores/current-order";
import { $items } from "@/lib/stores/items";
import { $orderPhase } from "@/lib/stores/phase";
import { PhaseIndicator } from "./PhaseIndicator";

function ItemInfo(): ReactElement {
  const item = useStore($items);

  return (
    <VStack alignItems="flex-start" p="2"w="full">
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
  const order = useStore($currentOrder);
  const orderPhase = useStore($orderPhase);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    registerReceiptInput(receiptInputRef.current);
    return (): void => {
      registerReceiptInput(null);
    };
  }, []);

  useEffect(() => {
    if (orderPhase === "CHECK_RECEIPT_NUMBER") {
      const input = receiptInputRef.current;
      if (input) {
        input.focus();
        input.select();
      }
    }
  }, [orderPhase]);

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
            disabled={orderPhase !== "CHECK_RECEIPT_NUMBER"}
            h="10"
            onChange={(event) => {
              const receiptNumber = Number.parseInt(event.target.value, 10);
              setReceiptNumber(receiptNumber);
            }}
            onKeyDown={(event) => {
              if (event.key === "Backspace") {
                event.preventDefault();
                if (event.currentTarget.value !== "") {
                  setReceiptNumber(null);
                }
                requestAnimationFrame(() => {
                  const input = receiptInputRef.current;
                  input?.focus();
                  input?.select();
                });
                return;
              }

              if (event.key === "Enter") {
                event.preventDefault();
                if (event.currentTarget.value.trim() === "")
                  return;
                $orderPhase.set("SELECT_ITEMS");
              }
            }}
            outline={{
              base: "2px solid",
              _focus: "4px solid",
            }}
            outlineColor="black"
            ref={receiptInputRef}
            textAlign="center"
            value={ReceiptNumberImpl(order.receiptNumber).toStr()}
            w="10"
          />
        </HStack>
        <PhaseIndicator />
      </VStack>
    </Expanded>
  );
}
