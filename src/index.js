import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux';
import App from './app/layout/App';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css';
import { configureStore } from './app/store/ConfigureStore';
import ScrollOnTop from './app/util/ScrollOnTop';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import ReduxToastr from 'react-redux-toastr';

const rootEl = document.getElementById('root');

const store = configureStore();

let render = () => {
    ReactDOM.render(
        <Provider store= {store}>
            <BrowserRouter>
                <ScrollOnTop >
                <ReduxToastr
                    position='bottom-right'
                    transitionIn='fadeIn'
                    transitionOut='fadeOut'
                />
                <App />
                </ScrollOnTop>
            </BrowserRouter>
        </Provider>,
        rootEl
     );
}

if (module.hot) {
    module.hot.accept('./app/layout/App', () => {
        setTimeout(render);
    })
}
store.firebaseAuthIsReady.then(() => {
    render();
})






// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
