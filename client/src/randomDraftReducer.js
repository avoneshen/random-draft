const CONNECTION_CONFIRMED = "connection_confirmed";
const HOST_CONFIRMED = "host_confirmed";
const JOIN_CONFIRMED = "join_confirmed";
const SETTING_UP = "setting_up";
const SETTINGS_CONFIRMED = "settings_confirmed";
const DRAFT_ACTION = "draft_action"; // a player can pick or ban
const CANCELLATION = "cancellation"; // the pick or ban took too long
const DRAFT_ACTION_SUMMARY = "draft_action_summary"; // summarise pick / ban
const DRAFT_COMPLETE = "draft_complete"; // it's over. Summarise final state.

// ================
// ACTION_CREATORS
// ================

export function connectionConfirmed({ players, hostID }) {
  return {
    type: CONNECTION_CONFIRMED,
    payload: {
      players,
      hostID,
    },
  };
}

// will set the hostID, but also add the host details as a player
export function hostConfirmed({ hostID, name, isRecipientHost }) {
  return {
    type: HOST_CONFIRMED,
    payload: {
      hostID,
      name,
      isRecipientHost, // controls playerID state
    },
  };
}

export function joinConfirmed({ id, name, isRecipientJoiner }) {
  return {
    type: JOIN_CONFIRMED,
    payload: {
      id,
      name,
      isRecipientJoiner, // controls playerID state
    },
  };
}

export function settingUp({ options }) {
  return {
    type: SETTING_UP,
    payload: {
      options,
    },
  };
}

export function settingsConfirmed({ playerTeamMap, teams }) {
  return {
    type: SETTINGS_CONFIRMED,
    payload: { playerTeamMap, teams },
  };
}

export function draftAction({ playerID, type, data }) {
  return {
    type: DRAFT_ACTION,
    payload: {
      playerID,
      type,
      data,
    },
  };
}

export function draftActionSummary({
  playerID,
  currentAction,
  newOptions,
  playerState,
}) {
  return {
    type: DRAFT_ACTION_SUMMARY,
    payload: {
      playerID,
      type: currentAction,
      newOptions,
      playerState,
    },
  };
}

export function cancellation() {
  return { type: CANCELLATION };
}

export function draftComplete() {
  return { type: DRAFT_COMPLETE };
}

// ================
// REDUCER
// ================
export const initialState = {
  lobbyStatus: "initial",
  hostID: null,
  options: {},
  playerID: null,
  playerIDs: [],
  players: {},
  draftData: {
    currentAction: null,
    currentPlayer: null,
    options: null,
    history: ["The draft is beginning..."],
    playerTeamMap: {},
    playerState: {},
    teams: {},
  },
};

export default function reducer(state, action) {
  switch (action.type) {
    case CONNECTION_CONFIRMED: {
      const { players, hostID } = action.payload;
      const playerIDs = players.map((player) => player.id);
      const playerMap = players.reduce((previous, current) => {
        previous[current.id] = { name: current.name };
        return previous;
      }, {});
      return { ...state, hostID, playerIDs, players: playerMap };
    }
    case HOST_CONFIRMED: {
      const { hostID, name, isRecipientHost } = action.payload;
      // Host is always the first player
      const playerIDs = [hostID];
      const players = { [hostID]: { name } };
      const playerID = isRecipientHost ? hostID : null;

      return { ...state, hostID, playerIDs, playerID, players };
    }

    case JOIN_CONFIRMED: {
      const {
        id,
        name,
        isRecipientJoiner, // controls playerID state
      } = action.payload;
      const playerIDs = [...state.playerIDs, id];
      const players = { ...state.players, [id]: { name } };
      const playerID = isRecipientJoiner ? id : state.playerID;

      return { ...state, playerIDs, playerID, players };
    }

    case SETTING_UP: {
      const options = action.payload.options.reduce((previous, current) => {
        previous[current.id] = { name: current.name };
        return previous;
      }, {});

      return { ...state, lobbyStatus: "setup", options };
    }

    case SETTINGS_CONFIRMED: {
      const { teams, playerTeamMap } = action.payload;
      const newState = { ...state };
      newState.draftData = {
        ...newState.draftData,
        options: null,
        playerTeamMap,
        teams,
      };
      return { ...newState, lobbyStatus: "countdown" };
    }

    case DRAFT_ACTION: {
      const { playerID, type, data } = action.payload;
      const newDraftData = { ...state.draftData };

      newDraftData.history.push(
        `${state.players[playerID].name}'s turn to ${type}`
      );

      // set current action
      newDraftData.currentAction = type;
      newDraftData.currentPlayer = playerID;
      newDraftData.options = data.options;
      // set current player

      return { ...state, draftData: { ...newDraftData }, lobbyStatus: "draft" };
    }

    case DRAFT_ACTION_SUMMARY: {
      const { playerID, type, playerState, newOptions } = action.payload;
      const newDraftData = { ...state.draftData };

      // This is right enough. There might be duplicate IDs but their data will be identical
      const previousOptions = state.draftData.options.filter(
        (stateOption) =>
          !newOptions.some((newOption) => stateOption.id === newOption.id)
      );

      newDraftData.history.push(
        `${state.players[playerID].name} ${
          type === "ban" ? "banned" : "picked"
        } ${previousOptions[0].name}`
      );
      newDraftData.options = newOptions;
      newDraftData.playerState = playerState;

      return { ...state, draftData: { ...newDraftData } };
    }

    case CANCELLATION: {
      const newDraftData = { ...state.draftData };
      newDraftData.history.push(
        "No choice received! Choice will be made randomly..."
      );

      return { ...state, draftData: { ...newDraftData } };
    }

    case DRAFT_COMPLETE: {
      const newDraftData = { ...state.draftData };
      newDraftData.history.push("The draft is over.");

      return {
        ...state,
        draftData: { ...newDraftData },
        lobbyStatus: "complete",
      };
    }

    default:
      return state;
  }
}
