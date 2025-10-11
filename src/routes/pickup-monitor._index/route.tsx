import type { ReactElement } from "react";
import { PickupMonitor } from "@/components/PickupMonitor";

export default function (): ReactElement {
  return <PickupMonitor basedOn="screen" isHighlightLonger size="large" />;
}
