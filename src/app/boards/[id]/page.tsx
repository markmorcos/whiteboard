"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const DrawingBoard = dynamic(() => import("./DrawingBoard"), { ssr: false });

export default function BoardPage() {
  const { id: boardId } = useParams<{ id: string }>();

  if (!boardId) return null;

  return (
    <main>
      <DrawingBoard boardId={boardId} />
    </main>
  );
}
