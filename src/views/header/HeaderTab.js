/*eslint-disable*/
import AppBar from "@material-ui/core/AppBar";
// @material-ui/core components
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import PropTypes from "prop-types";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React from "react";

const theme = createTheme({
  overrides: {
    MuiToolbar: {
      root: {
        color: "#ff",
        minHeight: "59px !important",
      },
      regular: {
        minHeight: "15px !important",
      },
    },
  },
});
const fabStyle = {
  position: "fixed",
  zIndex: 100,
  bottom: 16,
  right: 16,
};

export default function HeaderTab(props) {
  const { children, loading, ...rest } = props;

  return (
    <React.Fragment>
      <AppBar
        position="sticky"
        style={{ backgroundColor: "#17202A", marginBottom: "1%" }}
      >
        <MuiThemeProvider theme={theme}>
          <Toolbar style={{ marginLeft: "auto" }}>{children}</Toolbar>
        </MuiThemeProvider>
      </AppBar>
      <Fab
        sx={{ ...fabStyle }}
        aria-label="Expand"
        color="primary"
        onClick={() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </React.Fragment>
  );
}
HeaderTab.propTypes = {
  children: PropTypes.node,
};
