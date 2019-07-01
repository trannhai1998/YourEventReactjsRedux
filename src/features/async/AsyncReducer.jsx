import {createReducer} from './../../app/util/reducerUtil'
import * as types from './AsyncContants';
const initialState = {
    loading : false
}


export const asyncActionStarted = (state ) =>{
    return {...state ,loading : true}
}
export const asyncActionFinish = (state) => {
    return {...state, loading : false}
}
export const asyncActionError = (state) => {
    return {...state , loading : false}
}

export default createReducer(initialState , {
    [types.ASYNC_ACTION_START] : asyncActionStarted,
    [types.ASYNC_ACTION_FINISH] : asyncActionFinish,
    [types.ASYNC_ACTION_ERROR] : asyncActionError,
})