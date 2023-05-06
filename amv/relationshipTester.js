const models = require('./models');
const Rooms = models.Rooms;
const Buildings = models.Buildings;

// Buildings.create({
//   building_name: "Finance Building"
// })
// .then((newBuilding) => {
//   // The get() function allows you to recover only the DataValues of the object
//   console.log(newBuilding.get())
// })
// .catch((err) => {
//   console.log("Error while company creation : ", err)
// })

// Rooms.bulkCreate([
//     {device_id: '12345', room_name: 'Computer Laboratory 1',  room_desc: '3rd Floor, Finance Building', building_id: 1},
//     {device_id: '56789', room_name: 'Computer Laboratory 2',  room_desc: '3rd Floor, Finance Building', building_id: 1},
//   ])
//   .then((newRooms) => {
//     console.log(newRooms);
//   })
//   .catch((err) => {
//     console.log("Error while users creation : ", err);
//   })

// Rooms.findOne({
//     where: {room_name: 'Computer Laboratory 1'}, include: 'building'
//   })
//   .then((findedRoom) => {
//     // Get the User with Company datas included
//     console.log(findedRoom)
//     // Get the company record only
//     // console.log(findedRoom.building)
//   })
//   .catch((err) => {
//     console.log("Error while find room : ", err)
//   })
  
//   // 1:N
//   // Get the employees for a given company
//   Buildings.findByPk(1, {include: ['room']})
//   .then((building) => {
//     // Get the Company with Users (employes) datas included
//     console.log(building)
//     // Get the Rooms (room) records only
//     // console.log(building.get().room)
//   })
//   .catch((err) => {
//     console.log("Error while find building : ", err)
//   })


//COPY PASTE FROM OTHER FILES (Every piece of code that I want to delete but dont want to lose): 

//   <h2>${data.roomName}</h2>

// fetch('/sensor/data', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: data
//       }).then(response => {
//         // Handle response from server
//       }).catch(error => {
//         // Handle error
//       });

/*{ <div id="room-cards" class="card-deck">
            <% rooms.forEach((room) => { %>
                <div class="card mb-4" id="room-card-<%= room.id %>" style="display:none;">
                    <div class="card-header"><%= room.room_name %></div>
                    <div class="card-body">
                        <p><%= room.room_desc %></p>
                    </div>
                </div>
            <% }); %>
        </div> }*/