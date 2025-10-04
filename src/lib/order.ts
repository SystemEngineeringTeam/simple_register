/* eslint-disable ts/explicit-function-return-type */

import type { OrderStatus } from "@/types/order";
import { match } from "ts-pattern";

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
  };
}
