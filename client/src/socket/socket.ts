import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// const SERVER_URL = "http://localhost:3300";
const SERVER_URL = "https://www.scrumx.space";

export const initSocket = (): Socket => {
    if (!socket) {
        socket = io(SERVER_URL, {
            withCredentials: true, // Ensure cookies are sent
            transports: ["websocket"], // Prefer WebSockets over polling
        });
    }
    return socket;
};

export const getSocket = (): Socket => {
    return socket ?? initSocket(); // Initialize if not already connected
};
