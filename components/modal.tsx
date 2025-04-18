"use client";

import React, { useEffect, useMemo, useState } from "react";
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

  const [errors, setErrors] = useState({
    title: "",
    image: "",
    likes: "",
  });

  useEffect(() => {
    if (modalOpen) {
      modalOpen(() => {
        onOpen();
      });
    }
  }, [modalOpen, onOpen]);

  const handleChange = (field: keyof Meme, value: string | number) => {
    if (!meme) return;
    const updated = { ...meme, [field]: value };

    onChange(updated);
    validateField(field, value);
  };

  const validateField = (field: keyof Meme, value: string | number) => {
    let message = "";

    switch (field) {
      case "title":
        if (typeof value !== "string" || value.trim().length < 3) {
          message = "Мінімум 3 символи";
        } else if (value.length > 100) {
          message = "Максимум 100 символів";
        }
        break;

      case "image":
        if (typeof value !== "string" || !/^https?:\/\/.+\.jpg$/i.test(value)) {
          message = "Повне посилання на JPG (http/https)";
        }
        break;

      case "likes":
        const num = Number(value);

        if (!Number.isInteger(num) || num < 0 || num > 99) {
          message = "Введіть число від 0 до 99";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const isValid = useMemo(() => {
    return !errors.title && !errors.image && !errors.likes;
  }, [errors]);

  const handleSave = () => {
    if (isValid) {
      onSave();
      onClose();
    }
  };

  if (!meme) return null;

  return (
    <Modal isOpen={isOpen} size="sm" onClose={onClose}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Редагування мема
            </ModalHeader>
            <ModalBody className="flex flex-col gap-4">
              <Input isReadOnly label="ID" value={String(meme.id)} />
              <Input
                isRequired
                errorMessage={errors.title}
                isInvalid={!!errors.title}
                label="Назва"
                value={meme.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <Input
                isRequired
                errorMessage={errors.image}
                isInvalid={!!errors.image}
                label="Картинка (URL .jpg)"
                value={meme.image}
                onChange={(e) => handleChange("image", e.target.value)}
              />
              <Input
                isRequired
                errorMessage={errors.likes}
                isInvalid={!!errors.likes}
                label="Кількість лайків"
                type="number"
                value={String(meme.likes)}
                onChange={(e) => handleChange("likes", Number(e.target.value))}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={close}>
                Скасувати
              </Button>
              <Button
                color="primary"
                isDisabled={!isValid}
                onPress={handleSave}
              >
                Зберегти
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
