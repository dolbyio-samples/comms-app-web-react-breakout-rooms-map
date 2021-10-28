import { useEffect } from 'react';
import { conference } from '@voxeet/voxeet-web-sdk';
import { db } from '../../providers/Firebase';

// This hook clears out entries in Firebase for people
// who have exited the meeting.
// We use the `beforeunload` event elsewhere in the code
// (see useBroadcastPosition.js)
// to trigger removal of user entries from Firebase.
// However, that event is unfortunately not 100% reliable,
// so this module was introduced to ensure that all "zombie"
// users that persist in Firebase when the `beforeunload`
// event fails to fire are eventually removed.

// We poll periodically to kill the zombies (in milliseconds).
const pollInterval = 5000;

export const useKillZombies = ({ cell, remotePositions }) => {
  useEffect(() => {
    // Check and rectify differences periodically, every `pollInterval` ms.
    const interval = setInterval(() => {
      // Wait until we have the Firebase data
      // and we have joined the conference.
      if (remotePositions && conference.participants) {
        // For each user we are tracking in Firebase,
        for (const { id } of remotePositions) {
          // see if there is a corresponding participant in the Dolby.io conference.
          const participant = conference.participants.get(id);

          // If our Firebase entry is stale with respect to
          // the particimant inventory provided by Dolby APIs,
          if (!participant) {
            // remove it from Firebase.
            db.ref(`${cell}/user${id}`).set(null);
          }
        }
      }
    }, pollInterval);
    return () => {
      clearInterval(interval);
    };
  }, [cell, remotePositions]);
};
