import React from "react";

export default function History({ history }) {
  const historyListItems = history.map((history, index) => (
    <li key={index}>{history}</li>
  ));

  return (
    <div>
      <h3>Draft History</h3>
      <ul>{historyListItems}</ul>
    </div>
  );
}
