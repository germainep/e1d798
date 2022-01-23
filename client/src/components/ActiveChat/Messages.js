import React from "react";
import { Avatar, Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  const readMessages = messages.filter(
    (message) => message.senderId === userId && message.read
  );

  return (
    <Box>
      {messages.map((message, index, array) => {
        const time = moment(message.createdAt).format("h:mm");
        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            lastRead={
              message.read &&
              readMessages[readMessages.length - 1].id === message.id
            }
            photo={otherUser.photoUrl}
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
