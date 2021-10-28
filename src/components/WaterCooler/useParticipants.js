import { conference } from '@voxeet/voxeet-web-sdk';
import { useState, useEffect } from 'react';

// Provides
export const useParticipants = (joinInfo) => {
  const [participants, setParticipants] = useState(new Map());

  useEffect(() => {
    // Don't try to access participants
    // until after we've joined the meeting.
    if (!joinInfo) {
      return;
    }
    const updateParticipants = () => {
      // Clone the Map so that we trigger changes with React hooks.
      setParticipants(new Map(conference.participants));
    };

    // Initialize.
    updateParticipants();

    // Track updates.
    conference.on('streamAdded', updateParticipants);
    conference.on('streamUpdated', updateParticipants);
    conference.on('streamRemoved', updateParticipants);
    conference.on('participantUpdated', updateParticipants);

    // Clean up listeners.
    return () => {
      conference.off('streamAdded', updateParticipants);
      conference.off('streamUpdated', updateParticipants);
      conference.off('streamRemoved', updateParticipants);
      conference.off('participantUpdated', updateParticipants);
    };
  }, [joinInfo]);

  return participants;
};
