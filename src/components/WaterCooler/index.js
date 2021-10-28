import { useMemo } from 'react';
import { AppControls } from '../AppControls';
import { CallToActionButton } from '../UI/CallToActionButton';
import { icons } from './Avatar';
import { AvatarOrVideo } from './AvatarOrVideo';
import { useAvatarPosition } from './useAvatarPosition';
import { useRemotePositions } from './useRemotePositions';
import { HexGridOverlay, positionToH3 } from './HexGridOverlay';
import { useMeeting } from './useMeeting';
import { useBroadcastPosition } from './useBroadcastPosition';
import { useStopAudio } from './useStopAudio';
import { useParticipants } from './useParticipants';
import { useKillZombies } from './useKillZombies';
import './WaterCooler.scss';

// The color that your avatar will appear.
const colors = [
  '#EB467E',
  '#64C6FA',
  '#7340F5',
  '#818181',
  '#50B06C',
  '#3C4BF4',
];

const selfColor = colors[Math.floor(Math.random() * colors.length)];

const iconNames = Object.keys(icons);
const selfIcon = iconNames[Math.floor(Math.random() * iconNames.length)];

const svgWidth = 617;
const svgHeight = 617;

const initialPosition = [200, 200];

export function WaterCooler({ cell }) {
  // Place the user in a live meeting based on the activeHexId they are in.
  const joinInfo = useMeeting(cell);

  // The position of the avatar representing the user.
  // This hook implements the arrow key interactions.
  const position = useAvatarPosition({ initialPosition });

  // The id of the "active" hexagon - the one the user avatar is inside.
  const activeHexId = useMemo(() => positionToH3(position), [position]);

  // Broadcast the user's position to other clients using Firebase.
  useBroadcastPosition({
    joinInfo,
    position,
    activeHexId,
    cell,
    selfColor,
    selfIcon,
  });

  // Get the positions of the remote users from Firebase.
  const remotePositions = useRemotePositions({ joinInfo, cell });

  // Ensure there are no stale Firebase entries for people who have left.
  useKillZombies({ cell, remotePositions });

  // Stop audio for remote users who are not in the same hexagon.
  useStopAudio({ joinInfo, activeHexId, remotePositions });

  const participants = useParticipants(joinInfo);

  return (
    <div className="water-cooler-container">
      <div className="top">
        <div className="title">Welcome to the Dolby.io Headquarters!</div>
        <div className="blurb">
          Use L/R arrow keys to move around the space. Join a <br /> meeting by
          entering the same grid cell as other users.
        </div>
      </div>
      <svg width={svgWidth} height={svgHeight} className="water-cooler">
        <image
          href="1275-market-st-16th-optimized.png"
          x="0"
          y="0"
          height="1324px"
          width="2016px"
          transform="scale(0.49) translate(-405,-39)"
        />

        <HexGridOverlay activeHexId={activeHexId} />

        {remotePositions.map(({ position, color, id, icon }) => (
          <AvatarOrVideo
            key={id}
            id={id}
            position={position}
            color={color}
            icon={icon}
            participants={participants}
          />
        ))}
        <AvatarOrVideo
          color={selfColor}
          icon={selfIcon}
          position={position}
          id={joinInfo ? joinInfo.id : null}
          isSelf
          participants={participants}
        />
      </svg>
      <div className="bottom">
        <AppControls />
        <CallToActionButton />
        <div className="counterweight" />
      </div>
    </div>
  );
}
