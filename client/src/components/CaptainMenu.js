import React, { useMemo } from "react";
import Select from "react-select";

export default function CaptainMenu({
  onChange,
  playerIDs,
  players,
  playerTeamMap,
  teamCount,
  teams,
}) {
  const validCaptains = useMemo(() => {
    // players can only be an option if they aren't already a captain!
    const existingCaptains = new Set();
    for (let i = 1; i <= teamCount; i++) {
      const captain = teams[i].captain;
      if (captain) {
        existingCaptains.add(captain);
      }
    }
    return playerIDs.filter((id) => !existingCaptains.has(id));
  }, [playerIDs, teams, teamCount]);

  let captainSelects = [];
  for (let i = 1; i <= teamCount; i++) {
    // filter options by players actually on that team
    const teamPlayers = validCaptains.filter((id) => playerTeamMap[id] === i);
    const playerOptions = teamPlayers.map((playerID) => {
      return { value: playerID, label: players[playerID].name };
    });
    const options = [{ value: null, label: "Unassigned" }, ...playerOptions];

    const currentCaptain = teams[i].captain;

    captainSelects.push(
      <CaptainEntry
        key={`team-${i}`}
        team={i}
        teamPlayers={options}
        onChange={onChange}
        currentCaptain={
          currentCaptain ? players[currentCaptain].name : "Unassigned"
        }
      />
    );
  }

  return (
    <div>
      <h2>Team Captains</h2>
      <div>{captainSelects}</div>
    </div>
  );
}

function CaptainEntry({ currentCaptain, team, teamPlayers, onChange }) {
  return (
    <div>
      <h3>{`Team ${team} Captain:`}</h3>
      <Select
        value={{ label: currentCaptain, value: null }}
        options={teamPlayers}
        onChange={({ value }) => onChange(value, team)}
      />
      <br />
    </div>
  );
}
