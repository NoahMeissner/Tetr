import React from 'react';
import Tetris from "../../Interface/components/tetris/tetris";
import SquareFrame from "../../Interface/components/square_frame/square_frame";

/*
    GameView Component: This component serves as the main view for playing the Tetris game.
    It renders the Tetris component within a square frame, configured with the selected game mode and difficulty level.
*/


function GameView({ mode, difficulty, navigationFunctions }) {
  console.log("GameView", mode, difficulty);

  return (
    <SquareFrame showTetrisAnimation={false} hideNavBar={true}>
      <div style={{ width: '100%', height: '100%'}}>
        <Tetris 
          mode={mode}
          difficulty={difficulty}
          navigationFunctions={navigationFunctions}
        />
      </div>
    </SquareFrame>
  );
}

export default GameView;