import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import loggerMiddleware from "redux-logger";
import thunkMiddleware from "redux-thunk";

import user from "./user";
import conversations from "./conversations";
import activeConversation from "./activeConversation";

const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                                                        // Specify extension’s options like name, actionsDenylist, actionsCreators, serialize...
                                                      })
        : compose;

const enhancer = composeEnhancers(
    applyMiddleware(thunkMiddleware, loggerMiddleware)
    // other store enhancers if any
);
const CLEAR_ON_LOGOUT = "CLEAR_ON_LOGOUT";

export const clearOnLogout = () => {
  return {
    type: CLEAR_ON_LOGOUT
  };
};

const appReducer = combineReducers({
  user,
  conversations,
  activeConversation
});
const rootReducer = (state, action) => {
  if (action.type === CLEAR_ON_LOGOUT) {
    // set state to initial state
    state = undefined;
  }
  return appReducer(state, action);
};

export default createStore(rootReducer, enhancer );
