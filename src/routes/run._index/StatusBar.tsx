import type { ReactElement } from "react";
import type { Status } from "@/lib/stores/status";
import type { Nullable } from "@/types/utils";
import { useStore } from "@nanostores/react";
import { css } from "panda/css";
import { HStack, styled as p } from "panda/jsx";
import { match } from "ts-pattern";
import { Expanded } from "@/components/atomic/Expanded";
import { ReceiptNumberImpl } from "@/lib/order";
import { $status } from "@/lib/stores/status";
import { $systemStartTimeStr, $systemUptimeMs } from "@/lib/stores/time";

const InlineReceiptNumber = p("code", {
  base: {
    alignItems: "center",
    border: "1px solid",
    display: "grid",
    fontSize: "[10px]",
    h: "4",
    lineHeight: "none",
    placeItems: "center",
    position: "relative",
    w: "5",
  },
});

function Status({ status }: { status: Nullable<Status> }): ReactElement {
  return match(status)
    .with({ type: "RESET_PROGRESS" }, ({ progress, receiptNumber }) =>
      progress >= 0.2
        ? (
            <HStack
              color="black"
              fontWeight="bold"
              gap="1"
              h="full"
              overflow="hidden"
              position="relative"
              px="2"
            >
              <p.div
                bg="red.200"
                h="full"
                left="0"
                position="absolute"
                top="0"
                w="full"
                zIndex="0"
              />
              <p.div
                bg="red.300"
                h="full"
                left="0"
                position="absolute"
                style={{ width: `${progress * 100}%` }}
                top="0"
                transition="width 50ms linear"
                zIndex="1"
              />
              <HStack gap="1" position="relative" zIndex="2">
                <InlineReceiptNumber>
                  {ReceiptNumberImpl(receiptNumber).toStr()}
                </InlineReceiptNumber>
                <IconMaterialSymbolsRestartAlt />
                <p.p>BS を押し続けて注文をリセット...</p.p>
              </HStack>
            </HStack>
          )
        : <></>)
    .with({ type: "RESET" }, ({ receiptNumber }) => (
      <HStack
        bg="red.600"
        color="white"
        fontWeight="bold"
        gap="1"
        h="full"
        px="2"
      >
        <InlineReceiptNumber>
          {receiptNumber}
        </InlineReceiptNumber>
        <IconMaterialSymbolsRestartAlt />
        <p.p>注文をリセットしました</p.p>
      </HStack>
    ))

    .otherwise(() => <></>);
}

export function StatusBar(): ReactElement {
  const systemStartedTimeStr = useStore($systemStartTimeStr).timeOnly;
  const systemUptimeStr = useStore($systemUptimeMs());
  const status = useStore($status);

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
        <HStack bg="purple.500" color="white" gap="1" h="full" px="2">
          <HStack fontWeight="bold" gap="1">
            <InlineReceiptNumber>
              10
            </InlineReceiptNumber>
            <IconMaterialSymbolsBucketCheck />
            <p.p>注文を確定しました</p.p>
          </HStack>
        </HStack>
        <HStack h="full">
          <Status status={status} />
        </HStack>
      </HStack>
      <HStack>
        <p.p color="gray.500">
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
