module.exports = function (io) {
  let {
    GetAggregationDoc,
    GetDocs,
    GetOneDoc,
    InsertDoc,
    UpdateDoc,
    UpdateManyDoc,
  } = require("../model/mongodb.js");
  let { get, set } = require("lodash");
  let { ObjectId, isObjectId } = require("../controller/events/common");
  let chat = io.of("/chat");
  let notify = io.of("/notify");
  var chatRooms = [];

  chat.on("connection", async (socket) => {
    console.log("New client connected");
    // socket.on('disconnecting', () => {
    //   const rooms = Object.keys(socket.rooms);
    //   console.log("rooms disconnecting", rooms)
    // });

    socket.on("Update_offline_user_id", async (data) => {
      try {
        let _id = get(data, "user", false);
        if (isObjectId(_id)) {
          let obj = {};
          obj.online = false;
          let update = await UpdateDoc(
            "employees",
            { _id: ObjectId(_id) },
            obj,
            {}
          );
        }
      } catch (error) {
        console.log(`error is  Update_offline_user_id ${error}`);
      }
    });

    socket.on("Update_offline_agency_id", async (data) => {
      try {
        let _id = get(data, "user", false);
        if (isObjectId(_id)) {
          let obj = {};
          obj.online = false;
          let update = await UpdateDoc(
            "agencies",
            { _id: ObjectId(_id) },
            obj,
            {}
          );
        }
      } catch (error) {
        console.log(`error is  Update_offline_user_id ${error}`);
      }
    });

    socket.on("join network", async (data) => {
      try {
        var room = data.user;
        if (room) {
          if (chatRooms.indexOf(room) == -1) {
            chatRooms.push(room);
          }
          socket.join(room);
          socket.emit("roomcreated", room);
          if (isObjectId(room) && data.collections) {
            let obj = {};
            obj.online = true;
            let update = await UpdateDoc(
              data.collections,
              { _id: ObjectId(room) },
              obj,
              {}
            );
          }
        }
      } catch (err) {
        console.log(`err is 'join network' ${err}`);
      }
    });

    socket.on("disconnect", (data) => {
      if (data) {
        if (data.user) {
          var room = data.user;
          delete chatRooms[room];
          socket.emit("disconnect", room);
          socket.leave(room);
        }
      }
    });

    socket.on("network disconnect", (data) => {
      if (data) {
        if (data.user) {
          var room = data.user;
          delete chatRooms[room];
          socket.emit("disconnect", room);
          socket.leave(room);
        }
      }
    });

    socket.on("chat message", async (data) => {
      try {
        let from = get(data, "from", false),
          to = get(data, "to", false),
          message = get(data, "message", false);
        if (isObjectId(from) && isObjectId(to) && String(message).length > 0) {
          let agencies = GetOneDoc(
            "agencies",
            { $or: [{ _id: ObjectId(from) }, { _id: ObjectId(to) }] },
            {},
            {}
          );
          let employees = GetOneDoc(
            "employees",
            { $or: [{ _id: ObjectId(to) }, { _id: ObjectId(from) }] },
            {},
            {}
          );
          let docdata = await Promise.all([agencies, employees]);
          docdata = [...docdata];
          let obj = {};
          obj["receiver_type"] = "candidates";
          obj["from"] = ObjectId(from);
          obj["to"] = ObjectId(to);
          obj["sender"] = get(data, "sender", "agencies");
          obj["receiver"] = get(data, "receiver", "employees");
          obj["datatype"] = get(data, "datatype", "text");
          obj["message"] = message;
          obj["time_stamp"] = Number(new Date());
          data["time_stamp"] = Number(new Date());
          obj["ag_name"] = get(docdata, "0.name", "");
          obj["ag_surname"] = get(docdata, "0.surname", "");
          obj["ag_avatar"] = get(docdata, "0.avatar", "");
          obj["ag_phone"] = get(docdata, "0.phone", {});
          obj["can_name"] = get(docdata, "1.name", "");
          obj["can_surname"] = get(docdata, "1.surname", "");
          obj["can_avatar"] = get(docdata, "1.avatar", "");
          obj["can_phone"] = get(docdata, "1.phone", {});
          if (String(obj.sender) === "agencies") {
            obj.room = `${from}-${to}`;
            obj.agency_read_status = 2;
          } else {
            obj.room = `${to}-${from}`;
            obj.candidate_read_status = 2;
          }
          let insert = await InsertDoc("messages", obj);
          if (insert && insert._id) {
            console.log("success");
            chat.in(to).emit("web_update_chat", data);
            chat.in(from).emit("web_update_chat", data);
            socket.emit("web_update_chat", data);
          } else {
            socket.emit("Re try", data);
          }
        } else {
          socket.emit("data required", data);
        }
      } catch (error) {
        console.log(`error is 'chat message' ${error}`);
      }
    });

    socket.on("Instant Typing", (data) => {
      try {
        let from = get(data, "from", false),
          to = get(data, "to", false);
        if (isObjectId(from) && isObjectId(to)) {
          chat.in(to).emit("Show typing", data);
        } else {
          console.log(`Id is required Instant Typing `);
        }
      } catch (error) {
        console.log(`error is  Instant Typing ${error}`);
      }
    });

    socket.on("Update message read agencies", async (data) => {
      try {
        let from = get(data, "from", false),
          to = get(data, "to", false);
        if (isObjectId(from) && isObjectId(to)) {
          let query = {
            status: 1,
            $or: [
              { from: ObjectId(from), to: ObjectId(to) },
              { from: ObjectId(to), to: ObjectId(from) },
            ],
          };
          let obj = {};
          obj["agency_read_status"] = 2;
          let updatemay = await UpdateManyDoc("messages", query, obj, {
            multi: true,
          });
        }
      } catch (error) {
        console.log(`error is 'Update message read agencies' ${error}`);
      }
    });

    socket.on("Update message read employees", async (data) => {
      try {
        let from = get(data, "from", false),
          to = get(data, "to", false);
        if (isObjectId(from) && isObjectId(to)) {
          let query = {
            status: 1,
            $or: [
              { from: ObjectId(from), to: ObjectId(to) },
              { from: ObjectId(to), to: ObjectId(from) },
            ],
          };
          let obj = {};
          obj["candidate_read_status"] = 2;
          let updatemay = await UpdateManyDoc("messages", query, obj, {
            multi: true,
          });
        }
      } catch (error) {
        console.log(`error is 'Update message read agencies' ${error}`);
      }
    });

    socket.on("reminder", (data) => console.log(data, "data"));
  });

  notify.on("connection", (socket) => {
    socket.on("join network", async (data) => {
      try {
        console.log("object");
        var room = data.user;
        if (room) {
          if (chatRooms.indexOf(room) == -1) {
            chatRooms.push(room);
          }
          socket.join(room);
          socket.emit("roomcreated", room);
          if (isObjectId(room) && data.collections) {
            let obj = {};
            obj.online = true;
            let update = await UpdateDoc(
              data.collections,
              { _id: ObjectId(room) },
              obj,
              {}
            );
          }
        }
      } catch (err) {
        console.log(`err is 'join network' ${err}`);
      }
    });
  });
};
