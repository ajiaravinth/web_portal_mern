import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const DeleteModal = (props) => {
  const { modal, toggle, deleteAgency, id } = props;
  console.log(id, "id");
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Delete</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete?</p>
        </ModalBody>
        <ModalFooter
          className="text-center"
          style={{ justifyContent: "space-between" }}
        >
          <Button color="success" onClick={() => deleteAgency(id)}>
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

export default DeleteModal;
