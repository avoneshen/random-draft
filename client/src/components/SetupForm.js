import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useContext,
} from "react";
import reducer, {
  optionsUpdated,
  teamAssignmentUpdated,
  captainsUpdated,
  teamCountUpdated,
  bansUpdated,
  dupesUpdated,
} from "../SetupFormReducer";
import OptionsMenu from "./OptionsMenu";
import PlayersMenu from "./PlayersMenu";
import CaptainMenu from "./CaptainMenu";
import { SocketContext } from "../socket-context";

export default function SetupForm({ playerIDs, players, options }) {
  const [enoughTeams, setEnoughTeams] = useState(false); // 2+ teams
  const [enoughPicks, setEnoughPicks] = useState(false); // func of ban/enabled opts/players
  const [allPlayersHaveTeam, setAllPlayersHaveTeam] = useState(false);
  const [allTeamsValid, setAllTeamsValid] = useState(false); // captain & 1+ player
  const socket = useContext(SocketContext);

  const initialState = useMemo(() => {
    const opts = { ...options };
    const optionsKeys = [];

    Object.keys(opts).forEach((key) => {
      opts[key].enabled = true;
      optionsKeys.push(key);
    });

    // { 1: { players: [1,2], captain: 1}}
    const teams = {};
    const playerTeamMap = {};
    for (let i = 0; i < playerIDs.length; i++) {
      const player = playerIDs[i];
      teams[i + 1] = { players: [player], captain: player };
      playerTeamMap[player] = i + 1;
    }

    return {
      teams,
      teamCount: playerIDs.length,
      playerTeamMap,
      banCount: playerIDs.length,
      dupeCount: 1,
      options: opts,
      optionsKeys,
    };
  }, [options, playerIDs]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const submitHandler = useCallback(
    (event) => {
      console.log("state:", state);
      socket.emit("submit_settings", state);
    },
    [socket, state]
  );

  useEffect(
    function validationCallback() {
      const totalEnabledOptions = state.optionsKeys.reduce(
        (previous, current) => {
          if (state.options[current].enabled) {
            return previous + 1;
          }
          return previous;
        },
        0
      );
      let teamPlayersCount = 0;
      let teamsValid = state.teamCount === 0 ? false : true;

      for (let i = 0; i < state.teamCount; i++) {
        teamPlayersCount += state.teams[i + 1].players.length;
        if (
          state.teams[i + 1].players.length === 0 ||
          state.teams[i + 1].captain === null
        ) {
          teamsValid = false;
        }
      }

      if (state.teamCount >= 2) {
        setEnoughTeams(true);
      } else {
        setEnoughTeams(false);
      }

      if (
        totalEnabledOptions * state.dupeCount - state.banCount >=
        playerIDs.length
      ) {
        setEnoughPicks(true);
      } else {
        setEnoughPicks(false);
      }

      if (teamPlayersCount === playerIDs.length) {
        setAllPlayersHaveTeam(true);
      } else {
        setAllPlayersHaveTeam(false);
      }

      setAllTeamsValid(teamsValid);
    },
    [state, playerIDs.length]
  );

  return (
    <div>
      <h2>Available Options</h2>
      <OptionsMenu
        options={state.options}
        optionsKeys={state.optionsKeys}
        onChange={(id, enabled) => dispatch(optionsUpdated({ id, enabled }))}
      />
      <h2>Number of Teams</h2>
      <input
        type="number"
        min="2"
        max={playerIDs.length}
        value={state.teamCount}
        onChange={(event) =>
          dispatch(teamCountUpdated({ teamCount: Number(event.target.value) }))
        }
      />
      <h2>Number of Bans</h2>
      <p>
        There can be less bans than teams. If so, the teams that get to ban are
        chosen randomly.
      </p>
      <input
        type="number"
        value={state.banCount}
        min="0"
        onChange={(event) =>
          dispatch(bansUpdated({ banCount: Number(event.target.value) }))
        }
      />
      <h2>Number of Duplicate Teams</h2>
      <p>If greater than 1, all options in the pool are multiplied.</p>
      <input
        type="number"
        value={state.dupeCount}
        min="1"
        onChange={(event) =>
          dispatch(dupesUpdated({ dupeCount: Number(event.target.value) }))
        }
      />
      <PlayersMenu
        onChange={(teamID, playerID) =>
          dispatch(teamAssignmentUpdated({ teamID, playerID }))
        }
        playerIDs={playerIDs}
        players={players}
        playerTeamMap={state.playerTeamMap}
        teamCount={state.teamCount}
      />
      <CaptainMenu
        onChange={(playerID, teamID) =>
          dispatch(captainsUpdated({ teamID, playerID }))
        }
        playerIDs={playerIDs}
        players={players}
        playerTeamMap={state.playerTeamMap}
        teamCount={state.teamCount}
        teams={state.teams}
      />
      <button
        onClick={submitHandler}
        disabled={
          !(enoughTeams && enoughPicks && allPlayersHaveTeam && allTeamsValid)
        }
      >
        Begin Draft!
      </button>
    </div>
  );
}
