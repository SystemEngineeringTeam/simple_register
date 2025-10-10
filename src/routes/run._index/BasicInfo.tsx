import type { ReactElement } from "react";
import { useStore } from "@nanostores/react";
import { HStack, styled as p, VStack } from "panda/jsx";
import { useMemo } from "react";
import { Card } from "@/components/atomic/Card";
import { Expanded } from "@/components/atomic/Expanded";
import { $orders } from "@/lib/stores/orders";
import { $nowTime, $nowTimeStr } from "@/lib/stores/time";

function Time(): ReactElement {
  const nowTime = useStore($nowTime);
  const isOclock = nowTime.getMinutes() === 0 && nowTime.getSeconds() <= 20;
  const nowTimeStr = useStore($nowTimeStr).dayAndTimeSec;

  return (
    <HStack data-highlight-warn={isOclock} px="1">
      <IconMaterialSymbolsSchedule />
      <p.code
        fontSize="xl"
      >
        {nowTimeStr}
      </p.code>
    </HStack>
  );
}

export function BasicInfo(): ReactElement {
  const orders = useStore($orders);

  // 合計受付数と合計受取済数を計算
  const { totalAccepted, totalPickedUp } = useMemo(() => {
    const accepted = orders.length;
    const pickedUp = orders.filter((order) => order.status === "PICKED_UP").length;
    return { totalAccepted: accepted, totalPickedUp: pickedUp };
  }, [orders]);

  return (
    <Expanded display="flex" flexDir="column" gap="2" p="2">
      <HStack justifyContent="space-between" w="full">
        <Time />
      </HStack>
      <HStack alignItems="stretch" flex="1" gap="2">
        <Card centralized>
          <VStack>
            <p.p>合計受付数</p.p>
            <p.code fontSize="5xl" lineHeight="none" mx="auto">{totalAccepted}</p.code>
          </VStack>
        </Card>
        <Card centralized>
          <VStack>
            <p.p>合計受取済数</p.p>
            <p.code fontSize="5xl" lineHeight="none" mx="auto">{totalPickedUp}</p.code>
          </VStack>
        </Card>
      </HStack>
    </Expanded>
  );
}
