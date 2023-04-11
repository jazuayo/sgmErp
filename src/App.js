import { createBrowserHistory } from "history";
import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
} from "react-router-dom";
import PrivateRoute from "./util/common/PrivateRoute";
import Admin from "./views/admin/Admin.js";
import Login from "./views/login/Login.js";

const hist = createBrowserHistory();

function App() {
  return (
    <div>
      <Router history={hist} basename={process.env.REACT_APP_ROUTER_BASE || ""}>
        <div>
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute path="/admin" component={Admin} />
            <Redirect from="/" to="/login" />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
