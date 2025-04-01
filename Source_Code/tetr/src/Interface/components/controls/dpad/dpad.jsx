import React from 'react';
import './dpad.css';

/*
    Dpad Component: Renders a cross-shaped control layout similar to a Gameboy D-pad.
    Each direction on the cross emits a key press event when clicked.

    Based on https://github.com/ManzDev/gameboycss
 */

const DPad = ({ emitKeyPress }) => {
  const handleMouseDown = (key) => () => {
    emitKeyPress(key);
  };

  return (
    <div className="gameboy-controls-cross">
      <div className="cursor up" onMouseDown={handleMouseDown("ArrowUp")}></div>
      <div className="cursor left" onMouseDown={handleMouseDown("ArrowLeft")}></div>
      <div className="cursor center" onMouseDown={handleMouseDown("Enter")}>
        <div className="circle"></div>
      </div>
      <div className="cursor right" onMouseDown={handleMouseDown("ArrowRight")}></div>
      <div className="cursor down" onMouseDown={handleMouseDown("ArrowDown")}></div>
    </div>
  );
};

export default DPad;