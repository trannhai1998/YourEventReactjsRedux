import * as types from './../../features/TestArea/TestContant';
import  { createReducer } from './../../app/util/reducerUtil';
const initialState = {
    data : 424
}

export const incrementCounter = (state,payload) =>{
    return {...state,data : state.data + 1 };
}
export const decrementCounter = (state,payload) =>{
    return {...state,data : state.data -1 };
}

// const testReducer = (state = initialState , action) => {
//     switch(action.type){
//         case types.INCREMENT_COUNTER : 
//             return {...state,data : state.data + 1};
//         case types.DECREMENT_COUNTER : 
//             return {...state,data : state.data -1 };
//         default:return state;

//     }
// }
export default createReducer(
    initialState,{
    [types.INCREMENT_COUNTER] : incrementCounter,
    [types.DECREMENT_COUNTER] : decrementCounter
    }
);