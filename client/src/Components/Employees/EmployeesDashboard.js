import React, { useEffect, Children } from "react";
import { Button } from "reactstrap";

const EmployeesDashboard = (props) => {
  // useEffect(() => {
  //   console.log(props.location.state.agencyId, "dfdsfdsfdsfdsfdf");
  // }, []);
  return (
    <div className="container">
      <div className="text-center mt-4">
        <h3>EmployeesDashboard</h3>
        <hr />
      </div>
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
    </div>
  );
};

export default EmployeesDashboard;
