import React, { useState, useMemo } from "react";
import TeamSummary from "./TeamSummary";

export default function DraftCountdown({ countdown, players, teams }) {
  const [count, setCount] = useState(countdown);

  // Could really easily be a hook
  useMemo(() => {
    if (count > 0) {
      setTimeout(() => setCount(count - 1), 1000);
    }
  }, [count]);

  const teamIDs = Object.keys(teams);
  const teamsSummary = teamIDs.map((id) => (
    <TeamSummary key={id} team={teams[id]} teamID={id} players={players} />
  ));

  return (
    <div>
      <h2>Draft begins in: {count} seconds!</h2>
      <h2>Teams</h2>
      {teamsSummary}
    </div>
  );
}
