import React from "react";
import { Redirect, Route } from "react-router-dom";

// rutas publicas cuando no esta en sesion
function PublicRoute({ component: Component, ...rest }) {

  return (
    <Route
      {...rest}
      render={props => 
        <Redirect to={{ pathname: "/admin" }} />
      }
    />
  );
}

export default PublicRoute;
