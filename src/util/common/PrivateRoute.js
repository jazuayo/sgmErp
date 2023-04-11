import React from "react";
import { Route, Redirect } from "react-router-dom";

// rutas privadas cuando esta en sesion
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        let user = sessionStorage.getItem("user");
        if (!user) {
          // not logged in so redirect to login page with the return url
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        }
        return <Component {...props} />;
      }}
    />
  );
}

export default PrivateRoute;
