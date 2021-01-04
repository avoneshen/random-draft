import * as socketio from "socket.io";
import {
  CONNECTION,
  DISCONNECT,
  CONNECTION_CONFIRMED,
  REQUEST_HOST,
  REQUEST_JOIN,
  REQUEST_SETUP,
  SUBMIT_SETTINGS,
  HOST_CONFIRMED,
  JOIN_CONFIRMED,
  SETTING_UP,
  SETTINGS_CONFIRMED,
} from "./socketEvents.js";
import options from "./options.js";
import draftManager from "./draftManager.js";

interface Player {
  id: number;
  name: string;
}

export interface SettingData {
  banCount: number;
  dupeCount: number;
  teamCount: number;
  options: {
    [key: string]: {
      name: string;
      enabled: boolean;
    };
  };
  optionsKeys: Array<string>;
  playerTeamMap: {
    [key: string]: number;
  };
  teams: {
    [key: string]: { players: Array<number>; captain: number };
  };
}

let idSequence = 0;
let hostID: number | null = null;
const players: Array<Player> = [];

export const handleIo = (io: SocketIO.Server) => {
  io.on(CONNECTION, function (socket) {
    // Not the same thing as a request to join or host. User anonymous here.
    socket.emit(CONNECTION_CONFIRMED, {
      payload: { players, hostID },
    });

    socket.on(REQUEST_HOST, (name: string) => {
      if (hostID === null) {
        hostID = idSequence += 1;

        players.push({ id: hostID, name });

        socket.emit(HOST_CONFIRMED, {
          payload: { id: hostID, name, isRecipientHost: true },
        });
        socket.broadcast.emit(HOST_CONFIRMED, {
          payload: { id: hostID, name, isRecipientHost: false },
        });
      }
    });

    socket.on(REQUEST_JOIN, (name: string) => {
      const joinerID = (idSequence += 1);

      players.push({ id: joinerID, name });

      socket.emit(JOIN_CONFIRMED, {
        payload: { id: joinerID, name, isRecipientJoiner: true },
      });
      socket.broadcast.emit(JOIN_CONFIRMED, {
        payload: { id: joinerID, name, isRecipientJoiner: false },
      });
    });

    socket.on(REQUEST_SETUP, () =>
      io.emit(SETTING_UP, { payload: { options } })
    );

    socket.on(SUBMIT_SETTINGS, (data: SettingData) => {
      // todo: validate the submitted data and have a reject condition
      io.emit(SETTINGS_CONFIRMED, {
        playerTeamMap: data.playerTeamMap,
        teams: data.teams,
      });
      setTimeout(() => {
        draftManager(io, socket, data);
      }, 10500);
    });
  });
};
