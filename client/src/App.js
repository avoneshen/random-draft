import React, { useReducer } from "react";
import io from "socket.io-client";

import HostForm from "./components/HostForm";
import JoinerForm from "./components/JoinerForm.js";
import StagingMenu from "./components/StagingMenu";
import randomDraftReducer, { initialState } from "./randomDraftReducer";
import { SocketProvider } from "./socket-context.js";
import useSocketIO from "./useSocketIO";
import ConnectedPlayers from "./components/ConnectedPlayers";
import SetupForm from "./components/SetupForm";
import DraftCountdown from "./components/DraftCountdown";
import DraftInterface from "./components/DraftInterface";
import TeamSummary from "./components/TeamSummary";

require("./images/Placeholder.jpg");

const socket = io("http://localhost:8080");

function App() {
  const [store, dispatch] = useReducer(randomDraftReducer, initialState);
  useSocketIO(socket, dispatch);
  return <SocketProvider value={socket}>{renderApp(store)}</SocketProvider>;
}

function renderApp({
  hostID,
  playerID,
  playerIDs,
  players,
  lobbyStatus,
  options,
  draftData,
}) {
  if (hostID === null) {
    return <HostForm />;
  }

  if (hostID === playerID && lobbyStatus === "initial") {
    return (
      <div>
        <StagingMenu playerCount={playerIDs.length} />
        <ConnectedPlayers
          players={players}
          playerID={playerID}
          playerIDs={playerIDs}
        />
      </div>
    );
  }

  if (playerID === null) {
    return <JoinerForm host={players[hostID].name} />;
  } else if (playerID != null && lobbyStatus === "initial") {
    return (
      <div>
        <span>
          Waiting for {players[hostID].name} to start the draft. There are (
          {playerIDs.length}) connected players.
        </span>
        <ConnectedPlayers
          players={players}
          playerID={playerID}
          playerIDs={playerIDs}
        />
      </div>
    );
  }

  if (hostID === playerID && lobbyStatus === "setup") {
    return (
      <SetupForm playerIDs={playerIDs} players={players} options={options} />
    );
  } else if (lobbyStatus === "setup") {
    return (
      <div>
        <p>
          Waiting for {players[hostID].name} to finish setting up the draft...
        </p>
        <p>
          A draft consists of 2 stages. Firstly, team captains take it in turns
          to ban options (if enabled), and then random players take it in turns
          to pick a team.
        </p>
        <p>
          You'll be given a list of options to pick from. Scroll with the
          buttons, and click on the picture to choose your team. You only have
          30 seconds to pick or ban, so think ahead!
        </p>
        <p>Rounds will continue until all players have chosen a team.</p>
        <p>Good luck, and GG!</p>
      </div>
    );
  }
  if (lobbyStatus === "countdown") {
    return (
      <DraftCountdown
        players={players}
        teams={draftData.teams}
        countdown={10}
      />
    );
  }
  if (lobbyStatus === "draft") {
    return (
      <DraftInterface
        playerID={playerID}
        players={players}
        teams={draftData.teams}
        options={draftData.options}
        currentAction={draftData.currentAction}
        currentPlayer={draftData.currentPlayer}
        history={draftData.history}
        playerState={draftData.playerState}
      />
    );
  }
  if (lobbyStatus === "complete") {
    const teamIDs = Object.keys(draftData.teams);
    const teamsSummary = teamIDs.map((id) => (
      <TeamSummary
        team={draftData.teams[id]}
        teamID={id}
        players={players}
        playerState={draftData.playerState}
      />
    ));
    return (
      <div>
        <p>Draft Complete! GG!</p>
        <h2>Final Teams:</h2>
        {teamsSummary}
      </div>
    );
  }
}

export default App;
