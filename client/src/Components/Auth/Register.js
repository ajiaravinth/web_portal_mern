import React, { useState } from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import AvField from "availity-reactstrap-validation/lib/AvField";
import AvGroup from "availity-reactstrap-validation/lib/AvGroup";
import AvForm from "availity-reactstrap-validation/lib/AvForm";
import { useSelector, useDispatch } from "react-redux";
import { admin_register } from "../redux/action/adminActions";

const Register = (props) => {
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [values, setValues] = useState(user);
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const formSubmit = (e) => {
    e.preventDefault();
    let formData = {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
      phone: values.phone,
    };
    dispatch(admin_register(formData, props));
  };

  return (
    <div className="container">
      <ToastContainer autoClose={1500} />
      <div className="userContainer ">
        <h3 style={{ textAlign: "center" }}>Register</h3>
        <AvForm onValidSubmit={formSubmit}>
          <AvGroup>
            <AvField
              type="text"
              name="name"
              label="Name"
              placeholder="Enter your name"
              value={values.name}
              onChange={handleChange}
              validate={{
                required: { value: true, errorMessage: "Please enter name!" },
              }}
            />
          </AvGroup>
          <AvGroup>
            <AvField
              type="text"
              name="username"
              label="Username"
              placeholder="Enter Username"
              value={values.username}
              onChange={handleChange}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Please enter username!",
                },
              }}
            />
          </AvGroup>
          <AvGroup>
            <AvField
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your Email"
              value={values.email}
              onChange={handleChange}
              validate={{
                required: { value: true, errorMessage: "Please enter email!" },
              }}
            />
          </AvGroup>
          <AvGroup>
            <AvField
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Please enter password!",
                },
              }}
            />
          </AvGroup>
          <AvGroup>
            <AvField
              type="password"
              name="confirm_password"
              label="Confirm Password"
              placeholder="Re-Enter your password"
              value={values.confirm_password}
              onChange={handleChange}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Please re-enter password",
                },
                match: {
                  value: "password",
                  errorMessage: "Password doesn't match",
                },
              }}
            />
          </AvGroup>
          <AvGroup>
            <AvField
              type="number"
              name="phone"
              label="Phone Number"
              placeholder="Enter your Phone Number"
              value={values.phone}
              onChange={handleChange}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Please enter phone number",
                },
                minLength: {
                  value: 10,
                  errorMessage: "Phone number must be 10 digits ",
                },
                maxLength: {
                  value: 12,
                  errorMessage: "Phone number must be 10 digits ",
                },
              }}
            />
          </AvGroup>
          <AvGroup>
            <Button color="success">Register</Button>
          </AvGroup>
        </AvForm>
        <Link to="/">Go to Login</Link>
      </div>
    </div>
  );
};

export default Register;
