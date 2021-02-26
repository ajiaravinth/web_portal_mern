import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import AvField from "availity-reactstrap-validation/lib/AvField";
import AvGroup from "availity-reactstrap-validation/lib/AvGroup";
import AvForm from "availity-reactstrap-validation/lib/AvForm";
import { Link } from "react-router-dom";
import { admin_login } from "../redux/action/adminActions";

const Login = (props) => {
  const user = useSelector((state) => state.authReducer);
  const [values, setValues] = useState(user);
  const dispatch = useDispatch();

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
    dispatch(admin_login(formData, props));
  };

  return (
    <div className="container">
      <ToastContainer autoClose={1500} />
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
        <Link to="/register">Go to Register</Link>
      </div>
    </div>
  );
};

export default Login;
