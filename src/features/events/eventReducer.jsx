import { createReducer } from "./../../app/util/reducerUtil";
import * as types from "./eventContants";

const initialState = [];

export const createEvent = (state, payload) => {
  return [...state, Object.assign({}, payload.event)];
};

export const updateEvent = (state, payload) => {
  return [
    ...state.filter(event => event.id !== payload.event.id),
    Object.assign({}, payload.event)
  ];
};
export const deleteEvent = (state, payload) => {
  return [...state.filter(event => event.id !== payload.id)];
};
export const fetchEvents = (state, payload) => {
  const events = payload.events;
  return events;
};
export default createReducer(initialState, {
  [types.DELETE_EVENT]: deleteEvent,
  [types.CREATE_EVENT]: createEvent,
  [types.UPDATE_EVENT]: updateEvent,
  [types.FETCH_EVENT]: fetchEvents,
});
