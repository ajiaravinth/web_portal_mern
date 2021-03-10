import {
  LOGIN,
  REGISTER,
  LOGOUT,
  ADMIN_PROFILE,
  ADMIN_PROFILE_SAVE,
} from "../action/action-types";
import request from "../../../api/api";
import { toast } from "react-toastify";

const initialState = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirm_password: "",
  phone: "",
};

export const authReducer = (state = initialState, action) => {
  let formData = action.formData,
    props = action.props;
  switch (action.type) {
    case LOGIN:
      request({
        url: "/login",
        method: "POST",
        data: formData,
      })
        .then((res) => {
          if (res.status === 0) {
            toast.error(res.response);
          }
          if (res.status === 1) {
            localStorage.setItem("authToken", res.response.auth_token);
            toast.success(res.message);
            props.history.push({
              pathname: "/admin/dashboard",
              state: {
                message: res.message,
                auth_token: res.response.auth_token,
              },
            });
            //   window.location.href = "http://localahost:3000/admin/dashboard";
          }
        })
        .catch((error) => console.log(error));
      return state;

    case REGISTER:
      request({
        url: "/register",
        method: "POST",
        data: formData,
      })
        .then((res) => {
          if (res.status === 0) {
            toast.error(res.response);
          }
          if (res.status === 1) {
            toast.success(res.response);
            setTimeout(() => {
              props.history.push("/");
            }, 1500);
          }
        })
        .catch((err) => console.log(err));
      return state;

    case LOGOUT:
      request({
        url: "/logout",
        method: "POST",
        data: formData,
      })
        .then((res) => {
          if (res.status === 1) {
            localStorage.clear();
            props.history.push({
              pathname: "/",
              state: { message: res.response },
            });
            toast.success(res.response);
          }
        })
        .catch((err) => console.log(err));
      return state;

    case ADMIN_PROFILE:
      request({
        url: "/administrators/profile",
        method: "POST",
        data: formData,
      })
        .then((res) => {
          if (res.status === 1) {
            props.history.push({
              pathname: "/admin/edit",
              state: res.response.result,
            });
          } else {
            toast.error(res.response);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return state;

    case ADMIN_PROFILE_SAVE:
      request({
        url: "/administrators/profile/save",
        method: "POST",
        data: formData,
      })
        .then((res) => {
          if (res.status === 0) {
            toast.error(res.response);
          }
          if (res.status === 1) {
            toast.success(res.response);
            setTimeout(() => {
              props.history.push("/admin/dashboard");
            }, 1500);
          }
        })
        .catch((err) => console.log(err));
      return state;

    default:
      return state;
  }
};
