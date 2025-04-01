import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import LeaderboardModel from '../../../Model/LeaderboardModel';
import './tetris.css';
import {ButtonsSoundPlayer, LineClearSoundPlayer, MusicPlayer} from "../../../View/Utility/AudioPlayer";
import DeviceInfoContext from '../../../Model/DeviceInfoContext';

const BLOCK_SIZE = Math.floor(Math.min(window.innerWidth, window.innerHeight) / 300) * 10;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const SHAPES = [
  // I
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  // O
  [
    [1, 1],
    [1, 1]
  ],
  // T
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // L
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // J
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // S
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  // Z
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
];

// const COLORS = [
//   '#00F0F0',  // I - Cyan
//   '#FFFF00',  // O - Yellow
//   '#A000F0',  // T - Purple
//   '#F0A000',  // L - Orange
//   '#0000F0',  // J - Blue
//   '#00F000',  // S - Green
//   '#F00000',  // Z - Red
// ];


function Tetris({ mode, difficulty, navigationFunctions }) {
  const isMobile = useContext(DeviceInfoContext);

  // Meta game logic
  const [score, setScore] = useState(0);
  const leaderboard = LeaderboardModel();

  const generateNewBag = useCallback(() => {
    const bag = Array.from({ length: SHAPES.length }, (_, i) => i);
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag;
  }, []);


  // Game logic
  const canvasRef = useRef(null);
  const swapCanvasRef = useRef(null);
  const nextCanvasRef = useRef(null);
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [swapPiece, setSwapPiece] = useState(null);
  const [currentBag, setCurrentBag] = useState(() => generateNewBag());
  const [playButtonSound, setPlayButtonSound] = useState(false); // State for triggering button sound
  const [playDestroySound, setPlayDestroySound] = useState(false); // State for triggering button sound

  const generateNextPieces = useCallback(() => {
      let bag = [...currentBag];
      const pieces = [];
      for (let i = 0; i < 3; i++) {
          if (bag.length === 0) {
              bag = generateNewBag();
          }
          pieces.push(bag.pop());
      }
      setCurrentBag(bag);
      return pieces;
  }, [currentBag, generateNewBag]);

  const [nextPieces, setNextPieces] = useState(() => generateNextPieces());
  const [gameOver, setGameOver] = useState(false);
  const lastDropTimeRef = useRef(0);
  const isScaled = useRef(false); // Keeps track of whether the canvas is scaled
  const [timeRemaining, setTimeRemaining] = useState(60); // New state for timer

  const createNewPiece = useCallback(() => {
    let newNextPieces = [...nextPieces];
    let newBag = [...currentBag];

    if (newNextPieces.length === 0) {
        newNextPieces = generateNextPieces();
    }

    const shapeIndex = newNextPieces.shift();

    if (newBag.length === 0) {
        newBag = generateNewBag();
    }
    newNextPieces.push(newBag.pop());

    setNextPieces(newNextPieces);
    setCurrentBag(newBag);

    return {
        x: Math.floor(BOARD_WIDTH / 2) - Math.ceil(SHAPES[shapeIndex][0].length / 2),
        y: 0,
        shape: shapeIndex,
        blocks: SHAPES[shapeIndex]
    };
  }, [nextPieces, currentBag, generateNextPieces, generateNewBag]);

  const isColliding = useCallback((piece, board) => {
    return piece.blocks.some((row, dy) =>
      row.some((value, dx) =>
        value !== 0 &&
        (piece.y + dy >= BOARD_HEIGHT ||
         piece.x + dx < 0 ||
         piece.x + dx >= BOARD_WIDTH ||
         (board[piece.y + dy] && board[piece.y + dy][piece.x + dx] !== 0))
      )
    );
  }, []);

  const placePiece = useCallback((piece, board) => {
    const newBoard = board.map(row => [...row]);
    piece.blocks.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          newBoard[piece.y + y][piece.x + x] = piece.shape + 1;
        }
      });
    });
    clearLines(newBoard);
    return newBoard;
  }, []);

  const movePiece = useCallback((dx, dy) => {
    if (!currentPiece) return;
    const movedPiece = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };
    if (!isColliding(movedPiece, board)) {
      setCurrentPiece(movedPiece);
    }
  }, [currentPiece, board, isColliding]);

  const rotatePiece = useCallback(() => {
    if (!currentPiece) return;
    const rotatedBlocks = currentPiece.blocks[0].map((_, index) =>
      currentPiece.blocks.map(row => row[index]).reverse()
    );
    const rotatedPiece = { ...currentPiece, blocks: rotatedBlocks };

    // Perform wall kicks
    const kickTests = [
      [0, 0], [1, 0], [-1, 0], [0, 1], [2, 0], [-2, 0]
    ];
    for (let i = 0; i < kickTests.length; i++) {
      const [dx, dy] = kickTests[i];
      const testPiece = { ...rotatedPiece, x: rotatedPiece.x + dx, y: rotatedPiece.y + dy };
      if (!isColliding(testPiece, board)) {
        setCurrentPiece(testPiece);
        return;
      }
    }
  }, [currentPiece, board, isColliding]);

  const swapCurrentPiece = useCallback(() => {
    if (!currentPiece) return;
    if (!swapPiece) {
      setSwapPiece(currentPiece);
      setCurrentPiece(createNewPiece());
    } else {
      const temp = swapPiece;
      setSwapPiece(currentPiece);
      setCurrentPiece({
        ...temp,
        x: Math.floor(BOARD_WIDTH / 2) - Math.ceil(temp.blocks[0].length / 2),
        y: 0
      });
    }
  }, [currentPiece, swapPiece, createNewPiece]);

  const hardDrop = useCallback(() => {
    if (!currentPiece) return;
    let droppedPiece = { ...currentPiece, y: currentPiece.y + 1 };
    while (!isColliding(droppedPiece, board)) {
      droppedPiece.y += 1;
    }
    droppedPiece.y -= 1;
    setBoard(placePiece(droppedPiece, board));
    setCurrentPiece(null);
  }, [currentPiece, board, isColliding, placePiece]);

  const calculateGhostPosition = useCallback((piece, board) => {
    let ghostPiece = { ...piece };
    while (!isColliding({ ...ghostPiece, y: ghostPiece.y + 1 }, board)) {
      ghostPiece.y += 1;
    }
    return ghostPiece;
  }, [isColliding]);

    const endGame = useCallback(() => {
        setGameOver(true);
    }, []);

    useEffect(() => {
        if (gameOver) {
            if (mode === 'sprint') {
              leaderboard.saveScore(score);
            }
            navigationFunctions.navigateToOption(0, { score: score });
        }
    }, [gameOver, score, navigationFunctions, leaderboard, mode]);


  useEffect(() => {
      let timer;
      if (mode === 'sprint' && !gameOver) {
          timer = setInterval(() => {
              setTimeRemaining(prevTime => {
                  console.log('Time remaining:', prevTime); // Add this line
                  if (prevTime <= 1) {
                      clearInterval(timer);
                      endGame();
                      return 0;
                  }
                  return prevTime - 1;
              });
          }, 1000);
      }
      return () => clearInterval(timer);
  }, [mode, endGame, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const swapCanvas = swapCanvasRef.current;
    const nextCanvas = nextCanvasRef.current;
    const context = canvas.getContext('2d');
    const swapContext = swapCanvas.getContext('2d');
    const nextContext = nextCanvas.getContext('2d');

    // Get the computed styles
    const styles = getComputedStyle(document.documentElement);

    // Get the CSS variable values
    // const lightestColor = styles.getPropertyValue('--color-lightest').trim();
    const lightColor = styles.getPropertyValue('--color-light').trim();
    const darkColor = styles.getPropertyValue('--color-dark').trim();
    // const darkestColor = styles.getPropertyValue('--color-darkest').trim();

    // Scale the context only if it hasn't been scaled yet
    if (!isScaled.current) {
      context.scale(BLOCK_SIZE, BLOCK_SIZE);
      swapContext.scale(BLOCK_SIZE, BLOCK_SIZE); // Swap canvas scaled to half size
      nextContext.scale(BLOCK_SIZE, BLOCK_SIZE); // Next canvas scaled to half size
      isScaled.current = true;
      console.log(BLOCK_SIZE)
    }

    let animationFrameId;

    let dropInterval = 1000;
    switch (difficulty) {
        case 'easy':
            dropInterval = 1000;
            break;
        case 'medium':
            dropInterval = 500;
            break;
        case 'hard':
            dropInterval = 250;
            break;
        default:
            dropInterval = 1000;
    }

    function gameLoop(timestamp) {
      if (!gameOver) {
        update(timestamp);
        draw();
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    }

    function update(timestamp) {
      if (!currentPiece) {
        // Spawn new piece
        const newPiece = createNewPiece();
        if (isColliding(newPiece, board)) {
          endGame();
          console.log('Game Over: Initial piece collision');
        } else {
          setCurrentPiece(newPiece);
          console.log('New piece created:', newPiece);
        }
      } else if (timestamp - lastDropTimeRef.current > dropInterval) {
        // Gravity
        const movedPiece = { ...currentPiece, y: currentPiece.y + 1 };
        if (isColliding(movedPiece, board)) {
          // Gravity placed piece
          const newBoard = placePiece(currentPiece, board);
          setBoard(newBoard);
          setCurrentPiece(null);
          console.log('Piece placed, new board:', newBoard);
        } else {
          setCurrentPiece(movedPiece);
          console.log('Piece moved down:', movedPiece);
        }
        lastDropTimeRef.current = timestamp;
      }
    }

    function draw() {
      context.fillStyle = darkColor;
      context.fillRect(0, 0, canvas.width, canvas.height);

      board.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) {
            context.fillStyle = lightColor;
            context.fillRect(x, y, 1, 1);
          }
        });
      });

      if (currentPiece) {
        // Draw ghost piece
        const ghostPiece = calculateGhostPosition(currentPiece, board);
        context.fillStyle = `${lightColor}40`; // 40 is for 25% opacity
        ghostPiece.blocks.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value > 0) {
              context.fillRect(x + ghostPiece.x, y + ghostPiece.y, 1, 1);
            }
          });
        });

        // Floating piece
        context.fillStyle = lightColor;
        currentPiece.blocks.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value > 0) {
              context.fillRect(x + currentPiece.x, y + currentPiece.y, 1, 1);
            }
          });
        });
      }

      // Draw swap piece
      swapContext.fillStyle = darkColor;
      swapContext.fillRect(0, 0, swapCanvas.width, swapCanvas.height);
      if (swapPiece) {
        swapContext.fillStyle = lightColor;
        swapPiece.blocks.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value > 0) {
              swapContext.fillRect(x, y, 1, 1);
            }
          });
        });
      }

      // Draw next pieces
      nextContext.fillStyle = darkColor;
      nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
      nextPieces.forEach((shapeIndex, pieceIndex) => {
        const piece = SHAPES[shapeIndex];
        nextContext.fillStyle = lightColor;
        piece.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value > 0) {
              nextContext.fillRect(x, y + pieceIndex * 4, 1, 1);
            }
          });
        });
      });
    }

    function handleKeyPress(event) {
      if (!currentPiece || gameOver) return;

      event.preventDefault();
      event.stopPropagation();

      let keyMatched = false;


      switch (event.key) {
        case 'ArrowUp':
          rotatePiece();
          keyMatched = false;
          break;
        case 'ArrowLeft':
          movePiece(-1, 0);
          keyMatched = false;
          break;
        case 'ArrowDown':
          movePiece(0, 1);
          keyMatched = false;
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          keyMatched = false;
          break;
        case 'a':
        case 'Enter':
        case ' ':
          hardDrop();
          keyMatched = true;
          break;
        case 'b':
        case 'Shift':
          swapCurrentPiece();
          keyMatched = false;
          break;
        default:
          break;
      }
      if (keyMatched) {
        setPlayButtonSound(true);
      }
    }

    document.addEventListener('keydown', handleKeyPress);
    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      cancelAnimationFrame(animationFrameId);
    };
  }, [board, currentPiece, swapPiece, nextPieces, gameOver, createNewPiece, isColliding, placePiece, movePiece, rotatePiece, swapCurrentPiece, hardDrop, calculateGhostPosition, difficulty, endGame]);

  function createEmptyBoard() {
    return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
  }

  function clearLines(board) {
    let linesCleared = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (board[y].every(cell => cell !== 0)) {
        board.splice(y, 1);
        board.unshift(Array(BOARD_WIDTH).fill(0));
        y++;
        linesCleared++;
      }
    }
    if (linesCleared > 0) {
        // Clered lines: 100 points per line, squared to reward multiple lines at once
        setScore(prevScore => prevScore + ((linesCleared**2) * 100));
        setPlayDestroySound(true)
    } else {
        // Default placement: 10 points
        setScore(prevScore => prevScore + 10);
    }
  }

  return (
    <div className="tetris-game">
      <div className="game-area">
        <canvas
          ref={canvasRef}
          width={BLOCK_SIZE * BOARD_WIDTH}
          height={BLOCK_SIZE * BOARD_HEIGHT}
        />
        <div className="side-panel">
          <div className="swap-view">
            <canvas
              ref={swapCanvasRef}
              width={4*BLOCK_SIZE}
              height={4*BLOCK_SIZE}
            />
          </div>
          <div className="next-queue">
            <canvas
              ref={nextCanvasRef}
              width={4*BLOCK_SIZE}
              height={4*3*BLOCK_SIZE}
            />
          </div>
        </div>
      </div>
      <div className="game-info">
        {mode !== 'sprint' && <p className={isMobile ? 'mobile' : ''}>Score: {score} / GameMode: {mode}</p>}
        {mode === 'sprint' && <p className={isMobile ? 'mobile' : ''}>Score: {score} / Time left: {timeRemaining}s</p>}
      </div>
      {playButtonSound && <ButtonsSoundPlayer setPlayButtonSound={setPlayButtonSound} />}
      <MusicPlayer></MusicPlayer>
      {playDestroySound && <LineClearSoundPlayer setPlayLineClearSound={setPlayDestroySound}/> }
      </div>
  );
}

export default Tetris;
