import { createContext } from "react";

const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const socket = useMemo(
    () =>
      io("http://localhost:3000/", {
        path: "/socket",
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
      }),
    []
  );

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
