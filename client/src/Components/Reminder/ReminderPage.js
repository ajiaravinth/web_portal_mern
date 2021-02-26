import React, { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { Button } from "reactstrap";

const ReminderPage = () => {
  const data = {
    time: new Date(),
  };
  const [values, setValues] = useState(data);
  const dateChange = (value) => {
    console.log(value, "value");
    setValues({ ...values, time: value });
  };

  const timeSubmit = () => {
    console.log(values, "values");
  };

  return (
    <div className="container">
      <div className="mt-4">
        <DateTimePicker onChange={dateChange} value={values.time} />
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
