// These are socket.io built-ins, and so are lower case
export const CONNECTION = "connection";
export const DISCONNECT = "disconnect";

// ==================
// SETUP - INBOUND
// ==================
export const REQUEST_HOST = "request_host"; // 1. with name
export const REQUEST_JOIN = "request_join"; // 2. with name
export const REQUEST_SETUP = "request_setup"; // 2. -> 3. the host wants to set the game up
export const SUBMIT_SETTINGS = "submit_settings"; // 4. the host is done setting up

// ==================
// SETUP - OUTBOUND
// ==================
export const CONNECTION_CONFIRMED = "connection_confirmed";
export const HOST_CONFIRMED = "host_confirmed"; // 1. Tell everyone player ID & name of host
export const JOIN_CONFIRMED = "join_confirmed"; // 2. ack. Tell everyone new player ID & name
export const SETTING_UP = "setting_up"; // 3. transitions everyone to the setup screen. Host gets a form.
export const SETTINGS_CONFIRMED = "settings_confirmed"; // 4. The hosts settings have been accepted. Tell everyone the drafter, countdown actions, teams, and options
// ==================
// DRAFT - INBOUND
// ==================
export const DRAFT_DECISION = "draft_decision";

// ==================
// DRAFT - OUTBOUND
// ==================
export const DRAFT_ACTION = "draft_action"; // a player can pick or ban
export const CANCELLATION = "cancellation"; // the pick or ban took too long
export const DRAFT_ACTION_SUMMARY = "draft_action_summary"; // summarise pick / ban
export const DRAFT_COMPLETE = "draft_complete"; // it's over. Summarise final state.
