import React from "react";
import {
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import { AiFillEye } from "react-icons/ai";
import { FaTrashAlt, FaEllipsisV } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { BiSortAZ, BiSortZA } from "react-icons/bi";
import { NodeURL } from "../../api/api";

const ArchiveAgencyList = (props) => {
  const {
    sort,
    getAgencyDetails,
    getImagePreview,
    isDeleteAgency,
    values,
  } = props;

  const sortIcon =
    values.sortOrder === null ? (
      ""
    ) : values.sortOrder === true ? (
      <BiSortAZ />
    ) : (
      <BiSortZA />
    );

  return (
    <div>
      <Table hover>
        <thead>
          <tr>
            <th>S.No</th>
            <th onClick={() => sort("name")}>
              Name
              {values.tableOptions.field === "name" ? sortIcon : ""}
            </th>
            <th onClick={() => sort("email")}>
              Email
              {values.tableOptions.field === "email" ? sortIcon : ""}
            </th>
            <th onClick={() => sort("phone")}>
              Phone Number
              {values.tableOptions.field === "phone" ? sortIcon : ""}
            </th>
            <th onClick={() => sort("agency_name")}>
              Agency
              {values.tableOptions.field === "agency_name" ? sortIcon : ""}
            </th>
            <th onClick={() => sort("agency_logo")}>
              Agency
              {values.tableOptions.field === "agency_logo" ? sortIcon : ""}
            </th>
            <th onClick={() => sort("address.state")}>
              Area
              {values.tableOptions.field === "address.state" ? sortIcon : ""}
            </th>
            <th onClick={() => sort("address.country")}>
              Country
              {values.tableOptions.field === "address.country" ? sortIcon : ""}
            </th>
            <th onClick={() => sort("address.zipcode")}>
              Zipcode
              {values.tableOptions.field === "address.zipcode" ? sortIcon : ""}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {values.tableData && values.tableData.length > 0 ? (
            values.tableData.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone.code + item.phone.number}</td>
                <td>{item.agency_name}</td>
                <td>
                  {
                    <img
                      src={`${NodeURL + item.agency_logo}`}
                      alt={`${item.agency_name[i]}`}
                      width="50px"
                      height="50px"
                      onClick={() => getImagePreview(item._id)}
                    />
                  }
                </td>
                <td>{item.address.state}</td>
                <td>{item.address.country}</td>
                <td>{item.address.zipcode}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <UncontrolledDropdown
                    className="opt-changes"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <DropdownToggle className="option-methods">
                      <span>
                        <FaEllipsisV />
                      </span>
                    </DropdownToggle>
                    <DropdownMenu>
                      <div className="update-lists">
                        <button
                          type="button"
                          title="View"
                          className="btn"
                          onClick={(e) => getAgencyDetails(item._id, "view")}
                        >
                          <AiFillEye color="#1d61cf" /> View
                        </button>
                        <button
                          type="button"
                          title="Edit"
                          className="btn"
                          onClick={(e) => getAgencyDetails(item._id, "edit")}
                        >
                          <FiEdit color="#2b9c21" /> Edit
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          className="btn"
                          onClick={() => isDeleteAgency(item._id, "trash")}
                        >
                          <FaTrashAlt color=" #ff4444" /> Delete
                        </button>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
                {/* <td>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{ color: "#1b83ce" }}
                      onClick={(e) => getAgencyDetails(e, item._id, "view")}
                    >
                      <AiFillEye />
                    </span>
                    <span
                      style={{ color: "#21982b" }}
                      onClick={(e) => getAgencyDetails(e, item._id, "edit")}
                    >
                      <FiEdit />
                    </span>
                    <span
                      style={{ color: "#e83636c2" }}
                      onClick={() => isDeleteAgency(item._id)}
                    >
                      <FaTrashAlt />
                    </span>
                  </div> */}
                {/* {item.actions && item.actions.length > 0 && ( 
                   {item.actions.map((action, i) => (
                      <div key={i}>
                        <span
                          style={{ cursor: "pointer" }}
                          id={`${action.name}${i}`}
                        >
                          {String(`<${action.icon} />`)}
                        </span>
                        <UncontrolledTooltip
                          target={`${action.name}${i}`}
                          placement="left"
                        >
                          {action.tooltip}
                        </UncontrolledTooltip>
                      </div>
                    ))} 
                   )} */}
                {/* </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9}>List Is Empty</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ArchiveAgencyList;
