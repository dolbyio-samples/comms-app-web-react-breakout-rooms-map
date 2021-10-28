import { useEffect } from 'react';
import { db } from '../../providers/Firebase';

// Broadcast the user's position to other clients using Firebase.
export const useBroadcastPosition = ({
  joinInfo,
  position,
  activeHexId,
  cell,
  selfColor,
  selfIcon,
}) => {
  // Write position data into Firebase.
  useEffect(() => {
    // Do nothing until we've joined the meeting and have our ID.
    if (!joinInfo) return;

    // The unique ID that identifies this client.
    const selfId = joinInfo.id;

    //console.log(selfId);

    // Persist to Firebase.
    db.ref(`${cell}/user${selfId}`).set({
      position,
      hexId: activeHexId,
      color: selfColor,
      icon: selfIcon,
      id: selfId,
    });
  }, [cell, position, selfColor, selfIcon, joinInfo, activeHexId]);

  // Remove users when they close the browser.
  useEffect(() => {
    if (!joinInfo) return;
    const selfId = joinInfo.id;

    // Hack to be able to clear out positions manually.
    window.clearPositions = () => {
      db.ref(`${cell}`).set({});
    };

    // TODO see if we can use Dolby API events to track this more robustly.
    const callback = () => {
      db.ref(`${cell}/user${selfId}`).set(null);
    };
    window.addEventListener('beforeunload', callback);
    return () => window.removeEventListener('beforeunload', callback);
  }, [cell, joinInfo]);
};
