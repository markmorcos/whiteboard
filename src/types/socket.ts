import { Stroke, Cursor } from "@/types/board";

export type ClientToServerEvents = {
  "join-board": (payload: { boardId: string }) => void;
  stroke: (payload: { boardId: string; stroke: Stroke }) => void;
  cursor: (payload: { boardId: string; cursor: Cursor }) => void;
};

export type ServerToClientEvents = {
  stroke: (payload: { stroke: Stroke; userId: string }) => void;
  cursor: (payload: { cursor: Cursor; userId: string }) => void;
};
