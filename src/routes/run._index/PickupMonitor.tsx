import type { ReactElement } from "react";
import { useStore } from "@nanostores/react";
import { Center, Grid, styled as p, VStack } from "panda/jsx";
import { useMemo } from "react";
import { Expanded } from "@/components/atomic/Expanded";
import { ReceiptNumberImpl } from "@/lib/order";
import { $orders } from "@/lib/stores/orders";

export function PickupMonitor(): ReactElement {
  const orders = useStore($orders);

  const { waitingCooking, waitingPickup } = useMemo(() => {
    const cooking = orders.filter((order) => order.status === "WAITING_COOKING");
    const pickup = orders.filter((order) => order.status === "WAITING_PICKUP");
    return { waitingCooking: cooking, waitingPickup: pickup };
  }, [orders]);

  return (
    <Expanded bg="black" color="white" display="flex">
      <VStack alignItems="flex-start" gap="0" w="full">
        <p.p
          bg="amber.400"
          color="black"
          fontSize="2xl"
          fontWeight="bold"
          p="1"
          px="2"
          w="full"
        >
          調理待ち
        </p.p>
        <Grid
          gap="2"
          gridTemplateColumns="repeat(auto-fill, minmax(60px, 1fr))"
          p="2"
          w="full"
        >
          {waitingCooking.map((order) => (
            <Center
              aspectRatio="1 / 1"
              border="1px solid"
              borderColor="white"
              fontFamily="mono"
              fontSize="3xl"
              fontWeight="bold"
              key={order.id}
              lineHeight="none"
              p="2"
            >
              {ReceiptNumberImpl(order.receiptNumber).toStr()}
            </Center>
          ))}
        </Grid>
      </VStack>
      <VStack alignItems="flex-start" gap="0" w="full">
        <p.p
          bg="green.400"
          color="black"
          fontSize="2xl"
          fontWeight="bold"
          p="1"
          px="2"
          w="full"
        >
          受取待ち
        </p.p>
        <Grid
          gap="2"
          gridTemplateColumns="repeat(auto-fill, minmax(60px, 1fr))"
          p="2"
          w="full"
        >
          {waitingPickup.map((order) => (
            <Center
              aspectRatio="1 / 1"
              border="1px solid"
              borderColor="white"
              fontFamily="mono"
              fontSize="3xl"
              fontWeight="bold"
              key={order.id}
              lineHeight="none"
              p="2"
            >
              {ReceiptNumberImpl(order.receiptNumber).toStr()}
            </Center>
          ))}
        </Grid>
      </VStack>
    </Expanded>
  );
}
