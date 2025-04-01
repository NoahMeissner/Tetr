import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import './slider.css';
import { getSoundSettings, updateSingleSound } from "../../../Model/SoundModel";

/*
    SliderWithButtons Component: React functional component with forwardRef that renders a slider with buttons
    for increasing and decreasing its value. It also handles keyboard input for slider
    manipulation.
*/

const SliderWithButtons = forwardRef(({ min = 0, max = 100, step = 1, settingKey, isFocused }, ref) => {
    const [value, setValue] = useState(50);

    useEffect(() => {
        const settings = getSoundSettings();
        setValue(settings[settingKey] ?? 50);
    }, [settingKey]);

    const updateLocalStorage = (newValue) => {
        updateSingleSound(settingKey, newValue)
    };

    const handleDecrease = () => {
        setValue(prev => {
            const newValue = Math.max(min, prev - step);
            updateLocalStorage(newValue);
            return newValue;
        });
    };

    const handleIncrease = () => {
        setValue(prev => {
            const newValue = Math.min(max, prev + step);
            updateLocalStorage(newValue);
            return newValue;
        });
    };

    const handleChange = (event) => {
        const newValue = Number(event.target.value);
        setValue(newValue);
        updateLocalStorage(newValue);
    };

    const handleKeyPress = (key) => {
        if (key === 'ArrowLeft') {
            handleDecrease();
        } else if (key === 'ArrowRight') {
            handleIncrease();
        }
    };

    useImperativeHandle(ref, () => ({
        focus: () => {
            // Focus logic here, e.g., changing the appearance of the slider
        },
        handleKeyPress
    }));

    return (
        <div className={`slider-container ${isFocused ? 'focused' : ''}`}>
            <button className="slider-button" onClick={handleDecrease}>-</button>
            <input
                className="slider"
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
            />
            <button className="slider-button" onClick={handleIncrease}>+</button>
        </div>
    );
});

export default SliderWithButtons;