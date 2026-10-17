import React, { useEffect, useRef, useState } from "react";
import "./Dino.css";

const HIGH_SCORE_KEY = "dinoHighScore";

function Dino() {
  const dinoRef = useRef();
  const cactusRef = useRef();
  const gameRef = useRef();
  const gameOverRef = useRef(false);
  const collisionRef = useRef(false);
  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(0);

  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
    } catch {
      return 0;
    }
  });
  const highScoreRef = useRef(highScore);
  const [newRecord, setNewRecord] = useState(false);

  const jump = () => {
    if (gameOverRef.current) return;
    if (dinoRef.current && !dinoRef.current.classList.contains("jump")) {
      dinoRef.current.classList.add("jump");
      setTimeout(function () {
        dinoRef.current?.classList.remove("jump");
      }, 300);
    }
  };

  const speedUp = () => {
    const game = gameRef.current;
    if (!game) return;

    const time = Math.max(0.45, 1 - scoreRef.current / 10000);
    game.style.setProperty("--cactus-time", `${time}s`);
    collisionRef.current = false;
  };

  useEffect(() => {
    if (gameOver) return;

    const isAlive = setInterval(() => {
      const dino = dinoRef.current;
      const cactus = cactusRef.current;
      if (!dino || !cactus || collisionRef.current) return;

      const dinoTop = Number.parseInt(
        getComputedStyle(dino).getPropertyValue("top"),
        10
      );
      const cactusLeft = Number.parseInt(
        getComputedStyle(cactus).getPropertyValue("left"),
        10
      );

      if (cactusLeft < 40 && cactusLeft > 0 && dinoTop >= 140) {
        collisionRef.current = true;
        gameOverRef.current = true;
        setGameOver(true);

        const finalScore = scoreRef.current;
        if (finalScore > highScoreRef.current) {
          highScoreRef.current = finalScore;
          setHighScore(finalScore);
          setNewRecord(true);
          try {
            localStorage.setItem(HIGH_SCORE_KEY, String(finalScore));
          } catch {
            // storage blocked (private mode, etc.): the record still lasts until reload
          }
        }
      } else {
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }
    }, 10);

    return () => clearInterval(isAlive);
  }, [gameOver]);

  useEffect(() => {
    document.addEventListener("keydown", jump);
    return () => document.removeEventListener("keydown", jump);
  }, []);

  const restart = () => {
    scoreRef.current = 0;
    collisionRef.current = false;
    gameOverRef.current = false;
    setScore(0);
    setGameOver(false);
    setNewRecord(false);
    gameRef.current?.style.setProperty("--cactus-time", "1s");
    setRound((currentRound) => currentRound + 1);
  };

  return (
    <div
      className={gameOver ? "game over" : "game"}
      key={round}
      ref={gameRef}
    >
      <div className="score">Score : {score}</div>
      <div id="dino" ref={dinoRef}></div>
      <div id="cactus" ref={cactusRef} onAnimationIteration={speedUp}></div>

      {gameOver && (
        <div className="game-over">
          <h2>Game Over</h2>
          {newRecord && <p className="new-record">New high score!</p>}
          <p>Dude, don't run into cacti</p>
          <p>Score: {score}</p>
          <p>High Score: {highScore}</p>
          <button onClick={restart}>Play again</button>
        </div>
      )}
    </div>
  );
}

export default Dino;
