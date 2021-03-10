import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const RestoreModal = (props) => {
  const { modal, toggle, restoreAgency, id } = props;
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Restore</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to Restore?</p>
        </ModalBody>
        <ModalFooter
          className="text-center"
          style={{ justifyContent: "space-between" }}
        >
          <Button color="success" onClick={() => restoreAgency(id)}>
            Yes
          </Button>
          <Button color="danger" onClick={toggle}>
            No
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RestoreModal;
