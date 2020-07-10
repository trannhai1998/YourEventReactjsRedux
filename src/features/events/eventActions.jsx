import { toastr } from "react-redux-toastr";
import * as types from "./eventContants";
import * as actions from "./../async/AsyncActions";
import { fetchSampleData } from "./../../app/data/mockApi.js";
import { createNewEvent } from "./../../app/util/helpers";
import moment from "moment";
import firebase from "./../../app/config/firebaseConfig";
import compareAsc from "date-fns/compare_asc";

export const createEvent = (event) => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    let newEvent = createNewEvent(user, photoURL, event);
    console.log("new Event", newEvent);
    try {
      let createdEvent = await firestore.add("events", newEvent);
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        host: true,
      });
      toastr.success("Success! ", " Event has been Created !");
    } catch (error) {
      toastr.error("Oops ", " Something was Wrong !");
      console.log(error.message);
    }
  };
};

export const updateEvent = (event) => {
  return async (dispatch, getState, { getFirestore }) => {
    dispatch(actions.asyncActionStart());
    const firestore = firebase.firestore();
    event.date = moment(event.date).toDate();
    try {
      let eventDocRef = firestore.collection("events").doc(event.id);
      let dateEqual = compareAsc(
        getState().firestore.ordered.events[0].date,
        event.date
      );
      if (dateEqual === 0) {
        let batch = firestore.batch();
        await batch.update(eventDocRef, event);

        let eventAttendeeRef = firestore.collection("event_attendee");
        let eventAttendeeQuery = await eventAttendeeRef.where(
          "eventId",
          "==",
          event.id
        );
        let eventAttendeeQuerySnap = await eventAttendeeQuery.get();

        for (let i = 0; i < eventAttendeeQuerySnap.docs.length; i++) {
          let eventAtendeeDocRef = firestore
            .collection("event_attendee")
            .doc(eventAttendeeQuerySnap.docs[i].id);

          await batch.update(eventAtendeeDocRef, {
            eventDate: event.date,
          });
        }
        await batch.commit();
      } else {
        await eventDocRef.update(event);
      }
      toastr.success("Success! ", " Event has been Update !");
      dispatch(actions.asyncActionFinish());
    } catch (error) {
      dispatch(actions.asyncActionError());
      console.log(error.message);
      toastr.error("Oops ", " Something was Wrong !");
    }
  };
};

export const cancelToggle = (cancelled, eventId) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const message = cancelled
    ? "Are You sure want to cancel the event ?"
    : "This will reactivate the Event - are you Sure ?";
  try {
    toastr.confirm(message, {
      onOk: () =>
        firestore.update(`events/${eventId}`, {
          cancelled: cancelled,
        }),
    });
  } catch (error) {}
};

export const deleteEvent = (id) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: types.DELETE_EVENT,
        payload: {
          id,
        },
      });
      toastr.success("Success! ", " Event has been Deleted !");
    } catch (error) {
      toastr.error("Oops ", " Something was Wrong !");
    }
  };
};
export const fetchEvent = (events) => {
  return {
    type: types.FETCH_EVENT,
    payload: {
      events,
    },
  };
};

export const loadEvents = () => {
  return async (dispatch) => {
    try {
      dispatch(actions.asyncActionStart());
      let events = await fetchSampleData();
      dispatch(fetchEvent(events));
      dispatch(actions.asyncActionFinish());
    } catch (error) {
      console.log(error);
      dispatch(actions.asyncActionError());
    }
  };
};

export const getEventsForDashboard = (lastEvent) => async (
  dispatch,
  getState
) => {
  dispatch(actions.asyncActionStart());
  let today = new Date(Date.now());
  const firestore = firebase.firestore();
  const eventsRef = firestore.collection("events");
  try {
    let startAfter =
      lastEvent &&
      (await firestore.collection("events").doc(lastEvent.id).get());
    let query;

    lastEvent
      ? (query = eventsRef
          .where("date", "<=", today)
          .orderBy("date")
          .startAfter(startAfter)
          .limit(2))
      : (query = eventsRef.where("date", ">=", today).orderBy("date").limit(2));
    let querySnap = await query.get();

    if (querySnap.docs.length === 0) {
      dispatch(actions.asyncActionFinish());
      return;
    }
    let events = [];
    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
      events.push(evt);
      console.log(evt);
    }
    console.log("Events: ", events);
    dispatch({ type: types.FETCH_EVENT, payload: { events } });
    dispatch(actions.asyncActionFinish());
    return querySnap;
  } catch (error) {
    console.log(error);
    dispatch(actions.asyncActionError());
  }
};

export const addEventComment = (eventId, values, parentId) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const profile = getState().firebase.profile;
  const user = firebase.auth().currentUser;
  let newComment = {
    parentId: parentId,
    displayName: profile.displayName,
    photoURL: profile.photoURL || "/assets/user.png",
    uid: user.uid,
    text: values.comment,
    date: Date.now(),
  };
  try {
    await firebase.push(`event_chat/${eventId}`, newComment);
  } catch (error) {
    toastr.error("Oops ", " Something was wrong");
  }
};
