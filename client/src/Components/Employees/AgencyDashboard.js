import React, { useEffect, useState } from "react";
import { Button, Table, Row, Col } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import request from "../../api/api";
import { IoMdRadioButtonOn } from "react-icons/io";

const AgencyDashboard = (props) => {
  const [agencyId, setagencyId] = useState("");
  const [employeeData, setemployeeData] = useState([]);
  useEffect(() => {
    const id = props.location.state.agencyId;
    setagencyId(id);
    request({
      url: "employees/list",
      method: "POST",
      data: { id: id },
    })
      .then((res) => {
        res.status === 0 && console.log("no data found");
        res.status === 1 && setemployeeData(res.response);
      })
      .catch((err) => console.log(err));
  }, [props]);

  // const populateData = () => {
  //   const formData = { id: agencyId };
  //   request({
  //     url: "employees/list",
  //     method: "POST",
  //     data: formData,
  //   })
  //     .then((res) => console.log(res.response))
  //     .catch((err) => console.log(err));
  // };

  return (
    <div className="container">
      <ToastContainer autoClose={1500} />
      <div className="text-center mt-4">
        <h3>Employees Dashboard</h3>
        <hr />
      </div>
      <div>
        <Row>
          {/* <Col md="6">
            <div>
              <Button color="primary">Add Worklocation +</Button>
              <hr />
            </div>
          </Col> */}
          <Col>
            <div>
              <Button
                color="primary"
                onClick={() =>
                  props.history.push({
                    pathname: "/employee/add",
                    state: { agencyId: props.location.state.agencyId },
                  })
                }
              >
                Add Employees +
              </Button>
              <hr />
            </div>
            <div className="employeeTable">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Job Role</th>
                    <th>Mobile Number</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeData.length > 0 ? (
                    employeeData &&
                    employeeData.length > 0 &&
                    employeeData.map((list, i) => (
                      <tr key={i} style={{ cursor: "pointer" }}>
                        <td>{i + 1}</td>
                        <td style={{ textTransform: "capitalize" }}>
                          {list.username}
                        </td>
                        <td>{list.email}</td>
                        <td>{list.job_role}</td>
                        <td>{list.phone.code + "-" + list.phone.number}</td>
                        <td style={{ textTransform: "capitalize" }}>
                          {list.worklocation}
                        </td>
                        <td>
                          {list.employee_status === true ? (
                            <>
                              <span>
                                <IoMdRadioButtonOn color="green" size={12} />
                              </span>{" "}
                              <span>active</span>
                            </>
                          ) : (
                            <>
                              <span>
                                <IoMdRadioButtonOn color="red" size={12} />
                              </span>{" "}
                              <span>inactive</span>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No Records
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AgencyDashboard;
