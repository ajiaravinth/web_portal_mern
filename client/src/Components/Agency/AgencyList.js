import React from "react";
import {
  Table,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { AiFillEye, AiOutlineCloudUpload } from "react-icons/ai";
import { FaTrashAlt, FaFileArchive, FaEllipsisV } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { BiSortAZ, BiSortZA } from "react-icons/bi";
import { NodeURL } from "../../api/api";

const AgencyList = (props) => {
  const {
    values,
    sort,
    getAgencyDetails,
    isDeleteAgency,
    archiveAgency,
    getImagePreview,
    gotoDocumentpage,
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
      <Table hover responsive onContextMenu={(e) => e.preventDefault()}>
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
          {values.tableData &&
            values.tableData.length > 0 &&
            values.tableData.map((item, i) => (
              <tr
                key={i}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  props.history.push({
                    pathname: `/agency/dashboard`,
                    state: { agencyId: item._id },
                  })
                }
              >
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone.code + item.phone.number}</td>
                <td>{item.agency_name}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  {
                    <img
                      src={`${NodeURL}${item.agency_logo}`}
                      alt={`${item.agency_name[i]}`}
                      width="30px"
                      height="30px"
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
                          title="view"
                          className="btn"
                          onClick={(e) => getAgencyDetails(item._id, "view")}
                        >
                          <AiFillEye color="#1d61cf" /> View
                        </button>
                        <button
                          type="button"
                          title="edit"
                          className="btn"
                          onClick={(e) => getAgencyDetails(item._id, "edit")}
                        >
                          <FiEdit color="#2b9c21" /> Edit
                        </button>
                        <button
                          type="button"
                          title="delete"
                          className="btn"
                          onClick={() => isDeleteAgency(item._id, "trash")}
                        >
                          <FaTrashAlt color=" #ff4444" /> Delete
                        </button>
                        <button
                          type="button"
                          title="archive"
                          className="btn"
                          onClick={() => archiveAgency(item._id)}
                        >
                          <FaFileArchive color="#f5c000" /> Archive
                        </button>
                        <button
                          type="button"
                          title="fileupload"
                          className="btn"
                          onClick={() => gotoDocumentpage(item._id)}
                        >
                          <AiOutlineCloudUpload color="#ed26ff" /> File Upload
                        </button>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AgencyList;
