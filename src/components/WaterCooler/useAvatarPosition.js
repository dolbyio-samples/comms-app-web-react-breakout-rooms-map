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
if (position[0] < 50){
  position[0] = 51
}
//right
if (position[0] > 560){
  position[0] = 559
}

//top
if (position[1] < 60){
  position[1] = 59
}
//bottom
if (position[1] > 575){
  position[1] = 574
}


  return position;
};
