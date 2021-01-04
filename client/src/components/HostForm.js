import React, { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../socket-context";

export default function HostForm() {
  const [name, setName] = useState(null);
  const [validName, setValidName] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    name != null && name.length >= 3 ? setValidName(true) : setValidName(false);
  }, [name]);

  const submitHandler = useCallback(
    (event) => {
      socket.emit("request_host", name);
    },
    [name, socket]
  );

  return (
    <div>
      <input
        type="text"
        minLength="3"
        maxLength="20"
        onChange={(event) => setName(event.target.value)}
        placeholder="Your name here!"
      />
      <button onClick={submitHandler} disabled={!validName}>
        Host!
      </button>
    </div>
  );
}
