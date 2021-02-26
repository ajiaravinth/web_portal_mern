import React, { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { Button } from "reactstrap";
import moment from "moment";
import request from "../../api/api";
import { toast, ToastContainer } from "react-toastify";

const ReminderPage = () => {
  const data = {
    time: new Date(),
    desc: "",
  };
  const [values, setValues] = useState(data);
  const dateChange = (value) => {
    setValues({ ...values, time: value });
  };

  const handleChange = (e) => {
    setValues({ ...values, desc: e.target.value });
  };

  const timeSubmit = () => {
    let formData = {
      start: moment(values.time).format("YYYY-MM-DD HH:mm:ss"),
      description: values.desc,
    };
    request({
      url: "/reminder/set",
      method: "POST",
      data: formData,
    })
      .then((res) => {
        if (res.status === 1) {
          toast.success(res.response);
        }
      })
      .catch((err) => console.log(err));
    setValues(data);
  };

  return (
    <div className="container">
      <ToastContainer autoClose={1500} />
      <div className="mt-4">
        <DateTimePicker onChange={dateChange} value={values.time} />
      </div>
      <div className="mt-4">
        <h4>Description</h4>
        <p>
          <textarea type="text" value={values.desc} onChange={handleChange} />
        </p>
      </div>
      <div className="mt-3">
        <Button color="danger" onClick={timeSubmit}>
          Set
        </Button>
      </div>
    </div>
  );
};

export default ReminderPage;
