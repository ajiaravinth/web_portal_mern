import { AGENCY_REGISTER, AGENCY_DETAILS_SAVE } from "../action/action-types";
import request from "../../../api/api";
import { toast } from "react-toastify";

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
  language: [],
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

const registrationReducer = (state = initialData, action) => {
  const formData = action.formData,
    props = action.props;
  switch (action.type) {
    case AGENCY_REGISTER:
      request({
        url: "/register/agency",
        method: "POST",
        data: formData,
      }).then((res) => {
        if (res.status === 0) {
          toast.error(res.response);
        }
        if (res.status === 1) {
          props.history.push("/admin/dashboard");
        }
        toast.success(res.message);
      });
      return state;

    case AGENCY_DETAILS_SAVE:
      request({
        url: "/agency/details/save",
        method: "POST",
        data: formData,
      }).then((res) => {
        if (res.status === 0) {
          toast.error(res.response);
        }
        if (res.status === 1) {
          alert("");
          props.history.push("/admin/dashboard");
        }
        toast.success(res.response);
      });
      return state;

    default:
      return state;
  }
};

export default registrationReducer;
