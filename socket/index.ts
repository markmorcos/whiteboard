import { createServer } from "http";
import { Server } from "socket.io";

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  type: "pen" | "eraser" | "shape";
  points: number[];
  color: string;
  thickness: number;
}

export interface Cursor {
  position: Point;
  color: string;
}

export type ClientToServerEvents = {
  "join-board": (payload: { boardId: string }) => void;
  stroke: (payload: { boardId: string; stroke: Stroke }) => void;
  cursor: (payload: { boardId: string; cursor: Cursor }) => void;
};

export type ServerToClientEvents = {
  stroke: (payload: { stroke: Stroke; userId: string }) => void;
  cursor: (payload: { cursor: Cursor; userId: string }) => void;
};

const httpServer = createServer();

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  path: "/socket/socket.io",
});

io.on("connection", (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);

  socket.on("join-board", ({ boardId }) => {
    socket.join(boardId);
    console.log(`🧩 ${socket.id} joined board ${boardId}`);
  });

  socket.on("stroke", ({ boardId, stroke }) => {
    socket.to(boardId).emit("stroke", { stroke, userId: socket.id });
    console.log(`✏️ Stroke sent to board ${boardId} by ${socket.id}`);
  });

  socket.on("cursor", ({ boardId, cursor }) => {
    socket.to(boardId).emit("cursor", { cursor, userId: socket.id });
    console.log(`👤 Cursor updated for board ${boardId} by ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

const PORT = 8080;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Socket.IO backend running at http://0.0.0.0:${PORT}`);
});
