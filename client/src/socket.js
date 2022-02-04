import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser, setMessageUpdates,
} from "./store/conversations";
import {updateMessages} from "./store/utils/thunkCreators";


const socket = io(window.location.origin);




socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    const isActive = store.getState().activeConversation.id === data.message.senderId
    store.dispatch(setNewMessage(data.message, data.sender));
    store.dispatch(updateMessages(data.message.conversationId, isActive))
  });
  socket.on("update-messages", (data) => {
    store.dispatch(setMessageUpdates(data))
  })
});

export default socket;
