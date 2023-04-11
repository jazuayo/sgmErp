import * as React from "react";
import { styled } from "@mui/material/styles";
import Check from "@mui/icons-material/Check";

const IconSgmRoot = styled("div")(({ ownerState }) => ({
  color: "#52b38f",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#147a54",
  }),
  "& .IconSgm-completedIcon": {
    color: "#52b38f",
  },
  "& .IconSgm-circle": {
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function IconSgm(props) {
  const { active, completed } = props;

  return (
    <IconSgmRoot ownerState={{ active }}>
      {completed && <Check className="IconSgm-completedIcon" />}
      {!completed && <div className="IconSgm-circle" />}
    </IconSgmRoot>
  );
}

export default IconSgm;
