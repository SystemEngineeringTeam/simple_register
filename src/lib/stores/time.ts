import type { ReadableAtom } from "nanostores";
import { diffMinutes } from "@formkit/tempo";
import { atom, computed } from "nanostores";
import { dateToStr } from "@/lib/time";

export const $nowTime = atom(new Date());
export const $systemStartTime = atom(new Date());

setInterval(() => {
  $nowTime.set(new Date());
}, 500);

/// Computed ///

export const $nowTimeStr = computed($nowTime, dateToStr);
export const $systemStartTimeStr = computed($systemStartTime, dateToStr);

/// Derived ///

export function $systemUptimeMs(): ReadableAtom<number> {
  return computed(
    [$nowTime, $systemStartTime],
    (now, start) => diffMinutes(now, start),
  );
}
