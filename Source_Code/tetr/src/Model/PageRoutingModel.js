import React, { useState, useCallback, useMemo, useEffect } from 'react';
import WelcomeView from "../View/WelcomeView/WelcomeView";
import MenuView from "../View/MenuView/MenuView";
import ThemeSelectionView from "../View/ThemeSelectionView/ThemesSelectionView";
import SoundSettingsView from "../View/SoundSettingsView/SoundSettingsView";
import GameEndView from "../View/GameEndView/GameEndView";
import LeaderboardView from "../View/LeaderboardView/LeaderboardView";
import GameView from "../View/Game/Game";

/*
    Router Component and Navigation Higher-Order Component (HOC):
    The `Router` component handles routing and navigation within the application.
*/

// Higher-Order Component for navigation
const withNavigation = (WrappedComponent) => {
  return function WithNavigation(props) {
    const { navigateTo, goBack } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);

    const navigationFunctions = useMemo(() => ({
      // Navigation: Forward and Backward
      navigateToOption: (index, additionalParams = {}) => {
        if (props.options && props.options[index]) {
          const option = props.options[index];
          const combinedParams = { ...props.params, ...option.params, ...additionalParams };
          navigateTo(option.next, combinedParams);
        }
      },
      navigateBack: goBack,

      // Keyboard navigation
      // Select active navigation option
      setSelectedIndex: setSelectedIndex,
      selectNext: () => {
        if (props.options) {
          setSelectedIndex((prev) => (prev < props.options.length - 1 ? prev + 1 : 0));
        }
      },
      selectPrevious: () => {
        if (props.options) {
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : props.options.length - 1));
        }
      },
      // Navigate to selected option
      selectCurrent: (params = {}) => {
        if (props.options) {
          navigationFunctions.navigateToOption(selectedIndex, params);
        }
      }
    }), [props.options, props.params, navigateTo, goBack, setSelectedIndex, selectedIndex]);

    useEffect(() => {
      const handleKeyDown = (e) => {
        switch (e.key) {
          case 'ArrowUp':
          case 'ArrowLeft':
            navigationFunctions.selectPrevious();
            break;
          case 'ArrowDown':
          case 'ArrowRight':
            navigationFunctions.selectNext();
            break;
          case 'a':
          case 'Enter':
          case ' ':
            navigationFunctions.selectCurrent();
            break;
          case 'b':
          case 'Shift':
            navigationFunctions.navigateBack();
            break;
          default:
            break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [navigationFunctions]);

    return (
      <WrappedComponent
        {...props}
        navigationFunctions={navigationFunctions}
        selectedIndex={selectedIndex}
      />
    );
  };
};

// Simplified routing configuration
const routes = {
  welcome: {
    component: WelcomeView,
    options: [
      { label: 'Menu', next: 'menu' },
    ]
  },
  menu: {
    component: MenuView,
    options: [
      { label: 'Play', next: 'mode' },
      { label: 'Leaderboard', next: 'leaderboard' },
      { label: 'Settings', next: 'settings' },
    ]
  },
  mode: {
    component: MenuView,
    options: [
      { label: 'Endless', next: 'difficulty', params: { mode: 'endless' } },
      { label: 'Sprint', next: 'difficulty', params: { mode: 'sprint' } }
    ]
  },
  difficulty: {
    component: MenuView,
    options: [
      { label: 'Easy', next: 'game', params: { difficulty: 'easy' } },
      { label: 'Medium', next: 'game', params: { difficulty: 'medium' } },
      { label: 'Hard', next: 'game', params: { difficulty: 'hard' } }
    ]
  },
  settings: {
    component: MenuView,
    options: [
      { label: 'Themes', next: 'themes' },
      { label: 'Sound', next: 'sound' }
    ]
  },
  themes: {
    component: ThemeSelectionView
  },
  sound: {
    component: SoundSettingsView
  },
  game: {
    component: GameView,
    options: [
      { label: 'Score', next: 'gameEnd' },
    ]
  },
  gameEnd: {
    component: GameEndView,
    options: [
      { label: 'Play Again', next: 'game' },
      { label: 'Home', next: 'menu' }
    ]
  },
  leaderboard: {
    component: LeaderboardView
  }
};

// Main routing component
const Router = ({ initialRoute = 'welcome' }) => {
  const [currentRoute, setCurrentRoute] = useState(initialRoute);
  const [prevRoutes, setPrevRoutes] = useState([]);
  const [params, setParams] = useState({});

  const navigateTo = useCallback((route, newParams = {}) => {
    setPrevRoutes((prev) => [...prev, { route: currentRoute, params }]);
    setCurrentRoute(route);
    setParams((prevParams) => ({ ...prevParams, ...newParams }));
  }, [currentRoute, params]);

  const goBack = useCallback(() => {
    if (prevRoutes.length > 0) {
      const newPrevRoutes = [...prevRoutes];
      const { route: previousRoute, params: previousParams } = newPrevRoutes.pop();
      setCurrentRoute(previousRoute);
      setParams(previousParams);
      setPrevRoutes(newPrevRoutes);
    }
  }, [prevRoutes]);

  const routeConfig = routes[currentRoute];
  const Component = withNavigation(routeConfig.component);

  return (
    <Component
      {...params}
      navigateTo={navigateTo}
      goBack={goBack}
      options={routeConfig.options}
      next={routeConfig.next}
    />
  );
};

export default Router;