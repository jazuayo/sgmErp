import logo from "../../imagenes/ecommerce.png";
// core components
import Navbar from "../navbars/Navbar.js";
import Sidebar from "../sidebar/Sidebar.js";
//import "perfect-scrollbar/css/perfect-scrollbar.css";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { getModuleWithComponent } from "../../util/common/Common.js";

export default function Admin({ ...rest }) {
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  let routesPantalas = getModuleWithComponent();

  const switchRoutes = () => (
    <Switch>
      {routesPantalas.map((prop, key) => {
        if (prop.layout === "/admin") {
          return prop.subMenu.map((propSubMenu, key) => {
            return (
              <Route
                path={propSubMenu.layout + propSubMenu.path}
                component={propSubMenu.component}
                key={key}
              />
            );
          });
        }
        return null;
      })}
      <Redirect from="/admin" to="/admin/home" />
    </Switch>
  );

  return (
    <div style={{ paddingLeft: 55, paddingRight: 10 }}>
      <Sidebar
        routes={routesPantalas}
        logoText={"Inventario"}
        logo={logo}
        color={"turquesa"}
      />
      <div ref={mainPanel}>
        <Navbar routes={routesPantalas} />
        <br />
        <div style={{ color: "#FDFEFE" }}>{switchRoutes(routesPantalas)}</div>
      </div>
    </div>
  );
}