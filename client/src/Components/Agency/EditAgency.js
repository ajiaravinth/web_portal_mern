import React, { useState, useEffect } from "react";
import {
  AvField,
  AvGroup,
  AvForm,
  AvRadioGroup,
  AvRadio,
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
import request, { NodeURL } from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import jwt_decode from "jwt-decode";
import _ from "lodash";
import { useSelector } from "react-redux";
import ImgPreviewModal from "../Common/ImgPreviewModal";

const EditAgency = (props) => {
  const initialData = useSelector((state) => state.registration);
  const [values, setValues] = useState(initialData);
  const [agencyId, setAgencyId] = useState(props.location.state);
  const [phoneerror, setPhoneerror] = useState(false);
  const [previewImg, setpreviewImg] = useState("");
  const [isImgPreview, setisImgPreview] = useState(false);
  const toggle = () => {
    setisImgPreview(!isImgPreview);
  };

  useEffect(() => {
    const id = props.location.state;
    if (id) {
      setAgencyId(id);
    }
    request({
      url: "/agency/details",
      method: "POST",
      data: { _id: id },
    }).then((res) => {
      if (res.status === 0) {
        toast.error("Update Failed!!");
      }
      if (res.status === 1) {
        let newValue = res.response;
        let name = newValue.agency_logo.split("/");
        let logo_name = name[name.length - 1];
        setValues({
          ...values,
          id: newValue._id,
          username: newValue.username,
          email: newValue.email,
          name: newValue.name,
          password: jwt_decode(newValue.password).password,
          phone: newValue.phone.number,
          agency_name: newValue.agency_name,
          agency_logo: newValue.agency_logo,
          agency_logoname: logo_name,
          gender: newValue.gender,
          language: newValue.language,
          dateofbirth: newValue.dateofbirth,
          line1: newValue.address.line1,
          line2: newValue.address.line1,
          city: newValue.address.city,
          state: newValue.address.state,
          country: newValue.address.country,
          zipcode: newValue.address.zipcode,
          lat: newValue.address.lat,
          lon: newValue.address.lon,
          formatted_address: newValue.address.formatted_address,
        });
      }
    });
  }, [props]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const languageCheck = (e, i) => {
    const checked = e.target.checked;
    const data = [...values.language];
    // console.log(i, checked, "checked", data, "data");
    data.forEach((item, index) => {
      if (i === index) {
        return _.set(item, "key", checked ? 1 : 0);
      }
      return item;
    });
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
    e.preventDefault();
    let data = new FormData();
    data.append("id", values.id);
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

    request({
      url: "/agency/details/save",
      method: "POST",
      data: data,
    }).then((res) => {
      if (res.status === 0) {
        toast.error(res.response);
      }
      if (res.status === 1) {
        // console.log(res.response, "res");
        props.history.push("/admin/dashboard");
        toast.success(res.response);
      }
    });
  };

  const getImagePreview = (id) => {
    request({
      url: "/image/preview",
      method: "POST",
      data: { id: id },
    })
      .then((res) => {
        if (res.status === 0) {
          toast.error(res.response);
        }
        if (res.status === 1) {
          setpreviewImg(res.response);
          setisImgPreview(true);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="container">
      <ToastContainer autoClose={1500} />
      <h3 className="mt-4">Edit Agency</h3>
      <hr />
      <div>
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
                    required: {
                      value: true,
                      errorMessage: "Please enter name!",
                    },
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
                    <div style={{ color: "red" }}>
                      Enter Valid Phone Number!
                    </div>
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
                <AvRadioGroup
                  name="gender"
                  label="Gender"
                  value={values.gender}
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
              <FormGroup>
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
              </FormGroup>
              {/* <AvGroup>
              <Label>Language</Label>
              <AvCheckboxGroup
                inline
                name="check"
                errorMessage="Select One Language!"
                required
              >
                {values.language.map((lang, i) => (
                  <AvCheckbox
                    key={i}
                    id={`lang${i}`}
                    label={lang.value}
                    type="checkbox"
                    checked={lang.key === 1 ? true : false}
                    onClick={(e) => languageCheck(e, i)}
                  />
                ))}
              </AvCheckboxGroup>
            </AvGroup> */}
            </Col>

            {/* Agency Logo */}
            <Col md="6">
              <FormGroup>
                <Label>Agency Logo</Label>
                <CustomInput
                  type="file"
                  id="agency_logo"
                  label={
                    values.agency_logoname !== "" ? values.agency_logoname : ""
                  }
                  onChange={fileHandler}
                />
              </FormGroup>
            </Col>

            {/* Logo_Preview */}
            <Col md="6">
              <FormGroup>
                <Label>Logo</Label>
                <FormGroup>
                  <img
                    src={`${NodeURL}${values.agency_logo}`}
                    width="100px"
                    height="100px"
                    onClick={() => getImagePreview(values.id)}
                    alt="agency_logo"
                  />
                </FormGroup>
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
                  Update
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
      <div>
        {isImgPreview ? (
          <ImgPreviewModal
            modal={isImgPreview}
            toggle={toggle}
            logo_path={previewImg}
          />
        ) : null}
      </div>
    </div>
  );
};

export default EditAgency;
