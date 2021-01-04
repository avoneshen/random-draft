import React from "react";

export default function TeamSummary({ team, teamID, players, playerState }) {
  return (
    <div>
      <h3>Team {teamID}</h3>
      {createPlayerSummaries(
        players,
        team.players,
        team.captainID,
        playerState
      )}
    </div>
  );
}

function createPlayerSummaries(players, playerIDs, captainID, playerState) {
  return playerIDs.map((playerID) => {
    let playerChoice;
    if (playerState && playerState[playerID]) {
      playerChoice = playerState[playerID].name;
    } else {
      playerChoice = "?";
    }

    // TODO: player choice could include a small icon
    return playerID === captainID ? (
      <div key={playerID}>{players[playerID].name}</div>
    ) : (
      <div key={playerID}>
        {players[playerID].name}
        <span style={{ color: "red" }}>{" <captain>"}</span>
        {`: ${playerChoice}`}
      </div>
    );
  });
}
