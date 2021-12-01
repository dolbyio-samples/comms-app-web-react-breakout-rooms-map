import { useMemo } from 'react';
import { AppControls } from '../AppControls';
import { CallToActionButton } from '../UI/CallToActionButton';
import { icons } from './Avatar';
import { AvatarOrVideo } from './AvatarOrVideo';
import { useAvatarPosition } from './useAvatarPosition';
import { useRemotePositions } from './useRemotePositions';
import { positionToH3 } from './HexGridOverlay';
import { useMeeting } from './useMeeting';
import { useBroadcastPosition } from './useBroadcastPosition';
import { useParticipants } from './useParticipants';
import { useKillZombies } from './useKillZombies';
import { conference, session } from '@voxeet/voxeet-web-sdk';
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

const svgWidth = '100%';
const svgHeight = '100%';

const initialPosition = [200, 200];

export function WaterCooler({ cell }) {
  // Join meeting
  const joinInfo = useMeeting(cell);

  // The position of the avatar representing the user.
  // This hook implements the arrow key interactions,
  // and returns the [px,px] coordinate position of the particiapnt.
  const position = useAvatarPosition({ initialPosition });

  // once the local participant has joined,
  if (joinInfo) {
    // set the spatial positioning for the local particiapant
    conference.setSpatialPosition(session.participant, {
      x: position[0],
      y: position[1],
      z: 1,
    });
  }

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

  if (remotePositions && conference.participants) {
    // For each user we are tracking in Firebase,
    for (const p of remotePositions) {
      // see if there is a corresponding participant in the Dolby.io conference
      const participant = conference.participants.get(p.id);
      if (participant) {
        // set the spatial position of the remote participant,
        // based on the object that contains position in Firebase for that user (which is kept in sync with useBroadCastPosition)
        conference.setSpatialPosition(participant, {
          x: p.position[0],
          y: p.position[1],
          z: 1,
        });
      }
    }
  }

  const participants = useParticipants(joinInfo, position);

  return (
    <div className="water-cooler-container">
      <div className="top">
        <div className="title">Welcome to the Dolby.io Headquarters!</div>
        <div className="blurb">
          Use L/R arrow keys to move around the space. Join a <br /> meeting by
          entering the same grid cell as other users.
        </div>
      </div>
      <div className="map-image-container">
        <svg width={svgWidth} height={svgHeight} className="water-cooler">
          <image
            href="1275-market-st-16th-optimized.png"
            x="0"
            y="0"
            transform="scale(1) translate(-443, -605)"
          />
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
      </div>
      <div className="bottom">
        <AppControls />
        <CallToActionButton />
        <div className="counterweight" />
      </div>
    </div>
  );
}
