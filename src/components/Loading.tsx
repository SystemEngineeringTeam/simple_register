import type { ReactElement } from "react";
import { css } from "panda/css";
import { HStack } from "panda/jsx";
import SvgSpinnersRingResize from "@/assets/icons/SvgSpinnersRingResize.svg";

export function Loading({ children }: { children: ReactElement }): ReactElement {
  return (
    <HStack p="2">
      <img alt="" className={css({ w: "1rem", h: "1rem" })} src={SvgSpinnersRingResize} />
      {children}
    </HStack>
  );
}
