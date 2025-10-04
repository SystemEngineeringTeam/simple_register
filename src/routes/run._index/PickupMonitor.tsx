import type { ReactElement } from "react";
import { Center, Grid, styled as p, VStack } from "panda/jsx";
import { Expanded } from "@/components/atomic/Expanded";

export function PickupMonitor(): ReactElement {
  return (
    <Expanded bg="black" color="white" display="flex">
      <VStack alignItems="flex-start" gap="0" w="100%">
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
          gridTemplateColumns="repeat(auto-fit, minmax(50px, 1fr))"
          p="2"
          w="100%"
        >
          {[...Array.from({ length: 30 })].map((_, i) => (
            <Center
              aspectRatio="1 / 1"
              border="1px solid"
              borderColor="white"
              fontFamily="mono"
              fontSize="2xl"
              fontWeight="bold"
              key={i}
              lineHeight="none"
              p="2"
            >
              {i + 10}
            </Center>
          ))}
        </Grid>
      </VStack>
      <VStack alignItems="flex-start" w="100%">
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
      </VStack>
    </Expanded>
  );
}
