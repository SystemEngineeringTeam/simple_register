import type { Format } from "@formkit/tempo";
import { format } from "@formkit/tempo";
import { type } from "arktype";

const _IsoDate = type("string.date.iso");
export type Iso = typeof _IsoDate.infer;

// eslint-disable-next-line ts/explicit-function-return-type
export function dateToStr(date: Date | Iso) {
  const fmt = (option: Format): string => format(date, option);

  return {
    dayAndTime: fmt({ date: "short", time: "short" }),
    dayAndTimeSec: fmt({ date: "short", time: "medium" }),
    dateOnly: fmt({ date: "medium" }),
    timeOnly: fmt({ time: "short" }),
    timeOnlySec: fmt({ time: "medium" }),
  };
}
