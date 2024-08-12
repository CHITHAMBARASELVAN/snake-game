import React, { useState, useEffect, useCallback } from 'react';
import './GameBoard.css';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 8, y: 8 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

const GameBoard = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood());
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);

  // Generate random food position
  function generateFood() {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
  }

  // Check if the snake collides with itself or walls
  const checkCollision = useCallback(
    (newSnake) => {
      const head = newSnake[0];
      // Check walls
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return true;
      }
      // Check self collision
      for (let i = 1; i < newSnake.length; i++) {
        if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
          return true;
        }
      }
      return false;
    },
    []
  );

  // Handle snake movement
  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    const newSnake = [...snake];
    const newHead = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };
    newSnake.unshift(newHead);

    // Check for food collision
    if (newHead.x === food.x && newHead.y === food.y) {
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    if (checkCollision(newSnake)) {
      setIsGameOver(true);
      return;
    }

    setSnake(newSnake);
  }, [snake, direction, food, isGameOver, checkCollision]);

  // Change snake direction
  const changeDirection = (event) => {
    const { key } = event;
    let newDirection;
    switch (key) {
      case 'ArrowUp':
        if (direction.y === 0) newDirection = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (direction.y === 0) newDirection = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (direction.x === 0) newDirection = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (direction.x === 0) newDirection = { x: 1, y: 0 };
        break;
      default:
        return;
    }
    if (newDirection) setDirection(newDirection);
  };

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', changeDirection);
    return () => {
      window.removeEventListener('keydown', changeDirection);
    };
  }, [direction]);

  // Update the snake movement
  useEffect(() => {
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [moveSnake]);

  return (
    <div className="game-board">
      {Array.from({ length: GRID_SIZE }).map((_, row) =>
        Array.from({ length: GRID_SIZE }).map((_, col) => {
          const isSnake = snake.some((segment) => segment.x === col && segment.y === row);
          const isFood = food.x === col && food.y === row;
          return (
            <div
              key={`${row}-${col}`}
              className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
            />
          );
        })
      )}
      {isGameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default GameBoard;
