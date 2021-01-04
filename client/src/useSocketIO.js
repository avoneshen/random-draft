import { useMemo } from "react";
import {
  connectionConfirmed,
  hostConfirmed,
  joinConfirmed,
  settingUp,
  settingsConfirmed,
  draftAction,
  draftActionSummary,
  cancellation,
  draftComplete,
} from "./randomDraftReducer";

const CONNECTION_CONFIRMED = "connection_confirmed";
const HOST_CONFIRMED = "host_confirmed";
const JOIN_CONFIRMED = "join_confirmed";
const SETTING_UP = "setting_up";
const SETTINGS_CONFIRMED = "settings_confirmed";
const DRAFT_ACTION = "draft_action";
const CANCELLATION = "cancellation";
const DRAFT_ACTION_SUMMARY = "draft_action_summary";
const DRAFT_COMPLETE = "draft_complete";

export default function useSocketIO(socket, dispatch) {
  useMemo(() => {
    socket.on(CONNECTION_CONFIRMED, (data) => {
      dispatch(connectionConfirmed(data.payload));
    });

    socket.on(HOST_CONFIRMED, ({ payload: { id, name, isRecipientHost } }) =>
      dispatch(hostConfirmed({ hostID: id, name, isRecipientHost }))
    );

    socket.on(JOIN_CONFIRMED, (data) => dispatch(joinConfirmed(data.payload)));

    socket.on(SETTING_UP, (data) => dispatch(settingUp(data.payload)));

    socket.on(SETTINGS_CONFIRMED, (data) => dispatch(settingsConfirmed(data)));

    socket.on(DRAFT_ACTION, (data) => dispatch(draftAction(data)));

    socket.on(CANCELLATION, () => dispatch(cancellation()));

    socket.on(DRAFT_ACTION_SUMMARY, (data) =>
      dispatch(draftActionSummary(data))
    );

    socket.on(DRAFT_COMPLETE, () => dispatch(draftComplete()));
  }, [socket, dispatch]);
}
