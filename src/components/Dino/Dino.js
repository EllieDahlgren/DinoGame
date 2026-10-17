import React, { useEffect, useRef, useState } from "react";
import "./Dino.css";

function Dino() {
  const dinoRef = useRef();
  const cactusRef = useRef();
  const gameRef = useRef();
  const scoreRef = useRef(0);
  const collisionRef = useRef(false);
  const [score, setScore] = useState(0);

  const jump = () => {
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
        const finalScore = scoreRef.current;
        scoreRef.current = 0;
        setScore(0);
        alert("Game Over! Your Score : " + finalScore);
      } else {
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }
    }, 10);

    return () => clearInterval(isAlive);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", jump);
    return () => document.removeEventListener("keydown", jump);
  }, []);

  return (
    <div className="game" ref={gameRef}>
      <div className="score">Score : {score}</div>
      <div id="dino" ref={dinoRef}></div>
      <div id="cactus" ref={cactusRef} onAnimationIteration={speedUp}></div>
    </div>
  );
}

export default Dino;
