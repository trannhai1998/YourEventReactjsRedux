import * as types from './ModalsContants';
import { createReducer } from './../../app/util/reducerUtil'

const initialState = null;

export const openModal = (state , payload ) => {
    const { modalType , modalProps } = payload;
    return { modalType , modalProps } 
}

export const closeModal = ( state , payload ) =>{
    return null
}

export default createReducer(initialState ,{
    [types.MODAL_OPEN] : openModal,
    [types.MODAL_CLOSE] : closeModal
})