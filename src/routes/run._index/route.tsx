import type { ReactElement } from "react";
import { styled as p } from "panda/jsx";
import { Expanded } from "@/components/atomic/Expanded";
import { ActiveArea } from "./ActiveArea";
import { BasicInfo } from "./BasicInfo";
import { OrderQueue } from "./OrderQueue";
import { PickupMonitor } from "./PickupMonitor";
import { StatusBar } from "./StatusBar";

export default function (): ReactElement {
  return (
    <Expanded basedOn="screen">
      <p.div
        display="grid"
        gridTemplateAreas={`
          "basic-info order-queue"
          "pickup-monitor order-queue"
          "pickup-monitor order-queue"
          "active-area active-area"
          "active-area active-area"
          "status-bar status-bar"
        `}
        gridTemplateColumns="2fr 3fr"
        gridTemplateRows="1fr 1fr 1fr 1fr 1fr auto"
        h="100%"
      >
        <p.div gridArea="basic-info"><BasicInfo /></p.div>
        <p.div gridArea="pickup-monitor"><PickupMonitor /></p.div>
        <p.div gridArea="order-queue"><OrderQueue /></p.div>
        <p.div gridArea="active-area"><ActiveArea /></p.div>
        <p.div gridArea="status-bar"><StatusBar /></p.div>
      </p.div>
    </Expanded>
  );
}
