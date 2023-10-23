import React from "react";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
  },
}));

const Loader = () => {
  const classes = useStyles();

  return (
    <div className={classes.loaderContainer}>
      <CircularProgress />
    </div>
  );
};

export default Loader;
