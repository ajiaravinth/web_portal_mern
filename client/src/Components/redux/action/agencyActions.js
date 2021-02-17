import { AGENCY_DETAILS_SAVE, AGENCY_REGISTER } from "./action-types";

export const agency_register = (formData, props) => {
  return {
    type: AGENCY_REGISTER,
    formData,
    props,
  };
};

export const agency_details_save = (formData, props) => {
  return {
    type: AGENCY_DETAILS_SAVE,
    formData,
    props,
  };
};
