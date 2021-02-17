import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  Table,
} from "reactstrap";

const ViewAgency = ({ modal, toggle, agencyData }) => {
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Details Of Agnency</ModalHeader>
        <ModalBody>
          <Table borderless>
            <tbody>
              <tr>
                <td>Name</td>
                <td>:</td>
                <td>{agencyData.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>:</td>
                <td>{agencyData.email}</td>
              </tr>
              <tr>
                <td>User Name</td>
                <td>:</td>
                <td>{agencyData.username}</td>
              </tr>
              <tr>
                <td>Company Name</td>
                <td>:</td>
                <td>{agencyData.agency_name}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>:</td>
                <td>
                  {agencyData.address.state +
                    "," +
                    agencyData.address.country +
                    "," +
                    agencyData.address.zipcode}
                </td>
              </tr>
              <tr>
                <td>Contact Number</td>
                <td>:</td>
                <td>{agencyData.phone.code + "-" + agencyData.phone.number}</td>
              </tr>
              <tr>
                <td>Date of Birth</td>
                <td>:</td>
                <td>{agencyData.dateofbirth}</td>
              </tr>
              <tr>
                <td>language</td>
                <td>:</td>
                <td>
                  {agencyData.language.map((lang, i) => (
                    <ul
                      key={i}
                      style={{
                        margin: "0",
                        padding: "0",
                        float: "left",
                        paddingRight: "8px",
                      }}
                    >
                      <li style={{ listStyleType: "none" }}>
                        {lang.key === 1 ? lang.value : null}
                      </li>
                    </ul>
                  ))}
                </td>
              </tr>
              <tr>
                <td>Gender</td>
                <td>:</td>
                <td>{agencyData.gender}</td>
              </tr>
            </tbody>
          </Table>
          {/* <Col md="6">
              <Table>
                <tbody>
                  <tr>
                    <td>Email</td>
                    <td>{agencyData.email}</td>
                  </tr>
                </tbody>
              </Table>
            </Col> */}
          {/* <Col md="6">
              <Col md="6">Name:</Col>
              <Col md="6"> </Col>
            </Col> */}
        </ModalBody>
        <ModalFooter className="text-center">
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ViewAgency;
