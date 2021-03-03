import React, { useState, useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";
import request, { NodeURL } from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import io from "socket.io-client";

const ReminderPage = () => {
  const data = {
    time: new Date(),
    desc: "",
  };
  const [values, setValues] = useState(data);
  const [reminderdata, setReminderData] = useState({});
  const [showReminder, setShowReminder] = useState(false);
  const reminderToggle = () => setShowReminder(!showReminder);
  const dateChange = (value) => {
    setValues({ ...values, time: value });
  };

  useEffect(() => {
    populateData();
  }, []);

  // useEffect(() => {
  //   return populateData();
  // });

  const populateData = () => {
    const connectionOptions = {
      "force new connection": true,
      reconnectionAttempts: "Infinity", // avoid having user reconnect manually in order to prevent dead clients after a server restart
      timeout: 10000, // before connect_error and connect_timeout are emitted.
      transports: ["websocket"],
    };
    const socket = io(`${NodeURL}`, connectionOptions);
    socket.on("reminder", (data) => {
      if (data) {
        // console.log(data.docData, "socket");
        if (
          data.docData.reminder_status === 6 ||
          data.docData.snooze_status === 7
        ) {
          setShowReminder(true);
          setReminderData(data.docData);
        }
      }
    });
    request({
      url: "/reminder/notify",
      method: "GET",
    })
      .then((res) => {
        if (res.status === 0) {
          setShowReminder(false);
        }
        if (res.status === 1) {
          if (res.response.length > 0) {
            // setShowReminder(true);
            // res.response.map((item, i) => setReminderData(item));
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const closeReminder = (id) => {
    request({
      url: "/reminder/close",
      method: "POST",
      data: { id: id },
    })
      .then((res) => {
        if (res.status === 1) {
          setShowReminder(false);
          toast.success(res.response);
        }
      })
      .catch((err) => console.log(err));
    populateData();
  };

  const snoozeHandler = (id) => {
    request({
      url: "/reminder/snooze",
      method: "POST",
      data: { id: id },
    })
      .then((res) => {
        if (res.status === 1) {
          setShowReminder(false);
          toast.success(res.response);
        }
      })
      .catch((err) => console.log(err));
    populateData();
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

  // console.log(reminderdata, "reminderdata");

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
      <div>
        {showReminder ? (
          <Modal isOpen={showReminder} toggle={reminderToggle}>
            <ModalHeader toggle={reminderToggle}>Reminder</ModalHeader>
            <ModalBody>{reminderdata.description}</ModalBody>
            <ModalFooter>
              <Button
                color="warning"
                onClick={() => snoozeHandler(reminderdata._id)}
              >
                Snooze
              </Button>
              <Button
                color="danger"
                onClick={() => closeReminder(reminderdata._id)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        ) : null}
      </div>
    </div>
  );
};

export default ReminderPage;
