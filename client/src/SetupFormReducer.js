const OPTIONS_UPDATED = "OPTIONS_UPDATED";
const TEAM_COUNT_UPDATED = "TEAM_COUNT_UPDATED";
const TEAM_ASSIGNMENT_UPDATED = "TEAM_ASSIGNMENT_UPDATED";
const BANS_UPDATED = "BANS_UPDATED";
const DUPES_UPDATED = "DUPES_UPDATED";
const CAPTAINS_UPDATED = "CAPTAINS_UPDATED";

// ================
// ACTION_CREATORS
// ================

export function optionsUpdated({ id, enabled }) {
  return {
    type: OPTIONS_UPDATED,
    payload: {
      id,
      enabled,
    },
  };
}

export function teamCountUpdated({ teamCount }) {
  return {
    type: TEAM_COUNT_UPDATED,
    payload: {
      teamCount: isNaN(teamCount) ? 0 : teamCount,
    },
  };
}

export function teamAssignmentUpdated({ teamID, playerID }) {
  return {
    type: TEAM_ASSIGNMENT_UPDATED,
    payload: {
      teamID,
      playerID,
    },
  };
}

export function bansUpdated({ banCount }) {
  return {
    type: BANS_UPDATED,
    payload: {
      banCount,
    },
  };
}

export function dupesUpdated({ dupeCount }) {
  return {
    type: DUPES_UPDATED,
    payload: {
      dupeCount,
    },
  };
}

export function captainsUpdated({ teamID, playerID }) {
  return {
    type: CAPTAINS_UPDATED,
    payload: {
      teamID,
      playerID,
    },
  };
}

// ================
// REDUCER
// ================
export default function reducer(state, action) {
  switch (action.type) {
    case OPTIONS_UPDATED: {
      const { id, enabled } = action.payload;
      const newOpt = { name: state.options[id].name, enabled };

      return { ...state, options: { ...state.options, [id]: newOpt } };
    }
    case TEAM_ASSIGNMENT_UPDATED: {
      const { teamID, playerID } = action.payload;

      const oldTeamID = state.playerTeamMap[playerID];
      const newTeams = { ...state.teams };
      const newPlayerTeamMap = { ...state.playerTeamMap };
      newPlayerTeamMap[playerID] = teamID;

      newTeams[oldTeamID].players = newTeams[oldTeamID].players.filter(
        (id) => id !== playerID
      );

      if (newTeams[oldTeamID].captain === playerID) {
        newTeams[oldTeamID].captain = null;
      }
      newTeams[teamID].players.push(playerID);

      return { ...state, teams: newTeams, playerTeamMap: newPlayerTeamMap };
    }

    case TEAM_COUNT_UPDATED: {
      const { teamCount } = action.payload;
      const teams = { ...state.teams };

      if (
        teamCount === state.teamCount ||
        teamCount > Object.keys(state.playerTeamMap).length ||
        teamCount < 2
      ) {
        return state;
      }

      if (teamCount > state.teamCount) {
        const delta = teamCount - state.teamCount;
        for (let i = 1; i <= delta; i++) {
          teams[state.teamCount + i] = { players: [], captain: null };
        }

        return { ...state, teamCount, teams };
      }

      const playerTeamMap = { ...state.playerTeamMap };

      // assign players in the delta to the new highest team
      // remove teams > new max
      // update player team map
      const removedTeamIDs = Object.keys(state.teams).filter((teamID) => {
        return teamID > teamCount;
      });
      removedTeamIDs.forEach((id) => {
        const removedTeamPlayers = state.teams[id].players;
        teams[teamCount].players = [
          ...teams[teamCount].players,
          ...removedTeamPlayers,
        ];
        delete teams[id];
        removedTeamPlayers.forEach((orphanedPlayerID) => {
          playerTeamMap[orphanedPlayerID] = teamCount;
        });
      });

      return { ...state, playerTeamMap, teams, teamCount };
    }

    case CAPTAINS_UPDATED: {
      const { teamID, playerID } = action.payload;
      const newTeams = { ...state.teams };
      newTeams[teamID].captain = playerID; // might be null, is OK

      return { ...state, teams: newTeams };
    }

    case BANS_UPDATED: {
      const { banCount } = action.payload;
      return { ...state, banCount };
    }

    case DUPES_UPDATED: {
      const { dupeCount } = action.payload;
      return { ...state, dupeCount };
    }

    default:
      return state;
  }
}
