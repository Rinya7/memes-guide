export type Meme = {
  id: number;
  title: string;
  image: string;
  likes: number;
};

export const memes: Meme[] = [
  {
    id: 1,
    title: "Doge",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    likes: 25,
  },
  {
    id: 2,
    title: "Distracted Boyfriend",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    likes: 40,
  },
];
