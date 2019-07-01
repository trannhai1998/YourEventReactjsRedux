import * as types from './AsyncContants';

export const asyncActionStart = () => {
    return {
        type : types.ASYNC_ACTION_START
    }
}

export const asyncActionFinish = () => {
    return {
        type : types.ASYNC_ACTION_FINISH
    }
}

export const asyncActionError = () => {
    return {
        type : types.ASYNC_ACTION_ERROR
    }
}