import type { ReactElement } from "react";
import { useStore } from "@nanostores/react";
import { HStack, styled as p, VStack } from "panda/jsx";
import { Card } from "@/components/atomic/Card";
import { Expanded } from "@/components/atomic/Expanded";
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
  return (
    <Expanded display="flex" flexDir="column" gap="2" p="2">
      <HStack justifyContent="space-between" w="100%">
        <Time />
      </HStack>
      <HStack alignItems="stretch" flex="1" gap="2">
        <Card centralized>
          <VStack>
            <p.p>合計受付数</p.p>
            <p.code fontSize="5xl" lineHeight="none" mx="auto">256</p.code>
          </VStack>
        </Card>
        <Card centralized>
          <VStack>
            <p.p>合計受取済数</p.p>
            <p.code fontSize="5xl" lineHeight="none" mx="auto">244</p.code>
          </VStack>
        </Card>
      </HStack>
    </Expanded>
  );
}
