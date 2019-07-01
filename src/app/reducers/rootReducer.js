import { combineReducers } from 'redux';
import {reducer as FormReducer} from 'redux-form';
import {reducer as toastr} from 'react-redux-toastr';
import TestReducer from './testReducer';
import EventReducer from './../../features/events/eventReducer';
import ModalsReducer from './../../features/modals/ModalsReducer';
import authReducer from './../../features/auth/AuthReducer';
import asyncReducer from './../../features/async/AsyncReducer.jsx';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore'

const rootReducer = combineReducers({
    firebase : firebaseReducer,
    firestore : firestoreReducer,
    form : FormReducer,
    test : TestReducer,
    event : EventReducer,
    modals : ModalsReducer,
    auth : authReducer,
    async : asyncReducer,
    toastr : toastr
})
export default rootReducer;