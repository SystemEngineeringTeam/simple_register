import type { ReactElement } from "react";
import { useStore } from "@nanostores/react";
import { css } from "panda/css";
import { HStack, styled as p } from "panda/jsx";
import { Expanded } from "@/components/atomic/Expanded";
import { $systemStartTimeStr, $systemUptimeMs } from "@/lib/stores/time";

export function StatusBar(): ReactElement {
  const systemStartedTimeStr = useStore($systemStartTimeStr).timeOnly;
  const systemUptimeStr = useStore($systemUptimeMs());

  return (
    <Expanded
      alignItems="center"
      display="flex"
      fontSize="xs"
      justifyContent="space-between"
      px="1"
    >
      <HStack h="full">
        <HStack
          className={css({
            animation: "pulse",
            animationTimingFunction: "step-start",
          })}
          gap="1"
          p="1"
        >
          <IconMaterialSymbolsSync />
          <p.p>保存中...</p.p>
        </HStack>
        <HStack bg="green.600" color="white" gap="1" h="full" px="2">
          <HStack fontWeight="bold" gap="1">
            <p.code
              alignItems="center"
              border="1px solid"
              display="grid"
              fontSize="[10px]"
              h="4"
              lineHeight="none"
              placeItems="center"
              position="relative"
              w="5"
            >
              10
            </p.code>
            <IconMaterialSymbolsBucketCheck />
            <p.p>注文を確定しました</p.p>
          </HStack>
        </HStack>
      </HStack>
      <HStack>
        <p.p color="gray">
          システム開始時刻:
          {" "}
          <p.code>{systemStartedTimeStr}</p.code>
          {" "}
          (
          <p.code>{`${systemUptimeStr} m`}</p.code>
          )
        </p.p>
      </HStack>
    </Expanded>
  );
}
