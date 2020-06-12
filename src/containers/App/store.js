import { combineReducers, createStore } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { sidebarReducer, themeReducer, authReducer } from '../../redux/reducers/index';

const reducer = combineReducers({
  form: reduxFormReducer, // mounted under "form",
  theme: themeReducer,
  sidebar: sidebarReducer,
  auth: authReducer,
});

const store = createStore(
    reducer,
    {},
    window.devToolsExtension && window.devToolsExtension()
);

export default store;
