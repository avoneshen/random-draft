import React, { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../socket-context";

export default function StagingMenu({ playerCount }) {
  const [enoughPlayers, setEnoughPlayers] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (playerCount >= 2) {
      setEnoughPlayers(true);
      return;
    }
    setEnoughPlayers(false);
  }, [playerCount]);

  const submitHandler = useCallback(
    (event) => {
      socket.emit("request_setup");
    },
    [socket]
  );

  return (
    <div>
      {enoughPlayers ? (
        <span>
          Start the draft when you are ready. There are ({playerCount})
          connected players.
        </span>
      ) : (
        <span>Waiting for more players to join...</span>
      )}
      <button onClick={submitHandler} disabled={!enoughPlayers}>
        Begin Setup!
      </button>
    </div>
  );
}
