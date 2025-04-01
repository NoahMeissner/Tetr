import React from 'react';
import FaceButtons from "../face_buttons/face_buttons";
import DPad from "../dpad/dpad";
import './controls_layout.css';

const emitKeyPress = (key) => {
    const event = new KeyboardEvent('keydown', {
        key: key,
        bubbles: true,
        cancelable: true,
    });
    document.dispatchEvent(event);
};

const ControlsLayout = () => {
    return (
        <div className="mobile-controls">
            <div className="logo-container">
                <span className="gameboy-logo">TETRJS</span>
            </div>
            <div className="controls-container">
                <div className="control-field">
                    <DPad emitKeyPress={emitKeyPress} />
                </div>
                <div className="control-field">
                    <FaceButtons emitKeyPress={emitKeyPress} />
                </div>
            </div>
        </div>
    );
};

export default ControlsLayout;