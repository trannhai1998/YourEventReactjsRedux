import * as types from './ModalsContants';

export const openModal = (modalType , modalProps) => {
    return {
        type : types.MODAL_OPEN,
        payload : {
            modalType,
            modalProps
        }
    }
}
export const closeModal = (modalType , modalProps) => {
    return {
        type : types.MODAL_CLOSE,
        }
    }