import { IMAGE_PREVIEW } from "../action/action-types";
import request from "../../../api/api";

const initialState = {
  tableData: [],
  agencyData: {},
  agency_logo: "",
  modal: false,
  filterLocationList: [
    { value: "", label: "Select Country" },
    { value: "india", label: "India" },
    { value: "united-states", label: "United States" },
    { value: "brazil", label: "Brazil" },
    { value: "france", label: "France" },
  ],
  filterLocation: "",
  activePage: 1,
  activeTab: "1",
  pages: 0,
  pageRangeDisplayed: 4,
  currPage: 5,
  remainingEmp: 0,
  sortOrder: false,
  tableOptions: {
    search: "",
    filter: "all",
    page: {
      history: "",
      current: 1,
    },
    order: -1,
    field: "createdAt",
    limit: 5,
    skip: 0,
    to_date: "",
    from_date: "",
  },
  fromDate: "",
  toDate: "",
  pageRange: [
    {
      label: "5",
      value: 5,
    },
  ],
  pageRangeList: [
    {
      label: "5",
      value: 5,
    },
    {
      label: "10",
      value: 10,
    },
    {
      label: "15",
      value: 15,
    },
    {
      label: "20",
      value: 20,
    },
  ],
};

const agencyReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default agencyReducer;
