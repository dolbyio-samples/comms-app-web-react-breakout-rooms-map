import { useReducer, useEffect } from 'react';

const directions = {
  ArrowUp: [0, -1],
  ArrowRight: [1, 0],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
};

// How many pixels it moves by on each arrow press.
const speed = 10;

const reducer = (position, direction) => [
  position[0] + direction[0] * speed,
  position[1] + direction[1] * speed,
];

// This hook implements the arrow key interactions.
export const useAvatarPosition = ({ initialPosition = [200, 200] }) => {
  const [position, move] = useReducer(reducer, initialPosition);

  useEffect(() => {
    const listener = (event) => {
      const direction = directions[event.code];
      if (!direction) return;
      move(direction);

      // Prevent scrolling.
      event.preventDefault();
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);

  //Left
  if (position[0] < 20) {
    position[0] = 19;
  }
  //right
  if (position[0] > 1460) {
    position[0] = 1459;
  }

  //top
  if (position[1] < 18) {
    position[1] = 19;
  }
  //bottom
  if (position[1] > 665) {
    position[1] = 664;
  }

  return position;
};
