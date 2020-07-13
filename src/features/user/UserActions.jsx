import moment from "moment";
import { toastr } from "react-redux-toastr";
import cuid from "cuid";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from "../async/AsyncActions";
import firebase from "././../../app/config/firebaseConfig";
import { FETCH_EVENT } from "../events/eventContants";

export const setMainPhoto = (photo) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const today = new Date(Date.now());
  let eventAttendeeRef = firestore.collection("event_attendee");
  let userDocRef = firestore.collection("users").doc(user.uid);
  let activityDoc = firestore.collection("activity");
  try {
    dispatch(asyncActionStart());
    let batch = firestore.batch();
    await batch.update(userDocRef, {
      photoURL: photo.url,
    });

    let activityQuery = await activityDoc.where("hostUid", "==", user.uid);
    let activityQuerySnap = await activityQuery.get();
    for (let i = 0; i < activityQuerySnap.docs.length; i++) {
      let activityDocRef = await firestore
        .collection("activity")
        .doc(activityQuerySnap.docs[i].id);
      let activity = await activityDocRef.get();
      if (activity.data()) {
        if (activity.data().hostUid === user.uid) {
          batch.update(activityDocRef, {
            photoURL: photo.url,
          });
        }
      }
    }
    // Doi anh trong comment
    let eventQuery = await eventAttendeeRef
      .where("userUid", "==", user.uid)
      .where("eventDate", ">=", today);
    let eventQuerySnap = await eventQuery.get();
    for (let i = 0; i < eventQuerySnap.docs.length; i++) {
      let eventDocRef = await firestore
        .collection("events")
        .doc(eventQuerySnap.docs[i].data().eventId);
      let event = await eventDocRef.get();
      if (event.data()) {
        if (event.data().hostUid === user.uid) {
          batch.update(eventDocRef, {
            hostPhotoURL: photo.url,
            [`attendees.${user.uid}.photoURL`]: photo.url,
          });
        } else {
          batch.update(eventDocRef, {
            [`attendees.${user.uid}.photoURL`]: photo.url,
          });
        }
      }
    }
    await batch.commit();
    dispatch(asyncActionFinish());
  } catch (error) {
    dispatch(asyncActionError());
  }
};

export const updateProfile = (userUpdate) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const eventDocRef = firestore.collection("events");
  let activityDoc = firestore.collection("activity");

  const { isLoaded, isEmpty, ...updatedUser } = userUpdate;

  if (updatedUser.dateOfBirth !== getState().firebase.profile.dateOfBirth) {
    updatedUser.dateOfBirth = moment(user.dateOfBirth).toDate();
  }

  try {
    dispatch(asyncActionStart());
    console.log("Update User : ", updatedUser);
    await user.updateProfile(updatedUser);
    let batch = firestore.batch();

    let eventQuery = await eventDocRef.where("hostUid", "==", user.uid);
    let eventQuerySnap = await eventQuery.get();
    for (let i = 0; i < eventQuerySnap.docs.length; i++) {
      let eventDocData = await firestore
        .collection("events")
        .doc(eventQuerySnap.docs[i].id);
      let event = await eventDocData.get();
      if (event.data()) {
        if (event.data().hostUid === user.uid) {
          batch.update(eventDocData, {
            hostedBy: updatedUser.displayName,
          });
        }
      }
    }

    let activityQuery = await activityDoc.where("hostUid", "==", user.uid);
    let activityQuerySnap = await activityQuery.get();
    for (let i = 0; i < activityQuerySnap.docs.length; i++) {
      let activityDocRef = await firestore
        .collection("activity")
        .doc(activityQuerySnap.docs[i].id);
      let activity = await activityDocRef.get();
      if (activity.data()) {
        if (activity.data().hostUid === user.uid) {
          batch.update(activityDocRef, {
            hostedBy: updatedUser.displayName,
          });
        }
      }
    }

    await batch.commit();
    toastr.success("Success ", " Profile updated ");
    dispatch(asyncActionFinish());
  } catch (error) {
    dispatch(asyncActionError());
  }
};

