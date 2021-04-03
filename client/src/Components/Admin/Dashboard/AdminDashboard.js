import React, { useEffect, useState } from "react";
import { Button, Table } from "reactstrap";
import "./index.css";
import request from "../../../api/api";

const AdminDashboard = () => {
  const [bookingList, setbookingList] = useState([]);
  // useEffect(() => {
  //     request({
  //         url: "/booking/list",
  //         method: "POST",
  //     }).then(res => {
  //         if(res.status === 1) {
  //             setbookingList(res.response)
  //         }
  //     }).catch(err => console.log(err))
  // }, [])
  return (
    <div className="container">
      <div className="header">
        <h5 className="mr-3 mb-0 mt-2" style={{ textTransform: "capitalize" }}>
          {"username"}
        </h5>
        <Button color="danger">Logout</Button>
      </div>
      <div className="booking-count">
        <h5>Total Bookings</h5>
        <h6>{"count"}</h6>
      </div>
      <hr />
      <div>
        <Table hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>Orphanage</th>
              <th>Date Of Booking</th>
              <th>Booking Slot</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>aravinth</td>
              <td>1234567890</td>
              <td>chennai</td>
              <td>Children</td>
              <td>01/02/2021</td>
              <td>Break Fast</td>
              <td>Confirmed</td>
            </tr>
            {/* {bookingList &&
              bookingList.length > 0 &&
              bookingList.map((list, i) => (
                <tr>
                  <td>{list.username}</td>
                  <td>{list.userphone}</td>
                  <td>{list.address}</td>
                  <td>{list.orphanage_name}}</td>
                  <td>{list.booking_date}</td>
                  <td>{list.booking_slot}</td>
                  <td>{list.status === 1 ? "confirmed" : "Canceled"}</td>
                </tr>
              ))} */}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboard;
