import '@voxeet/voxeet-web-sdk';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';

// This is due to a breaking change in version 3.2.0,
// in which these functions are expected to be invoked as methods
// on the SDK object, like VoxeetSDK.initialize().
const initialize = VoxeetSDK.initialize.bind(VoxeetSDK);
const session = VoxeetSDK.session;
const mediaDevice = VoxeetSDK.mediaDevice;
const conference = VoxeetSDK.conference;

// To configure your app to used the closed spatial beta, sign up at https://go.dolby.io/spatial-audio
// Spatial enable key and secret
const consumerKey = '<DOLBYIO_COMMUNICATIONS_API>';
const consumerSecret = '<DOLBYIO_COMMUNICATIONS_SECRET>';

// const mediaDeviceService = mediaDevice();
export const initializeVoxeet = () => {
  initialize(consumerKey, consumerSecret);
};

/**
 * This function either creates a new session if there isn't anyone in one with that alias
 * or finds the conference if there already is.
 * It returns an object that can be passed into joinConference below();
 * @param {*} alias
 * @returns conference
 */
const createConference = (alias) => {
  return new Promise((resolve, reject) => {
    conference
      .create({ alias })
      .then((cellConference) => {
        resolve(cellConference);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

// conference in/out
const joinConference = (conf) => {
  conference.join(conf, {});
};

const leaveConference = () => {
  conference.leave();
};

// video
const startVideo = () => {
  conference
    .startVideo(session.participant)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });
};

const stopVideo = () => {
  conference
    .stopVideo(session.participant)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });
};

// audio
const startAudio = () => {
  conference
    .startAudio(session.participant)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });
};

const stopAudio = () => {
  conference
    .stopAudio(session.participant)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });
};

// media devices
const getAudioDevices = () => {
  return new Promise((resolve, reject) => {
    mediaDevice
      .enumerateAudioDevices()
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getVideoDevices = () => {
  return new Promise((resolve, reject) => {
    mediaDevice
      .enumerateVideoDevices()
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const changeAudioDevice = (deviceId) => {
  mediaDevice
    .selectAudioInput(deviceId)
    .then(() => {})
    .catch((err) => console.error);
};

const changeVideoDevice = (deviceId) => {
  mediaDevice
    .selectVideoInput(deviceId)
    .then(() => {})
    .catch((err) => console.error);
};

export {
  createConference,
  joinConference,
  leaveConference,
  startVideo,
  stopVideo,
  startAudio,
  stopAudio,
  getAudioDevices,
  getVideoDevices,
  changeAudioDevice,
  changeVideoDevice,
};
