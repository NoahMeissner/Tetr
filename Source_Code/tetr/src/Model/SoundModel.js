/*
    Sound Settings Module: This module provides functions to manage and persist sound settings in localStorage.
*/


export function updateSingleSound(key, value) {
    let soundSettings = JSON.parse(localStorage.getItem('SoundSettings')) || {
        music: 50,
        sound: 50,
        lastUpdated: new Date().toISOString()
    };
    soundSettings[key] = value;
    soundSettings.lastUpdated = new Date().toISOString();
    localStorage.setItem('SoundSettings', JSON.stringify(soundSettings));
    return soundSettings;
}

export function getSoundSettings() {
    return JSON.parse(localStorage.getItem('SoundSettings')) || {
        music: 50,
        sound: 50,
        lastUpdated: new Date().toISOString()
    };
}