import React from "react";
import {getSoundSettings} from "../../Model/SoundModel";
import { useEffect, useRef } from 'react';
import {useTheme} from "../../Model/ThemeContext";

/*
    AudioPlay Component: Plays background music based on the current theme. The volume is controlled according
    to the user settings stored in localStorage.
*/


export const MusicPlayer = () =>
{
    const music_path = {
        'bgb':"sounds/bg_bgb.wav" ,
        'blackwhite': "sounds/bg_bw.wav",
        'lavagb': "sounds/bg_lava.wav",
        'mangavina':"sounds/bg_manga.wav"
    }
    const {theme} = useTheme();
    const audioRef = useRef(null);
    var data = getSoundSettings();
    var volume = data.music / 100;

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <audio
            ref={audioRef}
            src={music_path[theme]}
            autoPlay
            loop
        />
    );
}

export const ButtonsSoundPlayer = ({ setPlayButtonSound }) => {
    const music_path = {
        'bgb':"sounds/kick.wav" ,
        'blackwhite': "sounds/kick.wav",
        'lavagb': "sounds/kick.wav",
        'mangavina':"sounds/kick.wav"
    }
    const {theme} = useTheme();
    const audioRef = useRef(null);

    var data = getSoundSettings();
    var volume = data.sound / 100;

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <audio
            ref={audioRef}
            src={music_path[theme]}
            autoPlay
            onEnded={() => setPlayButtonSound(false)}
        />
    );
};

export const LineClearSoundPlayer = ({ setPlayLineClearSound }) => {
    const audioRef = useRef(null);
    const music_path = {
        'bgb':"sounds/clear_bgb.wav" ,
        'blackwhite': "sounds/clear_bw.wav",
        'lavagb': "sounds/clear_lava.wav",
        'mangavina':"sounds/clear_manga.wav"
    }
    const {theme} = useTheme();

    var data = getSoundSettings();
    var volume = data.sound / 100;

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <audio
            ref={audioRef}
            src={music_path[theme]}
            autoPlay
            onEnded={() => setPlayLineClearSound(false)}
        />
    );
}


