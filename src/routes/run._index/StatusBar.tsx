import type { ReactElement } from "react";
import type { Status } from "@/lib/stores/status";
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

function Status(): ReactElement {
  const status = useStore($status);

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
    .with({ type: "INVALID_VALUE" }, ({ receiptNumber, detail }) => (
      <HStack
        bg="yellow.400"
        fontWeight="bold"
        gap="1"
        h="full"
        px="2"
      >
        <InlineReceiptNumber>
          {ReceiptNumberImpl(receiptNumber).toStr()}
        </InlineReceiptNumber>
        {match(detail)
          .with({ type: "RECEIPT_NUMBER" }, ({ receiptNumber: invalidReceiptNumber }) => (
            <>
              <IconMaterialSymbolsError />
              <p.p>
                受付番号
                {" "}
                <p.code>{invalidReceiptNumber}</p.code>
                {" "}
                は範囲外です (範囲: 1–50)
              </p.p>
            </>
          ))
          .with({ type: "ITEM_EMPTY" }, () => (
            <>
              <IconMaterialSymbolsError />
              <p.p>
                商品が 1 つも選択されていません
              </p.p>
            </>
          ))
          .with({ type: "ITEM_NUMBER" }, ({ itemNumber }) => (
            <>
              <IconMaterialSymbolsIndeterminateQuestionBox />
              <p.p>
                商品番号
                {" "}
                <p.code>{itemNumber}</p.code>
                {" "}
                に該当する商品はありません
              </p.p>
            </>
          ))
          .with({ type: "DISCOUNT_NUMBER" }, ({ discountNumber }) => (
            <>
              <IconMdiTagHidden />
              <p.p>
                割引番号
                {" "}
                <p.code>{discountNumber}</p.code>
                {" "}
                に該当する割引はありません
              </p.p>
            </>
          ))
          .with({ type: "QUANTITY_TOO_LARGE" }, ({ quantity }) => (
            <>
              <IconMaterialSymbolsError />
              <p.p>
                数量
                {" "}
                <p.code>{quantity.toString()}</p.code>
                {" "}
                は大きすぎます
              </p.p>
            </>
          ))
          .with({ type: "DEPOSIT_INSUFFICIENT" }, ({ deposit, total }) => (
            <>
              <IconMaterialSymbolsIndeterminateQuestionBox />
              <p.p>
                預かり金額&ensp;
                <p.code>{deposit}</p.code>
                &ensp;円は, 合計金額&ensp;
                <p.code>{total}</p.code>
                &ensp;円に対して不足しています
              </p.p>
            </>
          ))
          .exhaustive()}
      </HStack>
    ))
    .with({ type: "ORDER_CONFIRMED" }, ({ receiptNumber }) => (
      <HStack bg="purple.500" color="white" gap="1" h="full" px="2">
        <HStack fontWeight="bold" gap="1">
          <InlineReceiptNumber>
            {ReceiptNumberImpl(receiptNumber).toStr()}
          </InlineReceiptNumber>
          <IconMaterialSymbolsBucketCheck />
          <p.p>注文を確定しました</p.p>
        </HStack>
      </HStack>
    ))
    .otherwise(() => <></>);
}

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
          <p.p>保存を再試行しています...</p.p>
        </HStack>

        <HStack h="full">
          <Status />
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
