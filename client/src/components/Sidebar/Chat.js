import React from "react";
import { Badge, Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { activateChat } from "../../store/utils/thunkCreators";
import user from "../../store/user";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser } = conversation;

  const handleClick = async (id, username) => {
    if (!conversation.active) {
      const data = { id: id, username: username };
      await props.activateChat(data);
    }
  };

  return (
    <Box
      onClick={() => handleClick(conversation.id, otherUser.username)}
      className={classes.root}
    >
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      {conversation.unread > 0 && (
        <Badge badgeContent={conversation.unread} color="primary" />
      )}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    activateChat: (data) => {
      dispatch(activateChat(data));
    },
  };
};

export default connect(null, mapDispatchToProps)(Chat);
