import React from "react";

export default function ConnectedPlayers({ players, playerID, playerIDs }) {
  const playerList = playerIDs.map((id) => {
    const entry = `${players[id].name} ${id === playerID ? "(you)" : ""}`;
    return <li key={id}>{entry}</li>;
  });

  return (
    <div>
      <p>Connected players:</p>
      <ul>{playerList}</ul>
    </div>
  );
}
