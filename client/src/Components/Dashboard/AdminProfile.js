import React, { useState, useEffect } from "react";
import { Button, Row, Col } from "reactstrap";
import AvField from "availity-reactstrap-validation/lib/AvField";
import AvGroup from "availity-reactstrap-validation/lib/AvGroup";
import AvForm from "availity-reactstrap-validation/lib/AvForm";
import jwtDecode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { admin_profile_save } from "../redux/action/adminActions";
import { ToastContainer } from "react-toastify";

const AdminProfile = (props) => {
  const user = useSelector((state) => state.authReducer);
  const [values, setValues] = useState(user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let values = props.location.state;
    let getPwd = jwtDecode(values.password);
    setValues({
      ...values,
      password: getPwd.password,
    });
  }, []);

  const formSubmit = (e) => {
    e.preventDefault();
    let formData = {
      id: values._id,
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
      phone: values.phone,
      status: values.status,
    };
    dispatch(admin_profile_save(formData, props));
  };

  return (
    <div className="container">
      <ToastContainer autoClose={1500} />
      <div className="userContainer mt-4 ">
        <h3 style={{ textAlign: "center" }}>User Profile</h3>
        <AvForm onValidSubmit={formSubmit}>
          <Row>
            <Col md="6">
              <AvGroup>
                <AvField
                  type="text"
                  name="name"
                  label="Name"
                  placeholder="Enter your name"
                  value={values.name ? values.name : ""}
                  onChange={handleChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Please enter name!",
                    },
                  }}
                />
              </AvGroup>
            </Col>
            <Col md="6">
              <AvGroup>
                <AvField
                  type="text"
                  name="username"
                  label="Username"
                  placeholder="Enter Username"
                  value={values.username ? values.username : ""}
                  onChange={handleChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Please enter username!",
                    },
                  }}
                />
              </AvGroup>
            </Col>
            <Col md="6">
              <AvGroup>
                <AvField
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Enter your Email"
                  value={values.email ? values.email : ""}
                  onChange={handleChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Please enter email!",
                    },
                  }}
                />
              </AvGroup>
            </Col>
            <Col md="6">
              <AvGroup>
                <AvField
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={values.password ? values.password : ""}
                  onChange={handleChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Please enter password!",
                    },
                  }}
                />
              </AvGroup>
            </Col>
            <Col md="6">
              <AvGroup>
                <AvField
                  type="password"
                  name="confirm_password"
                  label="Confirm Password"
                  placeholder="Re-Enter your password"
                  value={values.confirm_password ? values.confirm_password : ""}
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
            </Col>
            <Col md="6">
              <AvGroup>
                <AvField
                  type="number"
                  name="phone"
                  label="Phone Number"
                  placeholder="Enter your Phone Number"
                  value={values.phone ? values.phone : ""}
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
            </Col>
            <Col>
              <AvGroup>
                <Button color="success">Update</Button>
                <Button
                  className="ml-3"
                  color="danger"
                  onClick={() => props.history.push("/admin/dashboard")}
                >
                  Cancel
                </Button>
              </AvGroup>
            </Col>
          </Row>
        </AvForm>
      </div>
    </div>
  );
};

export default AdminProfile;
