import type { ReactElement } from "react";
import { styled as p, VStack } from "panda/jsx";
import { Button } from "@/components/atomic/Button";

export type MenuDialogProps = {
  onClose: () => void;
};

export function MenuDialog({ onClose }: MenuDialogProps): ReactElement {
  return (
    <VStack bg="amber.500" gap="4" h="full" p="6" w="full">
      <p.h2 fontSize="2xl" fontWeight="bold">
        メニュー
      </p.h2>
      <VStack gap="2" w="full">
        <Button onClick={onClose} w="full">
          閉じる
        </Button>
      </VStack>
    </VStack>
  );
}
