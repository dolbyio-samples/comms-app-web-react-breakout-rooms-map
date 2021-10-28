import { Alien } from './icons/Alien';
import { Anchor } from './icons/Anchor';
import { Bug } from './icons/Bug';
import { Donut } from './icons/Donut';
import { Glasses } from './icons/Glasses';
import { Heart } from './icons/Heart';
import { Lightning } from './icons/Lightning';
import { Paperclip } from './icons/Paperclip';
import { Pizza } from './icons/Pizza';
import { Planet } from './icons/Planet';
import { Spiral } from './icons/Spiral';
import { Sun } from './icons/Sun';

export const icons = {
  Alien,
  Anchor,
  Bug,
  Donut,
  Glasses,
  Heart,
  Lightning,
  Paperclip,
  Pizza,
  Planet,
  Spiral,
  Sun,
};

// The icons were exported from the icon selector design,
// but the scaling is different in the floor plan screen.
const iconScale = 29 / 40;

export const Avatar = ({ position, color = '#FF59D1', icon, isSelf }) => {
  let Icon = icons[icon];
  if (!Icon) {
    console.log('Invalid icon name ' + icon);
    Icon = Paperclip;
  }
  return (
    <g className="avatar" transform={`translate(${position})`} fill={color}>
      <circle r="20" />
      <g transform={`scale(${iconScale})`}>
        <Icon color="white" />
      </g>
      {isSelf ? (
        <g transform="translate(0,36)">
          <text textAnchor="middle" fill="white" stroke="white">
            You
          </text>
          <text textAnchor="middle">You</text>
        </g>
      ) : null}
    </g>
  );
};
