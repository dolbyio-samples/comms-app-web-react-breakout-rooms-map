import { useState, useEffect } from 'react';
import { db } from '../../providers/Firebase';

// Gets the position of the avatars representing remote users from Firebase.
export const useRemotePositions = ({ joinInfo, cell }) => {
  const [positions, setPositions] = useState([]);

  // Subscribe for updates to remote positions.
  useEffect(() => {
    // Do nothing until we've joined the meeting and have our ID to filter out.
    if (!joinInfo) return;

    // The unique ID that identifies this client.
    const selfId = joinInfo.id;

    const ref = db.ref(cell);
    const callback = (snapshot) => {
      // This is an object where keys are user ids
      // and values are positions.
      const value = snapshot.val();

      // Guard against null case, before initialization of data in Firebase.
      if (value) {
        // Isolate the array of values to render.
        const positions = Object.values(value)

          // Don't render ourselves here - that is done elsewhere.
          .filter(({ id }) => id !== selfId);

        //console.log(JSON.stringify(positions, null, 2));

        setPositions(positions);
      }
    };
    ref.on('value', callback);
    return () => ref.off('value', callback);
  }, [cell, joinInfo]);

  return positions;
};
