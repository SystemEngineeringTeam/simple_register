import type { ReactElement } from "react";
import { styled as p, VStack } from "panda/jsx";

export default function (): ReactElement {
  return (
    <VStack fontSize="2xl">
      <p.a href="/main">main</p.a>
      <p.a href="/order-queue">order-queue</p.a>
      <p.a href="/pickup-monitor">pickup-monitor</p.a>
    </VStack>
  );
}
