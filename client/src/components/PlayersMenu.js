import React, { useMemo } from "react";
import Select from "react-select";

export default function PlayersMenu({
  onChange,
  playerIDs,
  players,
  playerTeamMap,
  teamCount,
}) {
  const options = useMemo(() => {
    const teams = [];
    for (let i = 1; i <= teamCount; i++) {
      teams.push({ value: i, label: `Team ${i}` });
    }
    return teams;
  }, [teamCount]);

  const playerOptions = playerIDs.map((id) => {
    return (
      <PlayerEntry
        key={id}
        onChange={onChange}
        playerID={id}
        playerName={players[id].name}
        team={playerTeamMap[id]}
        teamOptions={options}
      />
    );
  });

  return (
    <div>
      <h2>Team Assignments</h2>
      <div>{playerOptions}</div>
    </div>
  );
}

function PlayerEntry({ onChange, playerID, playerName, team, teamOptions }) {
  return (
    <div>
      <h3>{playerName}</h3>
      <Select
        value={teamOptions[team - 1]}
        options={teamOptions}
        onChange={({ value }) => onChange(value, playerID)}
      />
    </div>
  );
}
