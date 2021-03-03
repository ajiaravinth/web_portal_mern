import React, { useEffect, useState } from "react";
import AvForm from "availity-reactstrap-validation/lib/AvForm";
import { Row, Col, FormGroup, Label, Button } from "reactstrap";
import AvGroup from "availity-reactstrap-validation/lib/AvGroup";
import AvField from "availity-reactstrap-validation/lib/AvField";
import Select from "react-select";
import request from "../../api/api";

const AddEmployee = (props) => {
  const initialData = {
    fname: "",
    lname: "",
    email: "",
    mobile_number: "",
    worklocation: "",
    employee_status: 0,
  };

  const [values, setValues] = useState(initialData);
  const [agencyId, setagencyId] = useState("");
  const [usernameList, setusernameList] = useState([]);

  const formSubmit = (params) => {};
  const handleChange = (params) => {};
  const selectUserName = (data) => {
    // console.log(Array.of(data), "data");
    if (data) {
      request({
        url: "/agency/detail",
        method: "POST",
        data: { username: data.username },
      })
        .then((res) => {
          let data = res.response;
          console.log(data.name);
          setValues((state) => {
            state.fname = data.name;
            state.lname = data.name;
            state.email = data.email;
            state.mobile_number = data.phone.code + data.phone.number;
            return {
              ...state,
            };
          });
        })
        .catch((err) => console.log(err));
    }
  };
  //   const selectFilterLocations = (value) => {
  //     if (value) {
  //       setvalues((state) => {
  //         state.filterLocation = Array.of(value);
  //         state.tableOptions.search = value.value;
  //         if (isArchiveShow) {
  //           getArchiveList();
  //         }
  //         if (isDeletedShow) {
  //           getDeletedList();
  //         }
  //         if (isShow) {
  //           populateData();
  //         }
  //         return {
  //           ...state,
  //         };
  //       });
  //     } else {
  //       setvalues(
  //         (state) => {
  //           state.filterLocation = "";
  //           state.tableOptions.search = "";
  //           return {
  //             ...state,
  //           };
  //         },
  //         () => {
  //           if (isArchiveShow) {
  //             getArchiveList();
  //           }
  //           if (isDeletedShow) {
  //             getDeletedList();
  //           }
  //           if (isShow) {
  //             populateData();
  //           }
  //         }
  //       );
  //     }
  //   };

  useEffect(() => {
    let id = props.location.state.agencyId;

    setagencyId(id);
    request({
      url: "/agency/list",
      method: "GET",
    })
      .then((res) => {
        // let listData = res.response;
        // console.log(listData, "listData");
        let listData = res.response.map((list, i) => ({
          ...list,
          value: list.username,
          label: list.username,
        }));
        setusernameList(listData);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(usernameList, "usernameList");
  //   console.log(values.username, "username");

  return (
    <div className="container">
      <div className="mt-4">
        <h3>Add Employee</h3>
        <hr />
      </div>
      <div>
        <AvForm onValidSubmit={formSubmit}>
          <Row>
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

            {/* Username */}
            {/* <Col md="6">
              <AvGroup>
                <AvField
                  type="text"
                  name="username"
                  label="Username"
                  placeholder="Enter Username"
                  value={values.username || ""}
                  onChange={handleChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Please enter username!",
                    },
                  }}
                />
              </AvGroup>
            </Col> */}

            {/* Select Username */}
            <Col md="6">
              <AvGroup>
                <Label>Select Username</Label>
                <Select
                  name="username"
                  value={values.username}
                  options={usernameList}
                  onChange={selectUserName}
                  isSearchable={true}
                  placeholder="Select Username"
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
                  value={values.email || ""}
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

            {/* Phone Number */}
            {/* <Col md="6">
              <FormGroup>
                <Label>Phone Number</Label>
                <FormGroup>
                  <IntlTelInput
                    defaultCountry={"in"}
                    css={["intl-tel-input", "form-control", "phoneInput"]}
                    onPhoneNumberChange={phoneHandler}
                    value={values.phone}
                    utilsScript={libphonenumber}
                    className="phoneInput"
                  />
                  {phoneerror ? (
                    <div style={{ color: "red" }}>
                      Enter Valid Phone Number!
                    </div>
                  ) : null}
                </FormGroup>
              </FormGroup>
            </Col> */}

            {/* Submit Button */}
            <Col>
              <AvGroup>
                <Button color="success" className="mr-3">
                  Register
                </Button>
                <Button
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

export default AddEmployee;
