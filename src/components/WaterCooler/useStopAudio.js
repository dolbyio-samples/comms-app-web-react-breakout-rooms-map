import { useEffect } from 'react';
import { conference } from '@voxeet/voxeet-web-sdk';

// Stop audio for remote users who are not in the same hexagon.
// Start audio for remote users who are in the same hexagon.
// See reference:
// https://docs.dolby.io/interactivity/docs/js-client-sdk-conferenceservice#stopaudio
export const useStopAudio = ({ joinInfo, activeHexId, remotePositions }) => {
  useEffect(() => {
    // Don't try to mute/unmute until after we've joined the meeting.
    if (!joinInfo) return;

    // Figure out who to mute and who not to mute.
    for (const { hexId, id } of remotePositions) {
      //        console.log(hexId,activeHexId);
      //        console.log(hexId === activeHexId);
      const participant = conference.participants.get(id);
      // Guard against stale Firebase entries.
      if (participant) {
        // If the remote participant is in the same hexagon,
        if (hexId === activeHexId) {
          // let their audio through.
          conference.startAudio(participant);
        } else {
          // Otherwise stop their audio.
          conference.stopAudio(participant);
        }
      }
    }
  }, [joinInfo, activeHexId, remotePositions]);
};
