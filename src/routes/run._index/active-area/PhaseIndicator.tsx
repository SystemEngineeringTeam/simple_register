import type { ReactElement } from "react";
import type { OrderPhase } from "@/lib/stores/phase";
import { useStore } from "@nanostores/react";
import {
  HStack,
  styled as p,
} from "panda/jsx";
import { getEntries } from "@/lib";
import { $orderPhase } from "@/lib/stores/phase";

const phase = {
  CHECK_RECEIPT_NUMBER: "受付番号確認",
  SELECT_ITEMS: "商品選択",
  CHECK_DISCOUNT: "割引確認",
  PROCESS_PAYMENT: "支払い処理",
} as const satisfies Record<OrderPhase, string>;

export function PhaseIndicator(): ReactElement {
  const orderPhase = useStore($orderPhase);

  return (
    <HStack gap="0" justifyContent="space-around" w="full">
      {getEntries(phase).map(([key, label], idx) => (
        <p.div
          _active={{
            bg: "blue.600",
            color: "white",
            fontWeight: "bold",
          }}
          clipPath={{
            base: "polygon(95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%, 0% 0%)",
            // NOTE: 左側の端を揃える
            _first: "polygon(95% 0%, 100% 50%, 95% 100%, 0% 100%, 0% 50%, 0% 0%)",
            // NOTE: 右側の端を揃える
            _last: "polygon(100% 0%, 100% 50%, 100% 100%, 0% 100%, 5% 50%, 0% 0%)",
          }}
          data-active={key === orderPhase ? "true" : undefined}
          fontSize="sm"
          key={key}
          py="1"
          textAlign="center"
          w="full"
        >
          {idx + 1}
          {". "}
          {label}
        </p.div>
      ))}
    </HStack>
  );
}
