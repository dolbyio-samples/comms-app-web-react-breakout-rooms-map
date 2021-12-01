import { useEffect, useState } from 'react';
import { conference, session } from '@voxeet/voxeet-web-sdk';
const meetingId = (cell) => `water-cooler-${cell}`;

// This hook joins a meeting and returns joining info.
// That joining info contains the ID we can use with Dolby APIs
// to identify the user for the purposes of stopping/starting audio.
export const useMeeting = (cell) => {
  // Keep track of joining info, which contains the generated ID for our user.
  const [joinInfo, setJoinInfo] = useState(false);
  // Join the conference and store the generated ID.
  useEffect(() => {
    const join = async () => {
      // create conference
      const conf = await conference.create({
        alias: meetingId(cell),
        params: { dolbyVoice: true },
      });
      const joinOptions = {
        constraints: {
          audio: true,
          video: false,
        },
        preferRecvMono: false,
        preferSendMono: false,
        spatialAudio: true, // Turn on Spatial Audio
      };
      // join conference
      await conference.join(conf, joinOptions);
      setJoinInfo({
        id: session.participant.id,
      });
      // configure spatial environment and set on conference
      const scale = { x: 1480 / 16, y: 700 / 12, z: 1 }; // scale room to 16 meters x 12 meters
      const forward = { x: 0, y: -1, z: 0 };
      const up = { x: 0, y: 0, z: 1 };
      const right = { x: 1, y: 0, z: 0 };
      await conference.setSpatialEnvironment(scale, forward, up, right);
    };
    join();

    // Clean up when we move between cells.
    return () => {
      conference.leave();
    };
  }, [cell]);

  return joinInfo;
};
