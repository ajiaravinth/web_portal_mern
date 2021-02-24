import React, { useState } from "react";
import {
  AvField,
  AvGroup,
  AvForm,
  AvRadioGroup,
  AvRadio,
  AvCheckboxGroup,
  AvCheckbox,
} from "availity-reactstrap-validation";
import {
  Button,
  Label,
  FormGroup,
  Row,
  Col,
  Input,
  CustomInput,
} from "reactstrap";
import IntlTelInput from "react-intl-tel-input";
import { libphonenumber } from "react-intl-tel-input/dist";
import Datetime from "react-datetime";
import moment from "moment";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import _ from "lodash";
import { agency_register } from "../redux/action/agencyActions";

const AddNewAgency = (props) => {
  const initialData = {
    username: "",
    email: "",
    name: "",
    password: "",
    confirm_password: "",
    phone: "",
    code: "",
    dialcountry: "",
    agency_name: "",
    agency_logo: "",
    agency_logoname: "",
    gender: "",
    language: [
      { value: "Tamil", key: 0 },
      { value: "English", key: 0 },
      { value: "Hindi", key: 0 },
    ],
    dateofbirth: "",
    tempStatus: 1,
    address: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    formatted_address: "",
    lat: "",
    lon: "",
  };

  const dispatch = useDispatch();
  const [values, setValues] = useState(initialData);
  const [phoneerror, setPhoneerror] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const languageCheck = (e, i) => {
    const checked = e.target.checked;
    const data = [...values.language];
    console.log(checked);
    _.set(data[i], "key", checked ? 1 : 0);
    setValues({ ...values, language: data });
  };

  const fileHandler = (e) => {
    setValues({
      ...values,
      agency_logo: _.get(e, "target.files.[0]", {}),
      agency_logoname: _.get(e, "target.files.[0]", {}).name,
    });
  };

  const phoneHandler = (staus, value, countryData) => {
    if (staus === true) {
      setPhoneerror(false);
    } else {
      setPhoneerror(true);
    }
    setValues({
      ...values,
      phone: value,
      code: countryData.dialCode,
      dialcountry: countryData.iso2,
    });
  };

  const addressChange = (add) => {
    setValues({ ...values, address: add, formatted_address: add });
  };

  const addressSelect = (add) => {
    geocodeByAddress(add)
      .then(async (results) => {
        // line1
        const res_addressmap_strt_no = results[0].address_components.find(
          (item) => {
            return item.types[0] === "street_number";
          }
        );
        // line2
        const res_addressmap_route = results[0].address_components.find(
          (item) => {
            return item.types[0] === "route";
          }
        );
        // city
        const res_addressmap_postalTown = results[0].address_components.find(
          (item) => {
            return item.types[0] === "locality";
          }
        );
        // state
        const res_addressmap_adLvl1 = results[0].address_components.find(
          (item) => {
            return item.types[0] === "administrative_area_level_1";
          }
        );
        // country
        const res_addressmap_country = results[0].address_components.find(
          (item) => {
            return item.types[0] === "country";
          }
        );
        // zipcode
        const res_addressmap_zip = results[0].address_components.find(
          (item) => {
            return item.types[0] === "postal_code";
          }
        );
        let latlong = await getLatLng(results[0]).then((latlong) => {
          return {
            lat: latlong.lat,
            lon: latlong.lng,
          };
        });

        setValues({
          ...values,
          address: add,
          formatted_address: add,
          line1:
            res_addressmap_strt_no && res_addressmap_strt_no.long_name
              ? res_addressmap_strt_no.long_name
              : "",
          line2:
            res_addressmap_route && res_addressmap_route.long_name
              ? res_addressmap_route.long_name
              : "",
          city:
            res_addressmap_postalTown && res_addressmap_postalTown.long_name
              ? res_addressmap_postalTown.long_name
              : "",
          state:
            res_addressmap_adLvl1 && res_addressmap_adLvl1.long_name
              ? res_addressmap_adLvl1.long_name
              : "",
          country:
            res_addressmap_country && res_addressmap_country.long_name
              ? res_addressmap_country.long_name
              : "",
          zipcode:
            res_addressmap_zip && res_addressmap_zip.long_name
              ? res_addressmap_zip.long_name
              : "",
          lat: latlong.lat,
          lon: latlong.lon,
        });
      })
      .catch((err) => console.log(err));
  };

  const formSubmit = (e) => {
    console.log(values.language, "lang");
    e.preventDefault();
    let data = new FormData();
    data.append("username", values.username);
    data.append("email", values.email);
    data.append("password", values.password);
    data.append("confirm_password", values.confirm_password);
    data.append("name", values.name);
    data.append("gender", values.gender);
    data.append("dateofbirth", moment(values.dateofbirth).format("DD-MM-YYYY"));
    data.append("language", JSON.stringify(values.language));
    data.append("agency_name", values.agency_name);
    data.append("agency_logo", values.agency_logo);
    data.append("tempstatus", values.tempStatus);
    data.append("phone[code]", values.code);
    data.append("phone[number]", values.phone);
    data.append("address[line1]", values.line1);
    data.append("address[line2]", values.line2);
    data.append("address[city]", values.city);
    data.append("address[state]", values.state);
    data.append("address[country]", values.country);
    data.append("address[zipcode]", values.zipcode);
    data.append("address[formatted_address]", values.formatted_address);
    data.append("address[lat]", values.lat);
    data.append("address[lon]", values.lon);
    dispatch(agency_register(data, props));
  };

  return (
    <div className="container">
      <ToastContainer autoClose={1500} />
      <h3 className="mt-4">Add New Agency</h3>
      <hr />
      <AvForm onValidSubmit={formSubmit}>
        <Row>
          {/* Name */}
          <Col md="6">
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
          </Col>

          {/* Username */}
          <Col md="6">
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

          {/* Password */}
          <Col md="6">
            {" "}
            <AvGroup>
              <AvField
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={values.password || ""}
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

          {/* Confirm Password */}
          <Col md="6">
            <AvGroup>
              <AvField
                type="password"
                name="confirm_password"
                label="Confirm Password"
                placeholder="Re-Enter your password"
                value={values.confirm_password || ""}
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

          {/* Agency Name */}
          <Col md="6">
            <AvGroup>
              <AvField
                type="text"
                name="agency_name"
                label="Agency Name"
                placeholder="Enter your Agency Name"
                value={values.agency_name || ""}
                onChange={handleChange}
                validate={{
                  required: {
                    value: true,
                    errorMessage: "Please enter agencyname!",
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
                  css={["intl-tel-input", "form-control", "phoneInput"]}
                  onPhoneNumberChange={phoneHandler}
                  value={values.phone}
                  utilsScript={libphonenumber}
                  className="phoneInput"
                />
                {phoneerror ? (
                  <div style={{ color: "red" }}>Enter Valid Phone Number!</div>
                ) : null}
              </FormGroup>
            </FormGroup>
          </Col>

          {/* Date Of Birth */}
          <Col md="6">
            <FormGroup>
              <Label>DOB</Label>
              <Datetime
                dateFormat="DD-MM-YYYY"
                timeFormat={false}
                closeOnSelect={true}
                value={values.dateofbirth}
                inputProps={{
                  placeholder: "Pick Date",
                }}
                isValidDate={(current) =>
                  current.isBefore(moment(new Date()).subtract(0, "years"))
                }
                onChange={(e) => {
                  if (e._isValid) {
                    setValues({ ...values, dateofbirth: e });
                  } else if (!e) {
                    setValues({
                      ...values,
                      dateofbirth: null,
                    });
                  } else {
                    setValues({
                      ...values,
                      dateofbirth: null,
                    });
                  }
                }}
              />
            </FormGroup>
          </Col>

          {/* Gender */}
          <Col md="6">
            <AvGroup>
              <Label>Gender</Label>
              <AvRadioGroup
                name="gender"
                onChange={handleChange}
                required
                inline
                errorMessage="Select Gender"
              >
                <AvRadio
                  label="Male"
                  value="male"
                  checked={values.gender === "male"}
                />
                <AvRadio
                  label="Female"
                  value="female"
                  checked={values.gender === "female"}
                />
              </AvRadioGroup>
            </AvGroup>
          </Col>

          {/* Language */}
          <Col md="6">
            {/* <FormGroup>
              <Label>Language</Label>
              <FormGroup>
                {values.language.map((lang, i) => (
                  <FormGroup key={i} inline check>
                    <FormGroup check>
                      <Input
                        type="checkbox"
                        name={`language${i}`}
                        checked={lang.key === 1}
                        onChange={(e) => languageCheck(e, i)}
                        required
                      />
                    </FormGroup>
                    <span>{lang.value}</span>
                  </FormGroup>
                ))}
              </FormGroup>
            </FormGroup> */}
            <AvGroup>
              <Label>Language</Label>
              <AvCheckboxGroup
                inline
                name="language"
                required
                errorMessage="Select One Language!"
              >
                {values.language.map((lang, i) => (
                  <AvCheckbox
                    key={i}
                    type="checkbox"
                    id={`lang${i}`}
                    label={lang.value}
                    defaultChecked={lang.key === 1}
                    onClick={(e) => languageCheck(e, i)}
                  />
                ))}
              </AvCheckboxGroup>
            </AvGroup>
          </Col>

          {/* Agency Logo */}
          <Col md="6">
            <FormGroup>
              <Label>Agency Logo</Label>
              <CustomInput
                type="file"
                name="agency_logo"
                id="agency_logo"
                label={
                  values.agency_logoname
                    ? values.agency_logoname
                    : "Choose Logo"
                }
                onChange={(e, file) => fileHandler(e)}
              />
            </FormGroup>
          </Col>

          {/* Address */}
          <Col md="12">
            <FormGroup>
              <Label>Address</Label>
              <PlacesAutocomplete
                value={values.address || ""}
                onChange={addressChange}
                onSelect={addressSelect}
                // onFocus={geolocate}
              >
                {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                  <div className="ser-page">
                    <input
                      {...getInputProps({
                        placeholder: "Search Your Location",
                        className: "form-control",
                      })}
                    />
                    <div className="autocomplete-dropdown-container absolute my_styles">
                      {suggestions.map((suggestion, i) => {
                        const className = suggestion.active
                          ? "suggestion-item--active"
                          : "suggestion-item";
                        const style = suggestion.active
                          ? {
                              backgroundColor: "#fafafa",
                              cursor: "pointer",
                            }
                          : {
                              backgroundColor: "#ffffff",
                              cursor: "pointer",
                            };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style,
                            })}
                            key={i}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            </FormGroup>
          </Col>

          {/* Line1 */}
          <Col md="4">
            <AvGroup>
              <AvField
                type="text"
                name="line1"
                label="Line1"
                placeholder="Address Line 1"
                value={values.line1}
                onChange={handleChange}
                required
                errorMessage="Field is required"
              />
            </AvGroup>
          </Col>

          {/* Line2 */}
          <Col md="4">
            {" "}
            <AvGroup>
              <AvField
                type="text"
                name="line2"
                label="Line2"
                placeholder="Address Line 2"
                value={values.line2}
                onChange={handleChange}
                required
                errorMessage="Field is required"
              />
            </AvGroup>
          </Col>

          {/* City */}
          <Col md="4">
            {" "}
            <AvGroup>
              <AvField
                type="text"
                name="city"
                label="City/Town"
                placeholder="City"
                value={values.city}
                onChange={handleChange}
                required
                errorMessage="Field is required"
              />
            </AvGroup>
          </Col>

          {/* State */}
          <Col md="4">
            <AvGroup>
              <AvField
                type="text"
                name="state"
                label="State/Region"
                placeholder="State"
                value={values.state}
                onChange={handleChange}
                required
                errorMessage="Field is required"
              />
            </AvGroup>
          </Col>

          {/* Country */}
          <Col md="4">
            {" "}
            <AvGroup>
              <AvField
                type="text"
                name="country"
                label="Country"
                placeholder="Country"
                value={values.country}
                onChange={handleChange}
                required
                errorMessage="Field is required"
              />
            </AvGroup>
          </Col>

          {/* ZipCode */}
          <Col md="4">
            <AvGroup>
              <AvField
                type="text"
                name="zipcode"
                label="Zipcode"
                placeholder="ZipCode"
                value={values.zipcode}
                onChange={handleChange}
                required
                errorMessage="Field is required"
              />
            </AvGroup>
          </Col>

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
  );
};

export default AddNewAgency;