export const uploadProfileImage = (file, fileName) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const imageName = cuid();
  const user = firebase.auth().currentUser;
  const path = `${user.uid}/user_images`;
  const options = {
    name: imageName,
  };
  try {
    dispatch(asyncActionStart());
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    let downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL();

    let userDoc = await firestore.get(`users/${user.uid}`);
    if (!userDoc.data().photoURL) {
      await firebase.updateProfile({
        photoURL: downloadURL,
      });
      await user.updateProfile({
        photoURL: downloadURL,
      });
    }
    await firestore.add(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "photos" }],
      },
      {
        name: imageName,
        url: downloadURL,
      }
    );
    dispatch(asyncActionFinish());
  } catch (error) {
    dispatch(asyncActionError());
    throw new Error("Problem uploading photos");
  }
};
export const deletePhoto = (photo) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  try {
    await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);

    await firestore.delete({
      collection: "users",
      doc: user.uid,
      subcollections: [
        {
          collection: "photos",
          doc: photo.id,
        },
      ],
    });
  } catch (error) {}
};

export const goingToEvent = (event) => async (dispatch, getState) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const photoURL = getState().firebase.profile.photoURL;
  const attendee = {
    going: true,
    joinDate: Date.now(),
    photoURL: photoURL || "/assets/user.png",
    displayName: user.displayName,
    host: false,
  };
  try {
    let eventDocRef = firestore.collection("events").doc(event.id);
    let eventAttendeeRef = firestore
      .collection("event_attendee")
      .doc(`${event.id}_${user.uid}`);

    await firestore.runTransaction(async (tracsaction) => {
      await tracsaction.get(eventDocRef);
      await tracsaction.update(eventDocRef, {
        [`attendees.${user.uid}`]: attendee,
      });

      await tracsaction.set(eventAttendeeRef, {
        eventId: event.id,
        userUid: user.uid,
        eventDate: event.date,
        host: false,
      });
    });
    dispatch(asyncActionFinish());
    toastr.success("Success ", " You Have Signed up to the Event ");
  } catch (error) {
    dispatch(asyncActionError());
    toastr.error("Oops Something Was Wrong ");
  }
};

export const cancelGoingToEvent = (event) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  try {
    await firestore.update(`events/${event.id}`, {
      [`attendees.${user.uid}`]: firestore.FieldValue.delete(),
    });
    await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
    toastr.success("Success ", " You Have Remove yourself from  the Event ");
  } catch (error) {
    toastr.error("Oops Something Was Wrong ");
  }
};

export const getUserEvents = (userUid, activeTab) => async (
  dispatch,
  getState
) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
  const today = new Date(Date.now());
  let eventsRef = firestore.collection("event_attendee");
  let query;
  switch (activeTab) {
    case 1:
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("eventDate", "<=", today)
        .orderBy("eventDate");
      break;
    case 2:
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("eventDate", ">=", today)
        .orderBy("eventDate");
      break;
    case 3:
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("host", "==", true)
        .orderBy("eventDate", "desc");
      break;
    default:
      query = eventsRef
        .where("userUid", "==", userUid)
        .orderBy("eventDate", "desc");
      break;
  }
  try {
    let querySnap = await query.get();

    let events = [];
    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = await firestore
        .collection("events")
        .doc(querySnap.docs[i].data().eventId)
        .get();
      events.push({ ...evt.data(), id: evt.id });
    }
    dispatch({ type: FETCH_EVENT, payload: { events } });

    dispatch(asyncActionFinish());
  } catch (error) {
    toastr.error("Oops ", " Something Was Wrong !");
    dispatch(asyncActionError());
  }
};

export const followUser = (userToFollow) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  const following = {
    photoURL: userToFollow.photoURL || "/assets/user.png",
    city: userToFollow.city || "Unkown City",
    displayName: userToFollow.displayName,
  };
  try {
    await firestore.set(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "following", doc: userToFollow.id }],
      },
      following
    );
  } catch (error) {}
};

export const unfollowUser = (userToUnfollow) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  try {
    await firestore.delete({
      collection: "users",
      doc: user.uid,
      subcollections: [{ collection: "following", doc: userToUnfollow.id }],
    });
    toastr.success("Success You Unfollowed this Friend ");
  } catch (error) {
    toastr.error("Oops Something was Wrong ");
  }
};
