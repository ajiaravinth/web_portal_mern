import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import moment from "moment";
import request from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Input,
  FormGroup,
} from "reactstrap";
import { admin_logout, admin_profile } from "../redux/action/adminActions";
import AgencyList from "../Agency/AgencyList";
import Pagination from "react-js-pagination";
import Select from "react-select";
import Datetime from "react-datetime";
import ViewAgency from "../Agency/ViewAgency";
import DeletedAgencyList from "../Agency/DeletedAgencyList";
import DeleteModal from "../Common/DeleteModal";
import ArchiveAgencyList from "../Agency/ArchivedAgencyList";
import ImgPreviewModal from "../Common/ImgPreviewModal";
import RestoreModal from "../Common/RestoreModal";
import { ToastContainer, toast } from "react-toastify";

const Dashboard = (props) => {
  const state = useSelector((state) => state.agencyReducer);
  const dispatch = useDispatch();
  const [values, setvalues] = useState(state);
  const [agencyData, setagencyData] = useState([]);
  const [name, setName] = useState("");

  const [totalCount, settotalCount] = useState(0);
  const [deletedCount, setdeletedCount] = useState(0);
  const [archiveCount, setarchiveCount] = useState(0);

  const [deletId, setDeleteId] = useState("");
  const [userId, setUserId] = useState("");

  const [isShow, setIsShow] = useState(true);
  const [isDeletedShow, setIsDeletedShow] = useState(false);
  const [isArchiveShow, setIsArchiveShow] = useState(false);

  // View Modal
  const [viewModal, setViewModal] = useState(values.modal);
  const toggle = () => setViewModal(!viewModal);

  // Restore Agency
  const [restore_id, setrestore_id] = useState("");
  const [restorePopover, setrestorePopover] = useState(false);
  const toggleRestoreModal = () => setrestorePopover(!restorePopover);

  // Delete Confirmation Modal
  const [isDeleteModal, setisDeleteModal] = useState(false);
  const [isPermanentDelete, setisPermanentDelete] = useState(false);
  const toggleDeleteModal = () => setisDeleteModal(!isDeleteModal);
  const authCheck = localStorage.getItem("authToken");

  // Image Preview
  const [previewImg, setpreviewImg] = useState("");
  const [isImgPreview, setisImgPreview] = useState(false);
  const previewtoggle = () => {
    setisImgPreview(!isImgPreview);
  };

  // navbar dropdown
  const [isOpen, setIsOpen] = useState(false);
  const navbartoggle = () => setIsOpen(!isOpen);

  const populateData = () => {
    request({
      url: "/agency/list",
      method: "POST",
      data: values.tableOptions,
    })
      .then((res) => {
        if (res.status === 1 && authCheck) {
          setvalues({
            ...values,

            tableData: res.response.result,
            pages: res.response.fullcount,
            currPage: res.response.length,
            remainingEmp:
              res.response.fullcount -
              (values.tableOptions.skip > 0
                ? values.tableOptions.skip + res.response.length
                : res.response.length),
          });
          settotalCount(res.response.fullcount);
          setIsShow(true);
          setIsDeletedShow(false);
          setIsArchiveShow(false);
        } else if (res.status === 0) {
          console.log("error");
        }
      })
      .catch((err) => console.log(err));
  };

  const deletedListAPI = () => {
    request({
      url: "/agency/deleted/deleted_list",
      method: "POST",
    }).then((res) => {
      if (res.status === 1) {
        setdeletedCount(res.response.fullcount);
      }
    }).catch = (err) => console.log(err);
  };

  const archiveListAPI = () => {
    request({
      url: "/agency/archive/archive_list",
      method: "POST",
    }).then((res) => {
      if (res.status === 1) {
        setarchiveCount(res.response.fullcount);
      }
    }).catch = (err) => console.log(err);
  };

  useEffect(() => {
    let token = localStorage.getItem("authToken");
    var decoded = jwt_decode(token);
    setName(decoded.username);
    setUserId(decoded.id);
    populateData();
    deletedListAPI();
    archiveListAPI();
  }, []);

  const paginate = (data) => {
    const history = values.tableOptions.page.history;
    const limit = values.tableOptions.limit;

    if (data) {
      setvalues((state) => {
        if (history === "") {
          state.tableOptions.page.current = data;
          state.tableOptions.page.history = data;
          state.tableOptions.skip = data * limit - limit;
          state.activePage = data;
          if (isArchiveShow) {
            getArchiveList();
          }
          if (isDeletedShow) {
            getDeletedList();
          }
          if (isShow) {
            populateData();
          }
        } else if (history === data) {
          state.tableOptions.page.current = data;
          state.tableOptions.page.history = data;
          state.tableOptions.skip = data * limit - limit;
          state.activePage = data;
          if (isArchiveShow) {
            getArchiveList();
          }
          if (isDeletedShow) {
            getDeletedList();
          }
          if (isShow) {
            populateData();
          }
        } else {
          state.tableOptions.page.current = data;
          state.tableOptions.page.history = data;
          state.tableOptions.skip = data * limit - limit;
          state.bulk = [];
          state.count = 0;
          state.activePage = data;
          if (isArchiveShow) {
            getArchiveList();
          }
          if (isDeletedShow) {
            getDeletedList();
          }
          if (isShow) {
            populateData();
          }
        }
        return {
          ...state,
        };
      });
    }
  };

  const changeLimit = (page) => {
    setvalues((state) => {
      state.tableOptions.limit = parseInt(page.value, 10);
      state.tableOptions.skip = 0;
      state.tableOptions.page.history = 1;
      state.tableOptions.page.current = 1;
      state.count = 0;
      state.activePage = 1;
      state.pageRange = Array.of(page);
      return {
        ...state,
      };
    });
    if (isArchiveShow) {
      getArchiveList();
    }
    if (isDeletedShow) {
      getDeletedList();
    }
    if (isShow) {
      populateData();
    }
  };

  const search = (value) => {
    setvalues((state) => {
      state.tableOptions.search = value;
      if (isArchiveShow) {
        getArchiveList();
      }
      if (isDeletedShow) {
        getDeletedList();
      }
      if (isShow) {
        populateData();
      }
      return { ...state };
    });
  };

  const selectFilterLocations = (value) => {
    if (value) {
      setvalues((state) => {
        state.filterLocation = Array.of(value);
        state.tableOptions.search = value.value;
        if (isArchiveShow) {
          getArchiveList();
        }
        if (isDeletedShow) {
          getDeletedList();
        }
        if (isShow) {
          populateData();
        }
        return {
          ...state,
        };
      });
    } else {
      setvalues(
        (state) => {
          state.filterLocation = "";
          state.tableOptions.search = "";
          return {
            ...state,
          };
        },
        () => {
          if (isArchiveShow) {
            getArchiveList();
          }
          if (isDeletedShow) {
            getDeletedList();
          }
          if (isShow) {
            populateData();
          }
        }
      );
    }
  };

  const sort = (field) => {
    setvalues((state) => {
      state.sortOrder = !state.sortOrder;
      state.tableOptions.order = state.sortOrder ? 1 : -1;
      state.tableOptions.field = field;
      if (isArchiveShow) {
        getArchiveList();
      }
      if (isDeletedShow) {
        getDeletedList();
      }
      if (isShow) {
        populateData();
      }
      return {
        ...state,
      };
    });
  };

  const getAgencyDetails = (id, action) => {
    if (action === "edit") {
      props.history.push({
        pathname: "/agency/profile/edit",
        state: id,
      });
    }
    if (action === "view") {
      request({
        url: "/agency/details",
        method: "POST",
        data: { _id: id },
      })
        .then((res) => {
          setagencyData(res.response);
          setViewModal(!viewModal);
        })
        .catch((err) => console.log(err));
    }
  };

  const isDeleteAgency = (id, key) => {
    key === "trash" && setisDeleteModal(true);
    setDeleteId(id);
    key === "permanent" && setisPermanentDelete(true);
    setisDeleteModal(true);
    setDeleteId(id);
  };

  const deleteAgency = (id) => {
    request({
      url: "/agency/delete",
      method: "POST",
      data: { id: id },
    })
      .then((res) => {
        if (res.status === 0) {
          toast.error(res.response);
        }
        if (res.status === 1) {
          toast.success(res.response);
          if (isArchiveShow) {
            getArchiveList();
          }
          if (isDeletedShow) {
            getDeletedList();
          }
          if (isShow) {
            populateData();
          }
          deletedListAPI();
          archiveListAPI();
          toggleDeleteModal();
        }
      })
      .catch((err) => console.log(err));
  };

  const archiveAgency = (id) => {
    request({
      url: "/agency/archive",
      method: "POST",
      data: { id: id },
    })
      .then((res) => {
        if (res.status === 0) {
          toast.error(res.response);
        }
        if (res.status === 1) {
          toast.success(res.response);
          if (isArchiveShow) {
            getArchiveList();
          }
          if (isDeletedShow) {
            getDeletedList();
          }
          if (isShow) {
            populateData();
          }
          deletedListAPI();
          archiveListAPI();
        }
      })
      .catch((err) => console.log(err));
  };

  const removeAgency = (id) => {
    request({
      url: "/agency/remove",
      method: "POST",
      data: { id: id },
    })
      .then((res) => {
        if (res.status === 0) {
          toast.error(res.response);
        }
        if (res.status === 1) {
          toast.success(res.response);
          getDeletedList();
          deletedListAPI();
          toggleDeleteModal();
        }
      })
      .catch((error) => console.log(error));
  };

  const isRestore = (id) => {
    setrestore_id(id);
    setrestorePopover(true);
  };

  const restoreAgency = (id) => {
    request({
      url: "/agency/restore",
      method: "POST",
      data: { id: id },
    })
      .then((res) => {
        if (res.status === 0) {
          toast.error(res.response);
        }
        if (res.status === 1) {
          toast.success(res.response);
          setrestorePopover(false);
          populateData();
          getDeletedList();
          deletedListAPI();
        }
      })
      .catch((err) => console.log(err));
  };

  const logoutHandler = () => {
    let formdata = {
      username: name,
    };
    dispatch(admin_logout(formdata, props));
  };

  const viewProfileData = (id) => {
    let formdata = {
      id: id,
    };
    dispatch(admin_profile(formdata, props));
  };

  const getArchiveList = () => {
    request({
      url: "/agency/archive/archive_list",
      method: "POST",
      data: values.tableOptions,
    })
      .then((res) => {
        if (res.status === 1) {
          setvalues({
            ...values,
            tableData: res.response.result,
            pages: res.response.fullcount,
            currPage: res.response.length,
            remainingEmp:
              res.response.fullcount -
              (values.tableOptions.skip > 0
                ? values.tableOptions.skip + res.response.length
                : res.response.length),
          });
          setIsShow(false);
          setIsDeletedShow(false);
          setIsArchiveShow(true);
        } else if (res.status === 0) {
          console.log("error");
        }
      })
      .catch((err) => console.log(err));
  };

  const getDeletedList = () => {
    request({
      url: "/agency/deleted/deleted_list",
      method: "POST",
      data: values.tableOptions,
    })
      .then((res) => {
        if (res.status === 1) {
          setvalues({
            ...values,
            tableData: res.response.result,
            pages: res.response.fullcount,
            currPage: res.response.length,
            remainingEmp:
              res.response.fullcount -
              (values.tableOptions.skip > 0
                ? values.tableOptions.skip + res.response.length
                : res.response.length),
          });
          setIsShow(false);
          setIsDeletedShow(true);
          setIsArchiveShow(false);
          deletedListAPI();
        } else if (res.status === 0) {
          toast.error(res.response);
        }
      })
      .catch((err) => console.log(err));
  };

  const getFilterLsit = () => {
    if (isArchiveShow) {
      getArchiveList();
    }
    if (isDeletedShow) {
      getDeletedList();
    }
    if (isShow) {
      populateData();
    }
  };

  const handleFromDate = (date) => {
    setvalues({ ...values, fromDate: date });
  };

  const handleToDate = (date) => {
    setvalues((state) => {
      state.toDate = date;
      state.tableOptions.from_date = moment(values.fromDate).format(
        "YYYY/MM/DD"
      );
      state.tableOptions.to_date = moment(date).format("YYYY/MM/DD");
      return {
        ...state,
      };
    });
    getFilterLsit();
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

  const gotoDocumentpage = (id) => {
    props.history.push({
      pathname: "/document",
      state: { id: id },
    });
  };

  return (
    <div className="container">
      <div style={{ textAlign: "center", marginTop: "2em" }}>
        <div className="header">
          <Navbar color="light" light expand="md">
            <NavbarToggler onClick={navbartoggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink onClick={populateData}>Agencies</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={() => props.history.push("/addagency")}>
                    Add New Agency
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={() => props.history.push("/reminder")}>
                    Reminder
                  </NavLink>
                </NavItem>
              </Nav>
              <Nav>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    {name}
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => viewProfileData(userId)}>
                      Profile
                    </DropdownItem>
                    <DropdownItem onClick={logoutHandler}>Logout</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "2em" }}>
        <h3>
          {isShow
            ? "Agency List"
            : isDeletedShow
            ? "Deleted List"
            : isArchiveShow
            ? "Archive List"
            : "Agency List"}
        </h3>
        <hr />
        <div style={{ width: "75%", margin: "auto", marginBottom: "2em" }}>
          <Row>
            <Col md="4">
              <div
                className={isShow ? "diffListCount active" : "diffListCount"}
                style={{ background: "#3fa8a1" }}
                onClick={populateData}
              >
                All Agencies
                <div>{totalCount}</div>
              </div>
            </Col>
            <Col md="4">
              <div
                className={
                  isDeletedShow ? "diffListCount active" : "diffListCount"
                }
                style={{ background: "#d82f3f" }}
                onClick={getDeletedList}
              >
                Deleted Agencies
                <div>{deletedCount}</div>
              </div>
            </Col>
            <Col md="4">
              <div
                className={
                  isArchiveShow ? "diffListCount active" : "diffListCount"
                }
                style={{ background: "#7d6aa0" }}
                onClick={getArchiveList}
              >
                Archieve List
                <div>{archiveCount}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="mt-4 mb-3">
          <Row style={{ justifyContent: "space-between" }}>
            <Col md="3">
              <FormGroup>
                <Input
                  type="search"
                  placeholder="Search here"
                  name="search"
                  onChange={(e) => search(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <Select
                name="filterLocation"
                value={values.filterLocation}
                options={values.filterLocationList}
                onChange={selectFilterLocations}
                isSearchable={false}
                placeholder="Select Country"
              />
            </Col>
            <Col md="6">
              <Row>
                <Col md="2" className="pr-0">
                  <h6 className="mb-0 pt-2">Filter :</h6>
                </Col>
                <Col md="5">
                  <FormGroup>
                    <Datetime
                      dateFormat="YYYY/MM/DD"
                      timeFormat={false}
                      closeOnSelect={true}
                      // value={values.fromDate}
                      inputProps={{
                        placeholder: "From Date",
                      }}
                      isValidDate={(current) =>
                        current.isBefore(
                          moment(new Date()).subtract(0, "years")
                        )
                      }
                      onChange={handleFromDate}
                    />
                  </FormGroup>
                </Col>
                <Col md="5">
                  <FormGroup>
                    <Datetime
                      dateFormat="YYYY/MM/DD"
                      timeFormat={false}
                      closeOnSelect={true}
                      // value={values.toDate}
                      inputProps={{
                        placeholder: "To Date",
                      }}
                      isValidDate={(current) =>
                        current.isBefore(
                          moment(new Date()).subtract(0, "years")
                        )
                      }
                      onChange={handleToDate}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div>
          {isShow ? (
            <AgencyList
              values={values}
              sort={sort}
              getAgencyDetails={getAgencyDetails}
              isDeleteAgency={isDeleteAgency}
              getImagePreview={getImagePreview}
              archiveAgency={archiveAgency}
              gotoDocumentpage={gotoDocumentpage}
              {...props}
            />
          ) : (
            ""
          )}
          {isDeletedShow ? (
            <div>
              <DeletedAgencyList
                values={values}
                sort={sort}
                restore_id={restore_id}
                restoreAgency={restoreAgency}
                isRestore={isRestore}
                getAgencyDetails={getAgencyDetails}
                getImagePreview={getImagePreview}
                isDeleteAgency={isDeleteAgency}
                {...props}
              />
            </div>
          ) : (
            ""
          )}
          {isArchiveShow ? (
            <div>
              <ArchiveAgencyList
                values={values}
                sort={sort}
                getAgencyDetails={getAgencyDetails}
                isDeleteAgency={isDeleteAgency}
                getImagePreview={getImagePreview}
                {...props}
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Select
              isSearchable={false}
              value={values.pageRange}
              options={values.pageRangeList}
              onChange={changeLimit}
              className="pageRangeBox"
            />
          </div>
          <div>
            <Pagination
              prevPageText="<"
              nextPageText=">"
              firstPageText="<<"
              lastPageText=">>"
              itemClass="page-item"
              linkClass="page-link"
              activePage={values.activePage}
              itemsCountPerPage={values.tableOptions.limit}
              totalItemsCount={values.pages}
              pageRangeDisplayed={values.archivepageRangeDisplayed}
              onChange={paginate}
            />
          </div>
        </div>
        <div>
          {viewModal ? (
            <ViewAgency
              modal={viewModal}
              toggle={toggle}
              agencyData={agencyData}
            />
          ) : null}
          {isDeleteModal ? (
            <DeleteModal
              modal={isDeleteModal}
              toggle={toggleDeleteModal}
              deleteAgency={isPermanentDelete ? removeAgency : deleteAgency}
              id={deletId}
            />
          ) : (
            ""
          )}
          {restorePopover ? (
            <RestoreModal
              modal={restorePopover}
              toggle={toggleRestoreModal}
              restoreAgency={restoreAgency}
              id={restore_id}
            />
          ) : (
            ""
          )}
          {isImgPreview ? (
            <ImgPreviewModal
              modal={isImgPreview}
              toggle={previewtoggle}
              logo_path={previewImg}
            />
          ) : null}
        </div>
      </div>
      <ToastContainer autoClose={1500} />
    </div>
  );
};

export default Dashboard;
