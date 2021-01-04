import * as socketio from "socket.io";
import {
  DRAFT_ACTION,
  DRAFT_DECISION,
  DRAFT_ACTION_SUMMARY,
  CANCELLATION,
  DRAFT_COMPLETE,
} from "./socketEvents.js";
import { SettingData } from "./sockets";
import options, { Option } from "./options.js";

interface Action {
  type: string;
  playerID: number;
  data: object;
}

interface EnrichedAction {
  type: string;
  playerID: number;
  data: {
    options: Array<Option>;
  };
}

const PICK = "pick";
const BAN = "ban";
const DRAFT_TIMEOUT = 30000;

let currentTimeoutID: NodeJS.Timeout;
let currentAction = BAN;
let optionState: Array<Option>;
let actionState: Array<Action>;
const playerState: { [key: number]: Option } = {};

export default function draftManager(
  io: SocketIO.Server,
  socket: SocketIO.Socket,
  data: SettingData
) {
  // TODO: this trusts the client far too much
  Object.keys(io.sockets.sockets).forEach((socket) =>
    io.sockets.connected[socket].on(
      DRAFT_DECISION,
      ({
        playerID,
        optionIndex,
      }: {
        playerID: number;
        optionIndex: number;
      }) => {
        clearTimeout(currentTimeoutID);

        handleDecision(playerID, optionIndex, currentAction);

        io.emit(DRAFT_ACTION_SUMMARY, {
          playerID,
          currentAction,
          newOptions: optionState,
          playerState,
        });

        checkActions();
        handleNextAction();
      }
    )
  );

  function onTimeout(action: Action) {
    const { playerID, type } = action;
    io.emit(CANCELLATION);

    const randomOptionIndex = Math.floor(
      Math.random() * Math.floor(optionState.length - 1)
    );

    handleDecision(playerID, randomOptionIndex, type);

    io.emit(DRAFT_ACTION_SUMMARY, {
      playerID,
      type,
      newOptions: optionState,
      playerState,
    });

    // This will check how many actions are remaining and end / repopulate actions
    checkActions();
    handleNextAction();
  }

  function handleNextAction() {
    if (actionState.length === 0) {
      return;
    }
    const nextAction = actionState.shift() as EnrichedAction;
    nextAction.data.options = optionState;

    io.emit(DRAFT_ACTION, nextAction);

    // TODO: some security around the actions to prevent anyone submitting anything

    currentTimeoutID = setTimeout(() => onTimeout(nextAction), DRAFT_TIMEOUT);
  }

  // Todo: why not return the decision so we can display it? :/
  function handleDecision(
    playerID: number,
    optionIndex: number,
    action: string
  ) {
    if (action === BAN) {
      optionState.splice(optionIndex, 1);
    } else if (action === PICK) {
      const pickedOption = optionState.splice(optionIndex, 1)[0];
      playerState[playerID] = pickedOption;
    }
  }

  function checkActions() {
    if (actionState.length === 0) {
      if (currentAction === BAN) {
        setPickActions(data.playerTeamMap);
      } else {
        io.emit(DRAFT_COMPLETE);
      }
    }
  }

  draftInitialiser(data);
  handleNextAction();
}

function draftInitialiser(data: SettingData) {
  optionState = generateOptions(data.dupeCount, data.options);

  if (data.banCount > 0) {
    const captains = getCaptainIDs(data.teams);
    shuffle(captains);

    const banActions: Array<{ type: string; playerID: number; data: {} }> = [];
    for (let i = 0; i < data.banCount; i++) {
      banActions.push({
        type: BAN,
        playerID: captains[i],
        data: {},
      });
    }
    actionState = banActions;
  } else {
    setPickActions(data.playerTeamMap);
  }
}

function getCaptainIDs(teams: SettingData["teams"]): Array<number> {
  const teamIDs = Object.keys(teams);
  const captainIDs: Array<number> = [];

  teamIDs.forEach((id) => captainIDs.push(teams[id].captain));

  return captainIDs;
}

function generateOptions(
  dupes: SettingData["dupeCount"],
  settingOptions: SettingData["options"]
): Option[] {
  const opts = [...options];
  const enabledOptionKeys = Object.keys(settingOptions).filter(
    (key) => settingOptions[key].enabled
  );

  const enabledOptions = opts.filter((option) =>
    enabledOptionKeys.includes(String(option.id))
  );
  let finalOptions = enabledOptions;
  if (dupes > 1) {
    for (let currentDupeOpts = 1; currentDupeOpts < dupes; currentDupeOpts++) {
      finalOptions = [...finalOptions, ...finalOptions];
    }
    finalOptions = finalOptions.sort(function (a, b) {
      return a.id - b.id;
    });
  }
  return finalOptions;
}

function setPickActions(playerTeamMap: SettingData["playerTeamMap"]) {
  const stringPlayerIDs = Object.keys(playerTeamMap);
  const playerIDs = stringPlayerIDs.map(Number);
  shuffle(playerIDs);
  const pickActions = playerIDs.map((playerID) => ({
    type: PICK,
    playerID,
    data: {},
  }));

  actionState = pickActions;
  currentAction = PICK;
}

// uses fisher-yates shuffle - via bost.ocks.org/mike/shuffle
function shuffle(array: Array<any>) {
  let m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
