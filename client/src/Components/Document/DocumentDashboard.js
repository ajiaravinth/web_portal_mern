import React, { useState, useEffect } from "react";
import { Form, Row, Col, FormGroup, Button, CustomInput } from "reactstrap";
import request, { NodeURL } from "../../api/api";
import _ from "lodash";
import { toast, ToastContainer } from "react-toastify";

const DocumentDashboard = (props) => {
  const initialState = {
    file: "",
    filename: "",
    imageArray: [],
  };

  const [values, setValues] = useState(initialState);
  const [agencyId, setagencyId] = useState("");

  useEffect(() => {
    let id = props.location.state.id;
    setagencyId(id);
    populateData(id);
  }, []);

  const populateData = (id) => {
    request({
      url: "/document/all",
      method: "POST",
      data: { id: id },
    })
      .then((res) => {
        if (res.status === 0) {
          setValues({ ...values, imageArray: [] });
        }
        if (res.status === 1) {
          let data = res.response;
          // console.log(data, "daat");
          setValues((state) => {
            state.imageArray = data[0].avatar;
            return { ...state };
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const multipleFileHandler = (e) => {
    let data = new FormData();
    data.append("avatar", _.get(e, "target.files.[0]", {}));
    request({
      url: "/document/upload",
      method: "POST",
      data,
    })
      .then((res) =>
        setValues((state) => {
          state.imageArray.push(res.response);
          return { ...state };
        })
      )
      .catch((err) => console.log(err));
  };

  const uploadHandler = (e) => {
    e.preventDefault();
    const data = {
      avatar: values.imageArray,
      agencyId: agencyId,
    };
    request({
      url: "/document/upload/save",
      method: "POST",
      data,
    })
      .then((res) => {
        if (res.status === 0) {
          toast.error(res.response);
        }

        if (res.status === 1) {
          populateData(agencyId);
          toast.success("Document Added successful!!");
        }
      })

      .catch((err) => console.log(err));
  };

  const removeDocument = (id, docId) => {
    console.log(id, docId, "id");
    request({
      url: "/document/delete",
      method: "POST",
      data: { id: id, doc_id: docId },
    })
      .then((res) => {
        if (res.status === 0) {
          toast.error(res.response);
        }
        if (res.status === 1) {
          toast.success(res.response);
        }
        populateData(id);
      })
      .catch((err) => console.log(err));
  };

  // console.log(values.imageArray, "imageArray");

  const imageArray = values.imageArray;
  return (
    <div className="container">
      <ToastContainer autoClose={1500} />
      <h3 className="mt-4 text-center">Document Dashboard</h3>
      <hr />
      <div className="fileInputContainer">
        <Form onSubmit={uploadHandler}>
          <Row>
            <Col md="9">
              <div>
                <FormGroup>
                  <CustomInput
                    type="file"
                    name="avatar"
                    id="multiple_image"
                    onChange={multipleFileHandler}
                  />
                </FormGroup>
              </div>
            </Col>
            <Col md="3">
              <div className="text-center">
                <Button color="primary">Add File</Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <hr />
      <div className="previewBox">
        <Row>
          {imageArray.length > 0 ? (
            imageArray &&
            imageArray.length > 0 &&
            imageArray.map((list, i) => (
              <Col md="4" key={i}>
                <div className="imageContainer">
                  <img
                    src={`${NodeURL}${list.avatar_url}`}
                    alt="image_avatar"
                    width="100%"
                    height="100px"
                    className="p-3"
                  />
                  <span
                    className="removeBtn"
                    onClick={() => removeDocument(agencyId, list._id)}
                  >
                    &times;
                  </span>
                </div>
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-center mt-4">No Document</p>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default DocumentDashboard;
