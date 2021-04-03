import React from "react";
import {
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import { AiFillEye, AiOutlineCloseCircle } from "react-icons/ai";
import { BiSortAZ, BiSortZA } from "react-icons/bi";
import { MdSettingsBackupRestore } from "react-icons/md";
import { NodeURL } from "../../api/api";
import { FaEllipsisV } from "react-icons/fa";

const DeletedAgencyList = (props) => {
  const {
    sort,
    getAgencyDetails,
    isDeleteAgency,
    isRestore,
    getImagePreview,
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
                          title="View"
                          className="btn"
                          onClick={(e) => getAgencyDetails(item._id, "view")}
                        >
                          <AiFillEye color="#1b83ce" /> View
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          className="btn"
                          onClick={(e) => isDeleteAgency(item._id, "permanent")}
                        >
                          <AiOutlineCloseCircle color=" #ff4444" /> Delete
                        </button>
                        <button
                          type="button"
                          title="Restore"
                          className="btn"
                          id={`RestoreAgency${i}`}
                          onClick={(e) => isRestore(item._id)}
                        >
                          <MdSettingsBackupRestore /> Restore
                        </button>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
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

export default DeletedAgencyList;
