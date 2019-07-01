import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';
import { openModal } from './../modals/ModalsActions';

export const UserIsAuthenticated = connectedReduxRedirect({
    wrapperDisplayName: 'UserIsAuthenticated',
    allowRedirectBack: true,
    redirectPath: '/events',
    authenticatedSelector: ({firebase : {auth}}) => 
        auth.isLoaded && !auth.isEmpty,
    redirectAction: newLoc => (dispatch) => {
        dispatch(openModal('UnAuthModal'))
    }
})