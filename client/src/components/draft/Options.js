import React, { useMemo, useState, useCallback, useContext } from "react";
import Carousel from "react-bootstrap/Carousel";
import { SocketContext } from "../../socket-context";

import "./options.css";

const INITIAL_INDEX = 0;

export default function Options({
  playerID,
  players,
  options,
  currentAction,
  currentPlayer,
}) {
  const isCurrentPlayer = currentPlayer === playerID;

  if (isCurrentPlayer) {
    return (
      <OptionSelection
        currentAction={currentAction}
        options={options}
        playerID={playerID}
      />
    );
  } else {
    return (
      <div>
        <h2>It is {players[currentPlayer].name}'s turn to pick</h2>
        <OptionSummary options={options} />
      </div>
    );
  }
}

function OptionSummary({ options }) {
  if (options === null) {
    return <div>Loading Options</div>;
  }
  const optionComponents = options.map((option) => {
    return <div>{option.name}</div>;
  });
  return <div>{optionComponents}</div>;
}

function OptionSelection({ currentAction, options, playerID }) {
  const [currentOptionIndex, setCurrentOptionIndex] = useState(INITIAL_INDEX);
  const [count, setCount] = useState(30);
  const socket = useContext(SocketContext);

  // Could really easily be a hook
  useMemo(() => {
    if (count > 0) {
      setTimeout(() => setCount(count - 1), 1000);
    }
  }, [count]);

  const onSelection = useCallback(
    (index) => {
      socket.emit("draft_decision", {
        optionIndex: index,
        playerID: Number(playerID),
      });
      setCurrentOptionIndex(0);
    },
    [playerID, socket]
  );
  const onCarouselChange = useCallback((newIndex) => {
    console.log("called OCC");
    setCurrentOptionIndex(newIndex);
  }, []);

  return (
    <div className={"options-picker"}>
      <h2>
        It is your turn to{" "}
        <span className="current-action">{currentAction}</span>
      </h2>
      <div>Time remaining: {count} seconds</div>
      <p>Use the button to scroll. Click on a picture to choose it.</p>
      <Carousel
        onSelect={onCarouselChange}
        activeIndex={currentOptionIndex}
        interval={null}
        controls={true}
      >
        {options.map((option, index) => (
          <Carousel.Item>
            <div className="carousel-card" onClick={() => onSelection(index)}>
              <img
                className={"option-entry"}
                src={require(`../../images/${option.imagePath}`)}
                width="300px"
                height="300px"
                alt={option.name}
              />
            </div>
            <Carousel.Caption>{option.name}</Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
