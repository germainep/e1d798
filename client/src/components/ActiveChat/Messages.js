import React, {useEffect, useState} from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId} = props;
  const [lastRead, setLastRead] = useState(0)

  useEffect(() => {
    const readMessages = messages.filter((message) => {
      return userId === message.senderId && message.read
    })

    const lastId = readMessages.length > 0 ? readMessages[readMessages.length -1].id : null
    setLastRead(lastId)
  }, [messages, userId])

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            photo={otherUser.photoUrl}
            lastRead={lastRead === message.id}
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
