import type { ReactElement } from "react";
import { useStore } from "@nanostores/react";
import { HStack, styled as p } from "panda/jsx";
import { $nowTime, $nowTimeStr } from "@/lib/stores/time";

export function Time(): ReactElement {
  const nowTime = useStore($nowTime);
  const isOclock = nowTime.getMinutes() === 0 && nowTime.getSeconds() <= 20;
  const nowTimeStr = useStore($nowTimeStr).dayAndTimeSec;

  return (
    <HStack data-highlight-warn={isOclock} px="1">
      <IconMaterialSymbolsSchedule data-highlight-flash />
      <p.code
        fontSize="xl"
      >
        {nowTimeStr}
      </p.code>
    </HStack>
  );
}
