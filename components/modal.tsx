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
import { Input } from "@heroui/input";

import { Meme } from "@/types/meme";
type Props = {
  meme: Meme | null;
  onChange: (meme: Meme) => void;
  onSave: () => void;
  modalOpen?: (fn: () => void) => void;
};

const ModalComponent: React.FC<Props> = ({
  meme,
  onChange,
  onSave,
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

  const handleChange = (field: keyof Meme, value: string | number) => {
    onChange({ ...meme, [field]: value });
  };

  return (
    //<Modal isOpen={isOpen} size="sm" onClose={onClose}>
    //  <ModalContent>
    //    {(onClose) => (
    //      <>
    //        <ModalHeader className="flex flex-col gap-1">
    //          Edit Meme - {meme.title}
    //        </ModalHeader>
    //        <ModalBody>
    //          <p>ID: {meme.id}</p>
    //          <p>Image: {meme.image}</p>
    //          <p>Likes: {meme.likes}</p>
    //        </ModalBody>
    //        <ModalFooter>
    //          <Button color="danger" variant="light" onPress={onClose}>
    //            Close
    //          </Button>
    //          <Button color="primary" onPress={onClose}>
    //            Save (stub)
    //          </Button>
    //        </ModalFooter>
    //      </>
    //    )}
    //  </ModalContent>
    //</Modal>
    <Modal isOpen={isOpen} size="sm" onClose={onClose}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Meme — {meme.title}
            </ModalHeader>
            <ModalBody className="flex flex-col gap-4">
              <Input
                label="Title"
                value={meme.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <Input
                label="Image URL"
                value={meme.image}
                onChange={(e) => handleChange("image", e.target.value)}
              />
              <Input
                label="Likes"
                type="number"
                value={meme.likes}
                onChange={(e) => handleChange("likes", Number(e.target.value))}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={close}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  onSave(); // збереження
                  close(); // закриваємо модалку
                }}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
