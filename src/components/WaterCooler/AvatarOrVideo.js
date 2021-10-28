import { useMemo } from 'react';
import { Avatar } from './Avatar';
import { ParticipantVideo } from './ParticipantVideo';

export const AvatarOrVideo = ({
  id,
  position,
  color,
  icon,
  isSelf,
  participants,
}) => {
  // Isolate the video stream of the participant;
  const videoStream = useMemo(() => {
    // id and/or participants may be null for a brief time after the page renders the first time,
    // and before the conference is joined.
    if (id && participants) {
      const participant = participants.get(id);

      if (participant) {
        return participant.streams.find(
          (stream) => stream.getVideoTracks().length > 0
        );
      }
    }
    return null;
  }, [id, participants]);

  return videoStream ? (
    <ParticipantVideo position={position} videoStream={videoStream}  isSelf={isSelf} />
  ) : (
    <Avatar position={position} color={color} icon={icon} isSelf={isSelf} />
  );
};
