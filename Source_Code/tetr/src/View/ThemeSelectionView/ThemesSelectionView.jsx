import React, { useEffect, useCallback } from 'react';
import './ThemesSelectionView.css';
import SquareFrame from '../../Interface/components/square_frame/square_frame';
import { useTheme } from '../../Model/ThemeContext';

/*
    ThemeSelection Component: This component allows users to switch between different visual themes.
    It displays the current theme's image and name, and provides controls to navigate to the next or previous theme.
    Users can also change the theme using the arrow keys on their keyboard.
*/

const themes = [
  { name: 'Classic', key: 'bgb', image: 'themes/bgb.png' },
  { name: 'B&W', key: 'blackwhite', image: 'themes/bw.png' },
  { name: 'Lava', key: 'lavagb', image: 'themes/lava.png' },
  { name: 'Manga', key: 'mangavina', image: 'themes/manga.png' },
];

const ThemeSelectionView = () => {
  const { theme, changeTheme } = useTheme();

  const currentThemeIndex = themes.findIndex(t => t.key === theme);

  const nextTheme = useCallback(() => {
    const nextIndex = (currentThemeIndex + 1) % themes.length;
    changeTheme(themes[nextIndex].key);
  }, [currentThemeIndex, changeTheme]);

  const prevTheme = useCallback(() => {
    const prevIndex = (currentThemeIndex - 1 + themes.length) % themes.length;
    changeTheme(themes[prevIndex].key);
  }, [currentThemeIndex, changeTheme]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        nextTheme();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        prevTheme();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [nextTheme, prevTheme]);

  return (
    <SquareFrame showTetrisAnimation={false}>
      <div className="theme-selector">
        <div className="theme-image">
          <img src={themes[currentThemeIndex].image} alt={themes[currentThemeIndex].name} />
        </div>
        <div className="theme-controls">
          <span onClick={prevTheme} className="theme-selector-button">
            &lt;
          </span>
          <h2 className="theme-title">{themes[currentThemeIndex].name}</h2>
          <span onClick={nextTheme} className="theme-selector-button">
            &gt;
          </span>
        </div>
      </div>
    </SquareFrame>
  );
};

export default ThemeSelectionView;