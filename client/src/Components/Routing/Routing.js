import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AdminProfile from "../Dashboard/AdminProfile";
import AddNewAgency from "../Agency/AddNewAgency";
import Dashboard from "../Dashboard/Dashboard";
import EditAgency from "../Agency/EditAgency";
// import EditAgency from "../views/Agency/EditAgency";

const Routing = () => {
  let authUser = localStorage.getItem("authToken");
  return (
    <div>
      <Switch>
        <PrivateRoute
          exact
          path="/admin/dashboard"
          component={Dashboard}
          auth={authUser}
        />
        <PrivateRoute
          exact
          path="/admin/edit"
          component={AdminProfile}
          auth={authUser}
        />
        <PrivateRoute
          exact
          path="/addagency"
          component={AddNewAgency}
          auth={authUser}
        />
        <PrivateRoute
          exact
          path="/agency/profile/edit"
          component={EditAgency}
          auth={authUser}
        />
      </Switch>
    </div>
  );
};

export default Routing;

const PrivateRoute = ({ component: Components, auth, ...props }) => {
  return (
    <Route
      {...props}
      render={(props) =>
        auth ? (
          <Components {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
