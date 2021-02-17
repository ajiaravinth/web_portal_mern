import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { NodeURL } from "../../api/api";

const ImgPreviewModal = (props) => {
  const { modal, toggle, logo_path } = props;
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Agency Logo</ModalHeader>
        <ModalBody>
          <img
            src={`${NodeURL}${logo_path.agency_logo}`}
            alt="image_preview"
            width="100%"
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ImgPreviewModal;
