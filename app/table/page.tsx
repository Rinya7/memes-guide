"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";

import { defaultMemes } from "../../lib/memes";
import { Meme } from "../../types/meme";
import EditIcon from "../../components/icons/EditIcon";
import ModalComponent from "../../components/modal";

// Колонки таблиці
const columns = [
  { name: "ID", uid: "id" },
  { name: "Title", uid: "title" },
  { name: "Image", uid: "image" },
  { name: "Likes", uid: "likes" },
  { name: "Action", uid: "action" },
];

export default function MemeTable() {
  const [memes, setMemes] = useState<Meme[]>(defaultMemes);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const modalOpenProps = useRef<() => void>(() => {});

  useEffect(() => {
    const saved = Cookies.get("memes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMemes(parsed as Meme[]);
        }
      } catch (e) {
        console.error("❌ Помилка при читанні cookies:", e);
      }
    }
  }, []);

  const handleClick = (meme: Meme) => {
    setSelectedMeme(meme); // спочатку встановлюємо мема
    setTimeout(() => {
      modalOpenProps.current(); // потім відкриваємо модалку
    }, 0);
  };

  const handleMemeChange = (updated: Meme) => {
    setSelectedMeme(updated);
  };

  const handleSave = () => {
    if (!selectedMeme) return;
    setMemes((prev) =>
      // eslint-disable-next-line prettier/prettier
      prev.map((m) => (m.id === selectedMeme.id ? selectedMeme : m))
    );
  };

  const handleResetMemes = () => {
    Cookies.remove("memes"); // видаляємо куки
    setMemes(defaultMemes); // повертаємо за замовчуванням
  };

  useEffect(() => {
    Cookies.set("memes", JSON.stringify(memes), { expires: 7 }); // зберігаємо на 7 днів
  }, [memes]);

  const renderCell = useCallback((meme: Meme, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return meme.id;
      case "title":
        return meme.title;
      case "image":
        return (
          <a
            className="text-blue-500 underline text-xs"
            href={meme.image}
            rel="noopener noreferrer"
            target="_blank"
          >
            {meme.image}
          </a>
        );
      case "likes":
        return meme.likes;
      case "action":
        return (
          <div>
            <Tooltip content="Edit meme" size="sm">
              <Button
                color="danger"
                size="sm"
                onPress={() => handleClick(meme)}
              >
                <EditIcon />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  }, []);

  return (
    <>
      <Table isStriped aria-label="Memes Guid">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={memes}>
          {(meme) => (
            <TableRow key={meme.id}>
              {(columnKey) => (
                <TableCell className="  ">
                  {renderCell(meme, columnKey as string)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ModalComponent
        meme={selectedMeme}
        modalOpen={(fn) => {
          modalOpenProps.current = fn;
        }}
        onChange={handleMemeChange}
        onSave={handleSave}
      />
      {/*{selectedMeme && (
        <Modal isOpen={isOpen} size="sm" onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Edit Meme - {selectedMeme.title}
                </ModalHeader>
                <ModalBody>
                  <p>ID: {selectedMeme.id}</p>
                  <p>Image: {selectedMeme.image}</p>
                  <p>Likes: {selectedMeme.likes}</p>
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
      )}*/}
      <div className="my-4 flex justify-center">
        <Button color="warning" variant="flat" onPress={handleResetMemes}>
          Скинути зміни
        </Button>
      </div>
    </>
  );
}
