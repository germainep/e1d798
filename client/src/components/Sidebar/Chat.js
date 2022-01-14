import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent, Notifications } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { changeActive } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

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

  const handleClick = async (conversation) => {
    await props.changeActive(conversation.id);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      {conversation.unread > 0 && (
        <Notifications unread={conversation.unread} />
      )}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeActive: (id) => {
      dispatch(changeActive(id));
    },
  };
};

export default connect(null, mapDispatchToProps)(Chat);
