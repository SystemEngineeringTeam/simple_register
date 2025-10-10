/* eslint-disable ts/explicit-function-return-type */

import type { OrderStatus } from "@/types/order";
import type { Nullable } from "@/types/utils";
import { token } from "panda/tokens";
import { match } from "ts-pattern";

// ref: https://github.com/type-challenges/type-challenges/issues/360#issue-747316677
type CamelCase<S extends string> = S extends Lowercase<S>
  ? S extends `${infer F}_${infer RF}${infer R}`
    ? `${F}${Uppercase<RF>}${CamelCase<R>}`
    : S
  : CamelCase<Lowercase<S>>;

function toCamelCase<S extends string>(s: S): CamelCase<S> {
  return s.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()) as CamelCase<S>;
}

export function OrderStatusImpl(status: OrderStatus) {
  return {
    toLabelStr: () => match(status)
      .with("UNCONFIRMED", () => "注文前")
      .with("WAITING_COOKING", () => "調理待ち")
      .with("WAITING_PICKUP", () => "受取待ち")
      .with("PICKED_UP", () => "受取済")
      .with("REFUNDED", () => "返金済")
      .with("CANCELED", () => "取消済")
      .exhaustive(),
    toColor: () => {
      const key = `colors.orderStatus.${toCamelCase(status)}` as const;

      return {
        bg: token(`${key}.bg`),
        onBg: token(`${key}.onBg`),
        text: token(`${key}.text`),
      };
    },
  };
}

export function ReceiptNumberImpl(receiptNumber: Nullable<number>) {
  return {
    toStr: () => {
      if (receiptNumber == null) {
        return "?";
      }
      return receiptNumber.toString().padStart(2, "0");
    },
  };
}
