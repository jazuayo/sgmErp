/*eslint-disable*/
import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Icon from "@material-ui/core/Icon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import avatar from "../../imagenes/usuario.png";
// core components
import { NavLink } from "react-router-dom";
import { getUser } from "../../util/common/Common";
import Toolbar from "@material-ui/core/Toolbar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import clsx from "clsx";

const drawerWidth = 260;

const useStylesDraw = makeStyles((theme) => ({
  drawerOpen: {
    background: "#17202A",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    background: "#17202A",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: "45px",
  },
  iconUser: {
    marginTop: "7px",
    width: "60px",
  },
  panelUser: {
    textAlign: "center",
    color: "#FDFEFE",
    "&:after": {
      content: '""',
      position: "absolute",
      height: "1px",
      right: "15px",
      width: "calc(100% - 30px)",
      backgroundColor: "#FDFEFE",
    },
  },
}));

const selectedStyle = {
  backgroundColor: "#1ABC9C",
  color: "slategray",
};

export default function Sidebar(props) {
  const [state, setState] = React.useState(false);

  const [open, setOpen] = React.useState({
    nombrePantalla: "",
    estado: false,
  });

  const handleClick = (nombrePantalla, estado) => {
    setOpen({
      nombrePantalla: nombrePantalla,
      estado: !open.estado,
    });
  };

  const classesDraw = useStylesDraw();
  var datosUsuario = getUser();
  const { color, logo, logoText, routes } = props;

  const toggleDrawer = (open) => (event) => {
    setState(open);
  };

  const lista = () => (
    <div>
      {state ? (
        <div>
          <div className={classesDraw.panelUser}>
            <div>
              <a href="#">
                <img src={avatar} alt="..." className={classesDraw.iconUser} />
              </a>
              <p>{datosUsuario ? datosUsuario.nombreUsuario : ""}</p>
              <pre>{datosUsuario ? datosUsuario.sucursal : ""}</pre>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <List>
        {routes.map((prop, key) => {
          return (
            <div
              style={{ textDecoration: "none", color: "#FDFEFE" }}
              activeStyle={selectedStyle}
              key={key}
            >
              <ListItemButton
                onClick={() => {
                  handleClick(prop.name, true);
                }}
              >
                <ListItemIcon style={{ color: "#FDFEFE" }}>
                  <Icon style={{ padding: 2 }}>{prop.icon}</Icon>
                </ListItemIcon>
                <ListItemText
                  primary={props.rtlActive ? prop.rtlName : prop.name + " "}
                />
                {prop.subMenu.length !== 0 ? (
                  open.estado ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : null}
              </ListItemButton>

              {prop.subMenu.map((propSubMenu, key) => {
                return (
                  <Collapse
                    in={open.nombrePantalla == prop.name ? open.estado : null}
                    timeout="auto"
                    unmountOnExit
                    key={key}
                  >
                    {propSubMenu.orden === 1 && (
                      <List>
                        <NavLink
                          style={{
                            textDecoration: "none",
                            color: "#FDFEFE",
                          }}
                          to={propSubMenu.layout + propSubMenu.path}
                          activeStyle={selectedStyle}
                          key={key}
                        >
                          <ListItemButton
                            sx={{ pl: 5 }}
                            onClick={toggleDrawer(false)}
                          >
                            <ListItemIcon style={{ color: "#FDFEFE" }}>
                              <Icon style={{ padding: 2 }}>
                                {propSubMenu.icon}
                              </Icon>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                props.rtlActive
                                  ? propSubMenu.rtlName
                                  : propSubMenu.name + " "
                              }
                            />
                          </ListItemButton>
                        </NavLink>
                      </List>
                    )}
                  </Collapse>
                );
              })}
            </div>
          );
        })}
        <div style={{ textDecoration: "none", color: "#FDFEFE" }}>
          <ListItemButton
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            <ListItemIcon style={{ color: "#FDFEFE" }}>
              <Icon style={{ padding: 2 }}>{"outbound"}</Icon>
            </ListItemIcon>
            <ListItemText primary={"Cerrar Sesion"} />
          </ListItemButton>
        </div>
      </List>
    </div>
  );

  return (
    <React.Fragment key={"left"}>
      <Toolbar style={{ backgroundColor: "#FDFEFE" }}>
        {state ? (
          <div style={{ marginLeft: `calc(-65px + 260px)` }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer(false)}
            >
              <ChevronLeftIcon />
            </IconButton>
          </div>
        ) : (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
          >
            <Menu />
          </IconButton>
        )}
      </Toolbar>
      <Drawer
        variant="permanent"
        anchor={"left"}
        open={state}
        onClose={toggleDrawer(false)}
        classes={{
          paper: clsx({
            [classesDraw.drawerOpen]: state,
            [classesDraw.drawerClose]: !state,
          }),
        }}
      >
        <img src={logo} alt="logo" className={classesDraw.panelUser} />
        {lista()}
      </Drawer>
    </React.Fragment>
  );
}
