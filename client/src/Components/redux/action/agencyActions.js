import {
  AGENCY_DETAILS_SAVE,
  AGENCY_REGISTER,
  IMAGE_PREVIEW,
} from "./action-types";

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

export const image_preview = (id) => {
  return {
    type: IMAGE_PREVIEW,
    id,
  };
};
