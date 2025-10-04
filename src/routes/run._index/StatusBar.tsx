import type { ReactElement } from "react";
import { useStore } from "@nanostores/react";
import { css } from "panda/css";
import { styled as p } from "panda/jsx";
import { Expanded } from "@/components/atomic/Expanded";
import { $systemStartTimeStr, $systemUptimeMs } from "@/lib/stores/time";

export function StatusBar(): ReactElement {
  const systemStartedTimeStr = useStore($systemStartTimeStr).timeOnly;
  const systemUptimeStr = useStore($systemUptimeMs());

  return (
    <Expanded alignItems="center" display="flex" fontSize="xs">
      <p.div p="1">
        <IconMaterialSymbolsSync
          className={css({
            animationName: "pulse",
            animationTimingFunction: "step-start",
          })}
        />
      </p.div>
      <p.p color="gray">
        システム開始時刻:
        {" "}
        <p.code>{systemStartedTimeStr}</p.code>
        {" "}
        (
        <p.code>{`${systemUptimeStr} m`}</p.code>
        )
      </p.p>

    </Expanded>
  );
}
