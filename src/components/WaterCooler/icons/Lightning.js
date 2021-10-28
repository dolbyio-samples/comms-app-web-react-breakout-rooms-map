const width = 26.25;
const height = 40;
const fixCentering = `translate(${-width / 2},${-height / 2})`;

export const Lightning = ({ color }) => (
  <g transform={fixCentering}>
    <path
      d="M26.25 15.7392H15.8892L20 0L0 24.2608H10.3608L6.25 40L26.25 15.7392Z"
      fill={color}
    />
  </g>
);
