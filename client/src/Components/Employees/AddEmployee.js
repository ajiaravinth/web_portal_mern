import React, { useEffect, useState } from "react";
import AvForm from "availity-reactstrap-validation/lib/AvForm";
import { Row, Col, FormGroup, Label, Button } from "reactstrap";
import AvGroup from "availity-reactstrap-validation/lib/AvGroup";
import AvField from "availity-reactstrap-validation/lib/AvField";
import IntlTelInput from "react-intl-tel-input";
import { libphonenumber } from "react-intl-tel-input/dist";
import Select from "react-select";
import request from "../../api/api";
import Switch from "react-switch";
import { toast, ToastContainer } from "react-toastify";

const AddEmployee = (props) => {
  const initialData = {
    fname: "",
    lname: "",
    email: "",
    worklocation: "",
    job_role: "",
    employee_status: false,
    phone: {
      code: "",
      number: "",
    },
  };

  const [values, setValues] = useState(initialData);
  const [agencyId, setagencyId] = useState("");
  const [user, setuser] = useState("");
  const [usernameList, setusernameList] = useState([]);
  const [phoneerror, setphoneerror] = useState(false);

  useEffect(() => {
    let id = props.location.state.agencyId;
    setagencyId(id);
    request({
      url: "/employees/name_list",
      method: "GET",
    })
      .then((res) => {
        let listData = res.response.map((list, i) => ({
          ...list,
          value: list.username,
          label: list.username,
        }));
        setusernameList(listData);
      })
      .catch((err) => console.log(err));
  }, [props]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const statusCheck = (checked) => {
    setValues({ ...values, employee_status: checked });
  };

  const phoneHandler = (staus, value, countryData) => {
    console.log(values);
    if (staus === true) {
      setphoneerror(false);
    } else {
      setphoneerror(true);
    }
    setValues((state) => {
      state.phone.code = countryData.dialCode;
      state.phone.number = value;
      return {
        ...state,
      };
    });
  };

  const selectUserName = (data) => {
    if (data) {
      request({
        url: "/agency/detail",
        method: "POST",
        data: { username: data.username },
      })
        .then((res) => {
          let data = res.response;
          setValues((state) => {
            state.fname = data.name;
            state.lname = data.name;
            state.email = data.email;
            state.phone.code = data.phone.code;
            state.phone.number = data.phone.number;
            return { ...state };
          });
          setuser(data.username);
        })
        .catch((err) => console.log(err));
    }
  };

  const formSubmit = (e) => {
    e.preventDefault();
    let formData = {
      first_name: values.fname,
      last_name: values.lname,
      username: user,
      email: values.email,
      phone: values.phone,
      worklocation: values.worklocation,
      job_role: values.job_role,
      employee_status: values.employee_status,
      agencyid: agencyId,
    };
    request({
      url: "/employee/add",
      method: "POST",
      data: formData,
    })
      .then((res) => {
        if (res.status === 0) toast.error(res.response);
        if (res.status === 1) {
          toast.success(res.response);
          setTimeout(() => {
            props.history.push({
              pathname: "/agency/dashboard",
              state: { agencyId: agencyId },
            });
          }, 1500);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <ToastContainer autoClose={1500} />
      <div className="mt-4">
        <h3>Add Employee</h3>
        <hr />
      </div>
      <div>
        <AvForm onValidSubmit={formSubmit}>
          <Row>
            {/* Select Username */}
            <Col md="6">
              <AvGroup>
                <Label>Select Username</Label>
                <Select
                  value={values.username}
                  options={usernameList}
                  onChange={selectUserName}
                  isSearchable={true}
                  isClearable={true}
                  placeholder="Select Username"
                />
              </AvGroup>
            </Col>

            {/* First Name */}
            <Col md="6">
              <AvGroup>
                <AvField
                  type="text"
                  name="fname"
                  label="First Name"
                  placeholder="First name"
                  value={values.fname}
                  onChange={handleChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Please enter first name!",
                    },
                  }}
                />
              </AvGroup>
            </Col>

            {/* Last Name */}
            <Col md="6">
              <AvGroup>
                <AvField
                  type="text"
                  name="lname"
                  label="Last Name"
                  placeholder="Last name"
                  value={values.lname}
                  onChange={handleChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Please enter last name!",
                    },
                  }}
                />
              </AvGroup>
            </Col>

            {/* Email */}
            <Col md="6">
              <AvGroup>
                <AvField
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Enter your Email"
                  value={values.email}
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

            {/* work location */}
            <Col md="6">
              <AvGroup>
                <AvField
                  name="worklocation"
                  type="text"
                  label="Work Location"
                  placeholder="Wrok Location"
                  value={values.worklocation}
                  onChange={handleChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Please enter Location!",
                    },
                  }}
                />
              </AvGroup>
            </Col>

            {/* Job Role */}
            <Col md="6">
              <AvGroup>
                <AvField
                  name="job_role"
                  type="text"
                  label="Job Role"
                  placeholder="Job Role"
                  value={values.job_role}
                  onChange={handleChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Please enter Job Role!",
                    },
                  }}
                />
              </AvGroup>
            </Col>

            {/* Phone Number */}
            <Col md="6">
              <FormGroup>
                <Label>Phone Number</Label>
                <FormGroup>
                  <IntlTelInput
                    defaultCountry={"in"}
                    css={["intl-tel-input", "form-control"]}
                    onPhoneNumberChange={phoneHandler}
                    value={values.phone.number}
                    utilsScript={libphonenumber}
                  />
                  {phoneerror ? (
                    <small style={{ color: "red" }}>
                      Enter Valid Phone Number!
                    </small>
                  ) : null}
                </FormGroup>
              </FormGroup>
            </Col>
            <Col md="6">
              <AvGroup>
                <FormGroup>
                  <Label>Employee Status</Label>
                </FormGroup>
                <Switch
                  onChange={statusCheck}
                  name="employee_status"
                  checked={values.employee_status}
                  required
                />
              </AvGroup>
            </Col>

            {/* Submit Button */}
          </Row>
          <AvGroup>
            <Button color="success" className="mr-3">
              Add
            </Button>
            <Button
              color="danger"
              onClick={() =>
                props.history.push({
                  pathname: "/agency/dashboard",
                  state: { agencyId: agencyId },
                })
              }
            >
              Cancel
            </Button>
          </AvGroup>
        </AvForm>
      </div>
    </div>
  );
};

export default AddEmployee;
