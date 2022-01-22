import { setActiveChatToStore } from "./utils/reducerFunctions";

const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (data) => {
  return {
    type: SET_ACTIVE_CHAT,
    payload: { username: data.otherUser.username, conversation: data },
  };
};

const reducer = (state = "", action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return setActiveChatToStore(state, action.payload.username);
    }
    default:
      return state;
  }
};

export default reducer;
