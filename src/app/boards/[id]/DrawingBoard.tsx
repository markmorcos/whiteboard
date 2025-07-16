"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { getSocket } from "@/lib/socket";
import { Stroke } from "@/types/board";

export default function DrawingBoard({ boardId }: { boardId: string }) {
  const socket = useRef(getSocket());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stageRef = useRef<any>(null);
  const [lines, setLines] = useState<Record<string, Stroke>>({});
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!boardId) return;
    const currentSocket = socket.current;

    currentSocket.on("connect", () => {
      currentSocket.emit("join-board", { boardId });
    });

    currentSocket.on("stroke", ({ stroke }) => {
      setLines((prev) => ({ ...prev, [stroke.id]: stroke }));
    });

    return () => {
      currentSocket.off("stroke");
    };
  }, [boardId]);

  const handleMouseDown = () => {
    setIsDrawing(true);
    const newLine: Stroke = {
      id: crypto.randomUUID(),
      type: "pen",
      points: [],
      color: "black",
      thickness: 2,
    };
    setLines((prev) => ({ ...prev, [newLine.id]: newLine }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;

    const point = e.target.getStage().getPointerPosition();
    setLines((prev) => {
      const updated = { ...prev };
      const last = updated[Object.keys(updated).pop()!];
      last.points = [...last.points, point.x, point.y];
      return updated;
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    const last = lines[Object.keys(lines).pop()!];
    socket.current.emit("stroke", { boardId, stroke: last });
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      ref={stageRef}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
    >
      <Layer>
        {Object.values(lines).map((line) => (
          <Line
            key={line.id}
            points={line.points}
            stroke={line.color}
            strokeWidth={line.thickness}
            lineCap="round"
            lineJoin="round"
          />
        ))}
      </Layer>
    </Stage>
  );
}
