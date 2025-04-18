"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useMediaQuery } from "@react-hook/media-query";
import { Image } from "@heroui/image";
import { Card, CardBody, CardFooter } from "@heroui/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";

import { defaultMemes } from "@/lib/memes";
import { Meme } from "@/types/meme";

export default function PricingPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [memes, setMemes] = useState<Meme[]>([]);

  const isSmallScreen = useMediaQuery("(max-width: 639px)");
  const modalSize = isSmallScreen ? "xs" : "md";

  // ✅ Завантажуємо меми з cookies
  useEffect(() => {
    const saved = Cookies.get("memes");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setMemes(parsed);
        } else {
          setMemes(defaultMemes);
        }
      } catch {
        setMemes(defaultMemes);
      }
    } else {
      setMemes(defaultMemes);
    }
  }, []);

  const handleClick = (meme: Meme) => {
    setSelectedMeme(meme);
    onOpen();
  };

  return (
    <div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {memes.map((item, index) => (
          /* eslint-disable no-console */
          <Card
            key={index}
            isPressable
            shadow="sm"
            onPress={() => handleClick(item)}
          >
            <CardBody className="overflow-visible p-[8px] rounded">
              <Image
                alt={item.title}
                className="w-full object-cover h-[240px]  "
                radius="lg"
                shadow="sm"
                src={item.image}
                width="100%"
              />
            </CardBody>
            <CardFooter className="text-small justify-between">
              <b>{item.title}</b>
              <p className="text-default-500">❤️ {item.likes}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
      {selectedMeme && (
        <Modal
          isOpen={isOpen}
          placement="center"
          size={modalSize}
          onClose={onClose}
        >
          <ModalContent>
            {(close) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedMeme.title}
                </ModalHeader>
                <ModalBody className="flex flex-col gap-4">
                  <Card key={selectedMeme.id} shadow="sm">
                    <CardBody className="overflow-visible p-[8px]    ">
                      <Image
                        alt={selectedMeme.title}
                        className="w-full object-contain h-1/2  "
                        radius="lg"
                        shadow="sm"
                        src={selectedMeme.image}
                        width="100%"
                      />
                    </CardBody>
                    <CardFooter className="text-small justify-between">
                      <b>Likes</b>
                      <p className="text-default-500">❤️{selectedMeme.likes}</p>
                    </CardFooter>
                  </Card>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={close}>
                    Скасувати
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
