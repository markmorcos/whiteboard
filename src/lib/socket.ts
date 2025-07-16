import { io, Socket } from "socket.io-client";

import { ServerToClientEvents, ClientToServerEvents } from "@/types/socket";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket(): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> {
  if (!socket) {
    socket = io("https://whiteboard.morcos.tech", {
      path: "/socket/socket.io",
      transports: ["websocket"],
    });
  }

  return socket;
}
