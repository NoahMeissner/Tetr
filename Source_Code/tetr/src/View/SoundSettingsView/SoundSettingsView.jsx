import React, { useState, useEffect, useRef, useMemo } from 'react';
import SquareFrame from "../../Interface/components/square_frame/square_frame";
import SliderWithButtons from "../../Interface/components/slider/slider";

/*
    SoundSettingView Component: This component provides a UI for adjusting sound settings.
    The user can navigate between the sliders using the 'ArrowUp' and 'ArrowDown' keys, and adjust
    the values with the 'ArrowLeft' and 'ArrowRight' keys.
*/

function SoundSettingView() {
    const [focusedSlider, setFocusedSlider] = useState(0);
    
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);

    const sliderRefs = useMemo(() => [ref1, ref2, ref3], []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    setFocusedSlider(prev => (prev - 1 + 3) % 3);
                    break;
                case 'ArrowDown':
                    setFocusedSlider(prev => (prev + 1) % 3);
                    break;
                case 'ArrowLeft':
                case 'ArrowRight':
                    if (sliderRefs[focusedSlider].current) {
                        sliderRefs[focusedSlider].current.handleKeyPress(e.key);
                    }
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusedSlider, sliderRefs]);

    useEffect(() => {
        if (sliderRefs[focusedSlider].current) {
            sliderRefs[focusedSlider].current.focus();
        }
    }, [focusedSlider, sliderRefs]);

    return (
        <SquareFrame showTetrisAnimation={false}>
            <h2>Music</h2>
            <SliderWithButtons ref={sliderRefs[0]} settingKey="music" step={10} isFocused={focusedSlider === 0} />
            <h2>Sound</h2>
            <SliderWithButtons ref={sliderRefs[1]} settingKey="sound" step={10} isFocused={focusedSlider === 1} />
        </SquareFrame>
    )
}

export default SoundSettingView;