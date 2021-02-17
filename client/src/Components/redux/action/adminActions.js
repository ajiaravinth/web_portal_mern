import {
  LOGIN,
  REGISTER,
  LOGOUT,
  AGENCY_LIST,
  ADMIN_PROFILE,
  ADMIN_PROFILE_SAVE,
} from "./action-types";

export const admin_login = (formData, props) => {
  return {
    type: LOGIN,
    formData,
    props,
  };
};

export const admin_register = (formData, props) => {
  return {
    type: REGISTER,
    formData,
    props,
  };
};

export const admin_logout = (formData, props) => {
  return {
    type: LOGOUT,
    formData,
    props,
  };
};

export const admin_profile = (formData, props) => {
  return {
    type: ADMIN_PROFILE,
    formData,
    props,
  };
};

export const admin_profile_save = (formData, props) => {
  return {
    type: ADMIN_PROFILE_SAVE,
    formData,
    props,
  };
};

export const agency_list = (id) => {
  return {
    type: AGENCY_LIST,
    id,
  };
};
