"use client";

import Link from "next/link";
import { useState } from "react";

const mockBoards = [
  { id: "a1", title: "Design Sprint" },
  { id: "b2", title: "Marketing Plan" },
  { id: "c3", title: "Brainstorm" },
];

export default function HomePage() {
  const [boards] = useState(mockBoards);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Whiteboards</h1>
      <ul className="space-y-2">
        {boards.map((board) => (
          <li key={board.id}>
            <Link
              href={`/boards/${board.id}`}
              className="text-blue-600 hover:underline"
            >
              {board.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
