import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "50%",
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.primary.main,
    padding: "5px 10px",
    color: "white",
    textAlign: "center",
    fontWeight: "800",
  },
}));

const Notifications = (props) => {
  const classes = useStyles();
  const unread = props.unread || [];
  return <div className={classes.root}>{unread.toString()}</div>;
};

export default Notifications;
