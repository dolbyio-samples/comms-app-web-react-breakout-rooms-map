import { useMemo } from 'react';
import { geoToH3, kRing, h3ToGeoBoundary } from 'h3-js';
import { geoOrthographic, geoPath } from 'd3';

// See https://github.com/uber/h3-js/issues/59#issuecomment-891214544
const lng = 142.868226;
const lat = 75.147338;
const HEX_ZOOM_SIZE = 8;
const K_RING_LEVELS = 5;
const SCALE = 1000000;

const projection = geoOrthographic().scale(SCALE).rotate([-lng, -lat, -2.4]);
const pathGenerator = geoPath(projection);

const centerID = geoToH3(lat, lng, HEX_ZOOM_SIZE);
const ids = kRing(centerID, K_RING_LEVELS);

// Inspired by https://observablehq.com/@pstuffa/h3-vs-d3-hexbin
//const geoBoundariesProjected = geoBoundaries.map((geoBoundary) =>
//  geoBoundary.map((coordinates) => projection(coordinates))
//);
//const paths = geoBoundariesProjected.map(
//  (projectedBoundary) => `M${projectedBoundary.join('L')}Z`
//);

// H3 gives us coordinates with a winding order that's
// incompatible with what D3 geo expects.
// We fix that by reversing the ordering of the coordinates,
// for each hexagon individually.
const fixWindingOrder = (coords) => coords.reverse();

const h3ToMultiPolygon = (ids) => ({
  type: 'MultiPolygon',
  coordinates: [ids.map((id) => fixWindingOrder(h3ToGeoBoundary(id, true)))],
});

const h3ToPolygon = (id) => ({
  type: 'Polygon',
  coordinates: [fixWindingOrder(h3ToGeoBoundary(id, true))],
});

// Compute this only once.
const hexGrid = (
  <path fill="none" stroke="#7E84FF" d={pathGenerator(h3ToMultiPolygon(ids))} />
);

export const HexGridOverlay = ({ activeHexId }) => {
  const activeHex = useMemo(
    () => (
      <path
        fill="#7E84FF"
        fillOpacity="0.3"
        stroke="#3D4484"
        strokeWidth="2"
        d={pathGenerator(h3ToPolygon(activeHexId))}
      />
    ),
    [activeHexId]
  );
  return (
    <g>
      <g>{hexGrid}</g>
      <g>{activeHex}</g>
    </g>
  );
};

// Computes the hex cell ID in which the given position (in pixels) falls.
export const positionToH3 = (position) => {
  const [lng, lat] = projection.invert(position);
  return geoToH3(lat, lng, HEX_ZOOM_SIZE);
};
