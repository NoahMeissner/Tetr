import React from 'react';
import './face_buttons.css';

/*
    ABButtons Component: Renders two buttons labeled 'A' and 'B'.
    The component uses the `emitKeyPress` function prop to simulate key presses when the buttons are clicked.
*/

const FaceButtons = ({ emitKeyPress }) => {
    return (
        <div className="face-button-container">
            <button className="face-button b-button" onClick={() => emitKeyPress('b')}>B</button>
            <button className="face-button a-button" onClick={() => emitKeyPress('a')}>A</button>
        </div>
    );
};

export default FaceButtons;