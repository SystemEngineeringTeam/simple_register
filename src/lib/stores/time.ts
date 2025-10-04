import type { Format } from "@formkit/tempo";
import type { ReadableAtom } from "nanostores";
import { diffMinutes, format } from "@formkit/tempo";
import { atom, computed } from "nanostores";

export const $nowTime = atom(new Date());
export const $systemStartTime = atom(new Date());

setInterval(() => {
  $nowTime.set(new Date());
}, 500);

/// Computed ///

// eslint-disable-next-line ts/explicit-function-return-type
function dateToStr(date: Date) {
  const fmt = (option: Format): string => format(date, option);

  return {
    dayAndTime: fmt({ date: "short", time: "short" }),
    dayAndTimeSec: fmt({ date: "short", time: "medium" }),
    dateOnly: fmt({ date: "medium" }),
    timeOnly: fmt({ time: "medium" }),
  };
}

export const $nowTimeStr = computed($nowTime, dateToStr);
export const $systemStartTimeStr = computed($systemStartTime, dateToStr);

/// Derived ///

export function $systemUptimeMs(): ReadableAtom<number> {
  return computed(
    [$nowTime, $systemStartTime],
    (now, start) => diffMinutes(now, start),
  );
}
