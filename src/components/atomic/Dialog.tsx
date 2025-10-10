import type { ReactElement, ReactNode } from "react";
import { css } from "panda/css";
import { styled as p } from "panda/jsx";
import { useImperativeHandle, useState } from "react";

export type DialogProps = {
  children: ReactNode;
  onClose?: () => void;
};

export type DialogRef = {
  showModal: () => void;
  close: () => void;
};

export function Dialog({ ref, children, onClose }: DialogProps & { ref?: React.RefObject<DialogRef | null> }): ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, (): DialogRef => ({
    showModal: (): void => {
      setIsOpen(true);
    },
    close: (): void => {
      setIsOpen(false);
      onClose?.();
    },
  }));

  if (!isOpen) {
    return <></>;
  }

  return (
    <p.div
      bottom="0"
      left="0"
      position="absolute"
      right="0"
      top="0"
      zIndex="50"
    >
      {/* Overlay */}
      <p.div
        bg="gray.900"
        bottom="0"
        className={css({
          opacity: 0.6,
        })}
        left="0"
        onClick={() => {
          setIsOpen(false);
          onClose?.();
        }}
        position="absolute"
        right="0"
        top="0"
      />
      <p.div
        bg="white"
        display="flex"
        flexDir="column"
        h="full"
        left="0"
        maxH="calc(100% - 2rem)"
        maxW="calc(100% - 2rem)"
        overflow="auto"
        position="absolute"
        top="0"
        transform="translate(1rem, 1rem)"
        w="full"
        zIndex="modal"
      >
        {children}
      </p.div>
    </p.div>
  );
}

Dialog.displayName = "Dialog";
