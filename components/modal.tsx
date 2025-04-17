"use client";
import React, { useEffect } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";

import { Meme } from "@/types/meme";

type Props = {
  meme: Meme | null;
  //onChange: (meme: Meme) => void;
  //onSave: () => void;
  modalOpen?: (fn: () => void) => void;
};

const ModalComponent: React.FC<Props> = ({
  meme,
  //onChange,
  //onSave,
  modalOpen,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // передаємо onOpen зовні один раз при ініціалізації
  //  modalOpen()={onOpen();};
  useEffect(() => {
    if (modalOpen) {
      modalOpen(() => {
        onOpen(); // ось він — магічний виклик
        //console.log("meme", meme);
      });
    }
  }, [modalOpen, onOpen]);
  if (!meme) return null;
  return (
    <Modal isOpen={isOpen} size="sm" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Meme - {meme.title}
            </ModalHeader>
            <ModalBody>
              <p>ID: {meme.id}</p>
              <p>Image: {meme.image}</p>
              <p>Likes: {meme.likes}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Save (stub)
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
