import { createContext } from "react";

export const SocketContext = createContext();

export const SocketProvider = SocketContext.Provider;

export const SocketConsumer = SocketContext.Consumer;
