import IconButton from "@material-ui/core/IconButton";
// @material-ui/core components
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import UserInformation from "./UserInformation.js";

export default function Header(props) {
  const { open, color } = props;

  function makeBrand() {
    var name;
    props.routes.map((prop) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        name = props.rtlActive ? prop.rtlName : prop.name;
      }

      if (prop.subMenu.lenght !== 0) {
        // Nombre de las pantallas del subMenu
        prop.subMenu.map((propSubMenu) => {
          if (
            window.location.href.indexOf(
              propSubMenu.layout + propSubMenu.path
            ) !== -1
          ) {
            name = props.rtlActive ? propSubMenu.rtlName : propSubMenu.name;
          }
        });
      }
      return null;
    });
    return name;
  }

  return (
    <Toolbar style={{ backgroundColor: "#FDFEFE" }}>
      <div
        style={{
          width: "55%",
          display: "inline-block",
          letterSpacing: "unset",
          lineHeight: "25px",
          fontSize: "18px",
          borderRadius: "3px",
          textTransform: "none",
          color: "inherit",
          margin: "0",
          marginLeft: "calc(100vh - 50%)",
          "&:hover,&:focus": {
            background: "transparent",
          },
        }}
      >
        <UserInformation
          openMenu={open}
          nombrePantalla={makeBrand()}
        />
      </div>
    </Toolbar>
  );
}