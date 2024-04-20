import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Snippet,
} from "@nextui-org/react";

const Share = (props: any) => {
  const { isOpen, onOpenChange, postId } = props;

  const link = `${process.env.NEXT_PUBLIC_APP_BASE_URL}post/${postId}`;
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      radius="md"
      scrollBehavior="inside"
      isDismissable={false}
      classNames={{
        body: "py-6",
        backdrop: "bg-white/10 backdrop-opacity-10",
        base: "bg-white dark:bg-black text-black dark:text-white",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Share via</ModalHeader>
            <ModalBody>
              <div className="w-full">
                <Snippet
                  className="w-full flex-row flex-wrap overflow-auto break-words"
                  hideSymbol={true}
                  size="md"
                  copyButtonProps={{
                    size: "sm",
                  }}
                  tooltipProps={{
                    isDisabled: true,
                  }}
                  content="Copy link"
                >
                  <span>{link}</span>
                </Snippet>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Share;
