import { db } from '../providers/Firebase';

export const getFirebaseDataOnce = async ({ cell }) => {
  const ref = db.ref(cell);
  return (await ref.get()).val();
};

export const subscribeToAttributeUpdates = ({ cell, attribute, callback }) => {
  const ref = db.ref(`${cell}/${attribute}`);
  ref.on('value', (snapshot) => {
    callback({ newData: snapshot.val() });
  });
};
