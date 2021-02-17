import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
} from "reactstrap";

const ViewAgency = ({ modal, toggle, agencyData }) => {
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Details Of Agnency</ModalHeader>
        <ModalBody>
          <Row>
            <Col md="6">
              <span>Name: {agencyData.name}</span>
            </Col>
            <Col md="6">
              <span>User Name: {agencyData.username}</span>
            </Col>
            <Col md="6">
              <span>Email: {agencyData.email}</span>
            </Col>
            <Col md="6">
              <span>Company Name: {agencyData.agency_name}</span>
            </Col>
            <Col md="6">
              <span>
                Address:{" "}
                {agencyData.address.state +
                  "," +
                  agencyData.address.country +
                  "," +
                  agencyData.address.zipcode}
              </span>
            </Col>
            <Col md="6">
              <span>
                Contact Number:{" "}
                {agencyData.phone.code + "-" + agencyData.phone.number}
              </span>
            </Col>
          </Row>
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
