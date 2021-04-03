import React, { useState, useEffect } from "react";
import {AvForm, AvGroup, AvField} from "availity-reactstrap-validation";
import { Button } from "reactstrap";

const AdminLogin = (props) => {
  const user = {
    username: "",
    password: "",
  };
  const [values, setValues] = useState(user);

  useEffect(() => {
    // toast.success(props.location.state.message);
    let authCheck = localStorage.getItem("authToken");
    if (authCheck) {
      props.history.push("/admin/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const formSubmit = (e) => {
    e.preventDefault();
    let formData = {
      email: values.username,
      password: values.password,
    };
    console.log(formData, "formData")
  };
  return (
    <div>
      <div className="userContainer">
        <h3 style={{ textAlign: "center" }}>Login</h3>
        <AvForm onValidSubmit={formSubmit}>
          <AvGroup>
            <AvField
              type="text"
              name="username"
              label="Username"
              placehoder="Enter Username"              
              value={values.username}
              onChange={handleChange}
              validate={{
                required: { value: true, errMessage: "Please enter name" },
              }}
            />
          </AvGroup>
          <AvGroup>
            <AvField
              type="password"
              name="password"
              label="Password"
              placehoder="Enter Password"
              value={values.password}
              onChange={handleChange}
              validate={{
                required: { value: true, errMessage: "Please enter Password" },
              }}
            />
          </AvGroup>
          <Button color="success">Login</Button>
        </AvForm>
      </div>
    </div>
  );
};

export default AdminLogin;
