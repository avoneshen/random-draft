import React from "react";

export default function OptionsMenu({ options, optionsKeys, onChange }) {
  return <div>{renderOptions(options, optionsKeys, onChange)}</div>;
}

function renderOptions(options, optionsKeys, onChange) {
  return optionsKeys.map((key) => {
    const { name, enabled } = options[key];
    return (
      <div key={key}>
        <input
          type="checkbox"
          id={key}
          name={name}
          checked={enabled}
          onChange={(e) => onChange(key, !enabled)}
        />
        <label htmlFor={key}>{name}</label>
      </div>
    );
  });
}
