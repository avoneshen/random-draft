import React from "react";
import TeamSummary from "./TeamSummary";
import History from "./draft/History";
import Options from "./draft/Options";

export default function DraftInterface({
  playerID,
  players,
  teams,
  options,
  currentAction,
  currentPlayer,
  history,
  playerState,
}) {
  const teamIDs = Object.keys(teams);
  const teamsSummary = teamIDs.map((id) => (
    <TeamSummary
      team={teams[id]}
      teamID={id}
      players={players}
      playerState={playerState}
    />
  ));
  return (
    <div>
      {teamsSummary}
      <Options
        playerID={playerID}
        players={players}
        options={options}
        currentAction={currentAction}
        currentPlayer={currentPlayer}
      />
      <History history={history} />
    </div>
  );
}
