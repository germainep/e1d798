export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {};
    newConvo.id = message.conversationId;
    newConvo.otherUser = sender;
    newConvo.messages = [message];
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = {...convo}
      convoCopy.messages = [...convoCopy.messages, message]
      return convoCopy
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = {
        otherUser: user,
        messages: [],
        latestMessageText: {}
      };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages = [message];

      return newConvo;
    } else {
      return convo;
    }
  });
};


export const updateMessagesToStore = (state, conversation) => {

  return state.map((convo) => {
    if (convo.id === conversation.id) {
      const convoCopy = { ...convo };

      convoCopy.messages = [...conversation.messages]

      convoCopy.unread = convoCopy.messages.reduce((count, message) => {
        return convoCopy.otherUser.id === message.senderId
        && message.read === false ? count + 1 : count
      }, 0)

      convoCopy.latestMessageText = {
        text: convoCopy.messages[convoCopy.messages.length - 1].text,
        read: convoCopy.messages[convoCopy.messages.length - 1].read,
      };



      return convoCopy;

    }
    return convo
  });
};


